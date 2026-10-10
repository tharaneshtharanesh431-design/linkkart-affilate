package com.kart.serviceImpl;

import com.kart.dto.conversion.ConversionRequest;
import com.kart.dto.conversion.ConversionResponse;
import com.kart.dto.commission.CommissionResponse;
import com.kart.entity.AffiliateLink;
import com.kart.entity.Commission;
import com.kart.entity.Conversion;
import com.kart.entity.Campaign;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.AffiliateLinkRepository;
import com.kart.repository.CommissionRepository;
import com.kart.repository.ConversionRepository;
import com.kart.repository.UserRepository;
import com.kart.repository.OrganizationMemberRepository;
import com.kart.entity.User;
import com.kart.entity.Organization;
import com.kart.entity.OrganizationMember;
import com.kart.repository.CampaignAffiliateRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import com.kart.service.ConversionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversionServiceImpl implements ConversionService {

    private final ConversionRepository conversionRepository;
    private final CommissionRepository commissionRepository;
    private final com.kart.repository.ClickRepository clickRepository;
    private final UserRepository userRepository;
    private final OrganizationMemberRepository organizationMemberRepository;
    private final CampaignAffiliateRepository campaignAffiliateRepository;

    private final com.kart.service.FraudDetectionService fraudDetectionService;
    private final com.kart.service.LedgerService ledgerService;

    @Override
    @Transactional
    public ConversionResponse recordConversion(ConversionRequest request) {
        // 1. Find Click using trackingId
        com.kart.entity.Click click = clickRepository.findByTrackingId(request.getTrackingId())
                .orElseThrow(() -> new com.kart.exception.BadRequestException("Invalid tracking ID"));

        // 30-day attribution window
        if (click.getClickedAt().isBefore(LocalDateTime.now().minusDays(30))) {
            throw new com.kart.exception.BadRequestException("Attribution window has expired");
        }

        AffiliateLink link = click.getAffiliateLink();
        Campaign campaign = link.getCampaign();
        if (campaign == null) {
            throw new com.kart.exception.BadRequestException("Campaign not found for this link");
        }
        
        if (!"ACTIVE".equalsIgnoreCase(campaign.getStatus())) {
            throw new com.kart.exception.BadRequestException("Campaign is no longer active");
        }

        // Validate affiliate participation
        var campaignAffiliate = campaignAffiliateRepository.findByCampaignIdAndAffiliateId(campaign.getId(), link.getAffiliate().getId());
        
        if (campaignAffiliate.isEmpty() || (!"ACTIVE".equalsIgnoreCase(campaignAffiliate.get().getStatus()) && !"APPROVED".equalsIgnoreCase(campaignAffiliate.get().getStatus()))) {
            throw new com.kart.exception.BadRequestException("Affiliate is no longer an active participant in this campaign");
        }

        // 2. Validate Merchant Secret
        com.kart.entity.Organization organization = campaign.getOrganization();
        if (organization == null) {
            throw new com.kart.exception.BadRequestException("Organization not found for this campaign");
        }
        
        if (organization.getIntegrationSecret() == null) {
            throw new com.kart.exception.BadRequestException("Organization integration secret not configured");
        }

        boolean secretMatches = java.security.MessageDigest.isEqual(
                organization.getIntegrationSecret().getBytes(java.nio.charset.StandardCharsets.UTF_8),
                request.getMerchantSecret().getBytes(java.nio.charset.StandardCharsets.UTF_8)
        );

        if (!secretMatches) {
            throw new com.kart.exception.BadRequestException("Invalid merchant secret");
        }

        // 3. Check duplicate conversion
        boolean duplicate = conversionRepository.existsByOrderReferenceAndAffiliateLink_Campaign_Organization_Id(
                request.getOrderReference(), organization.getId());
        if (duplicate) {
            // Safe idempotent response
            return ConversionResponse.builder()
                    .trackingCode(link.getCode())
                    .productName(campaign.getTitle())
                    .amount(request.getOrderAmount())
                    .status("VALID")
                    .createdAt(LocalDateTime.now())
                    .build();
        }

        BigDecimal conversionAmount = request.getOrderAmount();

        // 4. Create Conversion
        Conversion conversion = Conversion.builder()
                .trackingId(request.getTrackingId())
                .affiliateLink(link)
                .orderAmount(conversionAmount)
                .orderReference(request.getOrderReference())
                .status("VALID")
                .convertedAt(LocalDateTime.now())
                .build();
        conversion = conversionRepository.save(conversion);
        
        // Evaluate for fraud
        fraudDetectionService.evaluateConversion(conversion, request.getMerchantSecret());

        // 5. Calculate commission amount
        BigDecimal commissionAmount = BigDecimal.ZERO;
        if ("FIXED".equalsIgnoreCase(campaign.getCommissionType())) {
            commissionAmount = campaign.getCommissionRate();
        } else {
            commissionAmount = conversionAmount.multiply(campaign.getCommissionRate()).divide(BigDecimal.valueOf(100.00), 2, java.math.RoundingMode.HALF_UP);
        }

        LocalDateTime clearsAt = conversion.getConvertedAt().plusDays(campaign.getClearingPeriodDays());

        // 6. Create Commission
        Commission commission = Commission.builder()
                .conversion(conversion)
                .affiliate(link.getAffiliate())
                .amount(commissionAmount)
                .status("PENDING")
                .clearsAt(clearsAt)
                .createdAt(LocalDateTime.now())
                .build();
        commissionRepository.save(commission);

        return toConversionResponse(conversion);
    }

    @Override
    @Transactional
    public ConversionResponse updateConversionStatus(Long conversionId, String status) {
        User user = getCurrentUser();
        checkMerchantOrAdmin(user);

        Conversion conversion = conversionRepository.findById(conversionId)
                .orElseThrow(() -> new ResourceNotFoundException("Conversion not found for id: " + conversionId));
                
        checkConversionOwnership(conversion, user);

        String upperStatus = status.toUpperCase();
        if (!List.of("VALID", "FRAUD", "REFUNDED").contains(upperStatus)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        // Update Conversion status
        conversion.setStatus(upperStatus);
        conversion = conversionRepository.save(conversion);

        // Update linked Commission status if exists
        List<Commission> commissions = commissionRepository.findByConversionId(conversionId);
        for (Commission comm : commissions) {
            String commStatus = comm.getStatus();
            
            if ("REFUNDED".equals(upperStatus)) {
                if ("PENDING".equals(commStatus) || "APPROVED".equals(commStatus)) {
                    comm.setStatus("REVERSED");
                    commissionRepository.save(comm);
                    if ("APPROVED".equals(commStatus)) {
                        ledgerService.recordCommissionReversal(comm);
                    }
                }
            } else if ("FRAUD".equals(upperStatus)) {
                if ("PENDING".equals(commStatus) || "APPROVED".equals(commStatus)) {
                    comm.setStatus("REJECTED");
                    commissionRepository.save(comm);
                }
            }
        }

        return toConversionResponse(conversion);
    }

    @Override
    public List<ConversionResponse> getAllConversions() {
        return conversionRepository.findAll().stream()
                .map(this::toConversionResponse)
                .toList();
    }

    @Override
    public List<ConversionResponse> getMerchantConversions() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return conversionRepository.findByMerchantEmail(email).stream()
                .map(this::toConversionResponse)
                .toList();
    }

    @Override
    public List<CommissionResponse> getAllCommissions() {
        return commissionRepository.findAll().stream()
                .map(this::toCommissionResponse)
                .toList();
    }

    @Override
    public List<CommissionResponse> getMerchantCommissions() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return commissionRepository.findByMerchantEmail(email).stream()
                .map(this::toCommissionResponse)
                .toList();
    }

    private ConversionResponse toConversionResponse(Conversion c) {
        return ConversionResponse.builder()
                .id(c.getId())
                .trackingCode(c.getAffiliateLink() != null ? c.getAffiliateLink().getCode() : null)
                .productName(c.getAffiliateLink() != null && c.getAffiliateLink().getCampaign() != null ?
                        c.getAffiliateLink().getCampaign().getTitle() : "Unknown Campaign")
                .amount(c.getOrderAmount())
                .status(c.getStatus())
                .createdAt(c.getConvertedAt())
                .build();
    }

    private User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AccessDeniedException("Authentication required");
        }
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new com.kart.exception.BadRequestException("Authenticated user account not found"));
    }

    private void checkMerchantOrAdmin(User user) {
        boolean isAllowed = "MERCHANT".equalsIgnoreCase(user.getRole().getName()) || "ADMIN".equalsIgnoreCase(user.getRole().getName());
        if (!isAllowed) {
            throw new AccessDeniedException("Forbidden: Only merchants or admins are authorized to perform this operation");
        }
    }

    private void checkConversionOwnership(Conversion conversion, User user) {
        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole().getName());
        if (isAdmin) return;

        Organization userOrganization = organizationMemberRepository.findByUser(user).stream()
                .findFirst()
                .map(OrganizationMember::getOrganization)
                .orElseThrow(() -> new com.kart.exception.BadRequestException("Merchant organization not found. Please complete onboarding."));

        AffiliateLink link = conversion.getAffiliateLink();
        if (link == null || link.getCampaign() == null || link.getCampaign().getOrganization() == null) {
            throw new AccessDeniedException("Forbidden: Conversion has no associated organization");
        }

        if (!link.getCampaign().getOrganization().getId().equals(userOrganization.getId())) {
            throw new AccessDeniedException("Forbidden: You are not authorized to modify another organization's conversion");
        }
    }

    private CommissionResponse toCommissionResponse(Commission c) {
        return CommissionResponse.builder()
                .id(c.getId())
                .conversionId(c.getConversion() != null ? c.getConversion().getId() : null)
                .affiliateEmail(c.getAffiliate() != null ? c.getAffiliate().getEmail() : "Unknown Affiliate")
                .amount(c.getAmount())
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
