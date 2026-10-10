package com.kart.serviceImpl;

import com.kart.entity.*;
import com.kart.repository.*;
import com.kart.service.ConversionService;
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

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class ConversionIDORTest {

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ConversionRepository conversionRepository;

    @Autowired
    private CommissionRepository commissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private OrganizationMemberRepository organizationMemberRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private AffiliateLinkRepository affiliateLinkRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private User merchantA;
    private User merchantB;
    private User admin;
    private Conversion conversionA;
    private Commission commissionA;

    @BeforeEach
    void setUp() {
        Role mRole = roleRepository.findByName("MERCHANT").orElseGet(() -> roleRepository.save(Role.builder().name("MERCHANT").build()));
        Role aRole = roleRepository.findByName("ADMIN").orElseGet(() -> roleRepository.save(Role.builder().name("ADMIN").build()));

        merchantA = userRepository.save(User.builder().email("merchA@test.com").password("pass").role(mRole).build());
        merchantB = userRepository.save(User.builder().email("merchB@test.com").password("pass").role(mRole).build());
        admin = userRepository.save(User.builder().email("admin@test.com").password("pass").role(aRole).build());

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

        Campaign campaignA = campaignRepository.save(Campaign.builder()
                .title("Campaign A")
                .organization(orgA)
                .commissionRate(new BigDecimal("10.00"))
                .commissionType("PERCENTAGE")
                .status("ACTIVE")
                .build());

        AffiliateLink linkA = affiliateLinkRepository.save(AffiliateLink.builder()
                .campaign(campaignA)
                .affiliate(admin)
                .code("LINKA")
                .targetUrl("http://test.com")
                .build());

        conversionA = conversionRepository.save(Conversion.builder()
                .trackingId("TRK123")
                .orderReference("ORD-TEST")
                .affiliateLink(linkA)
                .orderAmount(new BigDecimal("100.00"))
                .status("VALID")
                .convertedAt(LocalDateTime.now())
                .build());

        commissionA = commissionRepository.save(Commission.builder()
                .conversion(conversionA)
                .affiliate(admin)
                .amount(new BigDecimal("10.00"))
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .clearsAt(LocalDateTime.now().plusDays(30))
                .build());
    }

    @AfterEach
    void tearDown() {
        commissionRepository.deleteAll();
        conversionRepository.deleteAll();
        affiliateLinkRepository.deleteAll();
        campaignRepository.deleteAll();
        organizationMemberRepository.deleteAll();
        organizationRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        SecurityContextHolder.clearContext();
    }

    @Test
    void testMerchantBCannotModifyMerchantAConversion() {
        // Authenticate as Merchant B (Cross-Tenant)
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(merchantB.getEmail(), "pass", List.of(new SimpleGrantedAuthority("ROLE_MERCHANT")))
        );

        assertThrows(AccessDeniedException.class, () -> {
            conversionService.updateConversionStatus(conversionA.getId(), "FRAUD");
        });

        // Verify side effects did not occur
        Conversion saved = conversionRepository.findById(conversionA.getId()).orElseThrow();
        assertEquals("VALID", saved.getStatus());

        Commission comm = commissionRepository.findById(commissionA.getId()).orElseThrow();
        assertEquals("PENDING", comm.getStatus());
    }

    @Test
    void testMerchantACanModifyMerchantAConversion() {
        // Authenticate as Merchant A (Same-Tenant Authorized)
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(merchantA.getEmail(), "pass", List.of(new SimpleGrantedAuthority("ROLE_MERCHANT")))
        );

        conversionService.updateConversionStatus(conversionA.getId(), "FRAUD");

        // Verify side effects occurred
        Conversion saved = conversionRepository.findById(conversionA.getId()).orElseThrow();
        assertEquals("FRAUD", saved.getStatus());

        Commission comm = commissionRepository.findById(commissionA.getId()).orElseThrow();
        assertEquals("REJECTED", comm.getStatus()); // Fraud triggers REJECTED commission
    }

    @Test
    void testAdminCanModifyAnyConversion() {
        // Authenticate as Admin (Platform Admin)
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(admin.getEmail(), "pass", List.of(new SimpleGrantedAuthority("ROLE_ADMIN")))
        );

        conversionService.updateConversionStatus(conversionA.getId(), "REFUNDED");

        // Verify side effects occurred
        Conversion saved = conversionRepository.findById(conversionA.getId()).orElseThrow();
        assertEquals("REFUNDED", saved.getStatus());

        Commission comm = commissionRepository.findById(commissionA.getId()).orElseThrow();
        assertEquals("REVERSED", comm.getStatus()); // Refund triggers REVERSED commission
    }

    @Test
    void testUnauthenticatedCannotModifyConversion() {
        // Clear security context to simulate unauthenticated
        SecurityContextHolder.clearContext();

        assertThrows(AccessDeniedException.class, () -> {
            conversionService.updateConversionStatus(conversionA.getId(), "FRAUD");
        });

        // Verify side effects did not occur
        Conversion saved = conversionRepository.findById(conversionA.getId()).orElseThrow();
        assertEquals("VALID", saved.getStatus());
    }
}
