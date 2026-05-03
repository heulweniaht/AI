package com.healthcare.notification.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.notification.service.EmailService;
import com.healthcare.notification.service.NotificationLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class PaymentEventConsumer {

    private final EmailService emailService;
    private final NotificationLogService logService;
    private final ObjectMapper objectMapper;

    // Lắng nghe sự kiện: THANH TOÁN VNPay THÀNH CÔNG
    @KafkaListener(topics = "payment.success", groupId = "notification-group")
    public void onPaymentSuccess(@Payload String payload, Acknowledgment ack) {
        try {
            Map<String, Object> event = objectMapper.readValue(payload, new TypeReference<>() {});
            String patientEmail = (String) event.get("patientEmail");
            String amount = event.get("amount").toString();
            String transactionId = (String) event.get("transactionId");

            log.info("Đã nhận sự kiện thanh toán thành công. Gửi biên lai cho: {}", patientEmail);

            emailService.sendPaymentReceipt(patientEmail, amount, transactionId);

            logService.saveLog(patientEmail, "PAYMENT_SUCCESS", "Gửi biên lai thanh toán", "SUCCESS");
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Lỗi khi xử lý payment.success", e);
        }
    }
}
