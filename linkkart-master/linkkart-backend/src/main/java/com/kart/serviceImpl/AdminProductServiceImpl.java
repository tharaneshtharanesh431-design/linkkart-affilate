package com.kart.serviceImpl;

import com.kart.dto.admin.AdminProductResponse;
import com.kart.entity.AuditLog;
import com.kart.entity.Product;
import com.kart.entity.User;
import com.kart.repository.AuditLogRepository;
import com.kart.repository.ProductRepository;
import com.kart.repository.UserRepository;
import com.kart.service.AdminProductService;
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
public class AdminProductServiceImpl implements AdminProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    public Page<AdminProductResponse> getAllProducts(String search, String category, String status, Pageable pageable) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null && !status.isEmpty() && !status.equals("ALL")) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (category != null && !category.isEmpty() && !category.equals("ALL")) {
                predicates.add(cb.equal(root.get("category").get("name"), category));
            }
            if (search != null && !search.isEmpty()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), searchLower);
                Predicate merchantMatch = cb.like(cb.lower(root.get("organization").get("name")), searchLower);
                predicates.add(cb.or(nameMatch, merchantMatch));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec, pageable).map(this::mapToAdminProductResponse);
    }

    @Override
    public AdminProductResponse getProductDetails(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToAdminProductResponse(product);
    }

    @Override
    public AdminProductResponse activateProduct(Long id) {
        return updateProductStatus(id, "ACTIVE");
    }

    @Override
    public AdminProductResponse deactivateProduct(Long id) {
        return updateProductStatus(id, "INACTIVE");
    }

    private AdminProductResponse updateProductStatus(Long id, String newStatus) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setStatus(newStatus);
        Product updated = productRepository.save(product);

        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        if (admin != null) {
            AuditLog log = AuditLog.builder()
                .admin(admin)
                .action("ADMIN_" + newStatus + "_PRODUCT")
                .entityType("PRODUCT")
                .entityId(id)
                .description("Changed product status to " + newStatus)
                .build();
            auditLogRepository.save(log);
        }

        return mapToAdminProductResponse(updated);
    }

    private AdminProductResponse mapToAdminProductResponse(Product product) {
        return AdminProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .merchantEmail(product.getOrganization() != null ? product.getOrganization().getName() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .price(product.getPrice())
                .status(product.getStatus())
                .activeCampaignName(null)
                .createdAt(product.getCreatedAt())
                .build();
    }
}
