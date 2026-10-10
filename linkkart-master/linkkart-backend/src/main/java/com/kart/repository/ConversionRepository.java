package com.kart.repository;

import com.kart.entity.Conversion;
import org.springframework.data.jpa.repository.JpaRepository;

import com.kart.entity.User;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ConversionRepository extends JpaRepository<Conversion, Long>, JpaSpecificationExecutor<Conversion> {
    List<Conversion> findByAffiliateLinkAffiliate(User affiliate);
    long countByAffiliateLinkId(Long linkId);
    boolean existsByTrackingIdAndOrderReference(String trackingId, String orderReference);
    boolean existsByOrderReferenceAndAffiliateLink_Campaign_Organization_Id(String orderReference, Long orgId);
    long countByAffiliateLink_Affiliate_IdAndConvertedAtAfter(Long affiliateId, java.time.LocalDateTime after);
    long countByAffiliateLink_Campaign_IdAndAffiliateLink_Affiliate_Id(Long campaignId, Long affiliateId);
    @org.springframework.data.jpa.repository.Query("SELECT c FROM Conversion c JOIN c.affiliateLink al JOIN al.campaign camp JOIN camp.organization org JOIN org.members om WHERE om.user.email = :email")
    List<Conversion> findByMerchantEmail(@org.springframework.data.repository.query.Param("email") String email);
}
