package com.healthcare.auth.service;

import com.healthcare.auth.entity.Role;
import com.healthcare.auth.entity.User;
import com.healthcare.auth.entity.UserStatus;
import com.healthcare.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminUserService {

    private final UserRepository userRepository;

    // Đếm tổng số lượng User trong hệ thống
    public long getTotalUsersCount() {
        return userRepository.count();
    }

    // Cập nhật trạng thái Khóa/Mở khóa
    @Transactional
    public void updateUserStatus(Long userId, boolean isLocked) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User ID: " + userId));

        user.setLocked(isLocked);
        user.setStatus(isLocked ? UserStatus.BANNED : UserStatus.ACTIVE);
        userRepository.save(user);

        log.info("Đã thay đổi trạng thái isLocked của User {} thành {}", userId, isLocked);
    }
    public Page<User> searchUsers(String keyword, String roleStr, int page, int size) {
        Role role = (roleStr != null && !roleStr.isEmpty()) ? Role.valueOf(roleStr) : null;
        return userRepository.searchUsers(
                keyword,
                role,
                org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by("createdAt").descending())
        );
    }

    @Transactional
    public void enableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy User ID: " + userId));

        user.setEnabled(true); // Bật quyền đăng nhập
        user.setStatus(UserStatus.ACTIVE); // Cập nhật trạng thái thành ACTIVE
        userRepository.save(user);

        log.info("Đã kích hoạt (enable = true, ACTIVE) cho User ID: {}", userId);
    }
}