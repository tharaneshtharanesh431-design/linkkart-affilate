package com.kart.repository;

import com.kart.entity.ChatHistory;
import com.kart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByUserOrderByCreatedAtDesc(User user);
}
