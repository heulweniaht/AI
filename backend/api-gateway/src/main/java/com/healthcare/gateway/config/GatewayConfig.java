package com.healthcare.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import reactor.core.publisher.Mono;

import java.util.Objects;

@Configuration
public class GatewayConfig {

    //Giới hạn dựa trên IP
    @Bean
    @Primary
    public KeyResolver ipKeyResolver(){
        return exchange -> Mono.just(
                Objects.requireNonNull(exchange.getRequest().getRemoteAddress().getAddress().getHostAddress())
        );
    }

    // Giới hạn dựa trên UserID (chặn số lần đặt quá nhiều / s)
    @Bean
    public KeyResolver userKeyResolver(){
        return exchange -> Mono.just(
                exchange.getRequest().getHeaders().getFirst("X-User-Id") != null
                ? Objects.requireNonNull(exchange.getRequest().getHeaders().getFirst("X-User-Id"))
                        : "anonymous"
        );
    }
}
