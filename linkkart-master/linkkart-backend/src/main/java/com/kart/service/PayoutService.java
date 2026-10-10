package com.kart.service;

import com.kart.dto.payout.AdminPayoutResponse;
import com.kart.dto.payout.AffiliateBalanceResponse;
import com.kart.dto.payout.PayoutResponse;
import com.kart.dto.payout.PayoutRequest;

import java.util.List;

public interface PayoutService {
    AffiliateBalanceResponse getMyBalance();
    List<PayoutResponse> getMyPayouts();
    PayoutResponse requestPayout(PayoutRequest request);

    List<AdminPayoutResponse> getAllPayouts();
    AdminPayoutResponse processPayout(Long payoutId);
    AdminPayoutResponse markPaid(Long payoutId);
    AdminPayoutResponse rejectPayout(Long payoutId, String reason);
    AdminPayoutResponse failPayout(Long payoutId, String reason);
}
