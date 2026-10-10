package com.kart.repository;

import com.kart.entity.Click;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kart.entity.User;
import java.util.List;

public interface ClickRepository extends JpaRepository<Click, Long> {
    long countByAffiliateLinkId(Long affiliateLinkId);
    List<Click> findByAffiliateLinkAffiliate(User affiliate);
    java.util.Optional<Click> findByTrackingId(String trackingId);
    java.util.Optional<Click> findTopByAffiliateLinkIdAndIpHashOrderByClickedAtDesc(Long affiliateLinkId, String ipHash);
    long countByIpHashAndClickedAtAfter(String ipHash, java.time.LocalDateTime after);
    long countByAffiliateLink_Campaign_IdAndAffiliateLink_Affiliate_Id(Long campaignId, Long affiliateId);
}
