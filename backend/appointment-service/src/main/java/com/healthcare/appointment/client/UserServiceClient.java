package com.healthcare.appointment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "USER-SERVICE", fallbackFactory = UserServiceFallbackFactory.class)
public interface UserServiceClient {

    // Giả sử User Service có API này để trả về tên
    @GetMapping("/api/v1/users/{userId}/name")
    String getPatientName(@PathVariable("userId") Long userId);
}