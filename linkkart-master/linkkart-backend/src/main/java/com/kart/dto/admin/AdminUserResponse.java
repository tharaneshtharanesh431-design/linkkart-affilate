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
public class AdminUserResponse {
    private Long id;
    private String email;
    private String role;
    private String status;
    private boolean onboardingCompleted;
    private LocalDateTime createdAt;
    private String name; // Derived from profile if available
}
