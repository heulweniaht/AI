package com.healthcare.auth.controller;

import com.healthcare.auth.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    // Admin Service gọi vào đây để lấy tổng số User
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalUsers() {
        return ResponseEntity.ok(adminUserService.getTotalUsersCount());
    }

    // Admin Service gọi vào đây để khóa/mở khóa
    @PatchMapping("/{userId}/status")
    public ResponseEntity<Void> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam boolean isLocked) {

        adminUserService.updateUserStatus(userId, isLocked);
        return ResponseEntity.ok().build();
    }
}