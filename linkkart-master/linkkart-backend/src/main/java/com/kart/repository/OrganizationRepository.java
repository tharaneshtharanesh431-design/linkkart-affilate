package com.kart.repository;

import com.kart.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findBySlug(String slug);
    Optional<Organization> findByIntegrationSecret(String integrationSecret);
}
