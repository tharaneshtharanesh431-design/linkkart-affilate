package com.kart.serviceImpl;

import com.kart.dto.admin.AdminUserResponse;
import com.kart.entity.User;
import com.kart.entity.AuditLog;
import com.kart.repository.UserRepository;
import com.kart.repository.AuditLogRepository;
import com.kart.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    public Page<AdminUserResponse> getAllUsers(String search, String role, String status, Pageable pageable) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%"));
            }
            if (role != null && !role.isEmpty()) {
                predicates.add(cb.equal(root.get("role").get("name"), role));
            }
            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return userRepository.findAll(spec, pageable).map(this::mapToAdminUserResponse);
    }

    @Override
    public AdminUserResponse getUserDetails(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToAdminUserResponse(user);
    }

    @Override
    public AdminUserResponse updateUserStatus(Long id, String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setStatus(status);
        User updated = userRepository.save(user);
        
        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        if (admin != null) {
            AuditLog log = AuditLog.builder()
                .admin(admin)
                .action("ADMIN_UPDATED_USER_STATUS")
                .entityType("USER")
                .entityId(user.getId())
                .description("Changed status to " + status)
                .build();
            auditLogRepository.save(log);
        }
        
        return mapToAdminUserResponse(updated);
    }

    private AdminUserResponse mapToAdminUserResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .status(user.getStatus())
                .onboardingCompleted(user.isOnboardingCompleted())
                .createdAt(user.getCreatedAt())
                .name(null) // we could load profile here if needed, but for list it's better to avoid N+1 or use JOIN
                .build();
    }
}
