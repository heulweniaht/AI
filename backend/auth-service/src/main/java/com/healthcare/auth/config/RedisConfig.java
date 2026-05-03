package com.healthcare.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();

        // Sử dụng StringRedisSerializer để serialize/deserialize các Key của Redis thành String
        template.setConnectionFactory(connectionFactory);
        // Sử dụng GenericJackson2JsonRedisSerializer để serialize các Value thành JSON
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());

        // Cấu hình tương tự cho Hash Key/Value (nếu bạn dùng Hash)
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }
}
