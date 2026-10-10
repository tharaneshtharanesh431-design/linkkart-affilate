package com.kart.dto.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AffiliateOnboardingRequest {
    @NotBlank(message = "Payment email is required")
    @Email(message = "Invalid email format")
    private String paymentEmail;

    private String websiteUrl;

    private String socialLinks;

    private String taxId;

    private String displayName;
    private String bio;
    private String niche;
    private String audienceSize;
    private String profileImageUrl;
    private Boolean isDiscoverable;
    private String location;
}
