package com.kart.serviceImpl;

import com.kart.dto.admin.AdminApplicationResponse;
import com.kart.entity.AuditLog;
import com.kart.entity.CampaignAffiliate;
import com.kart.entity.User;
import com.kart.repository.AuditLogRepository;
import com.kart.repository.CampaignAffiliateRepository;
import com.kart.repository.UserRepository;
import com.kart.service.AdminApplicationService;
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
public class AdminApplicationServiceImpl implements AdminApplicationService {

    private final CampaignAffiliateRepository campaignAffiliateRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    public Page<AdminApplicationResponse> getAllApplications(String search, String status, Pageable pageable) {
        Specification<CampaignAffiliate> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null && !status.isEmpty() && !status.equals("ALL")) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (search != null && !search.isEmpty()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                Predicate affiliateMatch = cb.like(cb.lower(root.get("affiliate").get("email")), searchLower);
                Predicate merchantMatch = cb.like(cb.lower(root.get("campaign").get("organization").get("name")), searchLower);
                Predicate campaignMatch = cb.like(cb.lower(root.get("campaign").get("title")), searchLower);
                predicates.add(cb.or(affiliateMatch, merchantMatch, campaignMatch));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return campaignAffiliateRepository.findAll(spec, pageable).map(this::mapToAdminApplicationResponse);
    }

    @Override
    public AdminApplicationResponse approveApplication(Long campaignId, Long affiliateId) {
        return updateApplicationStatus(campaignId, affiliateId, "APPROVED");
    }

    @Override
    public AdminApplicationResponse rejectApplication(Long campaignId, Long affiliateId) {
        return updateApplicationStatus(campaignId, affiliateId, "REJECTED");
    }

    private AdminApplicationResponse updateApplicationStatus(Long campaignId, Long affiliateId, String newStatus) {
        CampaignAffiliate ca = campaignAffiliateRepository.findByCampaignIdAndAffiliateId(campaignId, affiliateId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
                
        ca.setStatus(newStatus);
        CampaignAffiliate updated = campaignAffiliateRepository.save(ca);
        
        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        if (admin != null) {
            AuditLog log = AuditLog.builder()
                .admin(admin)
                .action("ADMIN_" + newStatus + "_APPLICATION")
                .entityType("CAMPAIGN_AFFILIATE")
                .entityId(campaignId)
                .description(newStatus + " application for affiliate " + affiliateId + " on campaign " + campaignId)
                .build();
            auditLogRepository.save(log);
        }
        
        return mapToAdminApplicationResponse(updated);
    }

    private AdminApplicationResponse mapToAdminApplicationResponse(CampaignAffiliate ca) {
        return AdminApplicationResponse.builder()
                .campaignId(ca.getCampaign().getId())
                .affiliateId(ca.getAffiliate().getId())
                .campaignName(ca.getCampaign().getTitle())
                .merchantEmail(ca.getCampaign().getOrganization() != null ? ca.getCampaign().getOrganization().getName() : null)
                .affiliateEmail(ca.getAffiliate().getEmail())
                .status(ca.getStatus())
                .requestedDate(ca.getCreatedAt())
                .build();
    }
}
