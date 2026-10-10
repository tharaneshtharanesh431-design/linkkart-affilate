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
public class AdminProductResponse {
    private Long id;
    private String name;
    private String merchantEmail;
    private String categoryName;
    private BigDecimal price;
    private String status;
    private String activeCampaignName;
    private LocalDateTime createdAt;
}
