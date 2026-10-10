package com.kart.service;

import com.kart.dto.payout.AddPaymentMethodRequest;
import com.kart.dto.payout.PaymentMethodDto;
import com.kart.entity.PaymentMethod;

import java.util.List;

public interface PaymentMethodService {
    List<PaymentMethodDto> getMyPaymentMethods();
    PaymentMethodDto addPaymentMethod(AddPaymentMethodRequest request);
    void deletePaymentMethod(Long id);
    PaymentMethod getPaymentMethodEntity(Long id);
}
