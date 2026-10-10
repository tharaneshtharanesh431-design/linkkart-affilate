package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.commission.AffiliateCommissionResponse;
import com.kart.dto.commission.CommissionSummaryResponse;
import com.kart.service.CommissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/commissions")
@RequiredArgsConstructor
@Tag(name = "Affiliate Commissions")
public class CommissionController {

    private final CommissionService commissionService;

    @GetMapping("/my")
    @Operation(summary = "Get commissions for the authenticated affiliate")
    public ResponseEntity<ApiResponse<List<AffiliateCommissionResponse>>> getMyCommissions() {
        return ResponseEntity.ok(ApiResponse.success("Commissions retrieved successfully", commissionService.getMyCommissions()));
    }

    @GetMapping("/my/summary")
    @Operation(summary = "Get commission earnings summary for the authenticated affiliate")
    public ResponseEntity<ApiResponse<CommissionSummaryResponse>> getMyCommissionSummary() {
        return ResponseEntity.ok(ApiResponse.success("Commission summary retrieved successfully", commissionService.getMyCommissionSummary()));
    }
}
