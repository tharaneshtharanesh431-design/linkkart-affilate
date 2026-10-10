package com.kart.service;

import com.kart.dto.analytics.AnalyticsDashboardResponse;
import com.kart.dto.analytics.AnalyticsRequest;
import com.kart.entity.User;

public interface AffiliateAnalyticsService {
    AnalyticsDashboardResponse getDashboardAnalytics(User affiliate, AnalyticsRequest request);
}
