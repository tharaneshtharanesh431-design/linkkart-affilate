package com.kart.dto.fraud;

import com.kart.entity.FraudSignalStatus;
import lombok.Data;

@Data
public class FraudReviewRequest {
    private FraudSignalStatus status;
    private String reviewNotes;
}
