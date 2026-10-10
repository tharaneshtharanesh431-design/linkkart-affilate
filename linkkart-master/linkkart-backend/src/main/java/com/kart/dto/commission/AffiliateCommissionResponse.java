package com.kart.dto.commission;

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
public class AffiliateCommissionResponse {
    private Long id;
    private Long conversionId;
    private BigDecimal amount;
    private String status;
    private LocalDateTime clearsAt;
    private LocalDateTime createdAt;
}
