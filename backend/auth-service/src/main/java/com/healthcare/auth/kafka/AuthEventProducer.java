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

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishOtpRequested(String email, String fullName, String otp) {
        Map<String, String> evenData = new HashMap<>();
        evenData.put("email", email);
        evenData.put("fullName", fullName);
        evenData.put("otp", otp);
        evenData.put("evenType", "OTP_REQUESTES");

        kafkaTemplate.send("user.otp.requested", email, evenData)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Đã gửi sự kiện OTP cho {}", email);
                    } else {
                        log.error("Lỗi khi gửi sự kiện OTP: {}", ex.getMessage());
                    }
                });
    }
}
