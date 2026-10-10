package com.kart.security;

import com.kart.entity.Organization;
import com.kart.entity.OrganizationMember;
import com.kart.entity.User;
import com.kart.exception.BadRequestException;
import com.kart.repository.OrganizationMemberRepository;
import com.kart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;
    private final OrganizationMemberRepository organizationMemberRepository;

    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new AccessDeniedException("Authentication required");
        }
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("Authenticated user account not found"));
    }

    public Organization getOrganizationForUser(User user) {
        if ("ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            return null; // Admins don't have an organization in this context
        }
        return organizationMemberRepository.findByUser(user).stream()
                .findFirst()
                .map(OrganizationMember::getOrganization)
                .orElseThrow(() -> new BadRequestException("Organization not found. Please complete onboarding."));
    }

    public void checkRole(User user, String... allowedRoles) {
        String userRole = user.getRole().getName().toUpperCase();
        for (String role : allowedRoles) {
            if (role.toUpperCase().equals(userRole)) {
                return;
            }
        }
        throw new AccessDeniedException("Forbidden: You are not authorized to perform this operation");
    }

    public void verifyOrganizationOwnership(User user, Organization targetOrganization) {
        if ("ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            return;
        }
        Organization userOrg = getOrganizationForUser(user);
        if (targetOrganization == null || !targetOrganization.getId().equals(userOrg.getId())) {
            throw new AccessDeniedException("Forbidden: You are not authorized to access this organization's resources");
        }
    }
}
