package com.kart.repository;

import com.kart.entity.AffiliateLink;
import com.kart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import java.util.Optional;

public interface AffiliateLinkRepository extends JpaRepository<AffiliateLink, Long> {
    List<AffiliateLink> findByAffiliate(User affiliate);
    Optional<AffiliateLink> findByCode(String code);
    boolean existsByProductId(Long productId);
    List<AffiliateLink> findByProductId(Long productId);
    Optional<AffiliateLink> findByAffiliateAndProductId(User affiliate, Long productId);
}
