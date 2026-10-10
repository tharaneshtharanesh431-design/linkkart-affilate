package com.kart.serviceImpl;

import com.kart.dto.ai.ChatRequest;
import com.kart.dto.ai.ChatResponse;
import com.kart.dto.analytics.AnalyticsDashboardResponse;
import com.kart.dto.analytics.AnalyticsRequest;
import com.kart.entity.Product;
import com.kart.entity.User;
import com.kart.repository.ChatHistoryRepository;
import com.kart.repository.ProductRepository;
import com.kart.service.AffiliateAnalyticsService;
import com.kart.service.MerchantAnalyticsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AiServiceImplTest {



    @Mock
    private ChatHistoryRepository chatHistoryRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private AffiliateAnalyticsService affiliateAnalyticsService;
    @Mock
    private MerchantAnalyticsService merchantAnalyticsService;

    @InjectMocks
    private AiServiceImpl aiService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);

        // Intentionally setting geminiApiKey to empty string so it hits the mock fallback without making real API calls
        ReflectionTestUtils.setField(aiService, "geminiApiKey", "");
    }

    @Test
    void chat_withEmptyKey_returnsFallback() {
        ChatRequest req = new ChatRequest();
        req.setMessage("Hello");
        org.junit.jupiter.api.Assertions.assertThrows(IllegalStateException.class, () -> {
            aiService.chat(req, testUser);
        });
    }

    @Test
    void getAffiliateRecommendations_withEmptyKey_returnsFallback() {
        Product p = Product.builder().id(1L).name("Test").price(BigDecimal.TEN).build();
        when(productRepository.findAllByOrderByIdDesc()).thenReturn(List.of(p));

        org.junit.jupiter.api.Assertions.assertThrows(IllegalStateException.class, () -> {
            aiService.getAffiliateRecommendations("tech", null, testUser);
        });
    }

    @Test
    void getAffiliateRecommendations_noProducts_returnsMessage() {
        when(productRepository.findAllByOrderByIdDesc()).thenReturn(List.of());

        ChatResponse res = aiService.getAffiliateRecommendations("tech", null, testUser);
        assertNotNull(res.getReply());
        assertTrue(res.getReply().contains("No products found"));
    }

    @Test
    void generateAffiliateContent_withEmptyKey_returnsFallback() {
        Product p = Product.builder().id(1L).name("Test").price(BigDecimal.TEN).description("Desc").build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        org.junit.jupiter.api.Assertions.assertThrows(IllegalStateException.class, () -> {
            aiService.generateAffiliateContent(1L, "Twitter", "fun", testUser);
        });
    }

    @Test
    void generateMerchantProductContent_withEmptyKey_returnsFallback() {
        org.junit.jupiter.api.Assertions.assertThrows(IllegalStateException.class, () -> {
            aiService.generateMerchantProductContent("Product A", "Features", "Professional", testUser);
        });
    }

    @Test
    void getCampaignInsights_withEmptyKey_returnsFallback() {
        AnalyticsDashboardResponse mockData = AnalyticsDashboardResponse.builder()
                .kpis(com.kart.dto.analytics.AnalyticsKpiResponse.builder()
                        .totalClicks(100L)
                        .totalConversions(10L)
                        .totalSalesAmount(BigDecimal.valueOf(1000))
                        .totalEarnings(BigDecimal.valueOf(100))
                        .build())
                .build();

        when(merchantAnalyticsService.getDashboardAnalytics(eq(testUser), any())).thenReturn(mockData);

        org.junit.jupiter.api.Assertions.assertThrows(IllegalStateException.class, () -> {
            aiService.getCampaignInsights(1L, "this_month", testUser);
        });
    }

    @Test
    void getAffiliatePerformanceSummary_withEmptyKey_returnsFallback() {
        AnalyticsDashboardResponse mockData = AnalyticsDashboardResponse.builder()
                .kpis(com.kart.dto.analytics.AnalyticsKpiResponse.builder()
                        .totalClicks(100L)
                        .totalConversions(10L)
                        .totalEarnings(BigDecimal.valueOf(100))
                        .build())
                .build();

        when(affiliateAnalyticsService.getDashboardAnalytics(eq(testUser), any())).thenReturn(mockData);

        org.junit.jupiter.api.Assertions.assertThrows(IllegalStateException.class, () -> {
            aiService.getAffiliatePerformanceSummary("this_month", testUser);
        });
    }
}
