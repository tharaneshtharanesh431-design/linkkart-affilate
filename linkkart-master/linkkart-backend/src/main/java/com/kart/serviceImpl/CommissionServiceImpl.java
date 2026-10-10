package com.kart.serviceImpl;

import com.kart.dto.commission.AffiliateCommissionResponse;
import com.kart.dto.commission.CommissionSummaryResponse;
import com.kart.entity.Commission;
import com.kart.entity.User;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.CommissionRepository;
import com.kart.repository.UserRepository;
import com.kart.service.CommissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kart.event.*;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommissionServiceImpl implements CommissionService {

    private final CommissionRepository commissionRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final com.kart.service.LedgerService ledgerService;

    private User getAuthenticatedAffiliate() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
        
        if (!"AFFILIATE".equals(user.getRole().getName())) {
            throw new RuntimeException("Unauthorized: Only affiliates can access this");
        }
        return user;
    }

    @Override
    public List<AffiliateCommissionResponse> getMyCommissions() {
        User affiliate = getAuthenticatedAffiliate();
        List<Commission> commissions = commissionRepository.findByAffiliate(affiliate);
        
        return commissions.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::toResponse)
                .toList();
    }

    @Override
    public CommissionSummaryResponse getMyCommissionSummary() {
        User affiliate = getAuthenticatedAffiliate();
        List<Commission> commissions = commissionRepository.findByAffiliate(affiliate);
        
        BigDecimal approvedEarnings = BigDecimal.ZERO;
        BigDecimal pendingEarnings = BigDecimal.ZERO;
        BigDecimal reversedEarnings = BigDecimal.ZERO;

        for (Commission c : commissions) {
            String status = c.getStatus() != null ? c.getStatus().toUpperCase() : "";
            BigDecimal amount = c.getAmount() != null ? c.getAmount() : BigDecimal.ZERO;

            if ("APPROVED".equals(status)) {
                approvedEarnings = approvedEarnings.add(amount);
            } else if ("PENDING".equals(status)) {
                pendingEarnings = pendingEarnings.add(amount);
            } else if ("REVERSED".equals(status)) {
                reversedEarnings = reversedEarnings.add(amount);
            }
        }

        BigDecimal totalEarnings = approvedEarnings.add(pendingEarnings);

        return CommissionSummaryResponse.builder()
                .totalEarnings(totalEarnings)
                .pendingEarnings(pendingEarnings)
                .approvedEarnings(approvedEarnings)
                .reversedEarnings(reversedEarnings)
                .build();
    }

    @Override
    @Transactional
    public void approveEligibleCommissions() {
        LocalDateTime now = LocalDateTime.now();
        List<Commission> pendingCommissions = commissionRepository.findPendingCommissionsReadyToClear(now);
        
        int approvedCount = 0;
        for (Commission commission : pendingCommissions) {
            // Verify associated conversion is still VALID
            if (commission.getConversion() != null && "VALID".equalsIgnoreCase(commission.getConversion().getStatus())) {
                commission.setStatus("APPROVED");
                commissionRepository.save(commission);
                ledgerService.recordCommissionAccrual(commission);
                approvedCount++;
            }
        }
        
        if (approvedCount > 0) {
            log.info("Approved {} pending commissions successfully.", approvedCount);
        }
        
        for (Commission commission : pendingCommissions) {
            if ("APPROVED".equals(commission.getStatus())) {
                applicationEventPublisher.publishEvent(CommissionApprovedEvent.builder()
                        .commissionId(commission.getId())
                        .affiliateId(commission.getAffiliate().getId())
                        .amount(commission.getAmount())
                        .conversionId(commission.getConversion() != null ? commission.getConversion().getId().toString() : "N/A")
                        .timestamp(LocalDateTime.now())
                        .build());
            }
        }
    }

    private AffiliateCommissionResponse toResponse(Commission c) {
        return AffiliateCommissionResponse.builder()
                .id(c.getId())
                .conversionId(c.getConversion() != null ? c.getConversion().getId() : null)
                .amount(c.getAmount())
                .status(c.getStatus())
                .clearsAt(c.getClearsAt())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
