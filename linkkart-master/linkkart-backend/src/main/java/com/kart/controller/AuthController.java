package com.kart.controller;

import com.kart.dto.ApiResponse;
import com.kart.dto.auth.AuthResponse;
import com.kart.dto.auth.LoginRequest;
import com.kart.dto.auth.RegisterRequest;
import com.kart.jwt.JwtUtils;
import com.kart.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication")
public class AuthController {
    private final AuthService authService;
    private final JwtUtils jwtUtils;

    @Value("${jwt.access-token-expiration-ms:900000}")
    private long accessTokenExpirationMs;

    @Value("${jwt.refresh-token-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.SET_COOKIE, jwtUtils.generateCookie(jwtUtils.ACCESS_TOKEN_COOKIE_NAME, response.getAccessToken(), accessTokenExpirationMs / 1000).toString())
                .header(HttpHeaders.SET_COOKIE, jwtUtils.generateCookie(jwtUtils.REFRESH_TOKEN_COOKIE_NAME, response.getRefreshToken(), refreshTokenExpirationMs / 1000).toString())
                .body(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate a user")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtUtils.generateCookie(jwtUtils.ACCESS_TOKEN_COOKIE_NAME, response.getAccessToken(), accessTokenExpirationMs / 1000).toString())
                .header(HttpHeaders.SET_COOKIE, jwtUtils.generateCookie(jwtUtils.REFRESH_TOKEN_COOKIE_NAME, response.getRefreshToken(), refreshTokenExpirationMs / 1000).toString())
                .body(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(HttpServletRequest request) {
        AuthResponse response = authService.refresh(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtUtils.generateCookie(jwtUtils.ACCESS_TOKEN_COOKIE_NAME, response.getAccessToken(), accessTokenExpirationMs / 1000).toString())
                .header(HttpHeaders.SET_COOKIE, jwtUtils.generateCookie(jwtUtils.REFRESH_TOKEN_COOKIE_NAME, response.getRefreshToken(), refreshTokenExpirationMs / 1000).toString())
                .body(ApiResponse.success("Token refreshed successfully", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        authService.logout(request);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtUtils.getCleanCookie(jwtUtils.ACCESS_TOKEN_COOKIE_NAME).toString())
                .header(HttpHeaders.SET_COOKIE, jwtUtils.getCleanCookie(jwtUtils.REFRESH_TOKEN_COOKIE_NAME).toString())
                .body(ApiResponse.success("Logout successful", null));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody com.kart.dto.auth.ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success("If the email is registered, a password reset link will be sent.", null));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody com.kart.dto.auth.ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password has been reset successfully.", null));
    }
}
