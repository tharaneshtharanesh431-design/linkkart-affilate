package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.service.WebhookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Tag(name = "Payment Webhooks")
public class WebhookController {

    private final WebhookService webhookService;

    @PostMapping("/{provider}")
    @Operation(summary = "Handle incoming webhooks from payment providers")
    public ResponseEntity<String> handleWebhook(
            @PathVariable String provider,
            @RequestHeader(value = "X-Signature", required = false) String signature,
            @RequestBody String payload) {
        
        webhookService.processWebhook(provider, payload, signature);
        return ResponseEntity.ok("OK");
    }
}
