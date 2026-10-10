package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.admin.AdminAffiliateResponse;
import com.kart.service.AdminAffiliateService;
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
@RequestMapping("/api/admin/affiliates")
@RequiredArgsConstructor
@Tag(name = "Admin Affiliates")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAffiliateController {

    private final AdminAffiliateService adminAffiliateService;

    @GetMapping
    @Operation(summary = "Get paginated list of affiliates")
    public ResponseEntity<ApiResponse<Page<AdminAffiliateResponse>>> getAllAffiliates(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortStr,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDir, sortStr));
        return ResponseEntity.ok(ApiResponse.success("Affiliates retrieved", adminAffiliateService.getAllAffiliates(search, status, pageRequest)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get affiliate details by id")
    public ResponseEntity<ApiResponse<AdminAffiliateResponse>> getAffiliateDetails(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Affiliate retrieved", adminAffiliateService.getAffiliateDetails(id)));
    }
}
