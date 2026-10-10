package com.kart.service;

import com.kart.dto.analytics.AnalyticsDashboardResponse;
import java.io.ByteArrayInputStream;

public interface CsvExportService {
    ByteArrayInputStream exportAffiliateAnalytics(AnalyticsDashboardResponse data);
    ByteArrayInputStream exportMerchantAnalytics(AnalyticsDashboardResponse data);
    ByteArrayInputStream exportAdminAnalytics(AnalyticsDashboardResponse data);
}
