package com.healthcare.auth.controller;

import com.healthcare.auth.dto.response.AuthResponse;
import com.healthcare.auth.entity.User;
import com.healthcare.auth.repository.UserRepository;
import com.healthcare.auth.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/v1/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RedisTemplate<String, Object> redis;

    /**
     * Sau khi Google redirect về, Spring Security đã xử lý xong.
     * Endpoint này sinh JWT và trả về cho frontend.
     * Frontend redirect về đây sau khi Google login thành công.
     */
    @GetMapping("/success")
    public ResponseEntity<AuthResponse> oAuth2Success(
            @AuthenticationPrincipal OAuth2User oAuth2User) {

        String email = oAuth2User.getAttribute("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        String accessToken  = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(email);

        redis.opsForValue().set("rt:" + user.getId(), refreshToken, 7, TimeUnit.DAYS);

        return ResponseEntity.ok(AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(900)
                .userId(user.getId())
                .role(user.getRole().name())
                .build());
    }
}