package com.healthcare.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "DOCTOR-SERVICE")
public interface DoctorServiceClient {
    // Gọi API khởi tạo hồ sơ bác sĩ (API này đã có sẵn bên DoctorService của bạn)
    @PostMapping("/api/v1/doctors/internal/init-profile")
    void initDoctorProfile(@RequestParam("userId") Long userId, @RequestParam("fullName") String fullName);
}