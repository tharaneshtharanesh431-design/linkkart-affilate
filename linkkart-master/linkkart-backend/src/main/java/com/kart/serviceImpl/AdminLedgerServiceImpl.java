package com.kart.serviceImpl;

import com.kart.dto.admin.AdminCommissionResponse;
import com.kart.dto.admin.AdminConversionResponse;
import com.kart.dto.admin.AdminPayoutResponse;
import com.kart.entity.AuditLog;
import com.kart.entity.Commission;
import com.kart.entity.Conversion;
import com.kart.entity.Payout;
import com.kart.entity.User;
import com.kart.repository.AuditLogRepository;
import com.kart.repository.CommissionRepository;
import com.kart.repository.ConversionRepository;
import com.kart.repository.PayoutRepository;
import com.kart.repository.UserRepository;
import com.kart.service.AdminLedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminLedgerServiceImpl implements AdminLedgerService {

    private final ConversionRepository conversionRepository;
    private final CommissionRepository commissionRepository;
    private final PayoutRepository payoutRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    public Page<AdminConversionResponse> getAllConversions(String search, String status, Pageable pageable) {
        Specification<Conversion> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null && !status.isEmpty() && !status.equals("ALL")) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (search != null && !search.isEmpty()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                Predicate transIdMatch = cb.like(cb.lower(root.get("orderReference")), searchLower);
                Predicate affiliateMatch = cb.like(cb.lower(root.get("affiliateLink").get("affiliate").get("email")), searchLower);
                Predicate merchantMatch = cb.like(cb.lower(root.get("affiliateLink").get("campaign").get("organization").get("name")), searchLower);
                predicates.add(cb.or(transIdMatch, affiliateMatch, merchantMatch));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return conversionRepository.findAll(spec, pageable).map(this::mapToAdminConversionResponse);
    }

    @Override
    public Page<AdminCommissionResponse> getAllCommissions(String search, String status, Pageable pageable) {
        Specification<Commission> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null && !status.isEmpty() && !status.equals("ALL")) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (search != null && !search.isEmpty()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                Predicate affiliateMatch = cb.like(cb.lower(root.get("affiliate").get("email")), searchLower);
                Predicate merchantMatch = cb.like(cb.lower(root.get("conversion").get("affiliateLink").get("campaign").get("organization").get("name")), searchLower);
                predicates.add(cb.or(affiliateMatch, merchantMatch));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return commissionRepository.findAll(spec, pageable).map(this::mapToAdminCommissionResponse);
    }

    @Override
    public Page<AdminPayoutResponse> getAllPayouts(String search, String status, Pageable pageable) {
        Specification<Payout> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null && !status.isEmpty() && !status.equals("ALL")) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (search != null && !search.isEmpty()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                Predicate affiliateMatch = cb.like(cb.lower(root.get("affiliate").get("email")), searchLower);
                predicates.add(affiliateMatch);
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return payoutRepository.findAll(spec, pageable).map(this::mapToAdminPayoutResponse);
    }

    @Override
    public AdminPayoutResponse updatePayoutStatus(Long id, String status, String notes) {
        Payout payout = payoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payout not found"));
                
        payout.setStatus(status);
        if (notes != null) {
            if ("REJECTED".equals(status)) {
                payout.setRejectionReason(notes);
            } else if ("FAILED".equals(status)) {
                payout.setFailureReason(notes);
            }
        }
        
        if ("PAID".equals(status) || "REJECTED".equals(status) || "FAILED".equals(status)) {
            payout.setProcessedAt(LocalDateTime.now());
        }
        
        Payout updated = payoutRepository.save(payout);
        
        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        if (admin != null) {
            AuditLog log = AuditLog.builder()
                .admin(admin)
                .action("ADMIN_UPDATE_PAYOUT")
                .entityType("PAYOUT")
                .entityId(id)
                .description("Changed payout status to " + status)
                .build();
            auditLogRepository.save(log);
        }
        
        return mapToAdminPayoutResponse(updated);
    }

    private AdminConversionResponse mapToAdminConversionResponse(Conversion c) {
        return AdminConversionResponse.builder()
                .id(c.getId())
                .transactionId(c.getOrderReference())
                .clickId(c.getTrackingId())
                .affiliateEmail(c.getAffiliateLink().getAffiliate().getEmail())
                .merchantEmail(c.getAffiliateLink().getCampaign().getOrganization() != null ? c.getAffiliateLink().getCampaign().getOrganization().getName() : null)
                .campaignName(c.getAffiliateLink().getCampaign().getTitle())
                .saleAmount(c.getOrderAmount())
                .status(c.getStatus())
                .createdAt(c.getConvertedAt())
                .build();
    }

    private AdminCommissionResponse mapToAdminCommissionResponse(Commission c) {
        return AdminCommissionResponse.builder()
                .id(c.getId())
                .conversionId(c.getConversion().getId())
                .affiliateEmail(c.getAffiliate().getEmail())
                .merchantEmail(c.getConversion().getAffiliateLink().getCampaign().getOrganization() != null ? c.getConversion().getAffiliateLink().getCampaign().getOrganization().getName() : null)
                .campaignName(c.getConversion().getAffiliateLink().getCampaign().getTitle())
                .amount(c.getAmount())
                .status(c.getStatus())
                .createdAt(c.getCreatedAt())
                .clearingDate(c.getClearsAt())
                .build();
    }

    private AdminPayoutResponse mapToAdminPayoutResponse(Payout p) {
        return AdminPayoutResponse.builder()
                .id(p.getId())
                .affiliateEmail(p.getAffiliate().getEmail())
                .amount(p.getAmount())
                .status(p.getStatus())
                .paymentMethod("BANK_TRANSFER")
                .notes(p.getRejectionReason() != null ? p.getRejectionReason() : p.getFailureReason())
                .requestedAt(p.getRequestedAt())
                .processedAt(p.getProcessedAt())
                .build();
    }
}
