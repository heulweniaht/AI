package com.healthcare.auth.dto.response;

import com.healthcare.auth.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType;
    private long expiresIn;
    private Long userId;
    private String role;

    private User user;
}
