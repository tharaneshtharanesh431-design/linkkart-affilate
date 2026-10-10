package com.kart.repository;

import com.kart.entity.Campaign;
import com.kart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CampaignRepository extends JpaRepository<Campaign, Long>, JpaSpecificationExecutor<Campaign> {
    List<Campaign> findByOrganization(com.kart.entity.Organization organization);

    @Query("SELECT c FROM Campaign c JOIN c.products p WHERE p.id = :productId AND c.status = 'ACTIVE'")
    List<Campaign> findActiveCampaignsByProductId(@Param("productId") Long productId);

    long countByStatus(String status);
}
