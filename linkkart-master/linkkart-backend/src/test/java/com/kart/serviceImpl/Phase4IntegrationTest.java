package com.kart.serviceImpl;

import com.kart.dto.profile.AffiliateOnboardingRequest;
import com.kart.dto.profile.ProfileResponse;
import com.kart.entity.*;
import com.kart.repository.*;
import com.kart.service.CampaignService;
import com.kart.service.ProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class Phase4IntegrationTest {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private CampaignService campaignService;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private AffiliateProfileRepository affiliateProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CampaignRepository campaignRepository;
    
    @Autowired
    private CampaignAffiliateRepository campaignAffiliateRepository;

    @Autowired
    private OrganizationMemberRepository organizationMemberRepository;

    private User merchantA;
    private User merchantB;
    private User affiliate;
    private User affiliate2;
    private Organization orgA;
    private Organization orgB;
    private Campaign campA;
    private Campaign campB;

    @BeforeEach
    void setUp() {
        Role merchantRole = roleRepository.findByName("MERCHANT").orElseGet(() -> {
            Role r = new Role();
            r.setName("MERCHANT");
            return roleRepository.save(r);
        });

        Role affiliateRole = roleRepository.findByName("AFFILIATE").orElseGet(() -> {
            Role r = new Role();
            r.setName("AFFILIATE");
            return roleRepository.save(r);
        });

        orgA = new Organization();
        orgA.setName("Org A");
        orgA.setStatus("ACTIVE");
        orgA = organizationRepository.save(orgA);

        orgB = new Organization();
        orgB.setName("Org B");
        orgB.setStatus("ACTIVE");
        orgB = organizationRepository.save(orgB);

        merchantA = new User();
        merchantA.setEmail("merchantA@test.com");
        merchantA.setPassword("password");
        merchantA.setRole(merchantRole);
        merchantA = userRepository.save(merchantA);

        OrganizationMember om1 = new OrganizationMember();
        om1.setUser(merchantA);
        om1.setOrganization(orgA);
        om1.setRole("OWNER");
        organizationMemberRepository.save(om1);

        merchantB = new User();
        merchantB.setEmail("merchantB@test.com");
        merchantB.setPassword("password");
        merchantB.setRole(merchantRole);
        merchantB = userRepository.save(merchantB);

        OrganizationMember om2 = new OrganizationMember();
        om2.setUser(merchantB);
        om2.setOrganization(orgB);
        om2.setRole("OWNER");
        organizationMemberRepository.save(om2);

        affiliate = new User();
        affiliate.setEmail("affiliate@test.com");
        affiliate.setPassword("password");
        affiliate.setRole(affiliateRole);
        affiliate = userRepository.save(affiliate);

        affiliate2 = new User();
        affiliate2.setEmail("affiliate2@test.com");
        affiliate2.setPassword("password");
        affiliate2.setRole(affiliateRole);
        affiliate2 = userRepository.save(affiliate2);

        AffiliateProfile ap = new AffiliateProfile();
        ap.setUser(affiliate);
        ap.setDisplayName("Affiliate 1");
        ap.setPaymentEmail("affiliate1@test.com");
        ap.setNiche("tech");
        ap.setLocation("us");
        ap.setIsDiscoverable(true);
        ap.setStatus("ACTIVE");
        affiliateProfileRepository.save(ap);

        AffiliateProfile ap2 = new AffiliateProfile();
        ap2.setUser(affiliate2);
        ap2.setDisplayName("Affiliate 2");
        ap2.setPaymentEmail("affiliate2@test.com");
        ap2.setNiche("beauty");
        ap2.setLocation("us");
        ap2.setIsDiscoverable(false);
        ap2.setStatus("ACTIVE");
        affiliateProfileRepository.save(ap2);
        
        campA = new Campaign();
        campA.setTitle("Campaign A");
        campA.setOrganization(orgA);
        campA.setCommissionRate(new java.math.BigDecimal("10.00"));
        campA.setStatus("ACTIVE");
        campA = campaignRepository.save(campA);

        campB = new Campaign();
        campB.setTitle("Campaign B");
        campB.setOrganization(orgB);
        campB.setCommissionRate(new java.math.BigDecimal("10.00"));
        campB.setStatus("ACTIVE");
        campB = campaignRepository.save(campB);
    }
    @AfterEach
    void tearDown() {
        campaignAffiliateRepository.deleteAll();
        campaignRepository.deleteAll();
        organizationMemberRepository.deleteAll();
        affiliateProfileRepository.deleteAll();
        organizationRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    @WithMockUser(username = "merchantA@test.com", roles = "MERCHANT")
    void testDiscovery_DiscoverableAffiliateAppears() {
        List<ProfileResponse> affiliates = profileService.discoverAffiliates("tech", "us");
        assertThat(affiliates).hasSize(1);
        assertThat(affiliates.get(0).getUser().getEmail()).isEqualTo("affiliate@test.com");
    }

    @Test
    @WithMockUser(username = "merchantA@test.com", roles = "MERCHANT")
    void testDiscovery_NonDiscoverableAffiliateDoesNotAppear() {
        List<ProfileResponse> affiliates = profileService.discoverAffiliates("beauty", null);
        assertThat(affiliates).isEmpty();
    }
    
    @Test
    @WithMockUser(username = "affiliate@test.com", roles = "AFFILIATE")
    void testParticipation_AffiliateApplies() {
        campaignService.requestParticipation(campA.getId());
        
        CampaignAffiliate ca = campaignAffiliateRepository.findByCampaignIdAndAffiliateId(campA.getId(), affiliate.getId()).orElseThrow();
        assertThat(ca.getStatus()).isEqualTo("PENDING");
    }

    @Test
    @WithMockUser(username = "merchantA@test.com", roles = "MERCHANT")
    void testParticipation_MerchantApproves() {
        CampaignAffiliate ca = new CampaignAffiliate(campA, affiliate, "PENDING", java.time.LocalDateTime.now());
        campaignAffiliateRepository.save(ca);

        campaignService.approveParticipation(campA.getId(), affiliate.getId());
        
        CampaignAffiliate updated = campaignAffiliateRepository.findByCampaignIdAndAffiliateId(campA.getId(), affiliate.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo("ACTIVE");
    }

    @Test
    @WithMockUser(username = "merchantB@test.com", roles = "MERCHANT")
    void testParticipation_CrossTenantMerchantCannotApprove() {
        CampaignAffiliate ca = new CampaignAffiliate(campA, affiliate, "PENDING", java.time.LocalDateTime.now());
        campaignAffiliateRepository.save(ca);

        assertThrows(RuntimeException.class, () -> {
            campaignService.approveParticipation(campA.getId(), affiliate.getId());
        });
    }

    @Test
    @WithMockUser(username = "merchantA@test.com", roles = "MERCHANT")
    void testInvitation_MerchantInvites() {
        campaignService.inviteAffiliate(campA.getId(), affiliate.getId());
        
        CampaignAffiliate ca = campaignAffiliateRepository.findByCampaignIdAndAffiliateId(campA.getId(), affiliate.getId()).orElseThrow();
        assertThat(ca.getStatus()).isEqualTo("INVITED");
    }

    @Test
    @WithMockUser(username = "affiliate@test.com", roles = "AFFILIATE")
    void testInvitation_AffiliateAccepts() {
        CampaignAffiliate ca = new CampaignAffiliate(campA, affiliate, "INVITED", java.time.LocalDateTime.now());
        campaignAffiliateRepository.save(ca);

        campaignService.acceptInvitation(campA.getId());
        
        CampaignAffiliate updated = campaignAffiliateRepository.findByCampaignIdAndAffiliateId(campA.getId(), affiliate.getId()).orElseThrow();
        assertThat(updated.getStatus()).isEqualTo("ACTIVE");
    }
}
