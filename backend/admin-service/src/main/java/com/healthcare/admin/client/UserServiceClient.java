package com.healthcare.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "AUTH-SERVICE") // Mượn Auth Service để lấy tổng User (vì Auth quản lý tài khoản)
public interface UserServiceClient {
    @GetMapping("/api/v1/auth/admin/users/count") // Yêu cầu bạn phải tạo API này bên Auth Service (nếu chưa có)
    long getTotalUsers();

    @PatchMapping("/api/v1/auth/admin/users/{userId}/status")
    void updateUserStatus(@PathVariable("userId") Long userId, @RequestParam("isLocked") boolean isLocked);
}