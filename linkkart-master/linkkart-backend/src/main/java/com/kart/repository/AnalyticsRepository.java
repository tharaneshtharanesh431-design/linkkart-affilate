package com.kart.repository;

import com.kart.dto.analytics.PerformanceMetric;
import com.kart.dto.analytics.TimeSeriesDataPoint;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AnalyticsRepository {

    @PersistenceContext
    private EntityManager entityManager;

    // --- KPI Aggregations ---

    public long getClickCount(Long affiliateId, Long merchantId, LocalDateTime start, LocalDateTime end) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(c.id) FROM clicks c JOIN affiliate_links al ON c.affiliate_link_id = al.id JOIN campaigns camp ON al.campaign_id = camp.id WHERE c.clicked_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND al.affiliate_id = :affiliateId");
        if (merchantId != null) sql.append(" AND camp.merchant_id = :merchantId");

        Query q = entityManager.createNativeQuery(sql.toString());
        q.setParameter("start", start);
        q.setParameter("end", end);
        if (affiliateId != null) q.setParameter("affiliateId", affiliateId);
        if (merchantId != null) q.setParameter("merchantId", merchantId);

        return ((Number) q.getSingleResult()).longValue();
    }

    public long getConversionCount(Long affiliateId, Long merchantId, LocalDateTime start, LocalDateTime end) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(c.id) FROM conversions c JOIN affiliate_links al ON c.affiliate_link_id = al.id JOIN campaigns camp ON al.campaign_id = camp.id WHERE c.converted_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND al.affiliate_id = :affiliateId");
        if (merchantId != null) sql.append(" AND camp.merchant_id = :merchantId");

        Query q = entityManager.createNativeQuery(sql.toString());
        q.setParameter("start", start);
        q.setParameter("end", end);
        if (affiliateId != null) q.setParameter("affiliateId", affiliateId);
        if (merchantId != null) q.setParameter("merchantId", merchantId);

        return ((Number) q.getSingleResult()).longValue();
    }

    public BigDecimal getSalesVolume(Long affiliateId, Long merchantId, LocalDateTime start, LocalDateTime end) {
        StringBuilder sql = new StringBuilder("SELECT COALESCE(SUM(c.order_amount), 0) FROM conversions c JOIN affiliate_links al ON c.affiliate_link_id = al.id JOIN campaigns camp ON al.campaign_id = camp.id WHERE c.status = 'VALID' AND c.converted_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND al.affiliate_id = :affiliateId");
        if (merchantId != null) sql.append(" AND camp.merchant_id = :merchantId");

        Query q = entityManager.createNativeQuery(sql.toString());
        q.setParameter("start", start);
        q.setParameter("end", end);
        if (affiliateId != null) q.setParameter("affiliateId", affiliateId);
        if (merchantId != null) q.setParameter("merchantId", merchantId);

        return (BigDecimal) q.getSingleResult();
    }

    public BigDecimal getCommissionTotal(Long affiliateId, Long merchantId, LocalDateTime start, LocalDateTime end, List<String> statuses) {
        StringBuilder sql = new StringBuilder("SELECT COALESCE(SUM(c.amount), 0) FROM commissions c JOIN conversions conv ON c.conversion_id = conv.id JOIN affiliate_links al ON conv.affiliate_link_id = al.id JOIN campaigns camp ON al.campaign_id = camp.id WHERE c.created_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND c.affiliate_id = :affiliateId");
        if (merchantId != null) sql.append(" AND camp.merchant_id = :merchantId");
        if (statuses != null && !statuses.isEmpty()) sql.append(" AND c.status IN (:statuses)");

        Query q = entityManager.createNativeQuery(sql.toString());
        q.setParameter("start", start);
        q.setParameter("end", end);
        if (affiliateId != null) q.setParameter("affiliateId", affiliateId);
        if (merchantId != null) q.setParameter("merchantId", merchantId);
        if (statuses != null && !statuses.isEmpty()) q.setParameter("statuses", statuses);

        return (BigDecimal) q.getSingleResult();
    }

    public BigDecimal getPayoutTotal(Long affiliateId, LocalDateTime start, LocalDateTime end, List<String> statuses) {
        StringBuilder sql = new StringBuilder("SELECT COALESCE(SUM(p.amount), 0) FROM payouts p WHERE p.requested_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND p.affiliate_id = :affiliateId");
        if (statuses != null && !statuses.isEmpty()) sql.append(" AND p.status IN (:statuses)");

        Query q = entityManager.createNativeQuery(sql.toString());
        q.setParameter("start", start);
        q.setParameter("end", end);
        if (affiliateId != null) q.setParameter("affiliateId", affiliateId);
        if (statuses != null && !statuses.isEmpty()) q.setParameter("statuses", statuses);

        return (BigDecimal) q.getSingleResult();
    }

    // --- Time Series ---

    public List<TimeSeriesDataPoint> getTimeSeries(Long affiliateId, Long merchantId, LocalDateTime start, LocalDateTime end) {
        // Build base dates from start to end in Java, then query groups.
        List<TimeSeriesDataPoint> points = new ArrayList<>();
        LocalDate currentDate = start.toLocalDate();
        LocalDate endDate = end.toLocalDate();
        while (!currentDate.isAfter(endDate)) {
            points.add(new TimeSeriesDataPoint(currentDate, 0, 0, BigDecimal.ZERO, BigDecimal.ZERO));
            currentDate = currentDate.plusDays(1);
        }

        // Clicks
        StringBuilder clickSql = new StringBuilder("SELECT DATE(c.clicked_at) as d, COUNT(c.id) FROM clicks c JOIN affiliate_links al ON c.affiliate_link_id = al.id JOIN campaigns camp ON al.campaign_id = camp.id WHERE c.clicked_at BETWEEN :start AND :end");
        if (affiliateId != null) clickSql.append(" AND al.affiliate_id = :affiliateId");
        if (merchantId != null) clickSql.append(" AND camp.merchant_id = :merchantId");
        clickSql.append(" GROUP BY DATE(c.clicked_at)");
        
        Query cq = entityManager.createNativeQuery(clickSql.toString());
        cq.setParameter("start", start);
        cq.setParameter("end", end);
        if (affiliateId != null) cq.setParameter("affiliateId", affiliateId);
        if (merchantId != null) cq.setParameter("merchantId", merchantId);
        
        List<Object[]> clickResults = cq.getResultList();
        for (Object[] row : clickResults) {
            LocalDate d = ((java.sql.Date) row[0]).toLocalDate();
            long count = ((Number) row[1]).longValue();
            points.stream().filter(p -> p.getDate().equals(d)).findFirst().ifPresent(p -> p.setClicks(count));
        }

        // Conversions and Sales
        StringBuilder convSql = new StringBuilder("SELECT DATE(c.converted_at) as d, COUNT(c.id), COALESCE(SUM(CASE WHEN c.status = 'VALID' THEN c.order_amount ELSE 0 END), 0) FROM conversions c JOIN affiliate_links al ON c.affiliate_link_id = al.id JOIN campaigns camp ON al.campaign_id = camp.id WHERE c.converted_at BETWEEN :start AND :end");
        if (affiliateId != null) convSql.append(" AND al.affiliate_id = :affiliateId");
        if (merchantId != null) convSql.append(" AND camp.merchant_id = :merchantId");
        convSql.append(" GROUP BY DATE(c.converted_at)");

        Query convQ = entityManager.createNativeQuery(convSql.toString());
        convQ.setParameter("start", start);
        convQ.setParameter("end", end);
        if (affiliateId != null) convQ.setParameter("affiliateId", affiliateId);
        if (merchantId != null) convQ.setParameter("merchantId", merchantId);

        List<Object[]> convResults = convQ.getResultList();
        for (Object[] row : convResults) {
            LocalDate d = ((java.sql.Date) row[0]).toLocalDate();
            long count = ((Number) row[1]).longValue();
            BigDecimal sales = (BigDecimal) row[2];
            points.stream().filter(p -> p.getDate().equals(d)).findFirst().ifPresent(p -> {
                p.setConversions(count);
                p.setSales(sales);
            });
        }

        // Earnings
        StringBuilder earnSql = new StringBuilder("SELECT DATE(c.created_at) as d, COALESCE(SUM(c.amount), 0) FROM commissions c JOIN conversions conv ON c.conversion_id = conv.id JOIN affiliate_links al ON conv.affiliate_link_id = al.id JOIN campaigns camp ON al.campaign_id = camp.id WHERE c.created_at BETWEEN :start AND :end AND c.status IN ('APPROVED', 'PAID')");
        if (affiliateId != null) earnSql.append(" AND c.affiliate_id = :affiliateId");
        if (merchantId != null) earnSql.append(" AND camp.merchant_id = :merchantId");
        earnSql.append(" GROUP BY DATE(c.created_at)");

        Query earnQ = entityManager.createNativeQuery(earnSql.toString());
        earnQ.setParameter("start", start);
        earnQ.setParameter("end", end);
        if (affiliateId != null) earnQ.setParameter("affiliateId", affiliateId);
        if (merchantId != null) earnQ.setParameter("merchantId", merchantId);

        List<Object[]> earnResults = earnQ.getResultList();
        for (Object[] row : earnResults) {
            LocalDate d = ((java.sql.Date) row[0]).toLocalDate();
            BigDecimal earnings = (BigDecimal) row[1];
            points.stream().filter(p -> p.getDate().equals(d)).findFirst().ifPresent(p -> p.setEarnings(earnings));
        }

        return points;
    }

    // --- Performance Metrics ---

    public List<PerformanceMetric> getTopProducts(Long affiliateId, Long merchantId, LocalDateTime start, LocalDateTime end) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT p.id, p.name, ");
        sql.append(" (SELECT COUNT(*) FROM clicks c JOIN affiliate_links al ON c.affiliate_link_id = al.id WHERE al.product_id = p.id AND c.clicked_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND al.affiliate_id = :affiliateId");
        sql.append(") as clicks, ");
        sql.append(" (SELECT COUNT(*) FROM conversions c JOIN affiliate_links al ON c.affiliate_link_id = al.id WHERE al.product_id = p.id AND c.converted_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND al.affiliate_id = :affiliateId");
        sql.append(") as convs, ");
        sql.append(" (SELECT COALESCE(SUM(c.order_amount), 0) FROM conversions c JOIN affiliate_links al ON c.affiliate_link_id = al.id WHERE al.product_id = p.id AND c.status = 'VALID' AND c.converted_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND al.affiliate_id = :affiliateId");
        sql.append(") as sales, ");
        sql.append(" (SELECT COALESCE(SUM(c.amount), 0) FROM commissions c JOIN conversions conv ON c.conversion_id = conv.id JOIN affiliate_links al ON conv.affiliate_link_id = al.id WHERE al.product_id = p.id AND c.status IN ('APPROVED', 'PAID') AND c.created_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND c.affiliate_id = :affiliateId");
        sql.append(") as earnings ");
        sql.append(" FROM products p WHERE 1=1 ");
        if (merchantId != null) sql.append(" AND p.merchant_id = :merchantId ");
        // Ensure we only show products that have clicks or conversions
        sql.append(" HAVING clicks > 0 OR convs > 0 ");
        sql.append(" ORDER BY earnings DESC, convs DESC, clicks DESC LIMIT 5");

        Query q = entityManager.createNativeQuery(sql.toString());
        q.setParameter("start", start);
        q.setParameter("end", end);
        if (affiliateId != null) q.setParameter("affiliateId", affiliateId);
        if (merchantId != null) q.setParameter("merchantId", merchantId);

        List<Object[]> results = q.getResultList();
        return mapPerformanceMetrics(results);
    }

    public List<PerformanceMetric> getTopCampaigns(Long affiliateId, Long merchantId, LocalDateTime start, LocalDateTime end) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT camp.id, camp.title, ");
        sql.append(" (SELECT COUNT(*) FROM clicks c JOIN affiliate_links al ON c.affiliate_link_id = al.id WHERE al.campaign_id = camp.id AND c.clicked_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND al.affiliate_id = :affiliateId");
        sql.append(") as clicks, ");
        sql.append(" (SELECT COUNT(*) FROM conversions c JOIN affiliate_links al ON c.affiliate_link_id = al.id WHERE al.campaign_id = camp.id AND c.converted_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND al.affiliate_id = :affiliateId");
        sql.append(") as convs, ");
        sql.append(" (SELECT COALESCE(SUM(c.order_amount), 0) FROM conversions c JOIN affiliate_links al ON c.affiliate_link_id = al.id WHERE al.campaign_id = camp.id AND c.status = 'VALID' AND c.converted_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND al.affiliate_id = :affiliateId");
        sql.append(") as sales, ");
        sql.append(" (SELECT COALESCE(SUM(c.amount), 0) FROM commissions c JOIN conversions conv ON c.conversion_id = conv.id JOIN affiliate_links al ON conv.affiliate_link_id = al.id WHERE al.campaign_id = camp.id AND c.status IN ('APPROVED', 'PAID') AND c.created_at BETWEEN :start AND :end");
        if (affiliateId != null) sql.append(" AND c.affiliate_id = :affiliateId");
        sql.append(") as earnings ");
        sql.append(" FROM campaigns camp WHERE 1=1 ");
        if (merchantId != null) sql.append(" AND camp.merchant_id = :merchantId ");
        sql.append(" HAVING clicks > 0 OR convs > 0 ");
        sql.append(" ORDER BY earnings DESC, convs DESC, clicks DESC LIMIT 5");

        Query q = entityManager.createNativeQuery(sql.toString());
        q.setParameter("start", start);
        q.setParameter("end", end);
        if (affiliateId != null) q.setParameter("affiliateId", affiliateId);
        if (merchantId != null) q.setParameter("merchantId", merchantId);

        List<Object[]> results = q.getResultList();
        return mapPerformanceMetrics(results);
    }

    private List<PerformanceMetric> mapPerformanceMetrics(List<Object[]> results) {
        List<PerformanceMetric> metrics = new ArrayList<>();
        for (Object[] row : results) {
            Long id = ((Number) row[0]).longValue();
            String name = (String) row[1];
            long clicks = ((Number) row[2]).longValue();
            long convs = ((Number) row[3]).longValue();
            BigDecimal sales = (BigDecimal) row[4];
            BigDecimal earnings = (BigDecimal) row[5];
            double convRate = clicks > 0 ? ((double) convs / clicks) * 100.0 : 0.0;
            metrics.add(new PerformanceMetric(id, name, clicks, convs, convRate, sales, earnings));
        }
        return metrics;
    }
}
