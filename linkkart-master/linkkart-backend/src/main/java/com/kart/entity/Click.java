package com.kart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clicks", indexes = {
    @Index(name = "idx_click_affiliate_link_id", columnList = "affiliate_link_id"),
    @Index(name = "idx_click_tracking_id", columnList = "tracking_id"),
    @Index(name = "idx_click_clicked_at", columnList = "clicked_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Click {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tracking_id", nullable = false, unique = true, length = 36)
    private String trackingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "affiliate_link_id", nullable = false)
    private AffiliateLink affiliateLink;

    @Column(name = "ip_hash")
    private String ipHash;

    @Column(name = "user_agent")
    private String userAgent;

    @Builder.Default
    @Column(name = "clicked_at", nullable = false, updatable = false)
    private LocalDateTime clickedAt = LocalDateTime.now();
}
