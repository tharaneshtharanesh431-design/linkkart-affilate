package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.campaign.CampaignRequest;
import com.kart.dto.campaign.CampaignResponse;
import com.kart.service.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
@Tag(name = "Campaigns")
public class CampaignController {
    private final CampaignService campaignService;

    @GetMapping
    @Operation(summary = "List campaigns")
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Campaigns fetched successfully", campaignService.getAll()));
    }

    @GetMapping("/merchant")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MERCHANT')")
    @Operation(summary = "List campaigns for authenticated merchant")
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> getMerchantCampaigns() {
        return ResponseEntity.ok(ApiResponse.success("Merchant campaigns fetched successfully", campaignService.getMerchantCampaigns()));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
    @Operation(summary = "Create a campaign")
    public ResponseEntity<ApiResponse<CampaignResponse>> create(@Valid @RequestBody CampaignRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Campaign created successfully", campaignService.create(request)));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
    @Operation(summary = "Update a campaign")
    public ResponseEntity<ApiResponse<CampaignResponse>> update(@PathVariable Long id, @Valid @RequestBody CampaignRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Campaign updated successfully", campaignService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
    @Operation(summary = "Delete a campaign")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        campaignService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Campaign deleted successfully", null));
    }

    @PostMapping("/{id}/apply")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('AFFILIATE')")
    @Operation(summary = "Request participation in a campaign")
    public ResponseEntity<ApiResponse<com.kart.dto.campaign.CampaignParticipationResponse>> requestParticipation(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Participation requested successfully", campaignService.requestParticipation(id)));
    }

    @PostMapping("/{id}/approve/{affiliateId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
    @Operation(summary = "Approve participation request")
    public ResponseEntity<ApiResponse<com.kart.dto.campaign.CampaignParticipationResponse>> approveParticipation(@PathVariable Long id, @PathVariable Long affiliateId) {
        return ResponseEntity.ok(ApiResponse.success("Participation approved", campaignService.approveParticipation(id, affiliateId)));
    }

    @PostMapping("/{id}/reject/{affiliateId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
    @Operation(summary = "Reject participation request")
    public ResponseEntity<ApiResponse<com.kart.dto.campaign.CampaignParticipationResponse>> rejectParticipation(@PathVariable Long id, @PathVariable Long affiliateId) {
        return ResponseEntity.ok(ApiResponse.success("Participation rejected", campaignService.rejectParticipation(id, affiliateId)));
    }

    @GetMapping("/{id}/affiliates")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
    @Operation(summary = "Get campaign affiliates")
    public ResponseEntity<ApiResponse<List<com.kart.dto.campaign.CampaignParticipationResponse>>> getCampaignAffiliates(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Campaign affiliates fetched successfully", campaignService.getCampaignAffiliates(id)));
    }

    @PostMapping("/{id}/invite/{affiliateId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
    @Operation(summary = "Invite an affiliate to a campaign")
    public ResponseEntity<ApiResponse<com.kart.dto.campaign.CampaignParticipationResponse>> inviteAffiliate(@PathVariable Long id, @PathVariable Long affiliateId) {
        return ResponseEntity.ok(ApiResponse.success("Affiliate invited successfully", campaignService.inviteAffiliate(id, affiliateId)));
    }

    @PostMapping("/{id}/accept-invite")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('AFFILIATE')")
    @Operation(summary = "Accept an invitation to a campaign")
    public ResponseEntity<ApiResponse<com.kart.dto.campaign.CampaignParticipationResponse>> acceptInvitation(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Invitation accepted", campaignService.acceptInvitation(id)));
    }

    @PostMapping("/{id}/decline-invite")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('AFFILIATE')")
    @Operation(summary = "Decline an invitation to a campaign")
    public ResponseEntity<ApiResponse<com.kart.dto.campaign.CampaignParticipationResponse>> declineInvitation(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Invitation declined", campaignService.declineInvitation(id)));
    }
}
