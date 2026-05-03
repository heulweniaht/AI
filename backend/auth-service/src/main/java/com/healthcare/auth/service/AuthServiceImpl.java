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
//    // ── ĐĂNG NHẬP ────────────────────────────────────────────────────────
//    @Override
//    public AuthResponse login(LoginRequest req, HttpServletResponse response) {
//        // 1. Xác thực qua Spring Security AuthenticationManager
//        try {
//            authManager.authenticate(
//                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
//            );
//        } catch (BadCredentialsException e) {
//            throw new InvalidCredentialsException("Email hoặc mật khẩu không đúng");
//        }
//
//        // 2. Load user
//        User user = userRepository.findByEmail(req.getEmail())
//                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy user"));
//
//        if (user.getStatus() == UserStatus.PENDING_VERIFY) {
//            throw new AccountNotVerifiedException("Tài khoản chưa xác minh email");
//        }
//        if (user.getStatus() == UserStatus.BANNED) {
//            throw new AccountBannedException("Tài khoản đã bị khoá");
//        }
//
//        // 3. Tạo tokens
//        String accessToken  = jwtService.generateAccessToken(user);
//        String refreshToken = jwtService.generateRefreshToken(user.getEmail());
//
//        // 4. Lưu refresh token hash vào Redis (TTL 7 ngày)
//        String rtHash = DigestUtils.sha256Hex(refreshToken);
//        redis.opsForValue().set(
//                "rt:" + user.getId(),
//                rtHash,
//                7, TimeUnit.DAYS
//        );
//
//        // 5. Set HttpOnly Cookie cho Refresh Token
//        Cookie rtCookie = new Cookie("refreshToken", refreshToken);
//        rtCookie.setHttpOnly(true);
//        rtCookie.setSecure(true);       // HTTPS only
//        rtCookie.setPath("/api/v1/auth/refresh");
//        rtCookie.setMaxAge(7 * 24 * 3600);
//        response.addCookie(rtCookie);
//
//        // 6. Cập nhật last login
//        user.setLastLoginAt(LocalDateTime.now());
//        userRepository.save(user);
//
//        log.info("User logged in: id={}, email={}", user.getId(), user.getEmail());
//        return AuthResponse.builder()
//                .accessToken(accessToken)
//                .tokenType("Bearer")
//                .expiresIn(900)
//                .userId(user.getId())
//                .role(user.getRole().name())
//                .build();
//    }
//
//    // ── XÁC MINH OTP ─────────────────────────────────────────────────────
//    @Override
//    public MessageResponse verifyOtp(VerifyOtpRequest req) {
//        boolean valid = otpService.verifyOtp(req.getEmail(), req.getOtp());
//        if (!valid) throw new InvalidOtpException("OTP không đúng hoặc đã hết hạn");
//
//        User user = userRepository.findByEmail(req.getEmail())
//                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy user"));
//        user.setStatus(UserStatus.ACTIVE);
//        userRepository.save(user);
//
//        // Notify Kafka
//        eventProducer.publishUserRegistered(user.getId(), user.getEmail(), user.getFullName(), user.getRole().name());
//        return new MessageResponse("Xác minh thành công! Bạn có thể đăng nhập.");
//    }
//
//    // ── REFRESH TOKEN ─────────────────────────────────────────────────────
//    @Override
//    public AuthResponse refreshToken(HttpServletRequest request) {
//        String refreshToken = extractCookieValue(request, "refreshToken");
//        if (refreshToken == null) throw new InvalidTokenException("Không tìm thấy refresh token");
//
//        String email   = jwtService.extractEmail(refreshToken);
//        User user      = userRepository.findByEmail(email)
//                .orElseThrow(() -> new UserNotFoundException("User không tồn tại"));
//
//        // Verify hash trong Redis
//        String storedHash = redis.opsForValue().get("rt:" + user.getId());
//        String incomingHash = DigestUtils.sha256Hex(refreshToken);
//        if (!incomingHash.equals(storedHash)) {
//            throw new InvalidTokenException("Refresh token không hợp lệ hoặc đã bị thu hồi");
//        }
//
//        String newAccessToken = jwtService.generateAccessToken(user);
//        return AuthResponse.builder()
//                .accessToken(newAccessToken)
//                .expiresIn(900)
//                .tokenType("Bearer")
//                .build();
//    }
//
//    // ── LOGOUT ───────────────────────────────────────────────────────────
//    @Override
//    public MessageResponse logout(String accessToken, Long userId, HttpServletResponse response) {
//        // Blacklist JWT (JTI) cho đến khi hết hạn
//        String jti = jwtService.extractJti(accessToken);
//        redis.opsForValue().set("jti:blacklist:" + jti, "REVOKED", 15, TimeUnit.MINUTES);
//
//        // Xoá refresh token
//        redis.delete("rt:" + userId);
//
//        // Clear cookie
//        Cookie c = new Cookie("refreshToken", ""); c.setMaxAge(0); c.setPath("/");
//        response.addCookie(c);
//        return new MessageResponse("Đăng xuất thành công");
//    }


