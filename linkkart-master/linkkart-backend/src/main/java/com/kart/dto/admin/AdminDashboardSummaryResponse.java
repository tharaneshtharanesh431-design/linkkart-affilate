package com.kart.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardSummaryResponse {
    private long totalUsers;
    private long totalAffiliates;
    private long totalMerchants;
    private long totalProducts;
    private long activeCampaigns;
    private long totalClicks;
    private long totalConversions;
    private BigDecimal totalCommission;
    private BigDecimal pendingPayouts;
    private BigDecimal paidPayouts;
}
