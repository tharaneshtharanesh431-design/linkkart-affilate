package com.kart.dto.ai;

import lombok.Data;

@Data
public class CampaignInsightsRequest {
    private Long campaignId;
    private String dateRange;
}
