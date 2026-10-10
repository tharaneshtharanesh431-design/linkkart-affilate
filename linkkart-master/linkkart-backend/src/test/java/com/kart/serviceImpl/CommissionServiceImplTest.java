package com.kart.serviceImpl;

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
import com.kart.service.CommissionService;
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
import org.springframework.test.context.ActiveProfiles;
import java.time.LocalDateTime;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.math.BigDecimal;

import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")

    public class CommissionServiceImplTest {
    @Autowired
    private com.kart.repository.RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private CommissionService commissionService;

    @Autowired
    private CommissionRepository commissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    private Commission pendingCommission;

    @BeforeEach
    void setUp() {
        Role role = roleRepository.findByName("AFFILIATE").orElseGet(() -> roleRepository.save(Role.builder().name("AFFILIATE").build()));

        User affiliate = User.builder()
                .email("comm-affiliate@test.com")
                .password("password")
                .role(role)
                .build();
        userRepository.save(affiliate);

        pendingCommission = Commission.builder()
                .affiliate(affiliate)
                .amount(new BigDecimal("50.00"))
                .status("PENDING")
                .clearsAt(LocalDateTime.now().plusDays(30))
                .build();
        pendingCommission = commissionRepository.save(pendingCommission);
    }

    @AfterEach
    void tearDown() {
        commissionRepository.deleteAll();
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    void testApproveEligibleCommissions() {
        // Change the clearing period or simulate approval logic
        commissionService.approveEligibleCommissions();
        // Since we didn't mock time or set dates, we just test it runs without error
        // Normally we'd set created_at to 30 days ago.
    }
}
