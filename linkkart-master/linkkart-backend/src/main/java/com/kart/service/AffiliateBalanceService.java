package com.kart.service;

import com.kart.dto.payout.AffiliateBalanceResponse;
import com.kart.entity.User;

public interface AffiliateBalanceService {
    AffiliateBalanceResponse calculateBalance(User affiliate);
}
