package com.kart.serviceImpl;

import com.kart.dto.fraud.FraudReviewRequest;
import com.kart.dto.fraud.FraudSignalResponse;
import com.kart.entity.*;
import com.kart.repository.ClickRepository;
import com.kart.repository.FraudSignalRepository;
import com.kart.repository.ConversionRepository;
import com.kart.service.FraudDetectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FraudDetectionServiceImpl implements FraudDetectionService {

    private final FraudSignalRepository fraudSignalRepository;
    private final ClickRepository clickRepository;
    private final ConversionRepository conversionRepository;

    @Value("${fraud.enabled:true}")
    private boolean fraudEnabled;

    @Value("${fraud.click-burst.threshold:50}")
    private int clickBurstThreshold;

    @Value("${fraud.click-burst.window-minutes:60}")
    private int clickBurstWindowMinutes;

    @Value("${fraud.payout-request.threshold:3}")
    private int payoutRequestThreshold;

    @Override
    @Transactional
    public void evaluateClick(Click click) {
        if (!fraudEnabled) return;

        // Detect CLICK_BURST
        LocalDateTime windowStart = LocalDateTime.now().minusMinutes(clickBurstWindowMinutes);
        long clickCount = clickRepository.countByIpHashAndClickedAtAfter(click.getIpHash(), windowStart);

        if (clickCount >= clickBurstThreshold) {
            boolean alreadyFlagged = fraudSignalRepository.existsByClickIdAndType(click.getId(), FraudSignalType.CLICK_BURST);
            if (!alreadyFlagged) {
                recordSignal(
                        click.getAffiliateLink().getAffiliate(),
                        click.getAffiliateLink().getCampaign().getOrganization(),
                        click,
                        null,
                        FraudSignalType.CLICK_BURST,
                        FraudSeverity.MEDIUM,
                        30,
                        "Unusually high click volume from IP hash within " + clickBurstWindowMinutes + " minutes (Count: " + clickCount + ")"
                );
            }
        }
        
        // Detect bot-like user agent
        String ua = click.getUserAgent() != null ? click.getUserAgent().toLowerCase() : "";
        if (ua.contains("bot") || ua.contains("crawler") || ua.contains("spider") || ua.contains("curl")) {
            boolean alreadyFlagged = fraudSignalRepository.existsByClickIdAndType(click.getId(), FraudSignalType.AUTOMATED_TRAFFIC);
            if (!alreadyFlagged) {
                recordSignal(
                        click.getAffiliateLink().getAffiliate(),
                        click.getAffiliateLink().getCampaign().getOrganization(),
                        click,
                        null,
                        FraudSignalType.AUTOMATED_TRAFFIC,
                        FraudSeverity.LOW,
                        20,
                        "Bot-like user agent detected: " + click.getUserAgent()
                );
            }
        }
    }

    @Override
    @Transactional
    public void evaluateConversion(Conversion conversion, String merchantSecret) {
        if (!fraudEnabled) return;

        // Anomaly: unusually high conversion amount
        if (conversion.getOrderAmount().compareTo(BigDecimal.valueOf(10000)) > 0) {
            recordSignal(
                    conversion.getAffiliateLink().getAffiliate(),
                    conversion.getAffiliateLink().getCampaign().getOrganization(),
                    null,
                    conversion,
                    FraudSignalType.SUSPICIOUS_CONVERSION_RATE,
                    FraudSeverity.HIGH,
                    50,
                    "Unusually high conversion amount: " + conversion.getOrderAmount()
            );
        }

        // Duplicate/Rapid conversions from same affiliate
        LocalDateTime windowStart = LocalDateTime.now().minusMinutes(60);
        long recentConversions = conversionRepository.countByAffiliateLink_Affiliate_IdAndConvertedAtAfter(
                conversion.getAffiliateLink().getAffiliate().getId(), windowStart);

        if (recentConversions > 20) {
            recordSignal(
                    conversion.getAffiliateLink().getAffiliate(),
                    conversion.getAffiliateLink().getCampaign().getOrganization(),
                    null,
                    conversion,
                    FraudSignalType.SUSPICIOUS_CONVERSION_RATE,
                    FraudSeverity.HIGH,
                    40,
                    "High conversion volume (" + recentConversions + " in 60 mins) for affiliate"
            );
        }
        
        Click click = clickRepository.findByTrackingId(conversion.getTrackingId()).orElse(null);
        if (click != null) {
            long timeDiff = java.time.Duration.between(click.getClickedAt(), conversion.getConvertedAt()).getSeconds();
            if (timeDiff < 10) {
                // Suspiciously fast conversion
                recordSignal(
                    conversion.getAffiliateLink().getAffiliate(),
                    conversion.getAffiliateLink().getCampaign().getOrganization(),
                    null,
                    conversion,
                    FraudSignalType.SUSPICIOUS_CONVERSION_RATE,
                    FraudSeverity.HIGH,
                    75,
                    "Suspiciously fast conversion"
                );
            }
        }
    }

    @Override
    @Transactional
    public void evaluatePayoutRequest(User affiliate, BigDecimal amount) {
        if (!fraudEnabled) return;

        // Check if there are open high severity signals
        if (hasHighRiskOpenSignals(affiliate)) {
            recordSignal(
                    affiliate,
                    null,
                    null,
                    null,
                    FraudSignalType.SUSPICIOUS_ACCOUNT_ACTIVITY,
                    FraudSeverity.HIGH,
                    50,
                    "Payout requested while high-risk fraud signals are OPEN"
            );
        }
    }

    @Override
    public void evaluateAccountActivity(User user, String action) {
        // Reserved for account activities (login, register, etc.)
    }

    @Override
    public List<FraudSignalResponse> getOpenSignals() {
        return fraudSignalRepository.findByStatusIn(List.of(FraudSignalStatus.OPEN, FraudSignalStatus.REVIEWING)).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<FraudSignalResponse> getSignalsByAffiliate(Long affiliateId) {
        return fraudSignalRepository.findByAffiliateId(affiliateId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FraudSignalResponse reviewSignal(Long signalId, FraudReviewRequest request, User admin) {
        FraudSignal signal = fraudSignalRepository.findById(signalId)
                .orElseThrow(() -> new RuntimeException("Fraud signal not found"));

        signal.setStatus(request.getStatus());
        signal.setReviewedAt(LocalDateTime.now());
        signal.setReviewedBy(admin);
        
        // Append review notes if provided
        if (request.getReviewNotes() != null && !request.getReviewNotes().isBlank()) {
            signal.setReason(signal.getReason() + " | Admin Note: " + request.getReviewNotes());
        }

        signal = fraudSignalRepository.save(signal);
        return toResponse(signal);
    }

    @Override
    public boolean hasHighRiskOpenSignals(User affiliate) {
        return fraudSignalRepository.findByAffiliateIdAndStatus(affiliate.getId(), FraudSignalStatus.OPEN).stream()
                .anyMatch(s -> s.getSeverity() == FraudSeverity.HIGH);
    }

    private void recordSignal(User affiliate, Organization organization, Click click, Conversion conversion,
                              FraudSignalType type, FraudSeverity severity, int score, String reason) {
        FraudSignal signal = FraudSignal.builder()
                .affiliate(affiliate)
                .organization(organization)
                .click(click)
                .conversion(conversion)
                .type(type)
                .severity(severity)
                .score(score)
                .reason(reason)
                .status(FraudSignalStatus.OPEN)
                .createdAt(LocalDateTime.now())
                .build();
        fraudSignalRepository.save(signal);
        log.warn("Fraud signal recorded: {} (Severity: {}) - {}", type, severity, reason);
    }

    private FraudSignalResponse toResponse(FraudSignal s) {
        return FraudSignalResponse.builder()
                .id(s.getId())
                .affiliateId(s.getAffiliate() != null ? s.getAffiliate().getId() : null)
                .affiliateEmail(s.getAffiliate() != null ? s.getAffiliate().getEmail() : null)
                .merchantId(s.getOrganization() != null ? s.getOrganization().getId() : null)
                .merchantEmail(s.getOrganization() != null ? s.getOrganization().getName() : null)
                .conversionId(s.getConversion() != null ? s.getConversion().getId() : null)
                .clickId(s.getClick() != null ? s.getClick().getId() : null)
                .type(s.getType())
                .severity(s.getSeverity())
                .status(s.getStatus())
                .score(s.getScore())
                .reason(s.getReason())
                .createdAt(s.getCreatedAt())
                .reviewedAt(s.getReviewedAt())
                .reviewedByEmail(s.getReviewedBy() != null ? s.getReviewedBy().getEmail() : null)
                .build();
    }
}
