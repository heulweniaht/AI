package com.healthcare.auth.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthEventProducer {

    private static final String TOPIC_NOTIFICATION = "notification-topic";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Event: User PATIENT đăng ký thành công → Notification-Service gửi OTP qua email.
     */
    public void publishOtpRequested(String email, String fullName, String otp) {
        Map<String, String> event = new HashMap<>();
        event.put("eventType", "OTP_REQUESTED");
        event.put("email", email);
        event.put("fullName", fullName);
        event.put("otp", otp);

        kafkaTemplate.send(TOPIC_NOTIFICATION, email, event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("[Kafka] Đã gửi OTP_REQUESTED cho {}", email);
                    } else {
                        log.error("[Kafka] Lỗi gửi OTP_REQUESTED: {}", ex.getMessage());
                    }
                });
    }

    /**
     * Event: User yêu cầu quên mật khẩu → Notification-Service gửi mật khẩu mới qua email thật.
     */
    public void publishForgotPassword(String email, String fullName, String newPassword) {
        Map<String, String> event = new HashMap<>();
        event.put("eventType", "FORGOT_PASSWORD");
        event.put("email", email);
        event.put("fullName", fullName);
        event.put("newPassword", newPassword);

        kafkaTemplate.send(TOPIC_NOTIFICATION, email, event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("[Kafka] Đã gửi FORGOT_PASSWORD cho {}", email);
                    } else {
                        log.error("[Kafka] Lỗi gửi FORGOT_PASSWORD: {}", ex.getMessage());
                    }
                });
    }
}
