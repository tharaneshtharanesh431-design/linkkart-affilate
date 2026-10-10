package com.kart.repository;

import com.kart.entity.LedgerTransaction;
import com.kart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LedgerTransactionRepository extends JpaRepository<LedgerTransaction, Long> {
    List<LedgerTransaction> findByAffiliate(User affiliate);
}
