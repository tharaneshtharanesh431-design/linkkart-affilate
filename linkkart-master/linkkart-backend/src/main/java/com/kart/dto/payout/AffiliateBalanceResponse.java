package com.kart.dto.payout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AffiliateBalanceResponse {
    private BigDecimal approvedEarnings;
    private BigDecimal pendingEarnings;
    private BigDecimal paidAmount;
    private BigDecimal requestedAmount;
    private BigDecimal processingAmount;
    private BigDecimal availableBalance;
    private BigDecimal minimumPayout;
}
