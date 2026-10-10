package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.admin.AdminCampaignResponse;
import com.kart.service.AdminCampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/campaigns")
@RequiredArgsConstructor
@Tag(name = "Admin Campaigns")
@PreAuthorize("hasRole('ADMIN')")
public class AdminCampaignController {

    private final AdminCampaignService adminCampaignService;

    @GetMapping
    @Operation(summary = "Get paginated list of campaigns")
    public ResponseEntity<ApiResponse<Page<AdminCampaignResponse>>> getAllCampaigns(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortStr,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDir, sortStr));
        return ResponseEntity.ok(ApiResponse.success("Campaigns retrieved", adminCampaignService.getAllCampaigns(search, status, pageRequest)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get campaign details by id")
    public ResponseEntity<ApiResponse<AdminCampaignResponse>> getCampaignDetails(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Campaign retrieved", adminCampaignService.getCampaignDetails(id)));
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate campaign")
    public ResponseEntity<ApiResponse<AdminCampaignResponse>> activateCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Campaign activated", adminCampaignService.activateCampaign(id)));
    }

    @PostMapping("/{id}/pause")
    @Operation(summary = "Pause campaign")
    public ResponseEntity<ApiResponse<AdminCampaignResponse>> pauseCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Campaign paused", adminCampaignService.pauseCampaign(id)));
    }

    @PostMapping("/{id}/close")
    @Operation(summary = "Close campaign")
    public ResponseEntity<ApiResponse<AdminCampaignResponse>> closeCampaign(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Campaign closed", adminCampaignService.closeCampaign(id)));
    }
}
