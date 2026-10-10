package com.kart.serviceImpl;

import com.kart.dto.analytics.*;
import com.kart.repository.*;
import com.kart.service.AdminAnalyticsService;
import com.kart.service.AnalyticsDateHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CampaignRepository campaignRepository;
    private final AnalyticsDateHelper dateHelper;

    @Override
    public AnalyticsDashboardResponse getDashboardAnalytics(AnalyticsRequest request) {
        LocalDateTime[] dates = dateHelper.getStartAndEndDates(request);
        LocalDateTime start = dates[0];
        LocalDateTime end = dates[1];

        long clicks = analyticsRepository.getClickCount(null, null, start, end);
        long conversions = analyticsRepository.getConversionCount(null, null, start, end);
        double conversionRate = clicks > 0 ? ((double) conversions / clicks) * 100.0 : 0.0;

        BigDecimal totalSalesAmount = analyticsRepository.getSalesVolume(null, null, start, end);
        
        BigDecimal approvedCommissions = analyticsRepository.getCommissionTotal(null, null, start, end, List.of("APPROVED", "PAID"));
        BigDecimal pendingCommissions = analyticsRepository.getCommissionTotal(null, null, start, end, List.of("PENDING"));
        BigDecimal reversedCommissions = analyticsRepository.getCommissionTotal(null, null, start, end, List.of("REVERSED"));
        
        BigDecimal paidPayouts = analyticsRepository.getPayoutTotal(null, start, end, List.of("PAID"));
        BigDecimal pendingPayouts = analyticsRepository.getPayoutTotal(null, start, end, List.of("REQUESTED", "PROCESSING"));
        BigDecimal totalPayouts = paidPayouts.add(pendingPayouts);

        // Platform counts
        long totalUsers = userRepository.count();
        long totalAffiliates = userRepository.countByRole_Name("AFFILIATE");
        long totalMerchants = userRepository.countByRole_Name("MERCHANT");
        long totalProducts = productRepository.count();
        long totalCampaigns = campaignRepository.count();
        
        // You could add active status counts here by querying the repositories
        long activeProducts = productRepository.countByStatus("ACTIVE");
        long activeCampaigns = campaignRepository.countByStatus("ACTIVE");

        AnalyticsKpiResponse kpis = AnalyticsKpiResponse.builder()
                .totalClicks(clicks)
                .totalConversions(conversions)
                .conversionRate(conversionRate)
                .totalSalesAmount(totalSalesAmount)
                .approvedEarnings(approvedCommissions)
                .pendingEarnings(pendingCommissions)
                .reversedEarnings(reversedCommissions)
                .totalPayouts(totalPayouts)
                .paidPayouts(paidPayouts)
                .pendingPayouts(pendingPayouts)
                .totalUsers(totalUsers)
                .totalAffiliates(totalAffiliates)
                .totalMerchants(totalMerchants)
                .totalProducts(totalProducts)
                .totalCampaigns(totalCampaigns)
                .activeProducts(activeProducts)
                .activeCampaigns(activeCampaigns)
                .build();

        List<TimeSeriesDataPoint> timeSeries = analyticsRepository.getTimeSeries(null, null, start, end);
        List<PerformanceMetric> topProducts = analyticsRepository.getTopProducts(null, null, start, end);
        List<PerformanceMetric> topCampaigns = analyticsRepository.getTopCampaigns(null, null, start, end);

        return AnalyticsDashboardResponse.builder()
                .kpis(kpis)
                .timeSeries(timeSeries)
                .topProducts(topProducts)
                .topCampaigns(topCampaigns)
                .build();
    }
}
