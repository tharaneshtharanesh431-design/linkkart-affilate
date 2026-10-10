package com.kart.dto.analytics;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class AnalyticsDashboardResponse {
    private AnalyticsKpiResponse kpis;
    private List<TimeSeriesDataPoint> timeSeries;
    private List<PerformanceMetric> topProducts;
    private List<PerformanceMetric> topCampaigns;
    private List<PerformanceMetric> topLinks; // Affiliate specific
    private List<PerformanceMetric> topAffiliates; // Merchant specific
}
