package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.conversion.ConversionRequest;
import com.kart.dto.conversion.ConversionResponse;
import com.kart.dto.commission.CommissionResponse;
import com.kart.service.ConversionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Postback Conversions & Commissions")
public class ConversionController {

    private final ConversionService conversionService;

    @PostMapping("/postback/conversion")
    @Operation(summary = "Record a new conversion via server-to-server postback")
    public ResponseEntity<ApiResponse<ConversionResponse>> recordConversion(@Valid @RequestBody ConversionRequest request) {
        ConversionResponse response = conversionService.recordConversion(request);
        return ResponseEntity.ok(ApiResponse.success("Conversion recorded and commission calculated successfully", response));
    }

    @PutMapping("/conversions/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    @Operation(summary = "Update status of a conversion and its linked commission (Development/Testing only)")
    public ResponseEntity<ApiResponse<ConversionResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {
        ConversionResponse response = conversionService.updateConversionStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", response));
    }

    @GetMapping("/conversions")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all recorded conversions")
    public ResponseEntity<ApiResponse<List<ConversionResponse>>> getAllConversions() {
        return ResponseEntity.ok(ApiResponse.success("Conversions retrieved successfully", conversionService.getAllConversions()));
    }

    @GetMapping("/conversions/merchant")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MERCHANT')")
    @Operation(summary = "List conversions for authenticated merchant")
    public ResponseEntity<ApiResponse<List<ConversionResponse>>> getMerchantConversions() {
        return ResponseEntity.ok(ApiResponse.success("Merchant conversions retrieved successfully", conversionService.getMerchantConversions()));
    }

    @GetMapping("/commissions")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List all recorded commissions")
    public ResponseEntity<ApiResponse<List<CommissionResponse>>> getAllCommissions() {
        return ResponseEntity.ok(ApiResponse.success("Commissions retrieved successfully", conversionService.getAllCommissions()));
    }

    @GetMapping("/commissions/merchant")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('MERCHANT')")
    @Operation(summary = "List commissions for authenticated merchant")
    public ResponseEntity<ApiResponse<List<CommissionResponse>>> getMerchantCommissions() {
        return ResponseEntity.ok(ApiResponse.success("Merchant commissions retrieved successfully", conversionService.getMerchantCommissions()));
    }
}
