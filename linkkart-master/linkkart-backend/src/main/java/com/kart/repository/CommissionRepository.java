package com.kart.repository;

import com.kart.entity.Commission;
import com.kart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CommissionRepository extends JpaRepository<Commission, Long>, JpaSpecificationExecutor<Commission> {
    List<Commission> findByAffiliate(User affiliate);
    List<Commission> findByConversionAffiliateLinkId(Long linkId);
    
    @org.springframework.data.jpa.repository.Query("SELECT c FROM Commission c WHERE c.status = 'PENDING' AND c.clearsAt <= :now")
    List<Commission> findPendingCommissionsReadyToClear(@org.springframework.data.repository.query.Param("now") java.time.LocalDateTime now);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(c.amount) FROM Commission c JOIN c.conversion conv JOIN conv.affiliateLink al WHERE al.campaign.id = :campaignId AND al.affiliate.id = :affiliateId AND conv.status = 'VALID'")
    java.math.BigDecimal sumValidCommissionByCampaignAndAffiliate(@org.springframework.data.repository.query.Param("campaignId") Long campaignId, @org.springframework.data.repository.query.Param("affiliateId") Long affiliateId);

    List<Commission> findByConversionId(Long conversionId);
    
    @org.springframework.data.jpa.repository.Query("SELECT c FROM Commission c JOIN c.conversion conv JOIN conv.affiliateLink al JOIN al.campaign camp JOIN camp.organization org JOIN org.members om WHERE om.user.email = :email")
    List<Commission> findByMerchantEmail(@org.springframework.data.repository.query.Param("email") String email);
}
