package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.admin.AdminMerchantResponse;
import com.kart.service.AdminMerchantService;
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
@RequestMapping("/api/admin/merchants")
@RequiredArgsConstructor
@Tag(name = "Admin Merchants")
@PreAuthorize("hasRole('ADMIN')")
public class AdminMerchantController {

    private final AdminMerchantService adminMerchantService;

    @GetMapping
    @Operation(summary = "Get paginated list of merchants")
    public ResponseEntity<ApiResponse<Page<AdminMerchantResponse>>> getAllMerchants(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortStr,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDir, sortStr));
        return ResponseEntity.ok(ApiResponse.success("Merchants retrieved", adminMerchantService.getAllMerchants(search, status, pageRequest)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get merchant details by id")
    public ResponseEntity<ApiResponse<AdminMerchantResponse>> getMerchantDetails(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Merchant retrieved", adminMerchantService.getMerchantDetails(id)));
    }
}
