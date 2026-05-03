package com.healthcare.gateway.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.PublicKey;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    // Cơ chế: Đưa token vào, dùng chìa khóa bí mật (secret) để mở ổ khóa.
    // Nếu token bị giả mạo hoặc hết hạn, hàm này sẽ ném ra lỗi (JwtException).
    public Claims extractAllClaims(String token) throws JwtException {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Hàm tạo chìa khóa giải mã theo chuẩn HMAC-SHA
    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
