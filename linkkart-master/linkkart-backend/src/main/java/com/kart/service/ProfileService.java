package com.kart.service;

import com.kart.dto.profile.AffiliateOnboardingRequest;
import com.kart.dto.profile.MerchantOnboardingRequest;
import com.kart.dto.profile.ProfileResponse;

public interface ProfileService {
    ProfileResponse getMyProfile(String email);
    ProfileResponse onboardMerchant(String email, MerchantOnboardingRequest request);
    ProfileResponse updateMerchantProfile(String email, MerchantOnboardingRequest request);
    ProfileResponse onboardAffiliate(String email, AffiliateOnboardingRequest request);
    ProfileResponse updateAffiliateProfile(String email, AffiliateOnboardingRequest request);
    
    java.util.List<ProfileResponse> discoverAffiliates(String niche, String location);
}
