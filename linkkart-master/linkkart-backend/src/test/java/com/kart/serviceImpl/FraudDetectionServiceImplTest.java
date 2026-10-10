package com.kart.serviceImpl;

import com.kart.dto.fraud.FraudReviewRequest;
import com.kart.entity.*;
import com.kart.repository.ClickRepository;
import com.kart.repository.ConversionRepository;
import com.kart.repository.FraudSignalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class FraudDetectionServiceImplTest {

    @Mock
    private FraudSignalRepository fraudSignalRepository;

    @Mock
    private ClickRepository clickRepository;

    @Mock
    private ConversionRepository conversionRepository;

    @InjectMocks
    private FraudDetectionServiceImpl fraudDetectionService;

    private User affiliate;
    private User merchant;
    private AffiliateLink link;
    private Click click;
    private Conversion conversion;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        ReflectionTestUtils.setField(fraudDetectionService, "fraudEnabled", true);
        ReflectionTestUtils.setField(fraudDetectionService, "clickBurstThreshold", 50);
        ReflectionTestUtils.setField(fraudDetectionService, "clickBurstWindowMinutes", 60);
        ReflectionTestUtils.setField(fraudDetectionService, "payoutRequestThreshold", 3);

        affiliate = User.builder().id(1L).email("affiliate@test.com").build();
        merchant = User.builder().id(2L).email("merchant@test.com").build();
        Organization org = Organization.builder().id(1L).name("Test Org").build();
        Campaign campaign = Campaign.builder().id(1L).organization(org).build();
        link = AffiliateLink.builder().id(1L).affiliate(affiliate).campaign(campaign).build();
        
        click = Click.builder()
                .id(1L)
                .trackingId("trk_123")
                .affiliateLink(link)
                .ipHash("hash123")
                .userAgent("Mozilla")
                .clickedAt(LocalDateTime.now())
                .build();
                
        conversion = Conversion.builder()
                .id(1L)
                .trackingId("trk_123")
                .affiliateLink(link)
                .orderAmount(BigDecimal.valueOf(100))
                .orderReference("ord_123")
                .convertedAt(LocalDateTime.now())
                .build();
    }

    // CLICK TESTS
    @Test
    void testNormalClickIsAccepted() {
        when(clickRepository.countByIpHashAndClickedAtAfter(anyString(), any())).thenReturn(1L);
        fraudDetectionService.evaluateClick(click);
        verify(fraudSignalRepository, never()).save(any(FraudSignal.class));
    }

    @Test
    void testClickBurstDetectionWorks() {
        when(clickRepository.countByIpHashAndClickedAtAfter(anyString(), any())).thenReturn(51L);
        when(fraudSignalRepository.existsByClickIdAndType(anyLong(), eq(FraudSignalType.CLICK_BURST))).thenReturn(false);
        
        fraudDetectionService.evaluateClick(click);
        
        verify(fraudSignalRepository, times(1)).save(argThat(s -> s.getType() == FraudSignalType.CLICK_BURST));
    }

    @Test
    void testBotLikeSignalWorks() {
        click.setUserAgent("Googlebot/2.1");
        when(clickRepository.countByIpHashAndClickedAtAfter(anyString(), any())).thenReturn(1L);
        when(fraudSignalRepository.existsByClickIdAndType(anyLong(), eq(FraudSignalType.AUTOMATED_TRAFFIC))).thenReturn(false);
        
        fraudDetectionService.evaluateClick(click);
        
        verify(fraudSignalRepository, times(1)).save(argThat(s -> s.getType() == FraudSignalType.AUTOMATED_TRAFFIC));
    }

    // CONVERSION TESTS
    @Test
    void testConversionAnomalyDetectionWorks_HighAmount() {
        conversion.setOrderAmount(BigDecimal.valueOf(15000)); // Above 10000 threshold
        
        fraudDetectionService.evaluateConversion(conversion, "secret");
        
        verify(fraudSignalRepository, times(1)).save(argThat(s -> s.getType() == FraudSignalType.SUSPICIOUS_CONVERSION_RATE));
    }

    @Test
    void testConversionAnomalyDetectionWorks_HighVolume() {
        when(conversionRepository.countByAffiliateLink_Affiliate_IdAndConvertedAtAfter(anyLong(), any())).thenReturn(25L);
        
        fraudDetectionService.evaluateConversion(conversion, "secret");
        
        verify(fraudSignalRepository, times(1)).save(argThat(s -> s.getType() == FraudSignalType.SUSPICIOUS_CONVERSION_RATE));
    }

    // PAYOUT TESTS
    @Test
    void testPayoutSuspiciousBehaviorCreatesSignal() {
        when(fraudSignalRepository.findByAffiliateIdAndStatus(anyLong(), eq(FraudSignalStatus.OPEN)))
                .thenReturn(List.of(FraudSignal.builder().severity(FraudSeverity.HIGH).build()));
                
        fraudDetectionService.evaluatePayoutRequest(affiliate, BigDecimal.valueOf(100));
        
        verify(fraudSignalRepository, times(1)).save(argThat(s -> s.getType() == FraudSignalType.SUSPICIOUS_ACCOUNT_ACTIVITY));
    }

    // SECURITY TESTS
    @Test
    void testAdminCanReviewSignal() {
        FraudSignal signal = FraudSignal.builder().id(1L).status(FraudSignalStatus.OPEN).build();
        when(fraudSignalRepository.findById(1L)).thenReturn(Optional.of(signal));
        when(fraudSignalRepository.save(any(FraudSignal.class))).thenReturn(signal);
        
        User admin = User.builder().id(3L).email("admin@test.com").build();
        FraudReviewRequest request = new FraudReviewRequest();
        request.setStatus(FraudSignalStatus.CONFIRMED);
        request.setReviewNotes("Looks like fraud");
        
        fraudDetectionService.reviewSignal(1L, request, admin);
        
        assertEquals(FraudSignalStatus.CONFIRMED, signal.getStatus());
        assertNotNull(signal.getReviewedAt());
        assertEquals(admin, signal.getReviewedBy());
        assertTrue(signal.getReason().contains("Looks like fraud"));
    }
}
