package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.merchant.MerchantAffiliateResponse;
import com.kart.service.MerchantAffiliateService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/merchant/affiliates")
@RequiredArgsConstructor
@Tag(name = "Merchant Affiliates")
@PreAuthorize("hasRole('MERCHANT')")
public class MerchantAffiliateController {

    private final MerchantAffiliateService merchantAffiliateService;

    @GetMapping
    @Operation(summary = "List affiliates associated with merchant campaigns")
    public ResponseEntity<ApiResponse<List<MerchantAffiliateResponse>>> getMerchantAffiliates() {
        return ResponseEntity.ok(ApiResponse.success("Merchant affiliates retrieved successfully", merchantAffiliateService.getMerchantAffiliates()));
    }

    @PatchMapping("/{campaignId}/{affiliateId}/status")
    @Operation(summary = "Update affiliate status for a campaign")
    public ResponseEntity<ApiResponse<MerchantAffiliateResponse>> updateAffiliateStatus(
            @PathVariable Long campaignId,
            @PathVariable Long affiliateId,
            @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Affiliate status updated successfully", merchantAffiliateService.updateAffiliateStatus(campaignId, affiliateId, status)));
    }
}
