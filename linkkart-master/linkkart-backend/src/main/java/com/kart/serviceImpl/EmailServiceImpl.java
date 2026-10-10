package com.kart.serviceImpl;

import com.kart.entity.EmailDeliveryLog;
import com.kart.entity.EmailDeliveryStatus;
import com.kart.entity.User;
import com.kart.repository.EmailDeliveryLogRepository;
import com.kart.service.EmailProvider;
import com.kart.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final EmailProvider emailProvider;
    private final EmailDeliveryLogRepository deliveryLogRepository;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendCommissionApproved(User user, Long commissionId, Double amount, String orderId) {
        String subject = "Commission Approved";
        String content = String.format("Your commission of ₹%.2f for Order #%s has been approved.", amount, orderId);
        sendTrackedEmail(user, subject, content, content, "commission_approved", null);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendPayoutPaid(User user, Long payoutId, Double amount) {
        String subject = "Payout Paid";
        String content = String.format("Your payout of ₹%.2f has been marked as paid.", amount);
        sendTrackedEmail(user, subject, content, content, "payout_paid", null);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendSecurityNotification(User user, String eventDetails) {
        String subject = "Security Alert";
        String content = String.format("Security alert: %s", eventDetails);
        sendTrackedEmail(user, subject, content, content, "security_alert", null);
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendNotification(User user, String subject, String content) {
        sendTrackedEmail(user, subject, content, content, "general_notification", null);
    }
    
    private void sendTrackedEmail(User user, String subject, String htmlContent, String plainText, String templateName, Long notificationId) {
        EmailDeliveryLog deliveryLog = EmailDeliveryLog.builder()
                .user(user)
                .notificationId(notificationId)
                .templateName(templateName)
                .provider("MOCK")
                .status(EmailDeliveryStatus.PENDING)
                .attemptCount(1)
                .build();
                
        deliveryLog = deliveryLogRepository.save(deliveryLog);
        
        try {
            String messageId = emailProvider.sendEmail(user, subject, htmlContent, plainText, templateName, notificationId);
            deliveryLog.setProviderMessageId(messageId);
            deliveryLog.setStatus(EmailDeliveryStatus.SENT);
            deliveryLog.setSentAt(LocalDateTime.now());
        } catch (Exception e) {
            log.error("Email delivery failed", e);
            deliveryLog.setStatus(EmailDeliveryStatus.FAILED);
            deliveryLog.setLastError(e.getMessage());
        }
        
        deliveryLogRepository.save(deliveryLog);
    }
}
