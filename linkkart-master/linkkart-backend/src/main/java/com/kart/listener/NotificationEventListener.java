package com.kart.listener;

import com.kart.event.*;
import com.kart.entity.User;
import com.kart.entity.NotificationType;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.UserRepository;
import com.kart.service.EmailService;
import com.kart.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final NotificationService notificationService;
    private final EmailService emailService;
    private final UserRepository userRepository;

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePayoutRequested(PayoutRequestedEvent event) {
        log.info("Handling PayoutRequestedEvent for payout {}", event.getPayoutId());
        User affiliate = getUser(event.getAffiliateId());
        notificationService.createNotificationIfNotExists(
            affiliate,
            NotificationType.PAYOUT_REQUESTED,
            "Payout Requested",
            String.format("Your payout request for ₹%.2f has been received.", event.getAmount()),
            "PAYOUT",
            event.getPayoutId()
        );
        // Note: Can add email triggering here later
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePayoutProcessing(PayoutProcessingEvent event) {
        User affiliate = getUser(event.getAffiliateId());
        notificationService.createNotificationIfNotExists(
            affiliate,
            NotificationType.PAYOUT_PROCESSING,
            "Payout Processing",
            String.format("Your payout of ₹%.2f is now being processed.", event.getAmount()),
            "PAYOUT",
            event.getPayoutId()
        );
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePayoutPaid(PayoutPaidEvent event) {
        User affiliate = getUser(event.getAffiliateId());
        notificationService.createNotificationIfNotExists(
            affiliate,
            NotificationType.PAYOUT_PAID,
            "Payout Paid",
            String.format("Your payout of ₹%.2f has been successfully paid.", event.getAmount()),
            "PAYOUT",
            event.getPayoutId()
        );
        
        try {
            emailService.sendPayoutPaid(affiliate, event.getPayoutId(), event.getAmount().doubleValue());
        } catch (Exception e) {
            log.error("Failed to send payout paid email asynchronously for payout {}", event.getPayoutId(), e);
        }
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePayoutRejected(PayoutRejectedEvent event) {
        User affiliate = getUser(event.getAffiliateId());
        notificationService.createNotificationIfNotExists(
            affiliate,
            NotificationType.PAYOUT_REJECTED,
            "Payout Rejected",
            String.format("Your payout of ₹%.2f was rejected. Reason: %s", event.getAmount(), event.getReason()),
            "PAYOUT",
            event.getPayoutId()
        );
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePayoutFailed(PayoutFailedEvent event) {
        User affiliate = getUser(event.getAffiliateId());
        notificationService.createNotificationIfNotExists(
            affiliate,
            NotificationType.PAYOUT_FAILED,
            "Payout Failed",
            String.format("Your payout of ₹%.2f failed to process. Reason: %s", event.getAmount(), event.getReason()),
            "PAYOUT",
            event.getPayoutId()
        );
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCommissionApproved(CommissionApprovedEvent event) {
        User affiliate = getUser(event.getAffiliateId());
        notificationService.createNotificationIfNotExists(
            affiliate,
            NotificationType.COMMISSION_APPROVED,
            "Commission Approved",
            String.format("Your commission of ₹%.2f has been approved.", event.getAmount()),
            "COMMISSION",
            event.getCommissionId()
        );
        
        try {
            emailService.sendCommissionApproved(affiliate, event.getCommissionId(), event.getAmount().doubleValue(), event.getConversionId());
        } catch (Exception e) {
            log.error("Failed to send commission approved email asynchronously for commission {}", event.getCommissionId(), e);
        }
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handlePasswordResetRequested(PasswordResetRequestedEvent event) {
        log.info("Handling PasswordResetRequestedEvent for user {}", event.getEmail());
        User user = getUser(event.getUserId());
        
        try {
            String subject = "Password Reset Request";
            String content = "Use the following token to reset your password: " + event.getResetToken();
            // Since EmailService doesn't have sendPasswordReset yet, I will use sendNotification for now or add it.
            // Wait, sendNotification takes user, subject, content. Let's use that!
            emailService.sendNotification(user, subject, content);
        } catch (Exception e) {
            log.error("Failed to send password reset email", e);
        }
    }
}
