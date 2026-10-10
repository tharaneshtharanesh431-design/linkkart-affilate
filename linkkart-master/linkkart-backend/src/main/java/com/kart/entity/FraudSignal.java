package com.kart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_signals", indexes = {
    @Index(name = "idx_fraud_status_created", columnList = "status, created_at"),
    @Index(name = "idx_fraud_affiliate", columnList = "affiliate_id, created_at"),
    @Index(name = "idx_fraud_org", columnList = "organization_id, created_at"),
    @Index(name = "idx_fraud_type_created", columnList = "type, created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudSignal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "affiliate_id")
    private User affiliate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conversion_id")
    private Conversion conversion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "click_id")
    private Click click;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FraudSignalType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FraudSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private FraudSignalStatus status = FraudSignalStatus.OPEN;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false, length = 1000)
    private String reason;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;
}
