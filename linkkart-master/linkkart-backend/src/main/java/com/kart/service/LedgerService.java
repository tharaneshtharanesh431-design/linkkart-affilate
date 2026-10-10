package com.kart.service;

import com.kart.entity.Commission;
import com.kart.entity.Payout;

public interface LedgerService {
    void recordCommissionAccrual(Commission commission);
    void recordCommissionReversal(Commission commission);
    void reservePayout(Payout payout);
    void recordPayoutPaid(Payout payout);
    void releasePayout(Payout payout);
}
