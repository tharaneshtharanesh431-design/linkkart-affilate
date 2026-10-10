package com.kart.service;

import com.kart.dto.auth.AuthResponse;
import com.kart.dto.auth.LoginRequest;
import com.kart.dto.auth.RegisterRequest;
import com.kart.dto.auth.ForgotPasswordRequest;
import com.kart.dto.auth.ResetPasswordRequest;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(HttpServletRequest request);
    void logout(HttpServletRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
