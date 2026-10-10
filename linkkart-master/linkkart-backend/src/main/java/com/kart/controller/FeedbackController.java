package com.kart.controller;

import com.kart.constants.RoleName;
import com.kart.dto.ApiResponse;
import com.kart.dto.feedback.FeedbackRequest;
import com.kart.dto.feedback.FeedbackResponse;
import com.kart.entity.Feedback;
import com.kart.entity.User;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.FeedbackRepository;
import com.kart.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@Tag(name = "Feedback")
public class FeedbackController {
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Submit feedback")
    public ResponseEntity<ApiResponse<FeedbackResponse>> submit(@Valid @RequestBody FeedbackRequest request) {
        Feedback feedback = Feedback.builder()
                .content(request.getMessage())
                .build();
        feedbackRepository.save(feedback);
        return ResponseEntity.ok(ApiResponse.success("Feedback submitted successfully", FeedbackResponse.builder()
                .id(feedback.getId())
                .message(feedback.getContent())
                .build()));
    }

    @GetMapping
    @Operation(summary = "List feedback")
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> list() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));

        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole().getName());
        if (!isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException("Only admins can view feedback logs");
        }

        List<FeedbackResponse> response = feedbackRepository.findAll().stream().map(f -> FeedbackResponse.builder()
                .id(f.getId())
                .message(f.getContent())
                .build()).toList();
        return ResponseEntity.ok(ApiResponse.success("Feedback fetched successfully", response));
    }
}
