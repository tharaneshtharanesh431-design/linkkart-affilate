package com.kart.dto.commission;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionSummaryResponse {
    private BigDecimal totalEarnings;
    private BigDecimal pendingEarnings;
    private BigDecimal approvedEarnings;
    private BigDecimal reversedEarnings;
}
