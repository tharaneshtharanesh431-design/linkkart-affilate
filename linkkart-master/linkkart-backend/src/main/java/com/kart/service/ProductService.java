package com.kart.service;

import com.kart.dto.product.ProductRequest;
import com.kart.dto.product.ProductResponse;

import java.util.List;

public interface ProductService {
    ProductResponse create(ProductRequest request);
    ProductResponse update(Long id, ProductRequest request);
    ProductResponse toggleStatus(Long id, String status);
    void delete(Long id);
    List<ProductResponse> getAll(String search, String category, Double minCommission, String sort);
    List<ProductResponse> getMerchantProducts();
    ProductResponse getById(Long id);
}
