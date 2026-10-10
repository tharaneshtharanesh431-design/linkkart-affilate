package com.kart.dto.payout;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodDto {
    private Long id;
    private String type;
    private String accountHolderName;
    private String maskedIdentifier;
    private Boolean isActive;
}
