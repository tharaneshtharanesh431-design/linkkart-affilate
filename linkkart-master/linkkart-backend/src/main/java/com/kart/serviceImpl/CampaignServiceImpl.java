package com.kart.serviceImpl;

import com.kart.constants.RoleName;
import com.kart.dto.campaign.CampaignRequest;
import com.kart.dto.campaign.CampaignResponse;
import com.kart.entity.Campaign;
import com.kart.entity.Category;
import com.kart.entity.Organization;
import com.kart.entity.OrganizationMember;
import com.kart.entity.User;
import com.kart.exception.BadRequestException;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.CampaignRepository;
import com.kart.repository.OrganizationMemberRepository;
import com.kart.repository.ProductRepository;
import com.kart.repository.UserRepository;
import com.kart.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import com.kart.repository.CampaignAffiliateRepository;
import com.kart.entity.CampaignAffiliate;
import com.kart.entity.CampaignAffiliateId;
import com.kart.dto.campaign.CampaignParticipationResponse;

@Service
@RequiredArgsConstructor
public class CampaignServiceImpl implements CampaignService {
    private final CampaignRepository campaignRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrganizationMemberRepository organizationMemberRepository;
    private final CampaignAffiliateRepository campaignAffiliateRepository;

    @Override
    @Transactional
    public CampaignResponse create(CampaignRequest request) {
        User merchant = getCurrentUser();
        checkMerchantOrAdmin(merchant);
        
        Organization organization = getOrganizationForUser(merchant);

        Campaign campaign = Campaign.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .commissionRate(request.getCommissionRate())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .budget(request.getBudget())
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .organization(organization)
                .build();
        
        if (request.getProductIds() != null && !request.getProductIds().isEmpty()) {
            List<com.kart.entity.Product> products = productRepository.findAllById(request.getProductIds());
            for (com.kart.entity.Product product : products) {
                if (!product.getOrganization().getId().equals(organization.getId())) {
                    throw new BadRequestException("Product " + product.getId() + " does not belong to your organization");
                }
                campaign.getProducts().add(product);
            }
        }

        return toResponse(campaignRepository.save(campaign));
    }

    @Override
    @Transactional
    public CampaignResponse update(Long id, CampaignRequest request) {
        User user = getCurrentUser();
        checkMerchantOrAdmin(user);
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        checkCampaignOwnership(campaign, user);

        campaign.setTitle(request.getTitle());
        campaign.setDescription(request.getDescription());
        campaign.setCommissionRate(request.getCommissionRate());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        campaign.setBudget(request.getBudget());
        campaign.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        if (request.getProductIds() != null) {
            campaign.getProducts().clear();
            List<com.kart.entity.Product> products = productRepository.findAllById(request.getProductIds());
            for (com.kart.entity.Product product : products) {
                if (!product.getOrganization().getId().equals(campaign.getOrganization().getId())) {
                    throw new BadRequestException("Product " + product.getId() + " does not belong to your organization");
                }
                campaign.getProducts().add(product);
            }
        }

        return toResponse(campaignRepository.save(campaign));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User user = getCurrentUser();
        checkMerchantOrAdmin(user);
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        checkCampaignOwnership(campaign, user);
        campaignRepository.delete(campaign);
    }

    private void checkMerchantOrAdmin(User user) {
        boolean isAllowed = "MERCHANT".equalsIgnoreCase(user.getRole().getName()) || "ADMIN".equalsIgnoreCase(user.getRole().getName());
        if (!isAllowed) {
            throw new org.springframework.security.access.AccessDeniedException("Only merchants can manage campaigns");
        }
    }

    private Organization getOrganizationForUser(User user) {
        if ("ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            return null; // Admins don't have an organization in this context
        }
        return organizationMemberRepository.findByUser(user).stream()
                .findFirst()
                .map(OrganizationMember::getOrganization)
                .orElseThrow(() -> new BadRequestException("Merchant organization not found. Please complete onboarding."));
    }

    private void checkCampaignOwnership(Campaign campaign, User user) {
        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole().getName());
        if (isAdmin) return;

        Organization userOrganization = getOrganizationForUser(user);
        if (campaign.getOrganization() == null || !campaign.getOrganization().getId().equals(userOrganization.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("You are not authorized to modify this campaign");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<CampaignResponse> getAll() {
        return campaignRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CampaignResponse> getMerchantCampaigns() {
        User user = getCurrentUser();
        checkMerchantOrAdmin(user);

        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole().getName());

        List<Campaign> campaigns;
        if (isAdmin) {
            campaigns = campaignRepository.findAll();
        } else {
            Organization organization = getOrganizationForUser(user);
            campaigns = campaignRepository.findByOrganization(organization);
        }
        return campaigns.stream().map(this::toResponse).toList();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Authenticated user not found"));
    }

    private CampaignResponse toResponse(Campaign campaign) {
        return CampaignResponse.builder()
                .id(campaign.getId())
                .title(campaign.getTitle())
                .description(campaign.getDescription())
                .commissionRate(campaign.getCommissionRate())
                .startDate(campaign.getStartDate())
                .endDate(campaign.getEndDate())
                .budget(campaign.getBudget())
                .status(campaign.getStatus())
                .merchantId(campaign.getOrganization() != null ? campaign.getOrganization().getId() : null)
                .merchantName(campaign.getOrganization() != null ? campaign.getOrganization().getName() : null)
                .createdAt(campaign.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public CampaignParticipationResponse requestParticipation(Long campaignId) {
        User user = getCurrentUser();
        if (!"AFFILIATE".equalsIgnoreCase(user.getRole().getName())) {
            throw new org.springframework.security.access.AccessDeniedException("Only affiliates can request participation");
        }

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));

        if (!"ACTIVE".equalsIgnoreCase(campaign.getStatus())) {
            throw new BadRequestException("Campaign is not active");
        }

        CampaignAffiliate participation = campaignAffiliateRepository
                .findByCampaignIdAndAffiliateId(campaignId, user.getId())
                .orElse(null);

        if (participation != null) {
            throw new BadRequestException("Participation already exists in state: " + participation.getStatus());
        }

        participation = CampaignAffiliate.builder()
                .campaign(campaign)
                .affiliate(user)
                .status("PENDING")
                .build();

        return toParticipationResponse(campaignAffiliateRepository.save(participation));
    }

    @Override
    @Transactional
    public CampaignParticipationResponse approveParticipation(Long campaignId, Long affiliateId) {
        User user = getCurrentUser();
        checkMerchantOrAdmin(user);

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        checkCampaignOwnership(campaign, user);

        CampaignAffiliate participation = campaignAffiliateRepository
                .findByCampaignIdAndAffiliateId(campaignId, affiliateId)
                .orElseThrow(() -> new ResourceNotFoundException("Participation request not found"));

        participation.setStatus("ACTIVE");
        return toParticipationResponse(campaignAffiliateRepository.save(participation));
    }

    @Override
    @Transactional
    public CampaignParticipationResponse rejectParticipation(Long campaignId, Long affiliateId) {
        User user = getCurrentUser();
        checkMerchantOrAdmin(user);

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        checkCampaignOwnership(campaign, user);

        CampaignAffiliate participation = campaignAffiliateRepository
                .findByCampaignIdAndAffiliateId(campaignId, affiliateId)
                .orElseThrow(() -> new ResourceNotFoundException("Participation request not found"));

        participation.setStatus("REJECTED");
        return toParticipationResponse(campaignAffiliateRepository.save(participation));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CampaignParticipationResponse> getCampaignAffiliates(Long campaignId) {
        User user = getCurrentUser();
        checkMerchantOrAdmin(user);

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        checkCampaignOwnership(campaign, user);

        return campaignAffiliateRepository.findByCampaignId(campaignId).stream()
                .map(this::toParticipationResponse)
                .toList();
    }

    @Override
    @Transactional
    public CampaignParticipationResponse inviteAffiliate(Long campaignId, Long affiliateId) {
        User user = getCurrentUser();
        checkMerchantOrAdmin(user);

        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found"));
        checkCampaignOwnership(campaign, user);

        User affiliate = userRepository.findById(affiliateId)
                .orElseThrow(() -> new ResourceNotFoundException("Affiliate not found"));
        
        if (!"AFFILIATE".equalsIgnoreCase(affiliate.getRole().getName())) {
            throw new BadRequestException("User is not an affiliate");
        }

        CampaignAffiliate participation = campaignAffiliateRepository
                .findByCampaignIdAndAffiliateId(campaignId, affiliateId)
                .orElse(null);

        if (participation != null) {
            throw new BadRequestException("Participation already exists in state: " + participation.getStatus());
        }

        participation = CampaignAffiliate.builder()
                .campaign(campaign)
                .affiliate(affiliate)
                .status("INVITED")
                .build();

        return toParticipationResponse(campaignAffiliateRepository.save(participation));
    }

    @Override
    @Transactional
    public CampaignParticipationResponse acceptInvitation(Long campaignId) {
        User user = getCurrentUser();
        if (!"AFFILIATE".equalsIgnoreCase(user.getRole().getName())) {
            throw new org.springframework.security.access.AccessDeniedException("Only affiliates can accept invitations");
        }

        CampaignAffiliate participation = campaignAffiliateRepository
                .findByCampaignIdAndAffiliateId(campaignId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        if (!"INVITED".equalsIgnoreCase(participation.getStatus())) {
            throw new BadRequestException("No pending invitation to accept");
        }

        participation.setStatus("ACTIVE");
        return toParticipationResponse(campaignAffiliateRepository.save(participation));
    }

    @Override
    @Transactional
    public CampaignParticipationResponse declineInvitation(Long campaignId) {
        User user = getCurrentUser();
        if (!"AFFILIATE".equalsIgnoreCase(user.getRole().getName())) {
            throw new org.springframework.security.access.AccessDeniedException("Only affiliates can decline invitations");
        }

        CampaignAffiliate participation = campaignAffiliateRepository
                .findByCampaignIdAndAffiliateId(campaignId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        if (!"INVITED".equalsIgnoreCase(participation.getStatus())) {
            throw new BadRequestException("No pending invitation to decline");
        }

        participation.setStatus("REJECTED");
        return toParticipationResponse(campaignAffiliateRepository.save(participation));
    }

    private CampaignParticipationResponse toParticipationResponse(CampaignAffiliate pa) {
        return CampaignParticipationResponse.builder()
                .campaignId(pa.getCampaign().getId())
                .affiliateId(pa.getAffiliate().getId())
                .campaignTitle(pa.getCampaign().getTitle())
                .affiliateName(pa.getAffiliate().getEmail())
                .status(pa.getStatus())
                .createdAt(pa.getCreatedAt())
                .build();
    }
}
