package com.kart.service;

import com.kart.dto.link.AffiliateLinkRequest;
import com.kart.dto.link.AffiliateLinkResponse;

import java.util.List;

public interface AffiliateLinkService {
    AffiliateLinkResponse generateLink(AffiliateLinkRequest request);
    List<AffiliateLinkResponse> getMyLinks();
}
