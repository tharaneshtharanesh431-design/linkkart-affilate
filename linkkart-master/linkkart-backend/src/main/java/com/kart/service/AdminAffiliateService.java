package com.kart.service;

import com.kart.dto.admin.AdminAffiliateResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminAffiliateService {
    Page<AdminAffiliateResponse> getAllAffiliates(String search, String status, Pageable pageable);
    AdminAffiliateResponse getAffiliateDetails(Long id);
}
