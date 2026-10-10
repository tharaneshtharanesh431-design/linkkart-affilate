package com.kart.service;

import com.kart.dto.campaign.CampaignRequest;
import com.kart.dto.campaign.CampaignResponse;

import java.util.List;

public interface CampaignService {
    CampaignResponse create(CampaignRequest request);
    CampaignResponse update(Long id, CampaignRequest request);
    void delete(Long id);
    List<CampaignResponse> getAll();
    List<CampaignResponse> getMerchantCampaigns();

    com.kart.dto.campaign.CampaignParticipationResponse requestParticipation(Long campaignId);
    com.kart.dto.campaign.CampaignParticipationResponse approveParticipation(Long campaignId, Long affiliateId);
    com.kart.dto.campaign.CampaignParticipationResponse rejectParticipation(Long campaignId, Long affiliateId);
    List<com.kart.dto.campaign.CampaignParticipationResponse> getCampaignAffiliates(Long campaignId);

    com.kart.dto.campaign.CampaignParticipationResponse inviteAffiliate(Long campaignId, Long affiliateId);
    com.kart.dto.campaign.CampaignParticipationResponse acceptInvitation(Long campaignId);
    com.kart.dto.campaign.CampaignParticipationResponse declineInvitation(Long campaignId);
}
