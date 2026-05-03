package com.healthcare.auth.service;

import com.healthcare.auth.dto.request.LoginRequest;
import com.healthcare.auth.dto.request.RegisterRequest;
import com.healthcare.auth.dto.response.AuthResponse;

public interface AuthService {
    String register(RegisterRequest req);
    AuthResponse login(LoginRequest req);
    String verifyOtp(String email, String otp);
}