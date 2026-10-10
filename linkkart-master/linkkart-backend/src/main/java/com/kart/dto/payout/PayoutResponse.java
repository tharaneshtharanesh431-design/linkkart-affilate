package com.kart.dto.payout;

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
public class PayoutResponse {
    private Long id;
    private BigDecimal amount;
    private String status;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
    private String failureReason;
    private String rejectionReason;
}
