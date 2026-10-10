package com.kart.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCampaignResponse {
    private Long id;
    private String name;
    private String merchantEmail;
    private String commissionType;
    private BigDecimal commissionRate;
    private int clearingPeriodDays;
    private String status;
    private LocalDateTime createdAt;
    private long productCount;
    private long affiliateCount;
}
