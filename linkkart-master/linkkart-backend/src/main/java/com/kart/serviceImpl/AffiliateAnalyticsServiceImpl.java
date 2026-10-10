package com.kart.serviceImpl;

import com.kart.dto.analytics.*;
import com.kart.entity.User;
import com.kart.repository.AnalyticsRepository;
import com.kart.service.AffiliateAnalyticsService;
import com.kart.service.AnalyticsDateHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AffiliateAnalyticsServiceImpl implements AffiliateAnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final AnalyticsDateHelper dateHelper;

    @Override
    public AnalyticsDashboardResponse getDashboardAnalytics(User affiliate, AnalyticsRequest request) {
        LocalDateTime[] dates = dateHelper.getStartAndEndDates(request);
        LocalDateTime start = dates[0];
        LocalDateTime end = dates[1];
        Long affiliateId = affiliate.getId();

        long clicks = analyticsRepository.getClickCount(affiliateId, null, start, end);
        long conversions = analyticsRepository.getConversionCount(affiliateId, null, start, end);
        
        double conversionRate = clicks > 0 ? ((double) conversions / clicks) * 100.0 : 0.0;

        BigDecimal approvedEarnings = analyticsRepository.getCommissionTotal(affiliateId, null, start, end, List.of("APPROVED", "PAID"));
        BigDecimal pendingEarnings = analyticsRepository.getCommissionTotal(affiliateId, null, start, end, List.of("PENDING"));
        BigDecimal reversedEarnings = analyticsRepository.getCommissionTotal(affiliateId, null, start, end, List.of("REVERSED"));
        BigDecimal totalEarnings = approvedEarnings.add(pendingEarnings); // Custom logic if needed
        
        // EPC: Earnings Per Click (based on approved/paid earnings)
        BigDecimal epc = BigDecimal.ZERO;
        if (clicks > 0) {
            epc = approvedEarnings.divide(BigDecimal.valueOf(clicks), 2, RoundingMode.HALF_UP);
        }

        AnalyticsKpiResponse kpis = AnalyticsKpiResponse.builder()
                .totalClicks(clicks)
                .totalConversions(conversions)
                .conversionRate(conversionRate)
                .totalEarnings(approvedEarnings) // Usually we show approved as total
                .pendingEarnings(pendingEarnings)
                .approvedEarnings(approvedEarnings)
                .reversedEarnings(reversedEarnings)
                .epc(epc)
                .build();

        List<TimeSeriesDataPoint> timeSeries = analyticsRepository.getTimeSeries(affiliateId, null, start, end);
        List<PerformanceMetric> topProducts = analyticsRepository.getTopProducts(affiliateId, null, start, end);
        List<PerformanceMetric> topCampaigns = analyticsRepository.getTopCampaigns(affiliateId, null, start, end);

        return AnalyticsDashboardResponse.builder()
                .kpis(kpis)
                .timeSeries(timeSeries)
                .topProducts(topProducts)
                .topCampaigns(topCampaigns)
                .build();
    }
}
