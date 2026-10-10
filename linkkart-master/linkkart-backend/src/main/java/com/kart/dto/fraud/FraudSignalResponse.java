package com.kart.dto.fraud;

import com.kart.entity.FraudSeverity;
import com.kart.entity.FraudSignalStatus;
import com.kart.entity.FraudSignalType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FraudSignalResponse {
    private Long id;
    private Long affiliateId;
    private String affiliateEmail;
    private Long merchantId;
    private String merchantEmail;
    private Long conversionId;
    private Long clickId;
    private FraudSignalType type;
    private FraudSeverity severity;
    private FraudSignalStatus status;
    private int score;
    private String reason;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
    private String reviewedByEmail;
}
