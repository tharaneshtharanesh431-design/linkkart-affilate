package com.kart.dto.ai;

import lombok.Data;

@Data
public class AffiliateContentRequest {
    private Long productId;
    private String platform;
    private String tone;
}
