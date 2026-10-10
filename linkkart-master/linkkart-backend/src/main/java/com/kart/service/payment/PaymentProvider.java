package com.kart.service.payment;

import com.kart.entity.PaymentMethod;
import com.kart.entity.Payout;

public interface PaymentProvider {
    /**
     * Submit a payout to the external payment provider.
     * Returns an external reference ID.
     */
    String submitPayout(Payout payout, PaymentMethod paymentMethod);
    
    /**
     * Verifies the webhook signature.
     */
    boolean verifyWebhookSignature(String payload, String signature);
    
    /**
     * The name of the provider, e.g. "MOCK", "STRIPE".
     */
    String getProviderName();
}
