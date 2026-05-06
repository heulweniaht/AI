package com.healthcare.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "AUTH-SERVICE") // Mượn Auth Service để lấy tổng User (vì Auth quản lý tài khoản)
public interface UserServiceClient {
    @GetMapping("/api/v1/auth/admin/users/count") // Yêu cầu bạn phải tạo API này bên Auth Service (nếu chưa có)
    long getTotalUsers();

    @PutMapping ("/api/v1/auth/admin/users/{userId}/status")
    void updateUserStatus(@PathVariable("userId") Long userId, @RequestParam("isLocked") boolean isLocked);

    @GetMapping("/api/v1/auth/admin/users/search")
    Object searchUsers(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "page") int page,
            @RequestParam(value = "size") int size);


    @PutMapping("/api/v1/auth/admin/users/{userId}/enable")
    void enableUser(@PathVariable("userId") Long userId);

    @DeleteMapping("/api/v1/auth/admin/users/{userId}")
    void deleteUser(@org.springframework.web.bind.annotation.PathVariable("userId") Long userId);
}