package com.kart.controller;

import com.kart.entity.AffiliateLink;
import com.kart.entity.Click;
import com.kart.repository.AffiliateLinkRepository;
import com.kart.repository.ClickRepository;
import com.kart.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;
import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
@Tag(name = "Redirect Controller")
public class RedirectController {

    private final AffiliateLinkRepository affiliateLinkRepository;
    private final ClickRepository clickRepository;
    private final com.kart.repository.CampaignAffiliateRepository campaignAffiliateRepository;
    private final com.kart.service.FraudDetectionService fraudDetectionService;

    @org.springframework.beans.factory.annotation.Value("${app.security.ip-salt}")
    private String ipSalt;

    @GetMapping("/t/{code}")
    @Operation(summary = "Redirect tracking link and record click details")
    public void redirectAndTrack(
            @PathVariable String code,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        AffiliateLink affiliateLink = affiliateLinkRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Affiliate link not found for code: " + code));

        // Validate product and campaign status
        if (affiliateLink.getProduct() == null || !"ACTIVE".equalsIgnoreCase(affiliateLink.getProduct().getStatus())) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Product is currently inactive");
            return;
        }

        if (affiliateLink.getCampaign() == null || !"ACTIVE".equalsIgnoreCase(affiliateLink.getCampaign().getStatus())) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Campaign is currently inactive");
            return;
        }

        // Validate campaign participation
        var campaignAffiliate = campaignAffiliateRepository.findByCampaignIdAndAffiliateId(
                affiliateLink.getCampaign().getId(), affiliateLink.getAffiliate().getId());
        
        if (campaignAffiliate.isEmpty() || !"ACTIVE".equalsIgnoreCase(campaignAffiliate.get().getStatus())) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Affiliate is not an active participant in this campaign");
            return;
        }

        // Get Client IP Address
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty() || "unknown".equalsIgnoreCase(ipAddress)) {
            ipAddress = request.getRemoteAddr();
        }

        // Securely hash IP address
        String ipHash = hashIp(ipAddress);

        // Check for duplicate click within cooldown (60 seconds)
        String trackingId;
        java.util.Optional<Click> lastClick = clickRepository.findTopByAffiliateLinkIdAndIpHashOrderByClickedAtDesc(affiliateLink.getId(), ipHash);
        
        if (lastClick.isPresent() && java.time.Duration.between(lastClick.get().getClickedAt(), LocalDateTime.now()).getSeconds() < 60) {
            // Reuse existing tracking ID without recording a new click
            trackingId = lastClick.get().getTrackingId();
        } else {
            // Generate new tracking ID and record click
            trackingId = "trk_" + java.util.UUID.randomUUID().toString();
            String userAgent = request.getHeader("User-Agent");

            Click click = Click.builder()
                    .trackingId(trackingId)
                    .affiliateLink(affiliateLink)
                    .ipHash(ipHash)
                    .userAgent(userAgent)
                    .clickedAt(LocalDateTime.now())
                    .build();
            clickRepository.save(click);
            
            // Evaluate click for fraud/abuse asynchronously or synchronously
            fraudDetectionService.evaluateClick(click);
        }

        // Redirect to target URL, preserving existing query parameters
        String destinationUrl = affiliateLink.getTargetUrl();
        if (destinationUrl == null || destinationUrl.isBlank()) {
            destinationUrl = "http://localhost:3000/marketplace/" + affiliateLink.getProduct().getId();
        }
        
        String separator = destinationUrl.contains("?") ? "&" : "?";
        String finalRedirectUrl = destinationUrl + separator + "lkrt_click=" + trackingId;
        
        response.sendRedirect(finalRedirectUrl);
    }

    private String hashIp(String ipAddress) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
            md.update(ipSalt.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            byte[] hash = md.digest(ipAddress.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return java.util.Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash IP", e);
        }
    }
}
