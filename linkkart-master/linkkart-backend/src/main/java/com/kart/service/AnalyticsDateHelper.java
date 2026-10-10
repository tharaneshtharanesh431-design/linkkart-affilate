package com.kart.service;

import com.kart.dto.analytics.AnalyticsRequest;
import com.kart.dto.analytics.DateRange;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;

@Component
public class AnalyticsDateHelper {

    public LocalDateTime[] getStartAndEndDates(AnalyticsRequest request) {
        LocalDateTime start = null;
        LocalDateTime end = LocalDateTime.now();

        if (request.getRange() == null) {
            request.setRange(DateRange.LAST_30_DAYS);
        }

        switch (request.getRange()) {
            case TODAY:
                start = LocalDate.now().atStartOfDay();
                end = LocalDate.now().atTime(LocalTime.MAX);
                break;
            case LAST_7_DAYS:
                start = LocalDate.now().minusDays(6).atStartOfDay();
                end = LocalDate.now().atTime(LocalTime.MAX);
                break;
            case LAST_30_DAYS:
                start = LocalDate.now().minusDays(29).atStartOfDay();
                end = LocalDate.now().atTime(LocalTime.MAX);
                break;
            case THIS_MONTH:
                start = LocalDate.now().with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
                end = LocalDate.now().atTime(LocalTime.MAX);
                break;
            case LAST_MONTH:
                start = LocalDate.now().minusMonths(1).with(TemporalAdjusters.firstDayOfMonth()).atStartOfDay();
                end = LocalDate.now().minusMonths(1).with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX);
                break;
            case LAST_3_MONTHS:
                start = LocalDate.now().minusMonths(3).atStartOfDay();
                end = LocalDate.now().atTime(LocalTime.MAX);
                break;
            case LAST_6_MONTHS:
                start = LocalDate.now().minusMonths(6).atStartOfDay();
                end = LocalDate.now().atTime(LocalTime.MAX);
                break;
            case THIS_YEAR:
                start = LocalDate.now().with(TemporalAdjusters.firstDayOfYear()).atStartOfDay();
                end = LocalDate.now().atTime(LocalTime.MAX);
                break;
            case CUSTOM:
                if (request.getStartDate() != null && request.getEndDate() != null) {
                    start = request.getStartDate().atStartOfDay();
                    end = request.getEndDate().atTime(LocalTime.MAX);
                } else {
                    start = LocalDate.now().minusDays(30).atStartOfDay();
                    end = LocalDate.now().atTime(LocalTime.MAX);
                }
                break;
        }

        return new LocalDateTime[]{start, end};
    }
}
