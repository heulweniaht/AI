package com.healthcare.auth.config;

import com.healthcare.auth.service.OAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;

@Configuration
@RequiredArgsConstructor
public class OAuth2Config {

    private final OAuth2UserService oAuth2UserService;

    // Bean này được SecurityConfig dùng — không cần thêm gì nữa.
    // Chỉ để đây làm điểm import nếu cần custom resolver sau này.
    @Bean
    public OAuth2AuthorizationRequestResolver authorizationRequestResolver(
            ClientRegistrationRepository repo) {
        return new DefaultOAuth2AuthorizationRequestResolver(
                repo, "/oauth2/authorization");
    }
}