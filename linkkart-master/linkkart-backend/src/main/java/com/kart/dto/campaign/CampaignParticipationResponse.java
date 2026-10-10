package com.kart.dto.campaign;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CampaignParticipationResponse {
    private Long campaignId;
    private Long affiliateId;
    private String campaignTitle;
    private String affiliateName;
    private String status;
    private LocalDateTime createdAt;
}
