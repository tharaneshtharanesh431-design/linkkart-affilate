package com.kart.serviceImpl;

import com.kart.dto.payout.AdminPayoutResponse;
import com.kart.dto.payout.AffiliateBalanceResponse;
import com.kart.dto.payout.PayoutRequest;
import com.kart.dto.payout.PayoutResponse;
import com.kart.entity.AffiliateProfile;
import com.kart.entity.Payout;
import com.kart.entity.User;
import com.kart.exception.BadRequestException;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.AffiliateProfileRepository;
import com.kart.repository.PayoutRepository;
import com.kart.repository.UserRepository;
import com.kart.service.AffiliateBalanceService;
import com.kart.service.PayoutService;
import com.kart.event.*;
import org.springframework.context.ApplicationEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayoutServiceImpl implements PayoutService {

    private final PayoutRepository payoutRepository;
    private final AffiliateBalanceService affiliateBalanceService;
    private final UserRepository userRepository;
    private final AffiliateProfileRepository affiliateProfileRepository;
    private final ApplicationEventPublisher applicationEventPublisher;
    private final com.kart.service.FraudDetectionService fraudDetectionService;
    private final com.kart.service.LedgerService ledgerService;
    private final com.kart.service.PaymentMethodService paymentMethodService;
    private final java.util.List<com.kart.service.payment.PaymentProvider> paymentProviders;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    @Override
    public AffiliateBalanceResponse getMyBalance() {
        User affiliate = getAuthenticatedUser();
        return affiliateBalanceService.calculateBalance(affiliate);
    }

    @Override
    public List<PayoutResponse> getMyPayouts() {
        User affiliate = getAuthenticatedUser();
        return payoutRepository.findByAffiliateOrderByRequestedAtDesc(affiliate).stream()
                .map(this::toPayoutResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PayoutResponse requestPayout(PayoutRequest request) {
        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Payout amount must be greater than zero");
        }

        User affiliate = getAuthenticatedUser();
        // Lock the user record to prevent concurrent payout requests from exceeding balance
        affiliate = userRepository.findByIdWithLock(affiliate.getId()).orElse(affiliate);
        AffiliateBalanceResponse balance = affiliateBalanceService.calculateBalance(affiliate);

        if (request.getAmount().compareTo(balance.getMinimumPayout()) < 0) {
            throw new BadRequestException("Minimum payout amount is " + balance.getMinimumPayout());
        }

        if (request.getAmount().compareTo(balance.getAvailableBalance()) > 0) {
            throw new BadRequestException("Insufficient available balance");
        }

        com.kart.entity.PaymentMethod pm = null;
        if (request.getPaymentMethodId() != null) {
            pm = paymentMethodService.getPaymentMethodEntity(request.getPaymentMethodId());
            if (!pm.getAffiliate().getId().equals(affiliate.getId()) || !pm.getIsActive()) {
                throw new BadRequestException("Invalid or inactive payment method");
            }
        }

        Payout payout = Payout.builder()
                .affiliate(affiliate)
                .amount(request.getAmount())
                .status("REQUESTED")
                .paymentMethod(pm)
                .requestedAt(LocalDateTime.now())
                .build();

        payout = payoutRepository.save(payout);
        ledgerService.reservePayout(payout);
        
        // Evaluate for payout fraud/abuse
        fraudDetectionService.evaluatePayoutRequest(affiliate, request.getAmount());
        
        applicationEventPublisher.publishEvent(PayoutRequestedEvent.builder()
                .payoutId(payout.getId())
                .affiliateId(affiliate.getId())
                .amount(payout.getAmount())
                .timestamp(LocalDateTime.now())
                .build());
        
        return toPayoutResponse(payout);
    }

    @Override
    public List<AdminPayoutResponse> getAllPayouts() {
        return payoutRepository.findAllByOrderByRequestedAtDesc().stream()
                .map(this::toAdminPayoutResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AdminPayoutResponse processPayout(Long payoutId) {
        Payout payout = getPayout(payoutId);
        if (!"REQUESTED".equals(payout.getStatus())) {
            throw new BadRequestException("Payout is not in REQUESTED state");
        }
        
        // Find mock provider for Phase 7 abstraction
        com.kart.service.payment.PaymentProvider provider = paymentProviders.stream()
                .filter(p -> p.getProviderName().equalsIgnoreCase("MOCK"))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("No payment provider configured"));

        String externalRef = provider.submitPayout(payout, payout.getPaymentMethod());
        
        payout.setExternalReference(externalRef);
        payout.setStatus("PROCESSING");
        payout = payoutRepository.save(payout);
        
        applicationEventPublisher.publishEvent(PayoutProcessingEvent.builder()
                .payoutId(payout.getId())
                .affiliateId(payout.getAffiliate().getId())
                .amount(payout.getAmount())
                .timestamp(LocalDateTime.now())
                .build());
        
        return toAdminPayoutResponse(payout);
    }

    @Override
    @Transactional
    public AdminPayoutResponse markPaid(Long payoutId) {
        Payout payout = getPayout(payoutId);
        if (!"PROCESSING".equals(payout.getStatus())) {
            throw new BadRequestException("Payout must be PROCESSING to be marked as PAID");
        }
        payout.setStatus("PAID");
        payout.setProcessedAt(LocalDateTime.now());
        payout = payoutRepository.save(payout);
        ledgerService.recordPayoutPaid(payout);
        
        applicationEventPublisher.publishEvent(PayoutPaidEvent.builder()
                .payoutId(payout.getId())
                .affiliateId(payout.getAffiliate().getId())
                .amount(payout.getAmount())
                .timestamp(LocalDateTime.now())
                .build());
        
        return toAdminPayoutResponse(payout);
    }

    @Override
    @Transactional
    public AdminPayoutResponse rejectPayout(Long payoutId, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new BadRequestException("Rejection reason is required");
        }
        Payout payout = getPayout(payoutId);
        if (!"REQUESTED".equals(payout.getStatus())) {
            throw new BadRequestException("Only REQUESTED payouts can be REJECTED");
        }
        payout.setStatus("REJECTED");
        payout.setRejectionReason(reason);
        payout.setProcessedAt(LocalDateTime.now());
        payout = payoutRepository.save(payout);
        ledgerService.releasePayout(payout);
        
        applicationEventPublisher.publishEvent(PayoutRejectedEvent.builder()
                .payoutId(payout.getId())
                .affiliateId(payout.getAffiliate().getId())
                .amount(payout.getAmount())
                .reason(reason)
                .timestamp(LocalDateTime.now())
                .build());
        
        return toAdminPayoutResponse(payout);
    }

    @Override
    @Transactional
    public AdminPayoutResponse failPayout(Long payoutId, String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new BadRequestException("Failure reason is required");
        }
        Payout payout = getPayout(payoutId);
        if (!"PROCESSING".equals(payout.getStatus())) {
            throw new BadRequestException("Only PROCESSING payouts can be FAILED");
        }
        payout.setStatus("FAILED");
        payout.setFailureReason(reason);
        payout.setProcessedAt(LocalDateTime.now());
        payout = payoutRepository.save(payout);
        ledgerService.releasePayout(payout);
        
        applicationEventPublisher.publishEvent(PayoutFailedEvent.builder()
                .payoutId(payout.getId())
                .affiliateId(payout.getAffiliate().getId())
                .amount(payout.getAmount())
                .reason(reason)
                .timestamp(LocalDateTime.now())
                .build());
        
        return toAdminPayoutResponse(payout);
    }

    private Payout getPayout(Long id) {
        return payoutRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payout not found with id: " + id));
    }

    private PayoutResponse toPayoutResponse(Payout payout) {
        return PayoutResponse.builder()
                .id(payout.getId())
                .amount(payout.getAmount())
                .status(payout.getStatus())
                .requestedAt(payout.getRequestedAt())
                .processedAt(payout.getProcessedAt())
                .failureReason(payout.getFailureReason())
                .rejectionReason(payout.getRejectionReason())
                .build();
    }

    private AdminPayoutResponse toAdminPayoutResponse(Payout payout) {
        String paymentEmail = "Not Configured";
        try {
            AffiliateProfile profile = affiliateProfileRepository.findByUserId(payout.getAffiliate().getId())
                    .orElse(null);
            if (profile != null) {
                paymentEmail = profile.getPaymentEmail();
            }
        } catch (Exception ignored) { }

        return AdminPayoutResponse.builder()
                .id(payout.getId())
                .affiliateId(payout.getAffiliate().getId())
                .affiliateEmail(payout.getAffiliate().getEmail())
                .paymentEmail(paymentEmail)
                .amount(payout.getAmount())
                .status(payout.getStatus())
                .requestedAt(payout.getRequestedAt())
                .processedAt(payout.getProcessedAt())
                .failureReason(payout.getFailureReason())
                .rejectionReason(payout.getRejectionReason())
                .build();
    }
}
