package com.kart.service;

import com.kart.dto.ai.ChatRequest;
import com.kart.dto.ai.ChatResponse;
import com.kart.entity.User;
import java.util.Map;

public interface AiService {
    ChatResponse chat(ChatRequest request, User user);
    
    ChatResponse getAffiliateRecommendations(String niche, String category, User user);
    
    ChatResponse generateAffiliateContent(Long productId, String platform, String tone, User user);
    
    ChatResponse generateMerchantProductContent(String productName, String features, String tone, User user);
    
    ChatResponse getCampaignInsights(Long campaignId, String dateRange, User user);
    
    ChatResponse getAffiliatePerformanceSummary(String dateRange, User user);
}
