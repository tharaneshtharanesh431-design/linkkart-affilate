package com.kart.controller;

import com.kart.dto.conversion.ConversionResponse;
import com.kart.service.ConversionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ConversionControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ConversionService conversionService;

    @Test
    @WithMockUser(roles = "MERCHANT")
    public void testGetAllConversions_Merchant_Forbidden() throws Exception {
        when(conversionService.getAllConversions()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/conversions"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "AFFILIATE")
    public void testGetAllConversions_Affiliate_Forbidden() throws Exception {
        when(conversionService.getAllConversions()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/conversions"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testGetAllConversions_Admin_Allowed() throws Exception {
        when(conversionService.getAllConversions()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/conversions"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "MERCHANT")
    public void testGetAllCommissions_Merchant_Forbidden() throws Exception {
        when(conversionService.getAllCommissions()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/commissions"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void testGetAllCommissions_Admin_Allowed() throws Exception {
        when(conversionService.getAllCommissions()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/commissions"))
                .andExpect(status().isOk());
    }
}
