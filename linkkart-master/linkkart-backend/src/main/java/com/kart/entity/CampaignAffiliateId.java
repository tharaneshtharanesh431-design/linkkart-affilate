package com.kart.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampaignAffiliateId implements Serializable {
    private Long campaign;
    private Long affiliate;
}
