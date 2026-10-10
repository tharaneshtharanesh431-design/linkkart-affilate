package com.kart.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> authCache = new ConcurrentHashMap<>();
    private final Map<String, Bucket> trackingCache = new ConcurrentHashMap<>();
    private final Map<String, Bucket> conversionCache = new ConcurrentHashMap<>();

    private Bucket createAuthBucket() {
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createTrackingBucket() {
        Bandwidth limit = Bandwidth.classic(200, Refill.greedy(200, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket createConversionBucket() {
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Bucket resolveBucket(Map<String, Bucket> cache, String ip, java.util.function.Supplier<Bucket> supplier) {
        return cache.computeIfAbsent(ip, k -> supplier.get());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        String ip = request.getRemoteAddr();

        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register") || path.startsWith("/api/auth/refresh") || path.startsWith("/api/ai")) {
            Bucket bucket = resolveBucket(authCache, ip, this::createAuthBucket);
            if (bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                sendRateLimitResponse(response);
            }
        } else if (path.startsWith("/t/")) {
            Bucket bucket = resolveBucket(trackingCache, ip, this::createTrackingBucket);
            if (bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                sendRateLimitResponse(response);
            }
        } else if (path.startsWith("/api/postback/conversion")) {
            Bucket bucket = resolveBucket(conversionCache, ip, this::createConversionBucket);
            if (bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                sendRateLimitResponse(response);
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }

    private void sendRateLimitResponse(HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.getWriter().write("{\"success\":false,\"message\":\"Too many requests. Please try again later.\"}");
    }
}
