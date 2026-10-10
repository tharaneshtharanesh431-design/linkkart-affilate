package com.kart.service.provider;

import com.kart.entity.User;
import com.kart.service.EmailProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Slf4j
public class MockEmailProvider implements EmailProvider {

    @Override
    public String sendEmail(User to, String subject, String htmlContent, String plainTextContent, String templateName, Long notificationId) {
        log.info("MOCK EMAIL PROVIDER: Sending email to {} with subject: {}", to.getEmail(), subject);
        
        // Mock successful delivery
        return "mock-" + UUID.randomUUID().toString();
    }
}
