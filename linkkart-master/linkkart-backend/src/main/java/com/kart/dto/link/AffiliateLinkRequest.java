package com.kart.dto.link;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AffiliateLinkRequest {
    @NotNull
    private Long productId;
}
