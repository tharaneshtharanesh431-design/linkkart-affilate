package com.kart.service;

import com.kart.entity.Click;
import com.kart.entity.Conversion;
import com.kart.entity.Payout;
import com.kart.entity.User;
import com.kart.dto.fraud.FraudSignalResponse;
import com.kart.dto.fraud.FraudReviewRequest;

import java.util.List;

public interface FraudDetectionService {
    
    void evaluateClick(Click click);
    
    void evaluateConversion(Conversion conversion, String merchantSecret);
    
    void evaluatePayoutRequest(User affiliate, java.math.BigDecimal amount);
    
    void evaluateAccountActivity(User user, String action);
    
    List<FraudSignalResponse> getOpenSignals();
    
    List<FraudSignalResponse> getSignalsByAffiliate(Long affiliateId);
    
    FraudSignalResponse reviewSignal(Long signalId, FraudReviewRequest request, User admin);
    
    boolean hasHighRiskOpenSignals(User affiliate);
}
