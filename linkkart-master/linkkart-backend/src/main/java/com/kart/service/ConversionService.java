package com.kart.service;

import com.kart.dto.conversion.ConversionRequest;
import com.kart.dto.conversion.ConversionResponse;
import com.kart.dto.commission.CommissionResponse;

import java.util.List;

public interface ConversionService {
    ConversionResponse recordConversion(ConversionRequest request);
    ConversionResponse updateConversionStatus(Long conversionId, String status);
    List<ConversionResponse> getAllConversions();
    List<ConversionResponse> getMerchantConversions();
    List<CommissionResponse> getAllCommissions();
    List<CommissionResponse> getMerchantCommissions();
}
