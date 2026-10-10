package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.profile.ProfileResponse;
import com.kart.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discovery/affiliates")
@RequiredArgsConstructor
@Tag(name = "Affiliate Discovery")
public class AffiliateDiscoveryController {

    private final ProfileService profileService;

    @GetMapping
    @PreAuthorize("hasRole('MERCHANT') or hasRole('ADMIN')")
    @Operation(summary = "Discover affiliates based on criteria")
    public ResponseEntity<ApiResponse<List<ProfileResponse>>> discoverAffiliates(
            @RequestParam(required = false) String niche,
            @RequestParam(required = false) String location) {
        
        List<ProfileResponse> affiliates = profileService.discoverAffiliates(niche, location);
        return ResponseEntity.ok(ApiResponse.success("Affiliates fetched successfully", affiliates));
    }
}
