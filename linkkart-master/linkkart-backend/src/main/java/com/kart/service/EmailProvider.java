package com.kart.service;

import com.kart.entity.User;

public interface EmailProvider {
    /**
     * Sends an email using the underlying provider.
     * @param to the recipient user
     * @param subject the subject of the email
     * @param htmlContent the HTML content
     * @param plainTextContent the fallback plain text content
     * @param templateName the internal name of the template used
     * @param notificationId optional notification ID for tracking
     * @return provider's message ID if successful
     */
    String sendEmail(User to, String subject, String htmlContent, String plainTextContent, String templateName, Long notificationId);
}
