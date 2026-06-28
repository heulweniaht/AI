package com.healthcare.auth.service;

import com.healthcare.auth.client.DoctorServiceClient;
import com.healthcare.auth.dto.request.LoginRequest;
import com.healthcare.auth.dto.request.RegisterRequest;
import com.healthcare.auth.dto.response.AuthResponse;
import com.healthcare.auth.entity.User;
import com.healthcare.auth.entity.Role;
import com.healthcare.auth.entity.UserStatus;
import com.healthcare.auth.repository.UserRepository;
import com.healthcare.auth.kafka.AuthEventProducer;
import com.healthcare.auth.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final AuthEventProducer eventProducer;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final RedisTemplate<String, Object> redis;
    private final DoctorServiceClient doctorServiceClient;

    @Override
    @Transactional
    public String register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        boolean isDoctor = req.getRole().equalsIgnoreCase("DOCTOR");

        // DOCTOR: khóa chờ Admin phê duyệt chứng chỉ
        // PATIENT/USER: khóa chờ xác thực OTP (sẽ mở sau khi verify)
        User user = User.builder()
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .role(Role.valueOf(req.getRole().toUpperCase()))
                .status(UserStatus.PENDING_VERIFY)
                .enabled(false)
                .build();

        User savedUser = userRepository.save(user);

        if (isDoctor) {
            try {
                doctorServiceClient.initDoctorProfile(savedUser.getId(), savedUser.getFullName());
            } catch (Exception e) {
                log.error("Lỗi khi đồng bộ DoctorProfile: {}", e.getMessage());
                throw new RuntimeException("Lỗi hệ thống khi tạo hồ sơ bác sĩ.");
            }
            return "Đăng ký thành công. Tài khoản bác sĩ đang chờ Admin phê duyệt.";
        }

        // PATIENT: sinh OTP → đẩy vào Kafka → Notification-Service gửi email
        String otp = otpService.generateAndStoreOtp(savedUser.getEmail());
        eventProducer.publishOtpRequested(savedUser.getEmail(), savedUser.getFullName(), otp);

        return "Đăng ký thành công. Vui lòng kiểm tra email để nhận mã OTP xác thực.";
    }

    @Override
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Tài khoản hoặc mật khẩu không chính xác"));

        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
        } catch (org.springframework.security.authentication.DisabledException e) {
            if (user.getRole() == Role.DOCTOR) {
                throw new RuntimeException("Tài khoản đang chờ Admin phê duyệt.");
            } else {
                throw new RuntimeException("Tài khoản chưa được kích hoạt OTP. Vui lòng kiểm tra email.");
            }
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            throw new RuntimeException("Tài khoản hoặc mật khẩu không chính xác");
        }

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        redis.opsForValue().set(
                "rt:" + user.getId(),
                refreshToken,
                7, TimeUnit.DAYS
        );

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .expiresIn(900)
                .userId(user.getId())
                .role(user.getRole().name())
                .user(user)
                .build();
    }

    @Override
    public String verifyOtp(String email, String otp) {
        boolean valid = otpService.verifyOtp(email, otp);
        if (!valid) {
            throw new RuntimeException("OTP không hợp lệ hoặc đã hết hạn");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // Mở khóa PATIENT sau khi xác thực OTP thành công
        user.setEnabled(true);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);

        return "Xác thực tài khoản thành công! Bạn có thể đăng nhập.";
    }

    @Override
    @Transactional
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với email này"));

        // Sinh mật khẩu ngẫu nhiên 10 ký tự
        String newPassword = PasswordUtil.generateRandomPassword();

        // Cập nhật mật khẩu mới (đã mã hóa) vào DB
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Đẩy event vào Kafka → Notification-Service gửi email chứa mật khẩu mới
        eventProducer.publishForgotPassword(email, user.getFullName(), newPassword);

        return "Mật khẩu mới đã được gửi về email của bạn.";
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin tài khoản"));
    }
}
