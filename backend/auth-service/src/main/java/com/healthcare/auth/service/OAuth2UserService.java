package com.healthcare.auth.service;

import com.healthcare.auth.entity.Role;
import com.healthcare.auth.entity.User;
import com.healthcare.auth.entity.UserStatus;
import com.healthcare.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email    = oAuth2User.getAttribute("email");
        String fullName = oAuth2User.getAttribute("name");
        String picture  = oAuth2User.getAttribute("picture");

        // Tìm user đã tồn tại hoặc tạo mới (auto-register qua Google)
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            log.info("Tạo tài khoản mới qua Google OAuth2: {}", email);
            return userRepository.save(User.builder()
                    .email(email)
                    .fullName(fullName)
                    .passwordHash("")       // Không dùng mật khẩu thường
                    .role(Role.PATIENT)     // Đăng nhập Google mặc định là PATIENT
                    .status(UserStatus.ACTIVE)
                    .enabled(true)          // Google đã xác thực email rồi, không cần OTP
                    .build());
        });

        // Cập nhật avatar nếu chưa có
        if (picture != null && (user.getAvatarUrl() == null || user.getAvatarUrl().isBlank())) {
            user.setAvatarUrl(picture);
            userRepository.save(user);
        }

        return oAuth2User;
    }
}