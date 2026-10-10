package com.kart.dto.analytics;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class AnalyticsKpiResponse {
    private long totalClicks;
    private long totalConversions;
    private double conversionRate;
    private BigDecimal totalEarnings;
    private BigDecimal pendingEarnings;
    private BigDecimal approvedEarnings;
    private BigDecimal reversedEarnings;
    private BigDecimal availableBalance;
    private BigDecimal epc; // Earnings Per Click
    
    // Merchant specific
    private BigDecimal totalSalesAmount;
    
    // Admin specific
    private long totalUsers;
    private long totalAffiliates;
    private long totalMerchants;
    private long totalProducts;
    private long activeProducts;
    private long totalCampaigns;
    private long activeCampaigns;
    private long activeAffiliates;
    private long activeMerchants;
    private BigDecimal totalPayouts;
    private BigDecimal paidPayouts;
    private BigDecimal pendingPayouts;
}
