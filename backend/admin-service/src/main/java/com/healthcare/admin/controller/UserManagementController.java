package com.healthcare.admin.controller;

import com.healthcare.admin.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    @GetMapping
    public ResponseEntity<Object> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(userService.searchUsers(keyword, role, page, size));
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<String> toggleUserStatus(
            @PathVariable Long userId,
            @RequestBody Map<String, Boolean> body) {

        boolean isLocked = body.getOrDefault("isLocked", false);

        if (isLocked) {
            userService.lockUser(userId, "Vi phạm chính sách");
            return ResponseEntity.ok("Đã khóa tài khoản");
        } else {
            userService.unlockUser(userId);
            return ResponseEntity.ok("Đã mở khóa tài khoản");
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("Đã xóa tài khoản thành công");
    }
}