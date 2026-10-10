package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.admin.AdminProductResponse;
import com.kart.service.AdminProductService;
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
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@Tag(name = "Admin Products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final AdminProductService adminProductService;

    @GetMapping
    @Operation(summary = "Get paginated list of products")
    public ResponseEntity<ApiResponse<Page<AdminProductResponse>>> getAllProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortStr,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDir, sortStr));
        return ResponseEntity.ok(ApiResponse.success("Products retrieved", adminProductService.getAllProducts(search, category, status, pageRequest)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product details by id")
    public ResponseEntity<ApiResponse<AdminProductResponse>> getProductDetails(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Product retrieved", adminProductService.getProductDetails(id)));
    }

    @PostMapping("/{id}/activate")
    @Operation(summary = "Activate product")
    public ResponseEntity<ApiResponse<AdminProductResponse>> activateProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Product activated", adminProductService.activateProduct(id)));
    }

    @PostMapping("/{id}/deactivate")
    @Operation(summary = "Deactivate product")
    public ResponseEntity<ApiResponse<AdminProductResponse>> deactivateProduct(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Product deactivated", adminProductService.deactivateProduct(id)));
    }
}
