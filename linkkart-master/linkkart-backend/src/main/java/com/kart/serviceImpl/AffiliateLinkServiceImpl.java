package com.kart.serviceImpl;

import com.kart.constants.RoleName;
import com.kart.dto.link.AffiliateLinkRequest;
import com.kart.dto.link.AffiliateLinkResponse;
import com.kart.entity.AffiliateLink;
import com.kart.entity.Product;
import com.kart.entity.User;
import com.kart.entity.Commission;
import com.kart.exception.BadRequestException;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.AffiliateLinkRepository;
import com.kart.repository.ClickRepository;
import com.kart.repository.ProductRepository;
import com.kart.repository.UserRepository;
import com.kart.repository.ConversionRepository;
import com.kart.repository.CommissionRepository;
import com.kart.service.AffiliateLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AffiliateLinkServiceImpl implements AffiliateLinkService {

    private final AffiliateLinkRepository affiliateLinkRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ClickRepository clickRepository;
    private final ConversionRepository conversionRepository;
    private final CommissionRepository commissionRepository;
    private final com.kart.repository.CampaignRepository campaignRepository;
    private final com.kart.repository.CampaignAffiliateRepository campaignAffiliateRepository;

    @Override
    public AffiliateLinkResponse generateLink(AffiliateLinkRequest request) {
        User affiliate = getCurrentUser();
        checkAffiliateOrAdmin(affiliate);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!"ACTIVE".equalsIgnoreCase(product.getStatus())) {
            throw new BadRequestException("This product is currently inactive and cannot be promoted");
        }

        // Prevent duplicate links
        var existing = affiliateLinkRepository.findByAffiliateAndProductId(affiliate, product.getId());
        if (existing.isPresent()) {
            return toResponse(existing.get());
        }

        // Find eligible campaigns
        List<com.kart.entity.Campaign> activeCampaigns = campaignRepository.findActiveCampaignsByProductId(product.getId());
        if (activeCampaigns.isEmpty()) {
            throw new BadRequestException("No active campaigns available for this product");
        }

        // Check which ones the affiliate is approved for
        List<com.kart.entity.Campaign> eligibleCampaigns = activeCampaigns.stream().filter(c -> {
            var ca = campaignAffiliateRepository.findByCampaignIdAndAffiliateId(c.getId(), affiliate.getId());
            return ca.isPresent() && "ACTIVE".equalsIgnoreCase(ca.get().getStatus());
        }).toList();

        if (eligibleCampaigns.isEmpty()) {
            throw new BadRequestException("You are not authorized for any active campaigns for this product");
        }
        
        if (eligibleCampaigns.size() > 1) {
            throw new BadRequestException("Multiple eligible campaigns found. Campaign selection is required.");
        }

        com.kart.entity.Campaign selectedCampaign = eligibleCampaigns.get(0);

        // Generate unique tracking code
        String code;
        do {
            code = UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
        } while (affiliateLinkRepository.findByCode(code).isPresent());

        // Tracking URL target should be the destination URL of the product
        String destinationUrl = product.getDestinationUrl();
        if (destinationUrl == null || destinationUrl.isBlank()) {
            // fallback if merchant didn't set a destination URL
            destinationUrl = "http://localhost:3000/marketplace/" + product.getId(); 
        }

        AffiliateLink affiliateLink = AffiliateLink.builder()
                .code(code)
                .product(product)
                .campaign(selectedCampaign)
                .affiliate(affiliate)
                .targetUrl(destinationUrl)
                .createdAt(LocalDateTime.now())
                .build();

        affiliateLink = affiliateLinkRepository.save(affiliateLink);

        return toResponse(affiliateLink);
    }

    @Override
    public List<AffiliateLinkResponse> getMyLinks() {
        User affiliate = getCurrentUser();
        List<AffiliateLink> links = affiliateLinkRepository.findByAffiliate(affiliate);
        return links.stream().map(this::toResponse).toList();
    }

    private void checkAffiliateOrAdmin(User user) {
        boolean isAllowed = "AFFILIATE".equalsIgnoreCase(user.getRole().getName()) || "ADMIN".equalsIgnoreCase(user.getRole().getName());
        if (!isAllowed) {
            throw new org.springframework.security.access.AccessDeniedException("Only affiliates can generate promotion links");
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Authenticated user not found"));
    }

    private AffiliateLinkResponse toResponse(AffiliateLink link) {
        long clicksCount = clickRepository.countByAffiliateLinkId(link.getId());
        long conversionsCount = conversionRepository.countByAffiliateLinkId(link.getId());
        
        List<Commission> commissions = commissionRepository.findByConversionAffiliateLinkId(link.getId());
        BigDecimal totalCommission = commissions.stream()
                .filter(c -> c.getStatus().equalsIgnoreCase("APPROVED") || c.getStatus().equalsIgnoreCase("PAID"))
                .map(Commission::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        String trackingUrl = "http://localhost:8080/t/" + link.getCode();

        return AffiliateLinkResponse.builder()
                .id(link.getId())
                .code(link.getCode())
                .trackingUrl(trackingUrl)
                .productId(link.getProduct() != null ? link.getProduct().getId() : null)
                .productName(link.getProduct() != null ? link.getProduct().getName() : "Unknown Product")
                .merchantName(link.getProduct() != null && link.getProduct().getOrganization() != null ? 
                        link.getProduct().getOrganization().getName() : "Unknown Merchant")
                .clicksCount(clicksCount)
                .conversionsCount(conversionsCount)
                .totalCommission(totalCommission)
                .createdAt(link.getCreatedAt())
                .build();
    }
}
