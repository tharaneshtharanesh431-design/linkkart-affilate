package com.kart.dto.profile;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MerchantOnboardingRequest {
    @NotBlank(message = "Business name is required")
    private String businessName;

    private String websiteUrl;
    private String description;
    private String logoUrl;
    private String industry;
    private String contactEmail;
    private String location;
}
