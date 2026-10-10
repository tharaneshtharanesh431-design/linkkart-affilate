package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.admin.AdminAuditLogResponse;
import com.kart.service.AdminAuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Admin Audit Logs")
@PreAuthorize("hasRole('ADMIN')")
public class AdminAuditLogController {

    private final AdminAuditLogService adminAuditLogService;

    @GetMapping
    @Operation(summary = "Get paginated list of audit logs")
    public ResponseEntity<ApiResponse<Page<AdminAuditLogResponse>>> getAllAuditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(defaultValue = "createdAt") String sortStr,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortDir, sortStr));
        return ResponseEntity.ok(ApiResponse.success("Audit logs retrieved", adminAuditLogService.getAllAuditLogs(search, action, pageRequest)));
    }
}
