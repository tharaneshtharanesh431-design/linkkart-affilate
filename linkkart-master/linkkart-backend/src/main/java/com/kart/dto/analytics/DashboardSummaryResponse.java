package com.kart.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryResponse {
    private long totalClicks;
    private long totalConversions;
    private BigDecimal totalEarnings;
    private double conversionRate;
    private long activeLinks;
    private BigDecimal pendingCommission;
    private BigDecimal approvedCommission;
    private List<CategoryBreakdownResponse> categoryBreakdown;
}
