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
public class AdminMerchantResponse {
    private Long id;
    private String email;
    private String businessName;
    private String website;
    private String status;
    private boolean onboardingCompleted;
    private LocalDateTime createdAt;
    private long productCount;
    private long campaignCount;
    // We can add clicks, conversions, sales later if needed in the detailed view
}
