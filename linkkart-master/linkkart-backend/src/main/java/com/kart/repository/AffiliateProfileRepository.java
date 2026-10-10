package com.kart.repository;

import com.kart.entity.AffiliateProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface AffiliateProfileRepository extends JpaRepository<AffiliateProfile, Long>, JpaSpecificationExecutor<AffiliateProfile> {
    Optional<AffiliateProfile> findByUserId(Long userId);
}
