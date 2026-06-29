package com.healthcare.auth.service;

import com.healthcare.auth.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
public class JwtService {
    @Value("${jwt.secret}") private String secret;
    @Value("${jwt.access-expiry}") private long accessExpiry;
    @Value("${jwt.refresh-expiry}") private long refreshExpiry;

    public String generateAccessToken (User user) {
        return Jwts.builder()
                .subject(user.getEmail())
                .claims(Map.of("userId", user.getId(), "role", user.getRole().name(), "jti", UUID.randomUUID().toString()))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessExpiry))
                .signWith(getSignKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String generateRefreshToken (String email) {
        return Jwts.builder()
                .subject(email)
                .expiration(new Date(System.currentTimeMillis() + refreshExpiry))
                .signWith(getSignKey(), Jwts.SIG.HS256)
                .compact();
    }

    public SecretKey getSignKey () {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getRemainingTtlMs(String token) {
        Date expiration = extractAllClaims(token).getExpiration();
        long remaining = expiration.getTime() - System.currentTimeMillis();
        return Math.max(remaining, 0);
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            return !extractAllClaims(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}
