package com.kart.dto.feedback;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FeedbackRequest {
    @NotBlank
    private String message;

    private Integer rating;
}
