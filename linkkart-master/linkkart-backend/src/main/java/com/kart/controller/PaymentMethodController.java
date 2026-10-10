package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.payout.AddPaymentMethodRequest;
import com.kart.dto.payout.PaymentMethodDto;
import com.kart.service.PaymentMethodService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
@Tag(name = "Payment Methods")
@PreAuthorize("hasRole('AFFILIATE')")
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    @GetMapping
    @Operation(summary = "Get active payment methods for the authenticated affiliate")
    public ResponseEntity<ApiResponse<List<PaymentMethodDto>>> getMyPaymentMethods() {
        return ResponseEntity.ok(ApiResponse.success("Payment methods retrieved", paymentMethodService.getMyPaymentMethods()));
    }

    @PostMapping
    @Operation(summary = "Add a new payment method")
    public ResponseEntity<ApiResponse<PaymentMethodDto>> addPaymentMethod(@RequestBody AddPaymentMethodRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Payment method added", paymentMethodService.addPaymentMethod(request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate a payment method")
    public ResponseEntity<ApiResponse<Void>> deletePaymentMethod(@PathVariable Long id) {
        paymentMethodService.deletePaymentMethod(id);
        return ResponseEntity.ok(ApiResponse.success("Payment method removed", null));
    }
}
