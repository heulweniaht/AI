package com.healthcare.notification.consumer;

import com.healthcare.notification.entity.NotificationLog;
import com.healthcare.notification.repository.NotificationLogRepository;
import com.healthcare.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthEventConsumer {

    private final EmailService emailService;
    private final NotificationLogRepository logRepository;

    // Lắng nghe topic "user.otp.requested" từ nhóm "notification-group"
    @KafkaListener(topics = "user.otp.requested", groupId = "notification-group")
    public void onOtpRequested(@Payload Map<String, String> eventData, Acknowledgment ack) {
        String email = eventData.get("email");
        String fullName = eventData.get("fullName");
        String otp = eventData.get("otp");

        log.info("Nhận được yêu cầu gửi OTP cho email: {}", email);

        try {
            // 1. Thực hiện gửi Email
            emailService.sendOtpEmail(email, fullName, otp);

            // 2. Lưu vào DB để làm bằng chứng
            NotificationLog notifLog = NotificationLog.builder()
                    .recipient(email)
                    .type("OTP_REQUESTED")
                    .content("Đã gửi mã OTP: " + otp)
                    .status("SUCCESS")
                    .sentAt(LocalDateTime.now())
                    .build();
            logRepository.save(notifLog);

            // 3. BÁO CÁO THÀNH CÔNG VỚI KAFKA (Manual ACK)
            // Chỉ khi dòng này chạy, Kafka mới xóa tin nhắn. Nếu lỗi ở trên, dòng này không chạy, Kafka sẽ gửi lại.
            ack.acknowledge();

        } catch (Exception e) {
            log.error("Gửi OTP thất bại, Kafka sẽ tiến hành thử lại (Retry). Lỗi: {}", e.getMessage());
            // KHÔNG gọi ack.acknowledge() ở đây để Kafka tự động gửi lại tin nhắn này
        }
    }
}