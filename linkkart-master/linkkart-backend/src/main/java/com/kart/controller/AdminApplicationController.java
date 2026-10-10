package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.admin.AdminApplicationResponse;
import com.kart.service.AdminApplicationService;
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
@RequestMapping("/api/admin/applications")
@RequiredArgsConstructor
@Tag(name = "Admin Applications")
@PreAuthorize("hasRole('ADMIN')")
public class AdminApplicationController {

    private final AdminApplicationService adminApplicationService;

    @GetMapping
    @Operation(summary = "Get paginated list of affiliate applications")
    public ResponseEntity<ApiResponse<Page<AdminApplicationResponse>>> getAllApplications(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortStr,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDir, sortStr));
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", adminApplicationService.getAllApplications(search, status, pageRequest)));
    }

    @PostMapping("/{campaignId}/{affiliateId}/approve")
    @Operation(summary = "Approve affiliate application")
    public ResponseEntity<ApiResponse<AdminApplicationResponse>> approveApplication(
            @PathVariable Long campaignId,
            @PathVariable Long affiliateId
    ) {
        return ResponseEntity.ok(ApiResponse.success("Application approved", adminApplicationService.approveApplication(campaignId, affiliateId)));
    }

    @PostMapping("/{campaignId}/{affiliateId}/reject")
    @Operation(summary = "Reject affiliate application")
    public ResponseEntity<ApiResponse<AdminApplicationResponse>> rejectApplication(
            @PathVariable Long campaignId,
            @PathVariable Long affiliateId
    ) {
        return ResponseEntity.ok(ApiResponse.success("Application rejected", adminApplicationService.rejectApplication(campaignId, affiliateId)));
    }
}
