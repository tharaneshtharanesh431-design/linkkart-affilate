package com.kart.service;

import com.kart.dto.analytics.AnalyticsDashboardResponse;
import com.kart.dto.analytics.AnalyticsRequest;

public interface AdminAnalyticsService {
    AnalyticsDashboardResponse getDashboardAnalytics(AnalyticsRequest request);
}
