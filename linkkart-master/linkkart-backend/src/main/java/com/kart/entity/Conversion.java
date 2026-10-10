package com.kart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversions", indexes = {
    @Index(name = "idx_conv_affiliate_link_id", columnList = "affiliate_link_id"),
    @Index(name = "idx_conv_tracking_id", columnList = "tracking_id"),
    @Index(name = "idx_conv_converted_at", columnList = "converted_at"),
    @Index(name = "idx_conv_status", columnList = "status"),
    @Index(name = "idx_conv_order_reference", columnList = "order_reference")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_id", nullable = false, length = 36)
    private String trackingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "affiliate_link_id", nullable = false)
    private AffiliateLink affiliateLink;

    @Column(name = "order_amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal orderAmount;

    @Column(name = "order_reference", nullable = false)
    private String orderReference;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "VALID";

    @Builder.Default
    @Column(name = "converted_at", nullable = false, updatable = false)
    private LocalDateTime convertedAt = LocalDateTime.now();
}
