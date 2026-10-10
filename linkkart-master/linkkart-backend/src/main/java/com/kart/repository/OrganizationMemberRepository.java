package com.kart.repository;

import com.kart.entity.OrganizationMember;
import com.kart.entity.User;
import com.kart.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OrganizationMemberRepository extends JpaRepository<OrganizationMember, Long> {
    List<OrganizationMember> findByUser(User user);
    List<OrganizationMember> findByOrganization(Organization organization);
    Optional<OrganizationMember> findByUserAndOrganization(User user, Organization organization);
    Optional<OrganizationMember> findByUserIdAndOrganizationId(Long userId, Long organizationId);
}
