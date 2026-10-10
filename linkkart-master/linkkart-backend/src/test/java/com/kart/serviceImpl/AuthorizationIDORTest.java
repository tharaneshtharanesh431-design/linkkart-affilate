package com.kart.serviceImpl;

import com.kart.dto.product.ProductRequest;
import com.kart.entity.*;
import com.kart.repository.*;
import com.kart.service.ProductService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")

    public class AuthorizationIDORTest {
    @Autowired
    private com.kart.repository.RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private OrganizationMemberRepository organizationMemberRepository;

    private User merchantA;
    private User merchantB;
    private User affiliate;
    private Product productA;
    private Category category;

    @BeforeEach
    void setUp() {
        Role mRole = roleRepository.findByName("MERCHANT").orElseGet(() -> roleRepository.save(Role.builder().name("MERCHANT").build()));
        Role aRole = roleRepository.findByName("AFFILIATE").orElseGet(() -> roleRepository.save(Role.builder().name("AFFILIATE").build()));

        merchantA = userRepository.save(User.builder().email("merchA@test.com").password("pass").role(mRole).build());
        merchantB = userRepository.save(User.builder().email("merchB@test.com").password("pass").role(mRole).build());
        affiliate = userRepository.save(User.builder().email("affil@test.com").password("pass").role(aRole).build());
        
        category = categoryRepository.save(Category.builder().name("TestCat").build());

        Organization orgA = organizationRepository.save(Organization.builder()
                .name("Merchant A Org")
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build());

        Organization orgB = organizationRepository.save(Organization.builder()
                .name("Merchant B Org")
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build());

        organizationMemberRepository.save(OrganizationMember.builder()
                .organization(orgA)
                .user(merchantA)
                .role("ADMIN")
                .createdAt(LocalDateTime.now())
                .build());

        organizationMemberRepository.save(OrganizationMember.builder()
                .organization(orgB)
                .user(merchantB)
                .role("ADMIN")
                .createdAt(LocalDateTime.now())
                .build());

        productA = productRepository.save(Product.builder()
                .name("Product A")
                .organization(orgA)
                .price(new BigDecimal("10.00"))
                .status("ACTIVE")
                .category(category)
                .build());
    }

    @AfterEach
    void tearDown() {
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        organizationMemberRepository.deleteAll();
        organizationRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        SecurityContextHolder.clearContext();
    }

    @Test
    void testMerchantBCannotModifyMerchantAProduct() {
        // Authenticate as Merchant B
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(merchantB.getEmail(), "pass", List.of(new SimpleGrantedAuthority("ROLE_MERCHANT")))
        );

        ProductRequest req = new ProductRequest();
        req.setName("Hacked Product");
        req.setCategoryId(category.getId());
        req.setPrice(new BigDecimal("10.00"));

        assertThrows(AccessDeniedException.class, () -> {
            productService.update(productA.getId(), req);
        });
    }

    @Test
    void testAffiliateCannotModifyMerchantProduct() {
        // Authenticate as Affiliate
        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(affiliate.getEmail(), "pass", List.of(new SimpleGrantedAuthority("ROLE_AFFILIATE")))
        );

        ProductRequest req = new ProductRequest();
        req.setName("Hacked Product");
        req.setCategoryId(category.getId());
        req.setPrice(new BigDecimal("10.00"));

        assertThrows(AccessDeniedException.class, () -> {
            productService.update(productA.getId(), req);
        });
    }
}
