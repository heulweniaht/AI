package com.healthcare.gateway.filter;

import com.healthcare.gateway.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class JwtAuthGatewayFilterFactory extends AbstractGatewayFilterFactory<JwtAuthGatewayFilterFactory.Config> {

    private final JwtService jwtService;
    private final ReactiveStringRedisTemplate redisTemplate;

    //Danh sách API không cần kiểm tra token
    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/v1/auth", "/api/v1/doctors", "/api/v1/specialties",
            "/actuator", "/v3/api-docs"
    );

    public JwtAuthGatewayFilterFactory(JwtService jwtService, ReactiveStringRedisTemplate redisTemplate) {
        super(Config.class);
        this.jwtService = jwtService;
        this.redisTemplate = redisTemplate;
    }

    public static class Config {
        // Configuration properties
    }

    @Override
    public GatewayFilter apply(Config config) {
        return new org.springframework.cloud.gateway.filter.OrderedGatewayFilter((exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();

            if (path.startsWith("/eureka")) {
                return chain.filter(exchange);
            }
            //Kiểm tra API public
            boolean isPublic = PUBLIC_PATHS.stream().anyMatch(path::startsWith);
            if(isPublic && (request.getMethod().name().equals("GET") || path.contains("/api/v1/auth"))){
                return chain.filter(exchange);
            }

            //Kiểm tra Header Authorization
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")){
                return onError(exchange, "Thiếu hoặc sai định dạng Token", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            try {
                Claims claims = jwtService.extractAllClaims(token);
                String jti = claims.get("jti", String.class);

                return redisTemplate.hasKey("jti:blacklist:" + jti).flatMap(isBlacklisted -> {
                    if (Boolean.TRUE.equals(isBlacklisted)) {
                        return onError(exchange, "Token đã bị vô hiêu hoá (Đăng xuất)", HttpStatus.UNAUTHORIZED);
                    }

                    if (claims.getExpiration().before(new Date())) {
                        return onError(exchange, "Token đã hết hạn", HttpStatus.UNAUTHORIZED);
                    }

                    ServerHttpRequest mutatedRequest = request.mutate()
                            .header("X-User-Id", claims.get("userId", Long.class).toString())
                            .header("X-User-Role", claims.get("role", String.class))
                            .header("X-User-Email", claims.getSubject())
                            .build();

                    log.debug("Gateway - JWT hợp lệ : UserId={}, Role={}, API={}", claims.get("userId"), claims.get("role"), path);

                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                });
            }catch (JwtException e) {
                log.warn("Lỗi kiểm tra JWT tại Gateway: {}", e.getMessage());
                return onError(exchange, "Token không hợp lệ", HttpStatus.UNAUTHORIZED);
            }
        }, -1);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, "application/json");

        String body = String.format("{\"success\":false,\"status\":%d,\"message\":\"%s\"}", status.value(), message);
        DataBuffer buffer = response.bufferFactory().wrap(body.getBytes(StandardCharsets.UTF_8));

        return response.writeWith(Mono.just(buffer));
    }
}
