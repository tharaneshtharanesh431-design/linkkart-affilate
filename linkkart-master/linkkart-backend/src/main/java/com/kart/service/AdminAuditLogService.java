package com.kart.service;

import com.kart.dto.admin.AdminAuditLogResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminAuditLogService {
    Page<AdminAuditLogResponse> getAllAuditLogs(String search, String action, Pageable pageable);
}
