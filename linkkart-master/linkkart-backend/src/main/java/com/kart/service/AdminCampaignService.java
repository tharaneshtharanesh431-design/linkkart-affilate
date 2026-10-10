package com.kart.service;

import com.kart.dto.admin.AdminCampaignResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminCampaignService {
    Page<AdminCampaignResponse> getAllCampaigns(String search, String status, Pageable pageable);
    AdminCampaignResponse getCampaignDetails(Long id);
    AdminCampaignResponse activateCampaign(Long id);
    AdminCampaignResponse pauseCampaign(Long id);
    AdminCampaignResponse closeCampaign(Long id);
}
