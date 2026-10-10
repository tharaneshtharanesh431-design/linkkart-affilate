package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.analytics.AnalyticsDashboardResponse;
import com.kart.dto.analytics.AnalyticsRequest;
import com.kart.dto.analytics.DateRange;
import com.kart.entity.User;
import com.kart.exception.ResourceNotFoundException;
import com.kart.repository.UserRepository;
import com.kart.service.AdminAnalyticsService;
import com.kart.service.AffiliateAnalyticsService;
import com.kart.service.CsvExportService;
import com.kart.service.MerchantAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics")
public class AnalyticsController {

    private final AffiliateAnalyticsService affiliateAnalyticsService;
    private final MerchantAnalyticsService merchantAnalyticsService;
    private final AdminAnalyticsService adminAnalyticsService;
    private final CsvExportService csvExportService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private AnalyticsRequest buildRequest(DateRange range, LocalDate startDate, LocalDate endDate) {
        AnalyticsRequest req = new AnalyticsRequest();
        req.setRange(range != null ? range : DateRange.LAST_30_DAYS);
        req.setStartDate(startDate);
        req.setEndDate(endDate);
        return req;
    }

    // --- Affiliate ---

    @GetMapping("/affiliate")
    @PreAuthorize("hasRole('AFFILIATE')")
    @Operation(summary = "Get affiliate dashboard analytics")
    public ResponseEntity<ApiResponse<AnalyticsDashboardResponse>> getAffiliateAnalytics(
            @RequestParam(required = false) DateRange range,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        User affiliate = getAuthenticatedUser();
        AnalyticsDashboardResponse res = affiliateAnalyticsService.getDashboardAnalytics(affiliate, buildRequest(range, startDate, endDate));
        return ResponseEntity.ok(ApiResponse.success("Affiliate analytics retrieved", res));
    }

    @GetMapping("/affiliate/export")
    @PreAuthorize("hasRole('AFFILIATE')")
    @Operation(summary = "Export affiliate analytics CSV")
    public ResponseEntity<Resource> exportAffiliateAnalytics(
            @RequestParam(required = false) DateRange range,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        User affiliate = getAuthenticatedUser();
        AnalyticsDashboardResponse res = affiliateAnalyticsService.getDashboardAnalytics(affiliate, buildRequest(range, startDate, endDate));
        ByteArrayInputStream in = csvExportService.exportAffiliateAnalytics(res);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=affiliate_analytics.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(in));
    }

    // --- Merchant ---

    @GetMapping("/merchant")
    @PreAuthorize("hasRole('MERCHANT')")
    @Operation(summary = "Get merchant dashboard analytics")
    public ResponseEntity<ApiResponse<AnalyticsDashboardResponse>> getMerchantAnalytics(
            @RequestParam(required = false) DateRange range,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        User merchant = getAuthenticatedUser();
        AnalyticsDashboardResponse res = merchantAnalyticsService.getDashboardAnalytics(merchant, buildRequest(range, startDate, endDate));
        return ResponseEntity.ok(ApiResponse.success("Merchant analytics retrieved", res));
    }

    @GetMapping("/merchant/export")
    @PreAuthorize("hasRole('MERCHANT')")
    @Operation(summary = "Export merchant analytics CSV")
    public ResponseEntity<Resource> exportMerchantAnalytics(
            @RequestParam(required = false) DateRange range,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        User merchant = getAuthenticatedUser();
        AnalyticsDashboardResponse res = merchantAnalyticsService.getDashboardAnalytics(merchant, buildRequest(range, startDate, endDate));
        ByteArrayInputStream in = csvExportService.exportMerchantAnalytics(res);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=merchant_analytics.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(in));
    }

    // --- Admin ---

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get platform admin analytics")
    public ResponseEntity<ApiResponse<AnalyticsDashboardResponse>> getAdminAnalytics(
            @RequestParam(required = false) DateRange range,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        AnalyticsDashboardResponse res = adminAnalyticsService.getDashboardAnalytics(buildRequest(range, startDate, endDate));
        return ResponseEntity.ok(ApiResponse.success("Admin analytics retrieved", res));
    }

    @GetMapping("/admin/export")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Export admin analytics CSV")
    public ResponseEntity<Resource> exportAdminAnalytics(
            @RequestParam(required = false) DateRange range,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        AnalyticsDashboardResponse res = adminAnalyticsService.getDashboardAnalytics(buildRequest(range, startDate, endDate));
        ByteArrayInputStream in = csvExportService.exportAdminAnalytics(res);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=admin_analytics.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(new InputStreamResource(in));
    }
}
