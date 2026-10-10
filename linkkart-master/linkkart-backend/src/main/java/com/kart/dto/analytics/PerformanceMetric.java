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
public class PerformanceMetric {
    private Long id;
    private String name;
    private long clicks;
    private long conversions;
    private double conversionRate;
    private BigDecimal sales;
    private BigDecimal earnings;
}
