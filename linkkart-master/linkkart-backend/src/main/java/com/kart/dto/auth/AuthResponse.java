package com.kart.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    // Tokens are not returned in the JSON body, they are set as HttpOnly cookies.
    // However, if we need to return them internally to the controller, we can keep them here and ignore them in JSON serialization.
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String accessToken;
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String refreshToken;

    private String email;
    private String role;
    private boolean onboardingCompleted;
}
