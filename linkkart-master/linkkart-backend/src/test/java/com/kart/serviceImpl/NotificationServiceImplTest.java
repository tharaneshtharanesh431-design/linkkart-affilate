package com.kart.serviceImpl;

import com.kart.dto.notification.NotificationResponse;
import com.kart.entity.Notification;
import com.kart.entity.NotificationType;
import com.kart.entity.Role;
import com.kart.entity.User;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceImplTest {



    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationServiceImpl notificationService;

    private User testUser;
    private Notification testNotification;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setId(1L);
        role.setName("AFFILIATE");

        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("affiliate@test.com");
        testUser.setRole(role);

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(testUser, null, List.of())
        );

        testNotification = Notification.builder()
                .id(100L)
                .user(testUser)
                .type(NotificationType.SYSTEM)
                .title("Test Title")
                .message("Test Message")
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void createNotification_success() {
        notificationService.createNotification(testUser, NotificationType.SYSTEM, "Title", "Message", null, null);

        ArgumentCaptor<Notification> captor = ArgumentCaptor.forClass(Notification.class);
        verify(notificationRepository).save(captor.capture());

        Notification saved = captor.getValue();
        assertEquals(testUser, saved.getUser());
        assertEquals(NotificationType.SYSTEM, saved.getType());
        assertEquals("Title", saved.getTitle());
        assertEquals("Message", saved.getMessage());
        assertFalse(saved.getIsRead());
    }

    @Test
    void getNotificationsForCurrentUser_success() {
        Page<Notification> page = new PageImpl<>(List.of(testNotification));
        when(notificationRepository.findByUserOrderByCreatedAtDesc(eq(testUser), any(PageRequest.class)))
                .thenReturn(page);

        Page<NotificationResponse> result = notificationService.getNotificationsForCurrentUser(PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals(testNotification.getId(), result.getContent().get(0).getId());
    }

    @Test
    void getUnreadCountForCurrentUser_success() {
        when(notificationRepository.countByUserAndIsReadFalse(testUser)).thenReturn(5L);

        long count = notificationService.getUnreadCountForCurrentUser();

        assertEquals(5L, count);
    }

    @Test
    void markAsRead_success() {
        when(notificationRepository.findByIdAndUser(100L, testUser)).thenReturn(Optional.of(testNotification));
        when(notificationRepository.save(any(Notification.class))).thenAnswer(i -> i.getArguments()[0]);

        NotificationResponse response = notificationService.markAsRead(100L);

        assertTrue(response.getIsRead());
        assertNotNull(response.getReadAt());
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void markAsRead_notFound_throwsException() {
        when(notificationRepository.findByIdAndUser(100L, testUser)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> notificationService.markAsRead(100L));
    }

    @Test
    void markAllAsRead_success() {
        notificationService.markAllAsRead();
        verify(notificationRepository).markAllAsReadByUser(eq(testUser), any(LocalDateTime.class));
    }
    
    @Test
    void deleteNotification_success() {
        when(notificationRepository.findByIdAndUser(100L, testUser)).thenReturn(Optional.of(testNotification));
        
        notificationService.deleteNotification(100L);
        verify(notificationRepository).delete(testNotification);
    }
}
