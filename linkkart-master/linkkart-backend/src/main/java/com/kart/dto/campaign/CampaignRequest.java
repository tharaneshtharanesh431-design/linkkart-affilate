package com.kart.dto.campaign;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CampaignRequest {
    @NotBlank
    private String title;

    private String description;

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal commissionRate;

    private LocalDate startDate;
    private LocalDate endDate;

    private String status;

    private Long categoryId;

    private BigDecimal budget;

    private java.util.List<Long> productIds;
}
