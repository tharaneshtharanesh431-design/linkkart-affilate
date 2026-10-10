package com.kart.scheduler;

import com.kart.service.CommissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CommissionClearingScheduler {

    private final CommissionService commissionService;

    // Run every 60 seconds (configurable)
    @Scheduled(fixedRateString = "${app.commission.clearing-interval-ms:60000}")
    public void clearCommissions() {
        try {
            commissionService.approveEligibleCommissions();
        } catch (Exception e) {
            log.error("Error occurred while clearing commissions: ", e);
        }
    }
}
