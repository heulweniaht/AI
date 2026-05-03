package com.healthcare.admin.controller;

import com.healthcare.admin.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class UserManagementController {

    private final UserManagementService userService;

    @PatchMapping("/{userId}/lock")
    public ResponseEntity<String> lockUser(
            @PathVariable Long userId,
            @RequestParam(required = false, defaultValue = "Vi phạm chính sách") String reason) {
        userService.lockUser(userId, reason);
        return ResponseEntity.ok("Đã khóa tài khoản " + userId);
    }

    @PatchMapping("/{userId}/unlock")
    public ResponseEntity<String> unlockUser(@PathVariable Long userId) {
        userService.unlockUser(userId);
        return ResponseEntity.ok("Đã mở khóa tài khoản " + userId);
    }
}