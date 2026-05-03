package com.healthcare.appointment.config;

import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    // Bật log chi tiết để dễ debug khi 2 service nói chuyện với nhau
    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }
}