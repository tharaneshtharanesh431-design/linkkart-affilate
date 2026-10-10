package com.kart.repository;

import com.kart.entity.CampaignAffiliate;
import com.kart.entity.CampaignAffiliateId;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CampaignAffiliateRepository extends JpaRepository<CampaignAffiliate, CampaignAffiliateId>, JpaSpecificationExecutor<CampaignAffiliate> {
    Optional<CampaignAffiliate> findByCampaignIdAndAffiliateId(Long campaignId, Long affiliateId);
    java.util.List<CampaignAffiliate> findByCampaignId(Long campaignId);
}
