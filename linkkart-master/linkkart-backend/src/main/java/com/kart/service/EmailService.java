package com.kart.service;

import com.kart.entity.User;

public interface EmailService {
    void sendCommissionApproved(User user, Long commissionId, Double amount, String orderId);
    void sendPayoutPaid(User user, Long payoutId, Double amount);
    void sendSecurityNotification(User user, String eventDetails);
    void sendNotification(User user, String subject, String content);
}
