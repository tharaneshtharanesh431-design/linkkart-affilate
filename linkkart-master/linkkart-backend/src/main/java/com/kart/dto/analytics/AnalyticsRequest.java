package com.kart.dto.analytics;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AnalyticsRequest {
    private DateRange range;
    private LocalDate startDate;
    private LocalDate endDate;
}
