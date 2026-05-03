package com.healthcare.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpService {
    private final StringRedisTemplate redis;

    public String generateAndStoreOtp(String email) {
        String otp = String.format("%06d", new SecureRandom().nextInt(999999));
        redis.opsForValue().set("otp:" + email, otp, 5, TimeUnit.MINUTES);
        return otp;
    }

    public boolean verifyOtp(String email, String inputOtp) {
        String storedOtp = redis.opsForValue().get("otp:" + email);
        if (inputOtp.equals(storedOtp)) {
            redis.delete("otp:" + email);
            return true;
        }
        return false;
    }
}
