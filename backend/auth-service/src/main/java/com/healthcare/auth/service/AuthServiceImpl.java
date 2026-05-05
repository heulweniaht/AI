package com.healthcare.auth.service;

import com.healthcare.auth.dto.request.LoginRequest;
import com.healthcare.auth.dto.request.RegisterRequest;
import com.healthcare.auth.dto.response.AuthResponse;
import com.healthcare.auth.entity.User;
import com.healthcare.auth.entity.Role;
import com.healthcare.auth.repository.UserRepository;
import com.healthcare.auth.kafka.AuthEventProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final AuthEventProducer eventProducer;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final RedisTemplate<String, Object> redis;

    @Override
    @Transactional
    public String register(RegisterRequest req) {
        // 1. Kiểm tra email đã tồn tại chưa [cite: 314-315]
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        // 2. Tạo User và băm mật khẩu bằng BCrypt [cite: 116, 321-329]
        User user = User.builder()
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .role(Role.valueOf(req.getRole().toUpperCase()))
                .enabled(false)
                .build();
        userRepository.save(user);

        // 3. Xử lý OTP và thông báo qua Kafka [cite: 117-118, 333-334]
        String otp = otpService.generateAndStoreOtp(user.getEmail());
        eventProducer.publishOtpRequested(user.getEmail(), user.getFullName(), otp);

        return "Đăng ký thành công. Vui lòng kiểm tra email nhận mã OTP.";
    }

    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // 3. Kiểm tra xem đã kích hoạt OTP chưa
        if (!user.isEnabled()) {
            throw new RuntimeException("Tài khoản chưa được kích hoạt. Vui lòng xác minh OTP.");
        }

        // 4. Sinh cặp Token
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        // 5. Lưu Refresh Token vào Redis (Sống 7 ngày)
        // Việc này giúp ta có thể khóa tài khoản (thu hồi token) bất kỳ lúc nào bằng cách xóa nó khỏi Redis.
        redis.opsForValue().set(
                "rt:" + user.getId(), // Key trong Redis
                refreshToken,         // Giá trị
                7, TimeUnit.DAYS      // Hạn sử dụng
        );

        // 6. Trả kết quả
        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(900) // 15 phút (theo cấu hình của bạn)
                .userId(user.getId())
                .role(user.getRole().name())
                .build();
    }

    public String verifyOtp(String email, String otp){
        boolean valid = otpService.verifyOtp(email,otp);
        if (!valid) {
            throw new RuntimeException("OTP không hợp lệ hoặc đã hết hạn");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        user.setEnabled(true);
        userRepository.save(user);

        return "Xác thực tài khoản thành công! Bạn có thể đăng nhập";
    }
}



