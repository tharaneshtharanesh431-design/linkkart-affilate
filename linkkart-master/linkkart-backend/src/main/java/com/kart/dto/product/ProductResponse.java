package com.kart.dto.product;

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
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String commissionType;
    private BigDecimal commissionRate;
    private BigDecimal potentialCommission;
    private String imageUrl;
    private String destinationUrl;
    private String status;
    private Long categoryId;
    private String categoryName;
    private Long merchantId;
    private String merchantName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
