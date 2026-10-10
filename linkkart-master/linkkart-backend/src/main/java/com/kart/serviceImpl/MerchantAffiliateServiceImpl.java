package com.kart.serviceImpl;

import com.kart.dto.merchant.MerchantAffiliateResponse;
import com.kart.entity.*;
import com.kart.exception.ResourceNotFoundException;
import com.kart.exception.BadRequestException;
import com.kart.repository.*;
import com.kart.service.MerchantAffiliateService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MerchantAffiliateServiceImpl implements MerchantAffiliateService {

    private final UserRepository userRepository;
    private final CampaignAffiliateRepository campaignAffiliateRepository;
    private final CampaignRepository campaignRepository;
    private final ClickRepository clickRepository;
    private final ConversionRepository conversionRepository;
    private final CommissionRepository commissionRepository;
    private final OrganizationMemberRepository organizationMemberRepository;

    private User getAuthenticatedMerchant() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
        if (!"MERCHANT".equalsIgnoreCase(user.getRole().getName())) {
            throw new org.springframework.security.access.AccessDeniedException("Only merchants can access this");
        }
        return user;
    }

    private Organization getOrganizationForUser(User user) {
        return organizationMemberRepository.findByUser(user).stream()
                .findFirst()
                .map(OrganizationMember::getOrganization)
                .orElseThrow(() -> new BadRequestException("Merchant organization not found. Please complete onboarding."));
    }

    @Override
    public List<MerchantAffiliateResponse> getMerchantAffiliates() {
        User merchant = getAuthenticatedMerchant();
        Organization organization = getOrganizationForUser(merchant);
        List<Campaign> merchantCampaigns = campaignRepository.findByOrganization(organization);
        
        List<CampaignAffiliate> allAffiliates = campaignAffiliateRepository.findAll();
        List<MerchantAffiliateResponse> responses = new ArrayList<>();

        // Instead of filtering in-memory, we use the repositories to do the counting directly.
        for (CampaignAffiliate ca : allAffiliates) {
            if (merchantCampaigns.stream().anyMatch(c -> c.getId().equals(ca.getCampaign().getId()))) {
                long clicks = clickRepository.countByAffiliateLink_Campaign_IdAndAffiliateLink_Affiliate_Id(ca.getCampaign().getId(), ca.getAffiliate().getId());
                long conversions = conversionRepository.countByAffiliateLink_Campaign_IdAndAffiliateLink_Affiliate_Id(ca.getCampaign().getId(), ca.getAffiliate().getId());
                BigDecimal commissionGenerated = commissionRepository.sumValidCommissionByCampaignAndAffiliate(ca.getCampaign().getId(), ca.getAffiliate().getId());
                
                if (commissionGenerated == null) {
                    commissionGenerated = BigDecimal.ZERO;
                }

                responses.add(MerchantAffiliateResponse.builder()
                        .affiliateId(ca.getAffiliate().getId())
                        .affiliateEmail(ca.getAffiliate().getEmail())
                        .campaignId(ca.getCampaign().getId())
                        .campaignName(ca.getCampaign().getTitle())
                        .status(ca.getStatus())
                        .totalClicks(clicks)
                        .totalConversions(conversions)
                        .totalCommissionGenerated(commissionGenerated)
                        .build());
            }
        }
        
        return responses;
    }

    @Override
    @Transactional
    public MerchantAffiliateResponse updateAffiliateStatus(Long campaignId, Long affiliateId, String status) {
        User merchant = getAuthenticatedMerchant();
        Organization organization = getOrganizationForUser(merchant);
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));

        if (campaign.getOrganization() == null || !campaign.getOrganization().getId().equals(organization.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You do not own this campaign");
        }

        CampaignAffiliate ca = campaignAffiliateRepository.findById(new CampaignAffiliateId(campaignId, affiliateId))
                .orElseThrow(() -> new ResourceNotFoundException("Affiliate relationship not found"));

        ca.setStatus(status.toUpperCase());
        ca = campaignAffiliateRepository.save(ca);

        return MerchantAffiliateResponse.builder()
                .affiliateId(ca.getAffiliate().getId())
                .affiliateEmail(ca.getAffiliate().getEmail())
                .campaignId(ca.getCampaign().getId())
                .campaignName(ca.getCampaign().getTitle())
                .status(ca.getStatus())
                .totalClicks(0L)
                .totalConversions(0L)
                .totalCommissionGenerated(BigDecimal.ZERO)
                .build();
    }
}
