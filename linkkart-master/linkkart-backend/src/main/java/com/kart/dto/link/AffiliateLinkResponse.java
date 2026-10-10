package com.kart.dto.link;

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
public class AffiliateLinkResponse {
    private Long id;
    private String code;
    private String trackingUrl;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private String merchantName;
    private Long clicksCount;
    private Long conversionsCount;
    private BigDecimal totalCommission;
    private LocalDateTime createdAt;
}
