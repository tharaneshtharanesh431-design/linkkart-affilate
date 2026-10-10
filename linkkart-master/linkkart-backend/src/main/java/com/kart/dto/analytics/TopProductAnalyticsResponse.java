package com.kart.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopProductAnalyticsResponse {
    private String productName;
    private String merchantName;
    private long clicks;
    private long conversions;
    private BigDecimal earnings;
    private double conversionRate;
}
