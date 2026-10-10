package com.kart.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminApplicationResponse {
    private Long campaignId;
    private Long affiliateId;
    private String campaignName;
    private String merchantEmail;
    private String affiliateEmail;
    private String status;
    private LocalDateTime requestedDate;
}
