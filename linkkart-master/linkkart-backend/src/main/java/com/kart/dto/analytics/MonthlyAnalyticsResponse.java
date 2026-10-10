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
public class MonthlyAnalyticsResponse {
    private String month;
    private long clicks;
    private long conversions;
    private BigDecimal earnings;
}
