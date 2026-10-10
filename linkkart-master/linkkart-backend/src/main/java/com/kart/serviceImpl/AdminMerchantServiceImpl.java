package com.kart.serviceImpl;

import com.kart.dto.admin.AdminMerchantResponse;
import com.kart.entity.Organization;
import com.kart.entity.OrganizationMember;
import com.kart.entity.User;
import com.kart.repository.CampaignRepository;
import com.kart.repository.OrganizationMemberRepository;
import com.kart.repository.ProductRepository;
import com.kart.repository.UserRepository;
import com.kart.service.AdminMerchantService;
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
public class AdminMerchantServiceImpl implements AdminMerchantService {

    private final UserRepository userRepository;
    private final OrganizationMemberRepository organizationMemberRepository;
    private final ProductRepository productRepository;
    private final CampaignRepository campaignRepository;

    @Override
    public Page<AdminMerchantResponse> getAllMerchants(String search, String status, Pageable pageable) {
        Specification<User> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("role").get("name"), "MERCHANT"));
            
            if (search != null && !search.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("email")), "%" + search.toLowerCase() + "%"));
            }
            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return userRepository.findAll(spec, pageable).map(this::mapToAdminMerchantResponse);
    }

    @Override
    public AdminMerchantResponse getMerchantDetails(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Merchant not found"));
                
        if (!"MERCHANT".equals(user.getRole().getName())) {
            throw new RuntimeException("User is not a merchant");
        }
        return mapToAdminMerchantResponse(user);
    }

    private AdminMerchantResponse mapToAdminMerchantResponse(User user) {
        Optional<OrganizationMember> memberOpt = organizationMemberRepository.findByUser(user).stream().findFirst();
        Optional<Organization> orgOpt = memberOpt.map(OrganizationMember::getOrganization);
        
        long productCount = orgOpt.map(org -> productRepository.countByOrganization(org)).orElse(0L);
        long campaignCount = orgOpt.map(org -> (long) campaignRepository.findByOrganization(org).size()).orElse(0L);
        
        return AdminMerchantResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .status(user.getStatus())
                .onboardingCompleted(user.isOnboardingCompleted())
                .createdAt(user.getCreatedAt())
                .businessName(orgOpt.map(Organization::getName).orElse(null))
                .website(orgOpt.map(Organization::getWebsiteUrl).orElse(null))
                .productCount(productCount)
                .campaignCount(campaignCount)
                .build();
    }
}
