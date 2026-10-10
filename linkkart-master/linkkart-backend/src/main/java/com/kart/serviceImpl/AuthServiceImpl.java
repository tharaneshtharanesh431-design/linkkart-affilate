package com.kart.serviceImpl;

import com.kart.dto.auth.AuthResponse;
import com.kart.dto.auth.LoginRequest;
import com.kart.dto.auth.RegisterRequest;
import com.kart.dto.auth.ForgotPasswordRequest;
import com.kart.dto.auth.ResetPasswordRequest;
import com.kart.entity.PasswordResetToken;
import com.kart.repository.PasswordResetTokenRepository;
import com.kart.event.PasswordResetRequestedEvent;
import org.springframework.context.ApplicationEventPublisher;
import com.kart.entity.RefreshToken;
import com.kart.entity.Role;
import com.kart.entity.User;
import com.kart.exception.BadRequestException;
import com.kart.exception.ConflictException;
import com.kart.jwt.JwtUtils;
import com.kart.repository.RefreshTokenRepository;
import com.kart.repository.RoleRepository;
import com.kart.repository.UserRepository;
import com.kart.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    @Value("${jwt.refresh-token-expiration-ms:604800000}")
    private long refreshTokenDurationMs;

    private String hashToken(String token) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return java.util.Base64.getEncoder().encodeToString(hash);
        } catch (java.security.NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already registered");
        }

        Role role = getRoleFromRequest(request);

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        return authenticateAndGenerateTokens(request.getEmail(), request.getPassword());
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        return authenticateAndGenerateTokens(request.getEmail(), request.getPassword());
    }

    @Override
    @Transactional
    public AuthResponse refresh(HttpServletRequest request) {
        String plainRefreshTokenId = jwtUtils.getJwtFromCookies(request, jwtUtils.REFRESH_TOKEN_COOKIE_NAME);
        if (plainRefreshTokenId == null) {
            throw new BadRequestException("Refresh token is missing");
        }

        String hashedTokenId = hashToken(plainRefreshTokenId);
        RefreshToken token = refreshTokenRepository.findByTokenId(hashedTokenId)
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (token.getRevokedAt() != null || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Refresh token is expired or revoked");
        }

        User user = token.getUser();
        String roleName = user.getRole().getName();

        // Rotate token
        token.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(token);

        String newAccessToken = jwtUtils.generateAccessToken(user.getEmail(), roleName);
        String newPlainRefreshToken = jwtUtils.generateRefreshTokenId();
        
        RefreshToken newRefreshToken = RefreshToken.builder()
                .user(user)
                .tokenId(hashToken(newPlainRefreshToken))
                .expiresAt(LocalDateTime.now().plusNanos(refreshTokenDurationMs * 1000000))
                .build();
        refreshTokenRepository.save(newRefreshToken);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newPlainRefreshToken)
                .email(user.getEmail())
                .role(roleName)
                .onboardingCompleted(user.isOnboardingCompleted())
                .build();
    }

    @Override
    @Transactional
    public void logout(HttpServletRequest request) {
        String plainRefreshTokenId = jwtUtils.getJwtFromCookies(request, jwtUtils.REFRESH_TOKEN_COOKIE_NAME);
        if (plainRefreshTokenId != null) {
            String hashedTokenId = hashToken(plainRefreshTokenId);
            refreshTokenRepository.findByTokenId(hashedTokenId).ifPresent(token -> {
                token.setRevokedAt(LocalDateTime.now());
                refreshTokenRepository.save(token);
            });
        }
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String plainToken = java.util.UUID.randomUUID().toString();
            String hashedToken = hashToken(plainToken);
            
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .user(user)
                    .tokenHash(hashedToken)
                    .expiresAt(LocalDateTime.now().plusHours(1))
                    .build();
            passwordResetTokenRepository.save(resetToken);
            
            applicationEventPublisher.publishEvent(PasswordResetRequestedEvent.builder()
                    .userId(user.getId())
                    .email(user.getEmail())
                    .resetToken(plainToken) // We emit the raw token to the event so it can be emailed, NEVER stored in DB raw.
                    .timestamp(LocalDateTime.now())
                    .build());
        });
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String hashedToken = hashToken(request.getToken());
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(hashedToken)
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));
                
        if (resetToken.isUsed()) {
            throw new BadRequestException("Reset token has already been used");
        }
        
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }
        
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }

    private AuthResponse authenticateAndGenerateTokens(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(email).orElseThrow(() -> new BadRequestException("User not found"));
        String roleName = user.getRole().getName();

        String accessToken = jwtUtils.generateAccessToken(user.getEmail(), roleName);
        
        String plainRefreshToken = jwtUtils.generateRefreshTokenId();
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenId(hashToken(plainRefreshToken))
                .expiresAt(LocalDateTime.now().plusNanos(refreshTokenDurationMs * 1000000))
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(plainRefreshToken)
                .email(user.getEmail())
                .role(roleName)
                .onboardingCompleted(user.isOnboardingCompleted())
                .build();
    }

    private Role getRoleFromRequest(RegisterRequest request) {
        String roleName = "AFFILIATE";
        if (request.getRole() != null && !request.getRole().isBlank()) {
            roleName = request.getRole().trim().toUpperCase();
            if (roleName.equals("ADMIN")) {
                throw new BadRequestException("Cannot register as ADMIN");
            }
        }
        String finalRoleName = roleName;
        return roleRepository.findByName(finalRoleName)
                .orElseGet(() -> roleRepository.save(Role.builder().name(finalRoleName).build()));
    }
}
