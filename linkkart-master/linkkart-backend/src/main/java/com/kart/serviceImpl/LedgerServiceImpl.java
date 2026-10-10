package com.kart.serviceImpl;

import com.kart.entity.*;
import com.kart.repository.LedgerTransactionRepository;
import com.kart.service.LedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class LedgerServiceImpl implements LedgerService {

    private final LedgerTransactionRepository ledgerRepository;

    @Override
    @Transactional(propagation = Propagation.MANDATORY)
    public void recordCommissionAccrual(Commission commission) {
        saveTransaction(
            commission.getAffiliate(),
            LedgerTransactionType.COMMISSION_ACCRUED,
            LedgerDirection.CREDIT,
            commission.getAmount(),
            "COMMISSION",
            commission.getId(),
            "COMMISSION_ACCRUED:COMMISSION:" + commission.getId()
        );
    }

    @Override
    @Transactional(propagation = Propagation.MANDATORY)
    public void recordCommissionReversal(Commission commission) {
        saveTransaction(
            commission.getAffiliate(),
            LedgerTransactionType.COMMISSION_REVERSED,
            LedgerDirection.DEBIT,
            commission.getAmount(),
            "COMMISSION",
            commission.getId(),
            "COMMISSION_REVERSED:COMMISSION:" + commission.getId()
        );
    }

    @Override
    @Transactional(propagation = Propagation.MANDATORY)
    public void reservePayout(Payout payout) {
        saveTransaction(
            payout.getAffiliate(),
            LedgerTransactionType.PAYOUT_RESERVED,
            LedgerDirection.DEBIT,
            payout.getAmount(),
            "PAYOUT",
            payout.getId(),
            "PAYOUT_RESERVED:PAYOUT:" + payout.getId()
        );
    }

    @Override
    @Transactional(propagation = Propagation.MANDATORY)
    public void recordPayoutPaid(Payout payout) {
        saveTransaction(
            payout.getAffiliate(),
            LedgerTransactionType.PAYOUT_PAID,
            LedgerDirection.NEUTRAL,
            payout.getAmount(),
            "PAYOUT",
            payout.getId(),
            "PAYOUT_PAID:PAYOUT:" + payout.getId()
        );
    }

    @Override
    @Transactional(propagation = Propagation.MANDATORY)
    public void releasePayout(Payout payout) {
        saveTransaction(
            payout.getAffiliate(),
            LedgerTransactionType.PAYOUT_RELEASED,
            LedgerDirection.CREDIT,
            payout.getAmount(),
            "PAYOUT",
            payout.getId(),
            "PAYOUT_RELEASED:PAYOUT:" + payout.getId()
        );
    }

    private void saveTransaction(User affiliate, LedgerTransactionType type, LedgerDirection direction,
                                 BigDecimal amount, String refType, Long refId, String idempotencyKey) {
        LedgerTransaction tx = LedgerTransaction.builder()
            .affiliate(affiliate)
            .transactionType(type)
            .direction(direction)
            .amount(amount)
            .referenceType(refType)
            .referenceId(refId)
            .idempotencyKey(idempotencyKey)
            .build();
        ledgerRepository.save(tx);
    }
}
