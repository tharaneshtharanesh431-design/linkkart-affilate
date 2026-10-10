package com.kart.serviceImpl;

import com.kart.dto.conversion.ConversionRequest;
import com.kart.dto.conversion.ConversionResponse;
import com.kart.entity.*;
import com.kart.repository.*;
import com.kart.service.ConversionService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")

    public class ConversionServiceImplTest {
    @Autowired
    private com.kart.repository.RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private ConversionService conversionService;

    @Autowired
    private ConversionRepository conversionRepository;

    @Autowired
    private CommissionRepository commissionRepository;

    @Autowired
    private ClickRepository clickRepository;

    @Autowired
    private AffiliateLinkRepository affiliateLinkRepository;

    @Autowired
    private CampaignRepository campaignRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FraudSignalRepository fraudSignalRepository;
    
    @Autowired
    private CampaignAffiliateRepository campaignAffiliateRepository;

    private String validTrackingId = "test-track-id";
    private String merchantSecret = "my-secret-123";

    @BeforeEach
    void setUp() {
        Role merchantRole = roleRepository.findByName("MERCHANT").orElseGet(() -> roleRepository.save(Role.builder().name("MERCHANT").build()));
        Role affiliateRole = roleRepository.findByName("AFFILIATE").orElseGet(() -> roleRepository.save(Role.builder().name("AFFILIATE").build()));

        User merchant = userRepository.save(User.builder().email("merchant@test.com").password("pass").role(merchantRole).build());
        User affiliate = userRepository.save(User.builder().email("affiliate@test.com").password("pass").role(affiliateRole).build());

        Organization org = organizationRepository.save(Organization.builder()
                .name("Test Business")
                .integrationSecret(merchantSecret)
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .build());

        Category cat = categoryRepository.save(Category.builder().name("Tech").build());

        Product product = productRepository.save(Product.builder()
                .name("Laptop")
                .price(new BigDecimal("1000.00"))
                .organization(org)
                .category(cat)
                .status("ACTIVE")
                .build());

        Campaign campaign = campaignRepository.save(Campaign.builder()
                .title("Promo")
                .commissionRate(new BigDecimal("10.00"))
                .commissionType("PERCENTAGE")
                .organization(org)
                .status("ACTIVE")
                .clearingPeriodDays(30)
                .build());

        campaignAffiliateRepository.save(CampaignAffiliate.builder()
                .campaign(campaign)
                .affiliate(affiliate)
                .status("APPROVED")
                .build());
        campaign.getProducts().add(product);
        campaignRepository.save(campaign);

        AffiliateLink link = affiliateLinkRepository.save(AffiliateLink.builder()
                .affiliate(affiliate)
                .product(product)
                .campaign(campaign)
                .code("CODE123")
                .targetUrl("http://test.com")
                .build());

        clickRepository.save(Click.builder()
                .affiliateLink(link)
                .trackingId(validTrackingId)
                .ipHash("hash")
                .clickedAt(LocalDateTime.now())
                .build());
    }

    @AfterEach
    void tearDown() {
        fraudSignalRepository.deleteAll();
        commissionRepository.deleteAll();
        conversionRepository.deleteAll();
        clickRepository.deleteAll();
        affiliateLinkRepository.deleteAll();
        campaignAffiliateRepository.deleteAll();
        campaignRepository.deleteAll();
        productRepository.deleteAll();
        organizationRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        categoryRepository.deleteAll();
    }

    @Test
    void testValidConversion() {
        ConversionRequest request = new ConversionRequest();
        request.setTrackingId(validTrackingId);
        request.setOrderReference("ORDER-001");
        request.setOrderAmount(new BigDecimal("500.00"));
        request.setMerchantSecret(merchantSecret);

        ConversionResponse response = conversionService.recordConversion(request);

        assertNotNull(response);
        assertEquals("VALID", response.getStatus());

        assertEquals(1, conversionRepository.count());
        assertEquals(1, commissionRepository.count());

        Commission commission = commissionRepository.findAll().get(0);
        // 10% of 500 = 50
        assertEquals(new BigDecimal("50.00"), commission.getAmount());
        assertEquals("PENDING", commission.getStatus());
    }

    @Test
    void testDuplicateConversionIdempotency() {
        ConversionRequest request = new ConversionRequest();
        request.setTrackingId(validTrackingId);
        request.setOrderReference("ORDER-002");
        request.setOrderAmount(new BigDecimal("500.00"));
        request.setMerchantSecret(merchantSecret);

        // First call
        conversionService.recordConversion(request);
        assertEquals(1, conversionRepository.count());
        assertEquals(1, commissionRepository.count());

        // Second call with identical trackingId and orderReference
        ConversionResponse response2 = conversionService.recordConversion(request);
        assertNotNull(response2);
        assertEquals("VALID", response2.getStatus()); // returns success idempotently

        // Verify still only 1 conversion and 1 commission
        assertEquals(1, conversionRepository.count());
        assertEquals(1, commissionRepository.count());
    }

    @Test
    void testInvalidMerchantSecret() {
        ConversionRequest request = new ConversionRequest();
        request.setTrackingId(validTrackingId);
        request.setOrderReference("ORDER-003");
        request.setOrderAmount(new BigDecimal("500.00"));
        request.setMerchantSecret("wrong-secret");

        assertThrows(com.kart.exception.BadRequestException.class, () -> {
            conversionService.recordConversion(request);
        });

        assertEquals(0, conversionRepository.count());
        assertEquals(0, commissionRepository.count());
    }

    @Test
    void testInvalidTrackingId() {
        ConversionRequest request = new ConversionRequest();
        request.setTrackingId("non-existent-tracking-id");
        request.setOrderReference("ORDER-004");
        request.setOrderAmount(new BigDecimal("500.00"));
        request.setMerchantSecret(merchantSecret);

        assertThrows(com.kart.exception.BadRequestException.class, () -> {
            conversionService.recordConversion(request);
        });
    }
}
