package com.kart.serviceImpl;

import com.kart.dto.payout.AffiliateBalanceResponse;
import com.kart.entity.*;
import com.kart.repository.CommissionRepository;
import com.kart.repository.LedgerTransactionRepository;
import com.kart.repository.PayoutRepository;
import com.kart.service.AffiliateBalanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AffiliateBalanceServiceImpl implements AffiliateBalanceService {

    private final LedgerTransactionRepository ledgerRepository;
    private final CommissionRepository commissionRepository;
    private final PayoutRepository payoutRepository;

    @Value("${app.payout.minimum-amount:50.00}")
    private BigDecimal minimumPayout;

    @Override
    @Transactional(propagation = Propagation.REQUIRED, readOnly = true)
    public AffiliateBalanceResponse calculateBalance(User affiliate) {
        List<LedgerTransaction> transactions = ledgerRepository.findByAffiliate(affiliate);

        BigDecimal totalCredits = BigDecimal.ZERO;
        BigDecimal totalDebits = BigDecimal.ZERO;
        
        BigDecimal totalAccrued = BigDecimal.ZERO;
        BigDecimal totalReversed = BigDecimal.ZERO;
        BigDecimal paidAmount = BigDecimal.ZERO;

        for (LedgerTransaction tx : transactions) {
            BigDecimal amount = tx.getAmount() != null ? tx.getAmount() : BigDecimal.ZERO;

            if (tx.getDirection() == LedgerDirection.CREDIT) {
                totalCredits = totalCredits.add(amount);
            } else if (tx.getDirection() == LedgerDirection.DEBIT) {
                totalDebits = totalDebits.add(amount);
            }

            if (tx.getTransactionType() == LedgerTransactionType.COMMISSION_ACCRUED) {
                totalAccrued = totalAccrued.add(amount);
            } else if (tx.getTransactionType() == LedgerTransactionType.COMMISSION_REVERSED) {
                totalReversed = totalReversed.add(amount);
            } else if (tx.getTransactionType() == LedgerTransactionType.PAYOUT_PAID) {
                paidAmount = paidAmount.add(amount);
            }
        }

        BigDecimal availableBalance = totalCredits.subtract(totalDebits);
        if (availableBalance.compareTo(BigDecimal.ZERO) < 0) {
            availableBalance = BigDecimal.ZERO;
        }

        BigDecimal approvedEarnings = totalAccrued.subtract(totalReversed);

        // UI states that don't affect the actual available ledger balance
        BigDecimal pendingEarnings = BigDecimal.ZERO;
        List<Commission> commissions = commissionRepository.findByAffiliate(affiliate);
        for (Commission c : commissions) {
            if ("PENDING".equalsIgnoreCase(c.getStatus())) {
                pendingEarnings = pendingEarnings.add(c.getAmount() != null ? c.getAmount() : BigDecimal.ZERO);
            }
        }

        BigDecimal requestedAmount = BigDecimal.ZERO;
        BigDecimal processingAmount = BigDecimal.ZERO;
        List<Payout> payouts = payoutRepository.findByAffiliate(affiliate);
        for (Payout p : payouts) {
            if ("REQUESTED".equalsIgnoreCase(p.getStatus())) {
                requestedAmount = requestedAmount.add(p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO);
            } else if ("PROCESSING".equalsIgnoreCase(p.getStatus())) {
                processingAmount = processingAmount.add(p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO);
            }
        }

        return AffiliateBalanceResponse.builder()
                .approvedEarnings(approvedEarnings)
                .pendingEarnings(pendingEarnings)
                .requestedAmount(requestedAmount)
                .processingAmount(processingAmount)
                .paidAmount(paidAmount)
                .availableBalance(availableBalance)
                .minimumPayout(minimumPayout)
                .build();
    }
}
