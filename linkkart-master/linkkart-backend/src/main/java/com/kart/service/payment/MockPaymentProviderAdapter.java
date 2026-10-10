package com.kart.service.payment;

import com.kart.entity.PaymentMethod;
import com.kart.entity.Payout;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class MockPaymentProviderAdapter implements PaymentProvider {

    @Override
    public String submitPayout(Payout payout, PaymentMethod paymentMethod) {
        // In a real provider, this would do an HTTP request to Stripe/Razorpay
        // and return the Provider's Transfer/Payout ID.
        return "mock_transfer_" + UUID.randomUUID().toString();
    }

    @Override
    public boolean verifyWebhookSignature(String payload, String signature) {
        // Mock validation
        return "mock_valid_signature".equals(signature);
    }

    @Override
    public String getProviderName() {
        return "MOCK";
    }
}
