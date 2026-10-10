package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.profile.AffiliateOnboardingRequest;
import com.kart.dto.profile.MerchantOnboardingRequest;
import com.kart.dto.profile.ProfileResponse;
import com.kart.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "Profile")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/me")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profileService.getMyProfile(email)));
    }

    @PostMapping("/merchant/onboarding")
    @Operation(summary = "Submit merchant onboarding")
    public ResponseEntity<ApiResponse<ProfileResponse>> onboardMerchant(
            Authentication authentication,
            @Valid @RequestBody MerchantOnboardingRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success("Merchant onboarding completed", profileService.onboardMerchant(email, request)));
    }

    @PutMapping("/merchant")
    @Operation(summary = "Update merchant profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateMerchantProfile(
            Authentication authentication,
            @Valid @RequestBody MerchantOnboardingRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success("Merchant profile updated", profileService.updateMerchantProfile(email, request)));
    }

    @PostMapping("/affiliate/onboarding")
    @Operation(summary = "Submit affiliate onboarding")
    public ResponseEntity<ApiResponse<ProfileResponse>> onboardAffiliate(
            Authentication authentication,
            @Valid @RequestBody AffiliateOnboardingRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success("Affiliate onboarding completed", profileService.onboardAffiliate(email, request)));
    }

    @PutMapping("/affiliate")
    @Operation(summary = "Update affiliate profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateAffiliateProfile(
            Authentication authentication,
            @Valid @RequestBody AffiliateOnboardingRequest request) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success("Affiliate profile updated", profileService.updateAffiliateProfile(email, request)));
    }
}
