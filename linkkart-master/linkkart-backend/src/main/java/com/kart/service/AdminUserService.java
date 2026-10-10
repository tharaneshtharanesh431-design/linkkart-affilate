package com.kart.service;

import com.kart.dto.admin.AdminUserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {
    Page<AdminUserResponse> getAllUsers(String search, String role, String status, Pageable pageable);
    AdminUserResponse getUserDetails(Long id);
    AdminUserResponse updateUserStatus(Long id, String status);
}
