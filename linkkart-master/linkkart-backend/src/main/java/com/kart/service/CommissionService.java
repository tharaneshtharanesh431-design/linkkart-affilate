package com.kart.service;

import com.kart.dto.commission.AffiliateCommissionResponse;
import com.kart.dto.commission.CommissionSummaryResponse;

import java.util.List;

public interface CommissionService {
    List<AffiliateCommissionResponse> getMyCommissions();
    CommissionSummaryResponse getMyCommissionSummary();
    void approveEligibleCommissions();
}
