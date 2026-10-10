package com.kart.integration;

import com.kart.dto.payout.AffiliateBalanceResponse;
import com.kart.dto.payout.PayoutRequest;
import com.kart.entity.*;
import com.kart.repository.*;
import com.kart.service.AffiliateBalanceService;
import com.kart.service.CommissionService;
import com.kart.service.LedgerService;
import com.kart.service.PayoutService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
public class Phase6FinancialIntegrationTest {

    @Autowired private RoleRepository roleRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private OrganizationRepository organizationRepository;
    @Autowired private CampaignRepository campaignRepository;
    @Autowired private AffiliateLinkRepository affiliateLinkRepository;
    @Autowired private ConversionRepository conversionRepository;
    @Autowired private CommissionRepository commissionRepository;
    @Autowired private PayoutRepository payoutRepository;
    @Autowired private LedgerTransactionRepository ledgerRepository;
    
    @Autowired private AffiliateBalanceService affiliateBalanceService;
    @Autowired private LedgerService ledgerService;
    @Autowired private PayoutService payoutService;

    private User affiliate;
    private User merchant;
    private Organization organization;
    private Campaign campaign;
    private AffiliateLink link;

    @BeforeEach
    void setUp() {
        Role mRole = roleRepository.findByName("MERCHANT").orElseGet(() -> roleRepository.save(Role.builder().name("MERCHANT").build()));
        Role aRole = roleRepository.findByName("AFFILIATE").orElseGet(() -> roleRepository.save(Role.builder().name("AFFILIATE").build()));

        merchant = User.builder()
                .email("merchant_ph6@test.com")
                .password("password")
                .role(mRole)
                .build();
        merchant = userRepository.save(merchant);

        organization = Organization.builder()
                .name("Phase 6 Org")
                .build();
        organization = organizationRepository.save(organization);

        affiliate = User.builder()
                .email("affiliate_ph6@test.com")
                .password("password")
                .role(aRole)
                .build();
        affiliate = userRepository.save(affiliate);

        campaign = Campaign.builder()
                .organization(organization)
                .title("Financial Test Campaign")
                .commissionType("FIXED")
                .commissionRate(new BigDecimal("100.00"))
                .clearingPeriodDays(0)
                .status("ACTIVE")
                .build();
        campaign = campaignRepository.save(campaign);

        link = AffiliateLink.builder()
                .campaign(campaign)
                .affiliate(affiliate)
                .code("PH6TRACKINGCODE")
                .targetUrl("https://example.com/product")
                .build();
        link = affiliateLinkRepository.save(link);

        setSecurityContext(affiliate.getEmail());
    }

    @AfterEach
    void tearDown() {
        ledgerRepository.deleteAll();
        payoutRepository.deleteAll();
        commissionRepository.deleteAll();
        conversionRepository.deleteAll();
        affiliateLinkRepository.deleteAll();
        campaignRepository.deleteAll();
        organizationRepository.deleteAll();
        userRepository.deleteAll();
    }

    private void setSecurityContext(String email) {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(email, null, java.util.Collections.emptyList())
        );
    }

    @Test
    @Transactional
    void testCommissionLifecycleAndLedgerImmutability() {
        // 1. Create a Conversion and Commission directly to simulate existing flow
        Conversion conversion = Conversion.builder()
                .affiliateLink(link)
                .orderReference("ORDER_PH6_1")
                .trackingId("TRK_PH6_1")
                .orderAmount(new BigDecimal("500.00"))
                .status("VALID")
                .convertedAt(LocalDateTime.now())
                .build();
        conversion = conversionRepository.save(conversion);

        Commission commission = Commission.builder()
                .conversion(conversion)
                .affiliate(affiliate)
                .amount(new BigDecimal("100.00"))
                .status("PENDING")
                .clearsAt(LocalDateTime.now().minusDays(1)) // Cleared
                .build();
        commission = commissionRepository.save(commission);

        // Balance should be 0 because ledger is empty
        AffiliateBalanceResponse balance = affiliateBalanceService.calculateBalance(affiliate);
        assertThat(balance.getAvailableBalance()).isEqualByComparingTo(BigDecimal.ZERO);

        // 2. Approve Commission
        ledgerService.recordCommissionAccrual(commission);
        commission.setStatus("APPROVED");
        commissionRepository.save(commission);

        balance = affiliateBalanceService.calculateBalance(affiliate);
        assertThat(balance.getAvailableBalance()).isEqualByComparingTo(new BigDecimal("100.00"));
        assertThat(balance.getApprovedEarnings()).isEqualByComparingTo(new BigDecimal("100.00"));
        
        // 3. Reverse Commission
        ledgerService.recordCommissionReversal(commission);
        commission.setStatus("REVERSED");
        commissionRepository.save(commission);

        balance = affiliateBalanceService.calculateBalance(affiliate);
        assertThat(balance.getAvailableBalance()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(balance.getApprovedEarnings()).isEqualByComparingTo(BigDecimal.ZERO);

        // Ensure both ledger transactions exist
        assertThat(ledgerRepository.count()).isEqualTo(2);
    }

    @Test
    @Transactional
    void testPayoutReservationAndLifecycle() {
        // Setup balance of 200
        Commission c = Commission.builder()
                .affiliate(affiliate)
                .amount(new BigDecimal("200.00"))
                .status("APPROVED")
                .clearsAt(LocalDateTime.now())
                .build();
        c = commissionRepository.save(c);
        ledgerService.recordCommissionAccrual(c);

        AffiliateBalanceResponse initialBalance = affiliateBalanceService.calculateBalance(affiliate);
        assertThat(initialBalance.getAvailableBalance()).isEqualByComparingTo(new BigDecimal("200.00"));

        // 1. Request Payout
        setSecurityContext(affiliate.getEmail());
        PayoutRequest request = PayoutRequest.builder().amount(new BigDecimal("20.00")).build();
        request.setAmount(new BigDecimal("150.00"));
        payoutService.requestPayout(request);

        AffiliateBalanceResponse afterRequest = affiliateBalanceService.calculateBalance(affiliate);
        assertThat(afterRequest.getAvailableBalance()).isEqualByComparingTo(new BigDecimal("50.00"));
        assertThat(afterRequest.getRequestedAmount()).isEqualByComparingTo(new BigDecimal("150.00"));

        // Get the payout
        Payout payout = payoutRepository.findByAffiliateOrderByRequestedAtDesc(affiliate).get(0);

        // 2. Reject Payout -> funds released
        setSecurityContext(merchant.getEmail()); // simulate admin/merchant logic context if needed, but services bypass context in some test setups
        payoutService.rejectPayout(payout.getId(), "Test rejection");

        AffiliateBalanceResponse afterReject = affiliateBalanceService.calculateBalance(affiliate);
        assertThat(afterReject.getAvailableBalance()).isEqualByComparingTo(new BigDecimal("200.00"));
        assertThat(afterReject.getRequestedAmount()).isEqualByComparingTo(BigDecimal.ZERO);
        
        // Ledger should show ACCRUED, RESERVED, RELEASED
        assertThat(ledgerRepository.count()).isEqualTo(3);
    }
}
