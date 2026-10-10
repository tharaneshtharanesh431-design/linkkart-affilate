package com.kart.service;

import com.kart.dto.admin.AdminCommissionResponse;
import com.kart.dto.admin.AdminConversionResponse;
import com.kart.dto.admin.AdminPayoutResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminLedgerService {
    Page<AdminConversionResponse> getAllConversions(String search, String status, Pageable pageable);
    
    Page<AdminCommissionResponse> getAllCommissions(String search, String status, Pageable pageable);
    
    Page<AdminPayoutResponse> getAllPayouts(String search, String status, Pageable pageable);
    AdminPayoutResponse updatePayoutStatus(Long id, String status, String notes);
}
