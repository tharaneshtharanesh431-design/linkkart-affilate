package com.kart.serviceImpl;

import com.kart.dto.admin.AdminAffiliateResponse;
import com.kart.entity.AffiliateProfile;
import com.kart.entity.User;
import com.kart.repository.AffiliateLinkRepository;
import com.kart.repository.AffiliateProfileRepository;
import com.kart.repository.ClickRepository;
import com.kart.repository.ConversionRepository;
import com.kart.repository.UserRepository;
import com.kart.service.AdminAffiliateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminAffiliateServiceImpl implements AdminAffiliateService {

    private final UserRepository userRepository;
    private final AffiliateProfileRepository affiliateProfileRepository;
    private final AffiliateLinkRepository affiliateLinkRepository;
    private final ClickRepository clickRepository;
    private final ConversionRepository conversionRepository;

    @Override
    public Page<AdminAffiliateResponse> getAllAffiliates(String search, String status, Pageable pageable) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("role").get("name"), "AFFILIATE"));
            
            if (search != null && !search.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%"));
            }
            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return userRepository.findAll(spec, pageable).map(this::mapToAdminAffiliateResponse);
    }

    @Override
    public AdminAffiliateResponse getAffiliateDetails(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affiliate not found"));
                
        if (!"AFFILIATE".equals(user.getRole().getName())) {
            throw new RuntimeException("User is not an affiliate");
        }
        return mapToAdminAffiliateResponse(user);
    }

    private AdminAffiliateResponse mapToAdminAffiliateResponse(User user) {
        Optional<AffiliateProfile> profileOpt = affiliateProfileRepository.findByUserId(user.getId());
        
        long linksCount = affiliateLinkRepository.findByAffiliate(user).size();
        long clicksCount = clickRepository.findByAffiliateLinkAffiliate(user).size();
        long conversionsCount = conversionRepository.findByAffiliateLinkAffiliate(user).size();
        
        return AdminAffiliateResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .status(user.getStatus())
                .onboardingCompleted(user.isOnboardingCompleted())
                .createdAt(user.getCreatedAt())
                .name(user.getEmail()) // Fallback name as no first/last name exists
                .website(profileOpt.map(AffiliateProfile::getWebsiteUrl).orElse(null))
                .linksCount(linksCount)
                .clicksCount(clicksCount)
                .conversionsCount(conversionsCount)
                .build();
    }
}
