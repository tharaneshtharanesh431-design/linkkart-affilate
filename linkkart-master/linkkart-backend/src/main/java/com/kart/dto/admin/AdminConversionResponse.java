package com.kart.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminConversionResponse {
    private Long id;
    private String transactionId;
    private String clickId;
    private String affiliateEmail;
    private String merchantEmail;
    private String campaignName;
    private BigDecimal saleAmount;
    private String status;
    private LocalDateTime createdAt;
}
