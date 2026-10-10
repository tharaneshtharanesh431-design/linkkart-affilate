package com.kart.serviceImpl;

import com.kart.dto.profile.AffiliateOnboardingRequest;
import com.kart.dto.profile.MerchantOnboardingRequest;
import com.kart.dto.profile.ProfileResponse;
import com.kart.entity.AffiliateProfile;
import com.kart.entity.Organization;
import com.kart.entity.OrganizationMember;
import com.kart.entity.User;
import com.kart.exception.BadRequestException;
import com.kart.repository.AffiliateProfileRepository;
import com.kart.repository.OrganizationRepository;
import com.kart.repository.OrganizationMemberRepository;
import com.kart.repository.UserRepository;
import com.kart.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final OrganizationMemberRepository organizationMemberRepository;
    private final AffiliateProfileRepository affiliateProfileRepository;

    @Override
    public ProfileResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Object profile = null;
        if ("MERCHANT".equals(user.getRole().getName())) {
            Optional<OrganizationMember> memberOpt = organizationMemberRepository.findByUser(user).stream().findFirst();
            profile = memberOpt.map(OrganizationMember::getOrganization).orElse(null);
        } else if ("AFFILIATE".equals(user.getRole().getName())) {
            profile = affiliateProfileRepository.findByUserId(user.getId()).orElse(null);
        }

        return buildResponse(user, profile);
    }

    @Override
    @Transactional
    public ProfileResponse onboardMerchant(String email, MerchantOnboardingRequest request) {
        return processMerchantProfile(email, request, true);
    }

    @Override
    @Transactional
    public ProfileResponse updateMerchantProfile(String email, MerchantOnboardingRequest request) {
        return processMerchantProfile(email, request, false);
    }

    private ProfileResponse processMerchantProfile(String email, MerchantOnboardingRequest request, boolean isNew) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!"MERCHANT".equals(user.getRole().getName())) {
            throw new BadRequestException("User is not a merchant");
        }
        
        if (isNew && user.isOnboardingCompleted()) {
            throw new BadRequestException("Onboarding already completed");
        }

        Optional<OrganizationMember> existingMember = organizationMemberRepository.findByUser(user).stream().findFirst();
        Organization profile;
        if (existingMember.isPresent()) {
            profile = existingMember.get().getOrganization();
        } else {
            profile = new Organization();
            profile.setSlug(request.getBusinessName().toLowerCase().replaceAll("\\s+", "-") + "-" + user.getId());
        }

        profile.setName(request.getBusinessName());
        profile.setWebsiteUrl(request.getWebsiteUrl());
        profile.setDescription(request.getDescription());
        profile.setLogoUrl(request.getLogoUrl());
        profile.setIndustry(request.getIndustry());
        profile.setContactEmail(request.getContactEmail());
        profile.setLocation(request.getLocation());

        if (profile.getIntegrationSecret() == null) {
            byte[] secretBytes = new byte[32];
            new java.security.SecureRandom().nextBytes(secretBytes);
            profile.setIntegrationSecret(java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(secretBytes));
        }

        profile = organizationRepository.save(profile);

        if (existingMember.isEmpty()) {
            OrganizationMember member = OrganizationMember.builder()
                .organization(profile)
                .user(user)
                .role("OWNER")
                .status("ACTIVE")
                .build();
            organizationMemberRepository.save(member);
        }

        if (isNew) {
            user.setOnboardingCompleted(true);
            userRepository.save(user);
        }

        return buildResponse(user, profile);
    }

    @Override
    @Transactional
    public ProfileResponse onboardAffiliate(String email, AffiliateOnboardingRequest request) {
        return processAffiliateProfile(email, request, true);
    }

    @Override
    @Transactional
    public ProfileResponse updateAffiliateProfile(String email, AffiliateOnboardingRequest request) {
        return processAffiliateProfile(email, request, false);
    }

    private ProfileResponse processAffiliateProfile(String email, AffiliateOnboardingRequest request, boolean isNew) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!"AFFILIATE".equals(user.getRole().getName())) {
            throw new BadRequestException("User is not an affiliate");
        }

        AffiliateProfile profile = affiliateProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> AffiliateProfile.builder().user(user).build());

        profile.setPaymentEmail(request.getPaymentEmail());
        profile.setWebsiteUrl(request.getWebsiteUrl());
        profile.setSocialLinks(request.getSocialLinks());
        profile.setTaxId(request.getTaxId());
        
        profile.setDisplayName(request.getDisplayName());
        profile.setBio(request.getBio());
        profile.setNiche(request.getNiche());
        profile.setAudienceSize(request.getAudienceSize());
        profile.setProfileImageUrl(request.getProfileImageUrl());
        if (request.getIsDiscoverable() != null) {
            profile.setIsDiscoverable(request.getIsDiscoverable());
        }
        profile.setLocation(request.getLocation());

        affiliateProfileRepository.save(profile);

        if (isNew && !user.isOnboardingCompleted()) {
            user.setOnboardingCompleted(true);
            userRepository.save(user);
        }

        return buildResponse(user, profile);
    }

    private ProfileResponse buildResponse(User user, Object profile) {
        // Create safe profile copy without integration secret if merchant
        Object safeProfile = profile;
        if (profile instanceof Organization mp) {
            safeProfile = new SafeMerchantProfile(
                mp.getId(), mp.getName(), mp.getWebsiteUrl(),
                mp.getDescription(), mp.getLogoUrl(), mp.getIndustry(),
                mp.getContactEmail(), mp.getLocation()
            );
        }

        ProfileResponse.UserInfo userInfo = ProfileResponse.UserInfo.builder()
                .email(user.getEmail())
                .role(user.getRole().getName())
                .onboardingCompleted(user.isOnboardingCompleted())
                .build();

        return ProfileResponse.builder()
                .user(userInfo)
                .profile(safeProfile)
                .build();
    }

    // Temporary DTO for safe Merchant Profile
    private record SafeMerchantProfile(
        Long id, String businessName, String websiteUrl,
        String description, String logoUrl, String industry,
        String contactEmail, String location
    ) {}

    @Override
    @Transactional(readOnly = true)
    public java.util.List<ProfileResponse> discoverAffiliates(String niche, String location) {
        org.springframework.data.jpa.domain.Specification<AffiliateProfile> spec = org.springframework.data.jpa.domain.Specification.where(
            (root, query, cb) -> cb.equal(root.get("status"), "ACTIVE")
        );

        spec = spec.and((root, query, cb) -> cb.isTrue(root.get("isDiscoverable")));

        if (niche != null && !niche.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("niche")), "%" + niche.trim().toLowerCase() + "%"));
        }

        if (location != null && !location.trim().isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("location")), "%" + location.trim().toLowerCase() + "%"));
        }

        return affiliateProfileRepository.findAll(spec).stream()
                .map(profile -> buildResponse(profile.getUser(), profile))
                .toList();
    }
}
