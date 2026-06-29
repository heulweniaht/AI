package com.healthcare.auth.controller;

import com.healthcare.auth.dto.request.LoginRequest;
import com.healthcare.auth.dto.request.RefreshTokenRequest;
import com.healthcare.auth.dto.request.RegisterRequest;
import com.healthcare.auth.dto.response.AuthResponse;
import com.healthcare.auth.entity.User;
import com.healthcare.auth.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(authService.logout(authHeader));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestParam @Email String email,
            @RequestParam String otp) {
        return ResponseEntity.ok(authService.verifyOtp(email, otp));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    /**
     * POST /api/v1/auth/forgot-password?email=user@example.com
     * Sinh mật khẩu mới ngẫu nhiên, gửi về email thật qua Kafka → Notification-Service.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam @Email String email) {
        return ResponseEntity.ok(authService.forgotPassword(email));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe(@RequestHeader("X-User-Email") String email) {
        return ResponseEntity.ok(authService.getUserByEmail(email));
    }
}
