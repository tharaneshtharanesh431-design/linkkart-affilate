package com.kart.serviceImpl;

import com.kart.dto.conversion.ConversionRequest;
import com.kart.entity.AffiliateLink;
import com.kart.entity.Campaign;
import com.kart.entity.CampaignAffiliate;
import com.kart.entity.Click;
import com.kart.entity.Organization;
import com.kart.entity.Product;
import com.kart.entity.Role;
import com.kart.entity.User;
import com.kart.repository.AffiliateLinkRepository;
import com.kart.repository.CampaignAffiliateRepository;
import com.kart.repository.CampaignRepository;
import com.kart.repository.ClickRepository;
import com.kart.repository.ConversionRepository;
import com.kart.repository.OrganizationRepository;
import com.kart.repository.ProductRepository;
import com.kart.repository.RoleRepository;
import com.kart.repository.UserRepository;
import com.kart.service.AffiliateLinkService;
import com.kart.service.ConversionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.test.context.support.WithMockUser;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class Phase5TrackingIntegrationTest {

    @Autowired private RoleRepository roleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private OrganizationRepository organizationRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CampaignRepository campaignRepository;
    @Autowired private CampaignAffiliateRepository campaignAffiliateRepository;
    @Autowired private AffiliateLinkRepository affiliateLinkRepository;
    @Autowired private ClickRepository clickRepository;
    @Autowired private ConversionRepository conversionRepository;

    @Autowired private AffiliateLinkService affiliateLinkService;
    @Autowired private ConversionService conversionService;

    private User affiliate;
    private Organization merchantOrg;
    private Campaign campaign;
    private Product product;

    @BeforeEach
    public void setup() {
        Role affRole = roleRepository.findByName("AFFILIATE")
                .orElseGet(() -> roleRepository.save(Role.builder().name("AFFILIATE").build()));

        affiliate = userRepository.save(User.builder()
                .email("affiliate5@test.com")
                .password("password")
                .role(affRole)
                .build());

        merchantOrg = organizationRepository.save(Organization.builder()
                .name("Merchant Org 5")
                .integrationSecret("secret5")
                .build());

        product = productRepository.save(Product.builder()
                .name("Product 5")
                .organization(merchantOrg)
                .price(new BigDecimal("100.00"))
                .status("ACTIVE")
                .build());

        campaign = campaignRepository.save(Campaign.builder()
                .title("Campaign 5")
                .organization(merchantOrg)
                .products(java.util.Set.of(product))
                .status("ACTIVE")
                .commissionRate(new BigDecimal("10.00"))
                .clearingPeriodDays(30)
                .build());

        campaignAffiliateRepository.save(CampaignAffiliate.builder()
                .campaign(campaign)
                .affiliate(affiliate)
                .status("ACTIVE")
                .build());
    }

    @AfterEach
    void tearDown() {
        conversionRepository.deleteAll();
        clickRepository.deleteAll();
        affiliateLinkRepository.deleteAll();
        campaignAffiliateRepository.deleteAll();
        campaignRepository.deleteAll();
        productRepository.deleteAll();
        organizationRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "affiliate5@test.com", authorities = {"AFFILIATE"})
    public void testGenerateLink_RequiresActiveCampaignAffiliate() {
        campaignAffiliateRepository.deleteAll();
        var req = new com.kart.dto.link.AffiliateLinkRequest();
        req.setProductId(product.getId());

        // Initially, the affiliate has not joined the campaign
        assertThrows(com.kart.exception.BadRequestException.class, () -> affiliateLinkService.generateLink(req));

        // Join the campaign as PENDING
        CampaignAffiliate ca = CampaignAffiliate.builder()
                .campaign(campaign)
                .affiliate(affiliate)
                .status("PENDING")
                .build();
        campaignAffiliateRepository.save(ca);

        assertThrows(com.kart.exception.BadRequestException.class, () -> affiliateLinkService.generateLink(req));

        // Set to ACTIVE
        ca.setStatus("ACTIVE");
        campaignAffiliateRepository.save(ca);

        var resp = affiliateLinkService.generateLink(req);
        assertNotNull(resp);
    }

    @Test
    public void testRecordConversion_Idempotency() {
        // Setup Link
        AffiliateLink link = affiliateLinkRepository.save(AffiliateLink.builder()
                .affiliate(affiliate)
                .campaign(campaign)
                .product(product)
                .code("CODE123")
                .targetUrl("http://target.com")
                .build());

        // Setup Click
        Click click1 = clickRepository.save(Click.builder()
                .affiliateLink(link)
                .trackingId("trk_123")
                .ipHash("hash")
                .clickedAt(LocalDateTime.now())
                .build());

        // First Conversion
        ConversionRequest req1 = new ConversionRequest();
        req1.setTrackingId("trk_123");
        req1.setOrderReference("ORDER-001");
        req1.setOrderAmount(new BigDecimal("100.00"));
        req1.setMerchantSecret("secret5");

        var resp1 = conversionService.recordConversion(req1);
        assertEquals("VALID", resp1.getStatus());

        // Duplicate Conversion with same order reference
        ConversionRequest req2 = new ConversionRequest();
        req2.setTrackingId("trk_123"); // Same tracking
        req2.setOrderReference("ORDER-001"); // Same order
        req2.setOrderAmount(new BigDecimal("100.00"));
        req2.setMerchantSecret("secret5");

        var resp2 = conversionService.recordConversion(req2);
        assertEquals("VALID", resp2.getStatus());

        // Another Duplicate Conversion with DIFFERENT tracking but same order reference
        Click click2 = clickRepository.save(Click.builder()
                .affiliateLink(link)
                .trackingId("trk_456")
                .ipHash("hash")
                .clickedAt(LocalDateTime.now())
                .build());

        ConversionRequest req3 = new ConversionRequest();
        req3.setTrackingId("trk_456");
        req3.setOrderReference("ORDER-001"); // Same order
        req3.setOrderAmount(new BigDecimal("100.00"));
        req3.setMerchantSecret("secret5");

        var resp3 = conversionService.recordConversion(req3);
        assertEquals("VALID", resp3.getStatus());

        // Ensure only ONE conversion was actually saved
        long count = conversionRepository.count();
        assertEquals(1, count, "Conversions with same order reference should be idempotent per organization");
    }

    @Test
    public void testRecordConversion_RequiresValidMerchantSecret() {
        // Setup Link & Click
        AffiliateLink link = affiliateLinkRepository.save(AffiliateLink.builder()
                .affiliate(affiliate)
                .campaign(campaign)
                .product(product)
                .code("CODE456")
                .targetUrl("http://target.com")
                .build());
        clickRepository.save(Click.builder()
                .affiliateLink(link)
                .trackingId("trk_789")
                .ipHash("hash")
                .clickedAt(LocalDateTime.now())
                .build());

        ConversionRequest req = new ConversionRequest();
        req.setTrackingId("trk_789");
        req.setOrderReference("ORDER-002");
        req.setOrderAmount(new BigDecimal("50.00"));
        req.setMerchantSecret("invalid_secret"); // Bad secret

        assertThrows(com.kart.exception.BadRequestException.class, () -> {
            conversionService.recordConversion(req);
        });
    }
}
