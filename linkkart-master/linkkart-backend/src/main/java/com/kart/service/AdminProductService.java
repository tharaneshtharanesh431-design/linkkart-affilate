package com.kart.service;

import com.kart.dto.admin.AdminProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminProductService {
    Page<AdminProductResponse> getAllProducts(String search, String category, String status, Pageable pageable);
    AdminProductResponse getProductDetails(Long id);
    AdminProductResponse activateProduct(Long id);
    AdminProductResponse deactivateProduct(Long id);
}
