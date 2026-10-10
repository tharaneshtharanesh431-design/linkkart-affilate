package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.admin.AdminCommissionResponse;
import com.kart.dto.admin.AdminConversionResponse;
import com.kart.dto.admin.AdminPayoutResponse;
import com.kart.service.AdminLedgerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/ledger")
@RequiredArgsConstructor
@Tag(name = "Admin Ledger")
@PreAuthorize("hasRole('ADMIN')")
public class AdminLedgerController {

    private final AdminLedgerService adminLedgerService;

    @GetMapping("/conversions")
    @Operation(summary = "Get paginated list of conversions")
    public ResponseEntity<ApiResponse<Page<AdminConversionResponse>>> getAllConversions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortStr,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDir, sortStr));
        return ResponseEntity.ok(ApiResponse.success("Conversions retrieved", adminLedgerService.getAllConversions(search, status, pageRequest)));
    }

    @GetMapping("/commissions")
    @Operation(summary = "Get paginated list of commissions")
    public ResponseEntity<ApiResponse<Page<AdminCommissionResponse>>> getAllCommissions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortStr,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDir, sortStr));
        return ResponseEntity.ok(ApiResponse.success("Commissions retrieved", adminLedgerService.getAllCommissions(search, status, pageRequest)));
    }

    @GetMapping("/payouts")
    @Operation(summary = "Get paginated list of payouts")
    public ResponseEntity<ApiResponse<Page<AdminPayoutResponse>>> getAllPayouts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "requestedAt") String sortStr,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDir, sortStr));
        return ResponseEntity.ok(ApiResponse.success("Payouts retrieved", adminLedgerService.getAllPayouts(search, status, pageRequest)));
    }

    @PatchMapping("/payouts/{id}/status")
    @Operation(summary = "Update payout status")
    public ResponseEntity<ApiResponse<AdminPayoutResponse>> updatePayoutStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String status = body.get("status");
        String notes = body.get("notes");
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be empty");
        }
        return ResponseEntity.ok(ApiResponse.success("Payout updated", adminLedgerService.updatePayoutStatus(id, status, notes)));
    }
}
