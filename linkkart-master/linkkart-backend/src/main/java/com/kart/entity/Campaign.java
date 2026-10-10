package com.kart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "campaigns", indexes = {
    @Index(name = "idx_camp_org_id", columnList = "organization_id"),
    @Index(name = "idx_camp_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Campaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;

    @Column(nullable = false)
    private String title;

    @Column(name = "commission_type", nullable = false, length = 20)
    @Builder.Default
    private String commissionType = "PERCENTAGE";

    @Column(name = "commission_rate", nullable = false, precision = 19, scale = 2)
    private BigDecimal commissionRate;

    @Column(name = "clearing_period_days", nullable = false)
    @Builder.Default
    private Integer clearingPeriodDays = 30;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date")
    private java.time.LocalDate startDate;

    @Column(name = "end_date")
    private java.time.LocalDate endDate;

    @Column(precision = 19, scale = 2)
    private BigDecimal budget;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "campaign_products",
            joinColumns = @JoinColumn(name = "campaign_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    @Builder.Default
    private Set<Product> products = new HashSet<>();

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
