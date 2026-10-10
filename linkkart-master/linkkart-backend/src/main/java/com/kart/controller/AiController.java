package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.ai.*;
import com.kart.entity.User;
import com.kart.service.AiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Features")
public class AiController {
    private final AiService aiService;

    @PostMapping("/assistant")
    @Operation(summary = "Send a chat message to the scoped AI assistant")
    public ResponseEntity<ApiResponse<ChatResponse>> chat(@Valid @RequestBody ChatRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Chat completed", aiService.chat(request, user)));
    }

    @PostMapping("/affiliate/recommendations")
    @PreAuthorize("hasAuthority('AFFILIATE')")
    @Operation(summary = "Get affiliate product recommendations based on real DB products")
    public ResponseEntity<ApiResponse<ChatResponse>> getAffiliateRecommendations(@RequestBody AffiliateRecommendationRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Recommendations generated", aiService.getAffiliateRecommendations(request.getNiche(), request.getCategory(), user)));
    }

    @PostMapping("/affiliate/content")
    @PreAuthorize("hasAuthority('AFFILIATE')")
    @Operation(summary = "Generate promotional content for an affiliate")
    public ResponseEntity<ApiResponse<ChatResponse>> generateAffiliateContent(@RequestBody AffiliateContentRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Content generated", aiService.generateAffiliateContent(request.getProductId(), request.getPlatform(), request.getTone(), user)));
    }

    @PostMapping("/merchant/product-content")
    @PreAuthorize("hasAuthority('MERCHANT')")
    @Operation(summary = "Generate product content for a merchant")
    public ResponseEntity<ApiResponse<ChatResponse>> generateMerchantProductContent(@RequestBody MerchantProductContentRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Product content generated", aiService.generateMerchantProductContent(request.getProductName(), request.getFeatures(), request.getTone(), user)));
    }

    @PostMapping("/merchant/campaign-insights")
    @PreAuthorize("hasAuthority('MERCHANT')")
    @Operation(summary = "Get campaign insights based on analytics")
    public ResponseEntity<ApiResponse<ChatResponse>> getCampaignInsights(@RequestBody CampaignInsightsRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Insights generated", aiService.getCampaignInsights(request.getCampaignId(), request.getDateRange(), user)));
    }

    @PostMapping("/affiliate/performance-summary")
    @PreAuthorize("hasAuthority('AFFILIATE')")
    @Operation(summary = "Get performance summary based on analytics")
    public ResponseEntity<ApiResponse<ChatResponse>> getAffiliatePerformanceSummary(@RequestBody PerformanceSummaryRequest request, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success("Summary generated", aiService.getAffiliatePerformanceSummary(request.getDateRange(), user)));
    }
}
