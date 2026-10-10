package com.kart.dto.ai;

import lombok.Data;

@Data
public class MerchantProductContentRequest {
    private String productName;
    private String features;
    private String tone;
}
