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
public class AdminPayoutResponse {
    private Long id;
    private String affiliateEmail;
    private BigDecimal amount;
    private String status;
    private String paymentMethod;
    private String notes;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
}
