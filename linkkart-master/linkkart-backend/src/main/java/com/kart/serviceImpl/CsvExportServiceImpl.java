package com.kart.serviceImpl;

import com.kart.dto.analytics.AnalyticsDashboardResponse;
import com.kart.dto.analytics.PerformanceMetric;
import com.kart.dto.analytics.TimeSeriesDataPoint;
import com.kart.service.CsvExportService;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;

@Service
public class CsvExportServiceImpl implements CsvExportService {

    @Override
    public ByteArrayInputStream exportAffiliateAnalytics(AnalyticsDashboardResponse data) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter pw = new PrintWriter(out);

        // KPIs
        pw.println("AFFILIATE KPI SUMMARY");
        pw.println("Total Clicks,Total Conversions,Conversion Rate,Approved Earnings,Pending Earnings,EPC");
        pw.printf("%d,%d,%.2f%%,%.2f,%.2f,%.2f%n",
                data.getKpis().getTotalClicks(),
                data.getKpis().getTotalConversions(),
                data.getKpis().getConversionRate(),
                data.getKpis().getApprovedEarnings(),
                data.getKpis().getPendingEarnings(),
                data.getKpis().getEpc());
        pw.println();

        // Time Series
        pw.println("TIME SERIES");
        pw.println("Date,Clicks,Conversions,Earnings");
        if (data.getTimeSeries() != null) {
            for (TimeSeriesDataPoint pt : data.getTimeSeries()) {
                pw.printf("%s,%d,%d,%.2f%n", pt.getDate(), pt.getClicks(), pt.getConversions(), pt.getEarnings());
            }
        }
        pw.println();

        // Top Products
        pw.println("TOP PRODUCTS");
        pw.println("Product Name,Clicks,Conversions,Conversion Rate,Earnings");
        if (data.getTopProducts() != null) {
            for (PerformanceMetric pm : data.getTopProducts()) {
                pw.printf("\"%s\",%d,%d,%.2f%%,%.2f%n", escapeSpecialCharacters(pm.getName()), pm.getClicks(), pm.getConversions(), pm.getConversionRate(), pm.getEarnings());
            }
        }

        pw.flush();
        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public ByteArrayInputStream exportMerchantAnalytics(AnalyticsDashboardResponse data) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter pw = new PrintWriter(out);

        pw.println("MERCHANT KPI SUMMARY");
        pw.println("Total Clicks,Total Conversions,Conversion Rate,Total Sales Amount,Estimated Earnings,Commission Costs (Approved)");
        pw.printf("%d,%d,%.2f%%,%.2f,%.2f,%.2f%n",
                data.getKpis().getTotalClicks(),
                data.getKpis().getTotalConversions(),
                data.getKpis().getConversionRate(),
                data.getKpis().getTotalSalesAmount(),
                data.getKpis().getTotalEarnings(),
                data.getKpis().getApprovedEarnings());
        pw.println();

        pw.println("TIME SERIES");
        pw.println("Date,Clicks,Conversions,Sales");
        if (data.getTimeSeries() != null) {
            for (TimeSeriesDataPoint pt : data.getTimeSeries()) {
                pw.printf("%s,%d,%d,%.2f%n", pt.getDate(), pt.getClicks(), pt.getConversions(), pt.getSales());
            }
        }
        pw.println();

        pw.println("TOP CAMPAIGNS");
        pw.println("Campaign Title,Clicks,Conversions,Conversion Rate,Sales,Commission Costs");
        if (data.getTopCampaigns() != null) {
            for (PerformanceMetric pm : data.getTopCampaigns()) {
                pw.printf("\"%s\",%d,%d,%.2f%%,%.2f,%.2f%n", escapeSpecialCharacters(pm.getName()), pm.getClicks(), pm.getConversions(), pm.getConversionRate(), pm.getSales(), pm.getEarnings());
            }
        }

        pw.flush();
        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public ByteArrayInputStream exportAdminAnalytics(AnalyticsDashboardResponse data) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter pw = new PrintWriter(out);

        pw.println("ADMIN PLATFORM SUMMARY");
        pw.println("Total Users,Affiliates,Merchants,Total Products,Total Campaigns,Total Clicks,Total Conversions,Total Sales,Total Commissions,Total Payouts");
        pw.printf("%d,%d,%d,%d,%d,%d,%d,%.2f,%.2f,%.2f%n",
                data.getKpis().getTotalUsers(),
                data.getKpis().getTotalAffiliates(),
                data.getKpis().getTotalMerchants(),
                data.getKpis().getTotalProducts(),
                data.getKpis().getTotalCampaigns(),
                data.getKpis().getTotalClicks(),
                data.getKpis().getTotalConversions(),
                data.getKpis().getTotalSalesAmount(),
                data.getKpis().getApprovedEarnings(),
                data.getKpis().getTotalPayouts());
        pw.println();

        pw.println("TIME SERIES");
        pw.println("Date,Clicks,Conversions,Sales,Commissions");
        if (data.getTimeSeries() != null) {
            for (TimeSeriesDataPoint pt : data.getTimeSeries()) {
                pw.printf("%s,%d,%d,%.2f,%.2f%n", pt.getDate(), pt.getClicks(), pt.getConversions(), pt.getSales(), pt.getEarnings());
            }
        }

        pw.flush();
        return new ByteArrayInputStream(out.toByteArray());
    }

    private String escapeSpecialCharacters(String data) {
        if (data == null) {
            return "";
        }
        String escapedData = data.replaceAll("\\R", " ");
        if (data.contains(",") || data.contains("\"") || data.contains("'")) {
            data = data.replace("\"", "\"\"");
            escapedData = data;
        }
        return escapedData;
    }
}
