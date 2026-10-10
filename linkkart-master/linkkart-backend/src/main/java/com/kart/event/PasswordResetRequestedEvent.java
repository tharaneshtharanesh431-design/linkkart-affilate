package com.kart.event;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class PasswordResetRequestedEvent {
    private final Long userId;
    private final String email;
    private final String resetToken;
    private final LocalDateTime timestamp;
}
