package com.kart.serviceImpl;

import java.time.LocalDateTime;
import com.kart.dto.payout.PayoutRequest;
import java.time.LocalDateTime;
import com.kart.dto.payout.PayoutResponse;
import java.time.LocalDateTime;
import com.kart.dto.payout.AffiliateBalanceResponse;
import java.time.LocalDateTime;
import com.kart.entity.*;
import java.time.LocalDateTime;
import com.kart.repository.*;
import java.time.LocalDateTime;
import com.kart.service.PayoutService;
import java.time.LocalDateTime;
import com.kart.service.AffiliateBalanceService;
import java.time.LocalDateTime;
import org.junit.jupiter.api.AfterEach;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDateTime;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDateTime;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import java.time.LocalDateTime;
import org.springframework.security.core.context.SecurityContextHolder;
import java.time.LocalDateTime;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.time.LocalDateTime;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")


public class PayoutServiceImplTest {

    @Autowired
    private com.kart.repository.RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private com.kart.repository.NotificationRepository notificationRepository;
    @Autowired private com.kart.repository.ConversionRepository conversionRepository;
    @Autowired private com.kart.repository.AffiliateLinkRepository affiliateLinkRepository;
    @Autowired private com.kart.repository.CampaignRepository campaignRepository;
    @Autowired private com.kart.repository.ProductRepository productRepository;
    @Autowired private com.kart.repository.CategoryRepository categoryRepository;
    @Autowired private com.kart.repository.OrganizationRepository organizationRepository;
    
    private Conversion createDummyConversion() {
        Role merchantRole = roleRepository.findByName("MERCHANT").orElseGet(() -> roleRepository.save(Role.builder().name("MERCHANT").build()));
        User merchant = userRepository.save(User.builder().email("merchant-" + java.util.UUID.randomUUID() + "@test.com").password("pass").role(merchantRole).build());
        Organization org = organizationRepository.save(Organization.builder().name("Test Org " + java.util.UUID.randomUUID()).status("ACTIVE").createdAt(LocalDateTime.now()).build());
        Category cat = categoryRepository.save(Category.builder().name("Cat-" + java.util.UUID.randomUUID()).build());
        Product product = productRepository.save(Product.builder().name("Prod-" + java.util.UUID.randomUUID()).price(new java.math.BigDecimal("10")).organization(org).category(cat).status("ACTIVE").build());
        Campaign campaign = campaignRepository.save(Campaign.builder().organization(org).title("Camp").commissionType("PERCENTAGE").commissionRate(new java.math.BigDecimal("10")).clearingPeriodDays(30).status("ACTIVE").build());
        AffiliateLink link = affiliateLinkRepository.save(AffiliateLink.builder().affiliate(affiliate).campaign(campaign).product(product).code(java.util.UUID.randomUUID().toString()).targetUrl("http").build());
        return conversionRepository.save(Conversion.builder().affiliateLink(link).trackingId(java.util.UUID.randomUUID().toString()).orderAmount(new java.math.BigDecimal("100")).orderReference(java.util.UUID.randomUUID().toString()).status("VALID").build());
    }

    @Autowired
    private PayoutService payoutService;
    
    @Autowired
    private AffiliateBalanceService affiliateBalanceService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommissionRepository commissionRepository;

    @Autowired
    private LedgerTransactionRepository ledgerRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PayoutRepository payoutRepository;

    private User affiliate;

    @BeforeEach
    void setUp() {
        Role role = roleRepository.findByName("AFFILIATE").orElseGet(() -> roleRepository.save(Role.builder().name("AFFILIATE").build()));

        affiliate = User.builder()
                .email("payout-affiliate@test.com")
                .password("password")
                .role(role)
                .build();
        affiliate = userRepository.save(affiliate);

        SecurityContextHolder.getContext().setAuthentication(
            new UsernamePasswordAuthenticationToken(affiliate.getEmail(), "password", List.of(new SimpleGrantedAuthority("ROLE_AFFILIATE")))
        );
    }

    @AfterEach
    void tearDown() {
        ledgerRepository.deleteAll();
        payoutRepository.deleteAll();
        commissionRepository.deleteAll();
        conversionRepository.deleteAll();
        affiliateLinkRepository.deleteAll();
        campaignRepository.deleteAll();
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        organizationRepository.deleteAll();
        notificationRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        SecurityContextHolder.clearContext();
    }

    private void addBalance(BigDecimal amount, String idempotencyKey) {
        ledgerRepository.save(LedgerTransaction.builder()
            .affiliate(affiliate)
            .transactionType(LedgerTransactionType.COMMISSION_ACCRUED)
            .direction(LedgerDirection.CREDIT)
            .amount(amount)
            .referenceType("TEST")
            .referenceId((long) (Math.random() * 1000000))
            .idempotencyKey(idempotencyKey)
            .build());
    }

    @Test
    void testAvailableBalance() {
        commissionRepository.save(Commission.builder().affiliate(affiliate).conversion(createDummyConversion()).amount(new BigDecimal("200.00")).status("APPROVED").clearsAt(LocalDateTime.now()).build());
        addBalance(new BigDecimal("200.00"), "test-available-1");
        
        commissionRepository.save(Commission.builder().affiliate(affiliate).conversion(createDummyConversion()).amount(new BigDecimal("50.00")).status("PENDING").clearsAt(LocalDateTime.now().plusDays(30)).build());
        
        AffiliateBalanceResponse balance = payoutService.getMyBalance();
        assertEquals(new BigDecimal("200.00"), balance.getApprovedEarnings());
        assertEquals(new BigDecimal("50.00"), balance.getPendingEarnings());
        assertEquals(new BigDecimal("200.00"), balance.getAvailableBalance());
    }

    @Test
    void testPayoutRequest() {
        commissionRepository.save(Commission.builder().affiliate(affiliate).conversion(createDummyConversion()).amount(new BigDecimal("200.00")).status("APPROVED").clearsAt(LocalDateTime.now()).build());
        addBalance(new BigDecimal("200.00"), "test-req-1");
        
        PayoutRequest req = PayoutRequest.builder().amount(new BigDecimal("100.00")).build();
        PayoutResponse res = payoutService.requestPayout(req);
        
        assertEquals("REQUESTED", res.getStatus());
        assertEquals(new BigDecimal("100.00"), res.getAmount());
        
        AffiliateBalanceResponse balance = payoutService.getMyBalance();
        assertEquals(new BigDecimal("100.00"), balance.getAvailableBalance());
        assertEquals(new BigDecimal("100.00"), balance.getRequestedAmount());
    }

    @Test
    void testNegativePayoutRejected() {
        commissionRepository.save(Commission.builder().affiliate(affiliate).conversion(createDummyConversion()).amount(new BigDecimal("200.00")).status("APPROVED").clearsAt(LocalDateTime.now()).build());
        addBalance(new BigDecimal("200.00"), "test-neg-1");
        
        PayoutRequest req = PayoutRequest.builder().amount(new BigDecimal("-10.00")).build();
        assertThrows(com.kart.exception.BadRequestException.class, () -> {
            payoutService.requestPayout(req);
        });
    }

    @Test
    void testInsufficientBalance() {
        commissionRepository.save(Commission.builder().affiliate(affiliate).conversion(createDummyConversion()).amount(new BigDecimal("50.00")).status("APPROVED").clearsAt(LocalDateTime.now()).build());
        addBalance(new BigDecimal("50.00"), "test-insuf-1");
        
        PayoutRequest req = PayoutRequest.builder().amount(new BigDecimal("100.00")).build();
        assertThrows(com.kart.exception.BadRequestException.class, () -> {
            payoutService.requestPayout(req);
        });
    }

    @Test
    void testBalanceAfterRejectedPayout() {
        commissionRepository.save(Commission.builder().affiliate(affiliate).conversion(createDummyConversion()).amount(new BigDecimal("200.00")).status("APPROVED").clearsAt(LocalDateTime.now()).build());
        addBalance(new BigDecimal("200.00"), "test-rej-1");
        
        PayoutRequest req = PayoutRequest.builder().amount(new BigDecimal("100.00")).build();
        PayoutResponse res = payoutService.requestPayout(req);
        
        payoutService.rejectPayout(res.getId(), "Fraud suspected");
        
        AffiliateBalanceResponse balance = payoutService.getMyBalance();
        assertEquals(new BigDecimal("200.00"), balance.getAvailableBalance());
        assertEquals(new BigDecimal("0"), balance.getRequestedAmount());
    }
}
