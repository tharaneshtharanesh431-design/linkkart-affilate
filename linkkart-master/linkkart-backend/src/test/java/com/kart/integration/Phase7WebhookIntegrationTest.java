package com.kart.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kart.entity.PaymentMethod;
import com.kart.entity.Payout;
import com.kart.entity.User;
import com.kart.repository.PaymentMethodRepository;
import com.kart.repository.PayoutRepository;
import com.kart.repository.UserRepository;
import com.kart.repository.WebhookEventRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class Phase7WebhookIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PayoutRepository payoutRepository;

    @Autowired
    private WebhookEventRepository webhookEventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentMethodRepository paymentMethodRepository;

    @Autowired
    private com.kart.repository.RoleRepository roleRepository;

    private User affiliate;
    private Payout payout;

    @BeforeEach
    void setUp() {
        // Cleanup
        payoutRepository.deleteAll();
        webhookEventRepository.deleteAll();
        paymentMethodRepository.deleteAll();
        userRepository.deleteAll();

        com.kart.entity.Role role = roleRepository.findByName("AFFILIATE")
            .orElseGet(() -> roleRepository.save(com.kart.entity.Role.builder().name("AFFILIATE").build()));

        affiliate = User.builder()
                .email("affiliate7@test.com")
                .password("password")
                .role(role)
                .build();
        userRepository.save(affiliate);

        payout = Payout.builder()
                .affiliate(affiliate)
                .amount(new BigDecimal("100.00"))
                .status("PROCESSING")
                .externalReference("mock_ref_123")
                .requestedAt(LocalDateTime.now())
                .build();
        payoutRepository.save(payout);
    }

    @AfterEach
    void tearDown() {
        payoutRepository.deleteAll();
        webhookEventRepository.deleteAll();
        paymentMethodRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testWebhook_ValidSignature_Paid() throws Exception {
        String payload = "{\"external_event_id\":\"evt_1\",\"event_type\":\"payout.paid\",\"reference\":\"mock_ref_123\"}";

        mockMvc.perform(post("/api/webhooks/MOCK")
                .header("X-Signature", "mock_valid_signature")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk());

        Payout updatedPayout = payoutRepository.findById(payout.getId()).get();
        assertEquals("PAID", updatedPayout.getStatus());

        assertEquals(1, webhookEventRepository.count());
    }

    @Test
    void testWebhook_InvalidSignature() throws Exception {
        String payload = "{\"external_event_id\":\"evt_2\",\"event_type\":\"payout.paid\",\"reference\":\"mock_ref_123\"}";

        mockMvc.perform(post("/api/webhooks/MOCK")
                .header("X-Signature", "invalid")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testWebhook_Idempotency() throws Exception {
        String payload = "{\"external_event_id\":\"evt_3\",\"event_type\":\"payout.failed\",\"reference\":\"mock_ref_123\"}";

        mockMvc.perform(post("/api/webhooks/MOCK")
                .header("X-Signature", "mock_valid_signature")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk());

        // Send duplicate
        mockMvc.perform(post("/api/webhooks/MOCK")
                .header("X-Signature", "mock_valid_signature")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk());

        // Should only be processed once
        assertEquals(1, webhookEventRepository.count());
    }
}
