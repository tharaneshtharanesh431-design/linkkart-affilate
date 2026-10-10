package com.kart.serviceImpl;

import com.kart.dto.admin.AdminAuditLogResponse;
import com.kart.entity.AuditLog;
import com.kart.repository.AuditLogRepository;
import com.kart.service.AdminAuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminAuditLogServiceImpl implements AdminAuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public Page<AdminAuditLogResponse> getAllAuditLogs(String search, String action, Pageable pageable) {
        Specification<AuditLog> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (action != null && !action.isEmpty() && !action.equals("ALL")) {
                predicates.add(cb.equal(root.get("action"), action));
            }
            if (search != null && !search.isEmpty()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                Predicate emailMatch = cb.like(cb.lower(root.get("admin").get("email")), searchLower);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), searchLower);
                Predicate typeMatch = cb.like(cb.lower(root.get("entityType")), searchLower);
                predicates.add(cb.or(emailMatch, descMatch, typeMatch));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return auditLogRepository.findAll(spec, pageable).map(this::mapToAdminAuditLogResponse);
    }

    private AdminAuditLogResponse mapToAdminAuditLogResponse(AuditLog log) {
        return AdminAuditLogResponse.builder()
                .id(log.getId())
                .adminEmail(log.getAdmin() != null ? log.getAdmin().getEmail() : "SYSTEM")
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .description(log.getDescription())
                .timestamp(log.getCreatedAt())
                .build();
    }
}
