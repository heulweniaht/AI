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

    /**
     * Lắng nghe topic "notification-topic" — xử lý các sự kiện từ Auth-Service.
     * eventType: OTP_REQUESTED | FORGOT_PASSWORD
     */
    @KafkaListener(topics = "notification-topic", groupId = "notification-group")
    public void onAuthEvent(@Payload Map<String, String> eventData, Acknowledgment ack) {
        String eventType = eventData.get("eventType");
        String email     = eventData.get("email");
        String fullName  = eventData.get("fullName");

        log.info("[Kafka] Nhận event '{}' cho email: {}", eventType, email);

        try {
            String logContent;

            switch (eventType != null ? eventType : "") {

                case "OTP_REQUESTED" -> {
                    String otp = eventData.get("otp");
                    emailService.sendOtpEmail(email, fullName, otp);
                    logContent = "Đã gửi OTP: " + otp;
                }

                case "FORGOT_PASSWORD" -> {
                    String newPassword = eventData.get("newPassword");
                    emailService.sendForgotPasswordEmail(email, fullName, newPassword);
                    logContent = "Đã gửi mật khẩu mới qua email";
                }

                default -> {
                    log.warn("[Kafka] Bỏ qua event không xác định: {}", eventType);
                    ack.acknowledge();
                    return;
                }
            }

            // Lưu log vào DB
            logRepository.save(NotificationLog.builder()
                    .recipient(email)
                    .type(eventType)
                    .content(logContent)
                    .status("SUCCESS")
                    .sentAt(LocalDateTime.now())
                    .build());

            ack.acknowledge(); // Manual ACK — chỉ acknowledge khi xử lý thành công

        } catch (Exception e) {
            log.error("[Kafka] Xử lý event '{}' thất bại, sẽ retry. Lỗi: {}", eventType, e.getMessage());
            // Không acknowledge → Kafka tự động retry
        }
    }
}
