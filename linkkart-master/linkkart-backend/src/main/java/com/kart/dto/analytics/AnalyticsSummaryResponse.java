package com.kart.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryResponse {
    private double monthlyEarnings;
    private double revenue;
    private double conversionRate;
    private int topProducts;
    private int topAffiliates;
    private int activeCampaigns;
    private int totalProducts;
    private double monthlyRevenue;
    private int salesThisMonth;
    private int ranking;
    private List<String> recentHighlights;
}
