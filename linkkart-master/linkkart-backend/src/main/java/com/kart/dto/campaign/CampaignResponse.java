package com.kart.dto.campaign;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal commissionRate;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Long merchantId;
    private String merchantName;
    private BigDecimal budget;
    private LocalDateTime createdAt;
}
