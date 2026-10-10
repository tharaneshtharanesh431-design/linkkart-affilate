package com.kart.serviceImpl;

import com.kart.dto.payout.AddPaymentMethodRequest;
import com.kart.dto.payout.PaymentMethodDto;
import com.kart.entity.PaymentMethod;
import com.kart.entity.User;
import com.kart.exception.BadRequestException;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.PaymentMethodRepository;
import com.kart.repository.UserRepository;
import com.kart.service.PaymentMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentMethodServiceImpl implements PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    @Override
    public List<PaymentMethodDto> getMyPaymentMethods() {
        User affiliate = getAuthenticatedUser();
        return paymentMethodRepository.findByAffiliateAndIsActiveTrue(affiliate).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PaymentMethodDto addPaymentMethod(AddPaymentMethodRequest request) {
        User affiliate = getAuthenticatedUser();
        
        if (request.getType() == null || request.getIdentifier() == null || request.getAccountHolderName() == null) {
            throw new BadRequestException("All fields are required");
        }

        String masked = maskIdentifier(request.getIdentifier(), request.getType());
        
        // Mock Tokenization
        // In real life, we would call Provider API to create a Customer/Fund Account and get a token
        String token = "mock_dest_" + UUID.randomUUID().toString();

        PaymentMethod pm = PaymentMethod.builder()
                .affiliate(affiliate)
                .type(request.getType())
                .accountHolderName(request.getAccountHolderName())
                .maskedIdentifier(masked)
                .providerDestinationId(token)
                .isActive(true)
                .build();

        pm = paymentMethodRepository.save(pm);
        return toDto(pm);
    }

    @Override
    @Transactional
    public void deletePaymentMethod(Long id) {
        User affiliate = getAuthenticatedUser();
        PaymentMethod pm = paymentMethodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));
        
        if (!pm.getAffiliate().getId().equals(affiliate.getId())) {
            throw new BadRequestException("Unauthorized access to payment method");
        }

        pm.setIsActive(false);
        paymentMethodRepository.save(pm);
    }

    @Override
    public PaymentMethod getPaymentMethodEntity(Long id) {
        return paymentMethodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment method not found"));
    }

    private String maskIdentifier(String identifier, String type) {
        if (identifier.length() <= 4) return identifier;
        
        if ("UPI".equalsIgnoreCase(type)) {
            String[] parts = identifier.split("@");
            if (parts.length == 2 && parts[0].length() > 2) {
                return parts[0].substring(0, 2) + "***@" + parts[1];
            }
        }
        
        return "****" + identifier.substring(identifier.length() - 4);
    }

    private PaymentMethodDto toDto(PaymentMethod pm) {
        return PaymentMethodDto.builder()
                .id(pm.getId())
                .type(pm.getType())
                .accountHolderName(pm.getAccountHolderName())
                .maskedIdentifier(pm.getMaskedIdentifier())
                .isActive(pm.getIsActive())
                .build();
    }
}
