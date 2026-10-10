package com.kart.event;

import lombok.Builder;
import lombok.Getter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class PayoutFailedEvent {
    private final Long payoutId;
    private final Long affiliateId;
    private final BigDecimal amount;
    private final String reason;
    private final LocalDateTime timestamp;
}
