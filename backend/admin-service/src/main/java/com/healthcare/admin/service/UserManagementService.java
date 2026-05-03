package com.healthcare.admin.service;

import com.healthcare.admin.client.UserServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserManagementService {

    private final UserServiceClient userClient;

    public void lockUser(Long userId, String reason) {
        log.warn("Admin ra lệnh KHÓA tài khoản User ID: {}. Lý do: {}", userId, reason);
        // isLocked = true
        userClient.updateUserStatus(userId, true);
    }

    public void unlockUser(Long userId) {
        log.info("Admin ra lệnh MỞ KHÓA tài khoản User ID: {}", userId);
        // isLocked = false
        userClient.updateUserStatus(userId, false);
    }
}