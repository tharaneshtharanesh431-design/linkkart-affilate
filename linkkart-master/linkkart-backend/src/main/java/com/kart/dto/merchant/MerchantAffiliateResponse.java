package com.kart.dto.merchant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MerchantAffiliateResponse {
    private Long affiliateId;
    private String affiliateEmail;
    private Long campaignId;
    private String campaignName;
    private String status;
    private Long totalClicks;
    private Long totalConversions;
    private BigDecimal totalCommissionGenerated;
}
