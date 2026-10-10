package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.fraud.FraudReviewRequest;
import com.kart.dto.fraud.FraudSignalResponse;
import com.kart.entity.User;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.UserRepository;
import com.kart.service.FraudDetectionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/fraud")
@RequiredArgsConstructor
@Tag(name = "Fraud Detection (Admin)")
@PreAuthorize("hasRole('ADMIN')")
public class FraudController {

    private final FraudDetectionService fraudDetectionService;
    private final UserRepository userRepository;

    private User getAuthenticatedAdmin() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));
    }

    @GetMapping("/signals")
    @Operation(summary = "Get all open fraud signals")
    public ResponseEntity<ApiResponse<List<FraudSignalResponse>>> getOpenSignals() {
        return ResponseEntity.ok(ApiResponse.success("Fraud signals retrieved", fraudDetectionService.getOpenSignals()));
    }

    @GetMapping("/signals/affiliate/{affiliateId}")
    @Operation(summary = "Get all fraud signals for an affiliate")
    public ResponseEntity<ApiResponse<List<FraudSignalResponse>>> getSignalsByAffiliate(@PathVariable Long affiliateId) {
        return ResponseEntity.ok(ApiResponse.success("Fraud signals retrieved", fraudDetectionService.getSignalsByAffiliate(affiliateId)));
    }

    @PostMapping("/signals/{id}/review")
    @Operation(summary = "Review a fraud signal")
    public ResponseEntity<ApiResponse<FraudSignalResponse>> reviewSignal(
            @PathVariable Long id,
            @RequestBody FraudReviewRequest request) {
        User admin = getAuthenticatedAdmin();
        FraudSignalResponse response = fraudDetectionService.reviewSignal(id, request, admin);
        return ResponseEntity.ok(ApiResponse.success("Signal reviewed successfully", response));
    }
}
