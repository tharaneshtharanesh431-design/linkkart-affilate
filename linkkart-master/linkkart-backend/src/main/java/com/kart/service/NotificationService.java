package com.kart.service;

import com.kart.dto.notification.NotificationResponse;
import com.kart.entity.NotificationType;
import com.kart.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    void createNotification(User user, NotificationType type, String title, String message, String referenceType, Long referenceId);

    void createNotificationIfNotExists(User user, NotificationType type, String title, String message, String referenceType, Long referenceId);

    Page<NotificationResponse> getNotificationsForCurrentUser(Pageable pageable);

    long getUnreadCountForCurrentUser();

    NotificationResponse markAsRead(Long notificationId);

    void markAllAsRead();
    
    void deleteNotification(Long notificationId);
}
