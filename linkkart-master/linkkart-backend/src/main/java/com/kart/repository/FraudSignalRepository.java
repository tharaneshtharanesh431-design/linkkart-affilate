package com.kart.repository;

import com.kart.entity.FraudSignal;
import com.kart.entity.FraudSignalStatus;
import com.kart.entity.FraudSignalType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FraudSignalRepository extends JpaRepository<FraudSignal, Long>, JpaSpecificationExecutor<FraudSignal> {
    
    boolean existsByClickIdAndType(Long clickId, FraudSignalType type);
    
    boolean existsByConversionIdAndType(Long conversionId, FraudSignalType type);
    
    List<FraudSignal> findByAffiliateIdAndStatus(Long affiliateId, FraudSignalStatus status);
    
    long countByTypeAndCreatedAtAfter(FraudSignalType type, LocalDateTime after);
    
    List<FraudSignal> findByStatusIn(List<FraudSignalStatus> statuses);
    
    List<FraudSignal> findByAffiliateId(Long affiliateId);
}
