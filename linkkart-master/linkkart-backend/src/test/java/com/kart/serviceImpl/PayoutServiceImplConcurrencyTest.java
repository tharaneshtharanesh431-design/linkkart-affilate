package com.kart.serviceImpl;

import java.time.LocalDateTime;
import com.kart.dto.payout.PayoutRequest;
import java.time.LocalDateTime;
import com.kart.entity.Commission;
import java.time.LocalDateTime;
import com.kart.entity.Role;
import java.time.LocalDateTime;
import com.kart.entity.User;
import java.time.LocalDateTime;
import com.kart.repository.CommissionRepository;
import java.time.LocalDateTime;
import com.kart.repository.RoleRepository;
import java.time.LocalDateTime;
import com.kart.repository.UserRepository;
import java.time.LocalDateTime;
import com.kart.service.PayoutService;
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
import java.util.concurrent.CountDownLatch;
import java.time.LocalDateTime;
import java.util.concurrent.ExecutorService;
import java.time.LocalDateTime;
import java.util.concurrent.Executors;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;
import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicInteger;

import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")


public class PayoutServiceImplConcurrencyTest {

    @Autowired
    private com.kart.repository.RefreshTokenRepository refreshTokenRepository;
    @Autowired
    private com.kart.repository.NotificationRepository notificationRepository;

    @Autowired
    private PayoutService payoutService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommissionRepository commissionRepository;

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private com.kart.repository.PayoutRepository payoutRepository;

    @Autowired
    private com.kart.repository.LedgerTransactionRepository ledgerRepository;

    private User affiliate;

    @BeforeEach
    void setUp() {
        Role role = roleRepository.findByName("AFFILIATE").orElseGet(() -> roleRepository.save(Role.builder().name("AFFILIATE").build()));

        affiliate = User.builder()
                .email("concurrent-affiliate@test.com")
                .password("password")
                .role(role)
                .build();
        affiliate = userRepository.save(affiliate);

        // Give the affiliate an approved commission of 100
        Commission commission = Commission.builder()
                .affiliate(affiliate)
                .amount(new BigDecimal("100.00"))
                .status("APPROVED")
                .clearsAt(LocalDateTime.now())
                .build();
        commissionRepository.save(commission);
        
        ledgerRepository.save(com.kart.entity.LedgerTransaction.builder()
            .affiliate(affiliate)
            .transactionType(com.kart.entity.LedgerTransactionType.COMMISSION_ACCRUED)
            .direction(com.kart.entity.LedgerDirection.CREDIT)
            .amount(new BigDecimal("100.00"))
            .referenceType("COMMISSION")
            .referenceId(commission.getId())
            .idempotencyKey("test-conc-1")
            .build());
    }
    
    @AfterEach
    void tearDown() {
        ledgerRepository.deleteAll();
        payoutRepository.deleteAll();
        commissionRepository.deleteAll();
        notificationRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        SecurityContextHolder.clearContext();
    }

    @Test
    void testConcurrentPayoutRequests() throws InterruptedException {
        // Balance = 100. Two threads try to request 80 at the same time.
        // Only one should succeed.
        
        int numberOfThreads = 2;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(1); // To make threads start exactly at same time
        CountDownLatch doneLatch = new CountDownLatch(numberOfThreads);
        
        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger failCount = new AtomicInteger(0);

        for (int i = 0; i < numberOfThreads; i++) {
            executorService.execute(() -> {
                try {
                    // Set up Spring Security context for this thread
                    SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(affiliate.getEmail(), "password", List.of(new SimpleGrantedAuthority("ROLE_AFFILIATE")))
                    );
                    
                    latch.await(); // wait for start signal
                    
                    PayoutRequest req = PayoutRequest.builder().amount(new BigDecimal("80.00")).build();
                    payoutService.requestPayout(req);
                    successCount.incrementAndGet();
                } catch (Exception e) {
                    failCount.incrementAndGet();
                } finally {
                    SecurityContextHolder.clearContext();
                    doneLatch.countDown();
                }
            });
        }
        
        latch.countDown(); // Start all threads
        doneLatch.await(5, TimeUnit.SECONDS);
        
        assertEquals(1, successCount.get(), "Only one payout request should succeed");
        assertEquals(1, failCount.get(), "One payout request should fail due to insufficient balance");
    }
}
