package com.kart.serviceImpl;

import com.kart.dto.admin.AdminCampaignResponse;
import com.kart.entity.AuditLog;
import com.kart.entity.Campaign;
import com.kart.entity.User;
import com.kart.repository.AuditLogRepository;
import com.kart.repository.CampaignAffiliateRepository;
import com.kart.repository.CampaignRepository;
import com.kart.repository.UserRepository;
import com.kart.service.AdminCampaignService;
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
public class AdminCampaignServiceImpl implements AdminCampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignAffiliateRepository campaignAffiliateRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    public Page<AdminCampaignResponse> getAllCampaigns(String search, String status, Pageable pageable) {
        Specification<Campaign> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null && !status.isEmpty() && !status.equals("ALL")) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (search != null && !search.isEmpty()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("title")), searchLower);
                Predicate merchantMatch = cb.like(cb.lower(root.get("organization").get("name")), searchLower);
                predicates.add(cb.or(nameMatch, merchantMatch));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return campaignRepository.findAll(spec, pageable).map(this::mapToAdminCampaignResponse);
    }

    @Override
    public AdminCampaignResponse getCampaignDetails(Long id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        return mapToAdminCampaignResponse(campaign);
    }

    @Override
    public AdminCampaignResponse activateCampaign(Long id) {
        return updateCampaignStatus(id, "ACTIVE");
    }

    @Override
    public AdminCampaignResponse pauseCampaign(Long id) {
        return updateCampaignStatus(id, "PAUSED");
    }

    @Override
    public AdminCampaignResponse closeCampaign(Long id) {
        return updateCampaignStatus(id, "CLOSED");
    }

    private AdminCampaignResponse updateCampaignStatus(Long id, String newStatus) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));
        
        campaign.setStatus(newStatus);
        Campaign updated = campaignRepository.save(campaign);

        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        if (admin != null) {
            AuditLog log = AuditLog.builder()
                .admin(admin)
                .action("ADMIN_" + newStatus + "_CAMPAIGN")
                .entityType("CAMPAIGN")
                .entityId(id)
                .description("Changed campaign status to " + newStatus)
                .build();
            auditLogRepository.save(log);
        }

        return mapToAdminCampaignResponse(updated);
    }

    private AdminCampaignResponse mapToAdminCampaignResponse(Campaign campaign) {
        long affiliateCount = campaignAffiliateRepository.findAll((root, query, cb) -> cb.equal(root.get("campaign"), campaign)).size();
        
        return AdminCampaignResponse.builder()
                .id(campaign.getId())
                .name(campaign.getTitle())
                .merchantEmail(campaign.getOrganization() != null ? campaign.getOrganization().getName() : null)
                .commissionType(campaign.getCommissionType())
                .commissionRate(campaign.getCommissionRate())
                .clearingPeriodDays(campaign.getClearingPeriodDays())
                .status(campaign.getStatus())
                .createdAt(campaign.getCreatedAt())
                .productCount(campaign.getProducts() != null ? campaign.getProducts().size() : 0)
                .affiliateCount(affiliateCount)
                .build();
    }
}
