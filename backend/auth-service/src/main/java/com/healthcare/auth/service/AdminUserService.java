package com.healthcare.auth.service;

import com.healthcare.auth.entity.User;
import com.healthcare.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
        userRepository.save(user);

        log.info("Đã thay đổi trạng thái isLocked của User {} thành {}", userId, isLocked);
    }
}