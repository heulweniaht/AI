package com.healthcare.payment.kafka;

import com.healthcare.payment.entity.Payment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishPaymentSuccess(Payment payment, String patientEmail) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("paymentId", payment.getId());
        eventData.put("appointmentId", payment.getAppointmentId());
        eventData.put("patientId", payment.getPatientId());
        eventData.put("patientEmail", patientEmail);
        eventData.put("amount", payment.getAmount());
        eventData.put("transactionId", payment.getTransactionId());
        eventData.put("paidAt", payment.getPaidAt().toString());

        // Bắn vào topic "payment.success"[cite: 1]
        kafkaTemplate.send("payment.success", payment.getAppointmentId().toString(), eventData)
                .whenComplete((result, ex) -> {
                    if (ex == null) log.info("Đã phát sự kiện thanh toán thành công cho Lịch: {}", payment.getAppointmentId());
                    else log.error("Lỗi phát sự kiện thanh toán: {}", ex.getMessage());
                });
    }
}