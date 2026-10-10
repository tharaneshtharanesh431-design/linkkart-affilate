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
public class AdminAffiliateResponse {
    private Long id;
    private String email;
    private String name;
    private String website;
    private String status;
    private boolean onboardingCompleted;
    private LocalDateTime createdAt;
    private long linksCount;
    private long clicksCount;
    private long conversionsCount;
    // We can add earnings, payout history if needed in detail view
}
