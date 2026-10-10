# PHASE 7 PAYMENT PROVIDER INTEGRATION

## EXTERNAL PAYMENT PROVIDER: NOT SELECTED

At this time, no specific external payment provider (e.g., Stripe, Razorpay, PayPal) has been selected. 
Instead, a Provider-Independent abstraction has been implemented with a `MockPaymentProviderAdapter`.

### Provider Abstraction
The core abstraction is defined in `PaymentProvider`:

```java
public interface PaymentProvider {
    String submitPayout(Payout payout, PaymentMethod paymentMethod);
    boolean verifyWebhookSignature(String payload, String signature);
    String getProviderName();
}
```

### Provider Configuration
Providers are injected as a list of implementations. In `PayoutServiceImpl.processPayout`, a provider is selected by its name (currently hardcoded to `MOCK` for tests). When a real provider is implemented, it will be injected here.

### Provider Adapter Contract
An adapter must:
1. Translate our internal `Payout` and `PaymentMethod` to the provider's API payload.
2. Communicate with the external API over HTTP.
3. Return an external reference string (the Provider's Payout/Transfer ID).
4. Do not leak Provider SDK classes into internal LinkKart logic.

### Mock Provider
We have implemented `MockPaymentProviderAdapter` which mimics an async API. It generates a mock `external_reference` ID.

### External References
The `Payout` entity has a new `externalReference` column.
Once a Payout goes to `PROCESSING`, this ID is immutable and used to reconcile asynchronous webhooks.

### Webhook Contract
Webhooks are handled by `WebhookController` (`/api/webhooks/{provider}`).
1. The `provider` path variable determines which `PaymentProvider` adapter verifies the signature.
2. Idempotency is enforced by tracking the provider's event ID in `webhook_events`.
3. Valid `payout.paid` or `payout.failed` payloads will transition the Payout and Ledger accordingly.
