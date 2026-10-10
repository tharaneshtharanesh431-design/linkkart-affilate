package com.kart.service;

import com.kart.dto.admin.AdminApplicationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminApplicationService {
    Page<AdminApplicationResponse> getAllApplications(String search, String status, Pageable pageable);
    AdminApplicationResponse approveApplication(Long campaignId, Long affiliateId);
    AdminApplicationResponse rejectApplication(Long campaignId, Long affiliateId);
}
