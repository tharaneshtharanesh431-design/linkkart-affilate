package com.kart.serviceImpl;

import com.kart.dto.ai.ChatRequest;
import com.kart.dto.ai.ChatResponse;
import com.kart.dto.analytics.AnalyticsDashboardResponse;
import com.kart.dto.analytics.AnalyticsRequest;
import com.kart.entity.ChatHistory;
import com.kart.entity.Product;
import com.kart.entity.User;
import com.kart.repository.ChatHistoryRepository;
import com.kart.repository.ProductRepository;
import com.kart.service.AffiliateAnalyticsService;
import com.kart.service.AiService;
import com.kart.service.MerchantAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiServiceImpl implements AiService {
    private final ChatHistoryRepository chatHistoryRepository;
    private final ProductRepository productRepository;
    private final AffiliateAnalyticsService affiliateAnalyticsService;
    private final MerchantAnalyticsService merchantAnalyticsService;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String geminiApiUrl;

    private String callGemini(String prompt) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            log.error("Gemini API key is not configured. Cannot process prompt: {}", prompt);
            throw new IllegalStateException("AI service is unavailable: API key not configured.");
        }
        try {
            WebClient client = WebClient.builder().baseUrl(geminiApiUrl).build();
            Map<String, Object> payload = Map.of(
                    "contents", new Object[]{Map.of("parts", new Object[]{Map.of("text", prompt)})}
            );
            return client.post()
                    .uri(uriBuilder -> uriBuilder.queryParam("key", geminiApiKey).build())
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(body -> {
                        var candidates = (java.util.List<Map<String, Object>>) body.get("candidates");
                        if (candidates != null && !candidates.isEmpty()) {
                            var content = (Map<String, Object>) candidates.get(0).get("content");
                            var parts = (java.util.List<Map<String, Object>>) content.get("parts");
                            if (parts != null && !parts.isEmpty()) {
                                return parts.get(0).get("text").toString();
                            }
                        }
                        return "I couldn’t generate an AI response right now.";
                    })
                    .block();
        } catch (Exception ex) {
            log.error("AI service is unavailable right now", ex);
            throw new RuntimeException("AI service is unavailable right now. Please try again later.", ex);
        }
    }

    private void saveHistory(String prompt, String response) {
        ChatHistory history = ChatHistory.builder()
                .prompt(prompt)
                .response(response)
                .createdAt(LocalDateTime.now())
                .build();
        chatHistoryRepository.save(history);
    }

    @Override
    public ChatResponse chat(ChatRequest request, User user) {
        String prompt = "You are a Link Kart assistant. Answer specifically about Link Kart functionality: " 
                + "how to get paid, generate links, where to see commissions, etc. Do not reveal internal secrets, passwords, or act outside this scope. User question: " 
                + request.getMessage();
        String reply = callGemini(prompt);
        saveHistory(request.getMessage(), reply);
        return ChatResponse.builder().reply(reply).build();
    }

    @Override
    public ChatResponse getAffiliateRecommendations(String niche, String category, User user) {
        List<Product> products;
        if (category != null && !category.isBlank()) {
            products = productRepository.findByCategoryNameIgnoreCase(category);
        } else {
            products = productRepository.findAllByOrderByIdDesc();
        }

        if (products.isEmpty()) {
            return ChatResponse.builder().reply("No products found in the database for the given criteria.").build();
        }

        String productList = products.stream().limit(10).map(p -> 
            String.format("ID: %d, Name: %s, Price: %s", p.getId(), p.getName(), p.getPrice().toString())
        ).collect(Collectors.joining("\n"));

        String prompt = String.format(
            "Based on the following actual database products, recommend the top 3 best products for an affiliate focusing on the niche '%s'. " +
            "Do NOT invent any products, prices, or IDs. Only use the provided list:\n%s", 
            niche != null ? niche : "general audience", productList
        );

        String reply = callGemini(prompt);
        saveHistory("Affiliate Recommendations: " + niche, reply);
        return ChatResponse.builder().reply(reply).build();
    }

    @Override
    public ChatResponse generateAffiliateContent(Long productId, String platform, String tone, User user) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String prompt = String.format(
            "Write a promotional %s post for the following product. Tone should be %s. " +
            "Do NOT invent specifications, medical claims, or guarantees.\n" +
            "Product Name: %s\nDescription: %s\nPrice: %s",
            platform, tone, product.getName(), product.getDescription(), product.getPrice()
        );

        String reply = callGemini(prompt);
        saveHistory("Generate Content for Product ID: " + productId, reply);
        return ChatResponse.builder().reply(reply).build();
    }

    @Override
    public ChatResponse generateMerchantProductContent(String productName, String features, String tone, User user) {
        String prompt = String.format(
            "Generate an SEO-optimized product title and a short compelling description for a merchant to use on their e-commerce store. Tone: %s. " +
            "Product Name: %s\nFeatures/Draft: %s\n" +
            "Do NOT invent new features, only use what is provided.",
            tone, productName, features
        );

        String reply = callGemini(prompt);
        saveHistory("Generate Merchant Product Content: " + productName, reply);
        return ChatResponse.builder().reply(reply).build();
    }

    @Override
    public ChatResponse getCampaignInsights(Long campaignId, String dateRange, User user) {
        // Here we'd normally filter analytics by campaignId. We'll get overall merchant analytics for now as proxy.
        AnalyticsRequest req = new AnalyticsRequest();
        req.setRange(dateRange != null ? com.kart.dto.analytics.DateRange.valueOf(dateRange.toUpperCase()) : com.kart.dto.analytics.DateRange.THIS_MONTH);
        AnalyticsDashboardResponse data = merchantAnalyticsService.getDashboardAnalytics(user, req);

        String prompt = String.format(
            "You are an AI data analyst. Summarize these actual merchant metrics and suggest insights. " +
            "Do NOT invent metrics or make financial promises. Here is the data: " +
            "Clicks: %d, Conversions: %d, Revenue: %s, Commission Paid: %s",
            data.getKpis().getTotalClicks(), data.getKpis().getTotalConversions(), 
            data.getKpis().getTotalSalesAmount(), data.getKpis().getTotalEarnings()
        );

        String reply = callGemini(prompt);
        saveHistory("Campaign Insights for user: " + user.getId(), reply);
        return ChatResponse.builder().reply(reply).build();
    }

    @Override
    public ChatResponse getAffiliatePerformanceSummary(String dateRange, User user) {
        AnalyticsRequest req = new AnalyticsRequest();
        req.setRange(dateRange != null ? com.kart.dto.analytics.DateRange.valueOf(dateRange.toUpperCase()) : com.kart.dto.analytics.DateRange.THIS_MONTH);
        AnalyticsDashboardResponse data = affiliateAnalyticsService.getDashboardAnalytics(user, req);

        String prompt = String.format(
            "You are an AI assistant. Summarize these actual affiliate metrics. " +
            "Do NOT invent metrics or guarantee future earnings. Here is the data: " +
            "Clicks: %d, Conversions: %d, Earnings: %s",
            data.getKpis().getTotalClicks(), data.getKpis().getTotalConversions(), 
            data.getKpis().getTotalEarnings()
        );

        String reply = callGemini(prompt);
        saveHistory("Affiliate Performance Summary for user: " + user.getId(), reply);
        return ChatResponse.builder().reply(reply).build();
    }
}
