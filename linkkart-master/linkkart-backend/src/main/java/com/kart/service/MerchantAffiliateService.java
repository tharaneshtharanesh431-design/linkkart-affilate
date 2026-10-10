package com.kart.service;

import com.kart.dto.merchant.MerchantAffiliateResponse;
import java.util.List;

public interface MerchantAffiliateService {
    List<MerchantAffiliateResponse> getMerchantAffiliates();
    MerchantAffiliateResponse updateAffiliateStatus(Long campaignId, Long affiliateId, String status);
}
