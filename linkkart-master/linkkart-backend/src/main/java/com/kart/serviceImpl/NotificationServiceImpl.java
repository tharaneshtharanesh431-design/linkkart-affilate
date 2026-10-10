package com.kart.serviceImpl;

import com.kart.dto.notification.NotificationResponse;
import com.kart.entity.Notification;
import com.kart.entity.NotificationType;
import com.kart.entity.User;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.NotificationRepository;
import com.kart.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public void createNotification(User user, NotificationType type, String title, String message, String referenceType, Long referenceId) {
        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void createNotificationIfNotExists(User user, NotificationType type, String title, String message, String referenceType, Long referenceId) {
        if (referenceType != null && referenceId != null) {
            boolean exists = notificationRepository.existsByReferenceTypeAndReferenceIdAndType(referenceType, referenceId, type);
            if (exists) {
                return;
            }
        }
        createNotification(user, type, title, message, referenceType, referenceId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotificationsForCurrentUser(Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(currentUser, pageable);
        return notifications.map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCountForCurrentUser() {
        User currentUser = getCurrentUser();
        return notificationRepository.countByUserAndIsReadFalse(currentUser);
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(Long notificationId) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepository.findByIdAndUser(notificationId, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found or access denied"));
        
        if (!notification.getIsRead()) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            notification = notificationRepository.save(notification);
        }
        
        return mapToResponse(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead() {
        User currentUser = getCurrentUser();
        notificationRepository.markAllAsReadByUser(currentUser, LocalDateTime.now());
    }

    @Override
    @Transactional
    public void deleteNotification(Long notificationId) {
        User currentUser = getCurrentUser();
        Notification notification = notificationRepository.findByIdAndUser(notificationId, currentUser)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found or access denied"));
        notificationRepository.delete(notification);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .referenceType(notification.getReferenceType())
                .referenceId(notification.getReferenceId())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .readAt(notification.getReadAt())
                .build();
    }
}
