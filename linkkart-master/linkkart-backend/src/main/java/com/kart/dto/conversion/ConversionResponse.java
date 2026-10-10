package com.kart.dto.conversion;

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
public class ConversionResponse {
    private Long id;
    private String trackingCode;
    private String productName;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt;
}
