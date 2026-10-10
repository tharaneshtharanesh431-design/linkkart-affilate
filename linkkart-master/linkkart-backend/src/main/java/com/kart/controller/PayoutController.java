package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.payout.AffiliateBalanceResponse;
import com.kart.dto.payout.PayoutRequest;
import com.kart.dto.payout.PayoutResponse;
import com.kart.service.PayoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payouts")
@RequiredArgsConstructor
@Tag(name = "Affiliate Payouts")
@PreAuthorize("hasRole('AFFILIATE')")
public class PayoutController {

    private final PayoutService payoutService;

    @GetMapping("/my")
    @Operation(summary = "Get payout history for the authenticated affiliate")
    public ResponseEntity<ApiResponse<List<PayoutResponse>>> getMyPayouts() {
        return ResponseEntity.ok(ApiResponse.success("Payout history retrieved successfully", payoutService.getMyPayouts()));
    }

    @GetMapping("/my/balance")
    @Operation(summary = "Get available balance and earnings for the authenticated affiliate")
    public ResponseEntity<ApiResponse<AffiliateBalanceResponse>> getMyBalance() {
        return ResponseEntity.ok(ApiResponse.success("Balance retrieved successfully", payoutService.getMyBalance()));
    }

    @PostMapping("/request")
    @Operation(summary = "Request a withdrawal/payout")
    public ResponseEntity<ApiResponse<PayoutResponse>> requestPayout(@RequestBody PayoutRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payout requested successfully", payoutService.requestPayout(request)));
    }
}
