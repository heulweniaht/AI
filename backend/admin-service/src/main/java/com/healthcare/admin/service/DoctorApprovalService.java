package com.healthcare.admin.service;

import com.healthcare.admin.client.DoctorServiceClient;
import com.healthcare.admin.client.UserServiceClient;
import com.healthcare.admin.dto.DoctorApprovalRequest;
import com.healthcare.admin.kafka.AdminEventProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorApprovalService {

    private final DoctorServiceClient doctorClient;
    private final AdminEventProducer eventProducer;
    // Thêm UserServiceClient vào khai báo
    private final UserServiceClient userClient;

    public void processApproval(Long doctorId, DoctorApprovalRequest request) {
        String newStatus = request.isApproved() ? "ACTIVE" : "REJECTED";

        // 1. Gọi sang Doctor Service để đổi trạng thái, đồng thời hứng lấy userId
        log.info("Gửi lệnh đổi trạng thái Bác sĩ {} thành {}", doctorId, newStatus);
        Long userId = doctorClient.updateDoctorStatus(doctorId, newStatus);

        // 2. TỰ ĐỘNG HÓA: Nếu được duyệt, mở khóa tài khoản bên Auth Service luôn!
        if (request.isApproved()) {
            userClient.enableUser(userId);
            log.info("Đã mở khóa đăng nhập thành công cho User ID: {}", userId);
        }

        // 3. Bắn sự kiện lên Kafka (Giữ nguyên)
        String doctorEmail = "doctor" + doctorId + "@healthcare.com";
        eventProducer.publishDoctorApprovalEvent(doctorId, doctorEmail, request.isApproved(), request.getReason());

        log.info("Xử lý duyệt hồ sơ Bác sĩ {} hoàn tất.", doctorId);
    }

    public Object getPendingDoctors() {
        return doctorClient.getPendingDoctors();
    }
}