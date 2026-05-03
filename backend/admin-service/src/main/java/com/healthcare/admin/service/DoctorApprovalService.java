package com.healthcare.admin.service;

import com.healthcare.admin.client.DoctorServiceClient;
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

    public void processApproval(Long doctorId, DoctorApprovalRequest request) {
        String newStatus = request.isApproved() ? "ACTIVE" : "REJECTED";

        // 1. Gọi Feign sang Doctor Service để ép đổi trạng thái
        log.info("Gửi lệnh đổi trạng thái Bác sĩ {} thành {}", doctorId, newStatus);
        doctorClient.updateDoctorStatus(doctorId, newStatus);

        // 2. Tương lai: Gọi sang User/Auth Service lấy email bác sĩ (ở đây giả lập)
        String doctorEmail = "doctor" + doctorId + "@healthcare.com";

        // 3. Bắn sự kiện lên Kafka để Notification Service gửi mail báo cho bác sĩ
        eventProducer.publishDoctorApprovalEvent(doctorId, doctorEmail, request.isApproved(), request.getReason());

        log.info("Xử lý duyệt hồ sơ Bác sĩ {} hoàn tất.", doctorId);
    }
}