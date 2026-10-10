package com.kart.service;

import com.kart.dto.admin.AdminMerchantResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminMerchantService {
    Page<AdminMerchantResponse> getAllMerchants(String search, String status, Pageable pageable);
    AdminMerchantResponse getMerchantDetails(Long id);
}
