package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.payout.AdminPayoutResponse;
import com.kart.dto.payout.ReasonRequest;
import com.kart.service.PayoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/payouts")
@RequiredArgsConstructor
@Tag(name = "Admin Payouts")
@PreAuthorize("hasRole('ADMIN')")
public class AdminPayoutController {

    private final PayoutService payoutService;

    @GetMapping
    @Operation(summary = "Get all payout requests across the platform")
    public ResponseEntity<ApiResponse<List<AdminPayoutResponse>>> getAllPayouts() {
        return ResponseEntity.ok(ApiResponse.success("Payouts retrieved successfully", payoutService.getAllPayouts()));
    }

    @PostMapping("/{id}/process")
    @Operation(summary = "Process a requested payout")
    public ResponseEntity<ApiResponse<AdminPayoutResponse>> processPayout(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Payout marked as PROCESSING", payoutService.processPayout(id)));
    }

    @PostMapping("/{id}/paid")
    @Operation(summary = "Mark a processing payout as PAID")
    public ResponseEntity<ApiResponse<AdminPayoutResponse>> markPaid(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Payout marked as PAID", payoutService.markPaid(id)));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject a requested payout")
    public ResponseEntity<ApiResponse<AdminPayoutResponse>> rejectPayout(@PathVariable Long id, @RequestBody ReasonRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payout REJECTED", payoutService.rejectPayout(id, request.getReason())));
    }

    @PostMapping("/{id}/fail")
    @Operation(summary = "Mark a processing payout as FAILED")
    public ResponseEntity<ApiResponse<AdminPayoutResponse>> failPayout(@PathVariable Long id, @RequestBody ReasonRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payout marked as FAILED", payoutService.failPayout(id, request.getReason())));
    }
}
