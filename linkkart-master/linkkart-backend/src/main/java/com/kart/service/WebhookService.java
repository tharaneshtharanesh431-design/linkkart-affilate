package com.kart.service;

public interface WebhookService {
    void processWebhook(String providerName, String payload, String signature);
}
