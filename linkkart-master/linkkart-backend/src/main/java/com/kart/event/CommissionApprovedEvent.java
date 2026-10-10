package com.kart.event;

import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class CommissionApprovedEvent {
    private final Long commissionId;
    private final Long affiliateId;
    private final BigDecimal amount;
    private final String conversionId;
    private final LocalDateTime timestamp;
}
