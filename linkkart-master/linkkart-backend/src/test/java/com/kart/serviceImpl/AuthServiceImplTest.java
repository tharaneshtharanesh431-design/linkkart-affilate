package com.kart.serviceImpl;

import com.kart.dto.auth.AuthResponse;
import com.kart.dto.auth.LoginRequest;
import com.kart.dto.auth.RegisterRequest;
import com.kart.entity.Role;
import com.kart.entity.User;
import com.kart.repository.RoleRepository;
import com.kart.repository.UserRepository;
import com.kart.jwt.JwtUtils;
import com.kart.service.AuthService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")

    public class AuthServiceImplTest {
    @Autowired
    private com.kart.repository.RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        roleRepository.findByName("AFFILIATE").orElseGet(() -> roleRepository.save(Role.builder().name("AFFILIATE").build()));
        roleRepository.findByName("MERCHANT").orElseGet(() -> roleRepository.save(Role.builder().name("MERCHANT").build()));
    }

    @AfterEach
    void tearDown() {
        refreshTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    void testSuccessfulRegistrationAndLogin() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("auth@test.com");
        req.setPassword("SecurePass123!");
        req.setRole("AFFILIATE");

        AuthResponse res = authService.register(req);
        assertNotNull(res);
        assertNotNull(res.getAccessToken()); // Checking if token is returned

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("auth@test.com");
        loginReq.setPassword("SecurePass123!");

        AuthResponse loginRes = authService.login(loginReq);
        assertNotNull(loginRes);
    }

    @Test
    void testInvalidLogin() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("auth2@test.com");
        req.setPassword("SecurePass123!");
        req.setRole("AFFILIATE");

        authService.register(req);

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("auth2@test.com");
        loginReq.setPassword("WrongPass!");

        assertThrows(org.springframework.security.authentication.BadCredentialsException.class, () -> {
            authService.login(loginReq);
        });
    }

    @Test
    void testRefreshToken() {
        RegisterRequest req = new RegisterRequest();
        req.setEmail("auth3@test.com");
        req.setPassword("SecurePass123!");
        req.setRole("AFFILIATE");

        authService.register(req);

        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("auth3@test.com");
        loginReq.setPassword("SecurePass123!");

        AuthResponse authRes = authService.login(loginReq);
        
        MockHttpServletRequest refreshReq = new MockHttpServletRequest();
        refreshReq.setCookies(new jakarta.servlet.http.Cookie("refresh_token", authRes.getRefreshToken()));
        refreshReq.setRemoteAddr("127.0.0.1");
        
        AuthResponse refRes = authService.refresh(refreshReq);
        assertNotNull(refRes);
        assertNotNull(refRes.getAccessToken());
    }
}
