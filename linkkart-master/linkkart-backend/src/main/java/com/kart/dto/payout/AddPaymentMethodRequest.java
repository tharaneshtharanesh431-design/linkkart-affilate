package com.kart.dto.payout;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddPaymentMethodRequest {
    private String type; // BANK_ACCOUNT, UPI
    private String accountHolderName;
    private String identifier; // Raw account number or UPI ID (will be tokenized)
}
