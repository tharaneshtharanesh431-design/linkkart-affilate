package com.kart.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminActivityItem {
    private String type; // e.g., "USER_REGISTERED", "NEW_PRODUCT", "CONVERSION", "PAYOUT_REQUEST"
    private String description;
    private LocalDateTime timestamp;
}
