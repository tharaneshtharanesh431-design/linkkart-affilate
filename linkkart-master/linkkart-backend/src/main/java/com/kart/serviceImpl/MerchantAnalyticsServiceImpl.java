package com.kart.serviceImpl;

import com.kart.dto.analytics.*;
import com.kart.entity.User;
import com.kart.repository.AnalyticsRepository;
import com.kart.service.MerchantAnalyticsService;
import com.kart.service.AnalyticsDateHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MerchantAnalyticsServiceImpl implements MerchantAnalyticsService {

    private final AnalyticsRepository analyticsRepository;
    private final AnalyticsDateHelper dateHelper;

    @Override
    public AnalyticsDashboardResponse getDashboardAnalytics(User merchant, AnalyticsRequest request) {
        LocalDateTime[] dates = dateHelper.getStartAndEndDates(request);
        LocalDateTime start = dates[0];
        LocalDateTime end = dates[1];
        Long merchantId = merchant.getId();

        long clicks = analyticsRepository.getClickCount(null, merchantId, start, end);
        long conversions = analyticsRepository.getConversionCount(null, merchantId, start, end);
        
        double conversionRate = clicks > 0 ? ((double) conversions / clicks) * 100.0 : 0.0;

        BigDecimal totalSalesAmount = analyticsRepository.getSalesVolume(null, merchantId, start, end);
        
        BigDecimal approvedCommissions = analyticsRepository.getCommissionTotal(null, merchantId, start, end, List.of("APPROVED", "PAID"));
        BigDecimal pendingCommissions = analyticsRepository.getCommissionTotal(null, merchantId, start, end, List.of("PENDING"));
        BigDecimal reversedCommissions = analyticsRepository.getCommissionTotal(null, merchantId, start, end, List.of("REVERSED"));
        
        // Estimated Merchant Earnings (Revenue minus Commission Costs)
        BigDecimal estimatedEarnings = totalSalesAmount.subtract(approvedCommissions);

        AnalyticsKpiResponse kpis = AnalyticsKpiResponse.builder()
                .totalClicks(clicks)
                .totalConversions(conversions)
                .conversionRate(conversionRate)
                .totalSalesAmount(totalSalesAmount)
                .totalEarnings(estimatedEarnings) // Net revenue for merchant
                .pendingEarnings(pendingCommissions) // Used for pending commission costs
                .approvedEarnings(approvedCommissions) // Used for approved commission costs
                .reversedEarnings(reversedCommissions)
                .build();

        List<TimeSeriesDataPoint> timeSeries = analyticsRepository.getTimeSeries(null, merchantId, start, end);
        List<PerformanceMetric> topProducts = analyticsRepository.getTopProducts(null, merchantId, start, end);
        List<PerformanceMetric> topCampaigns = analyticsRepository.getTopCampaigns(null, merchantId, start, end);
        
        // Top affiliates logic could be similar to top products/campaigns, but let's reuse products/campaigns for now 
        // to fit the DTO, or add a getTopAffiliates to AnalyticsRepository.

        return AnalyticsDashboardResponse.builder()
                .kpis(kpis)
                .timeSeries(timeSeries)
                .topProducts(topProducts)
                .topCampaigns(topCampaigns)
                .build();
    }
}
