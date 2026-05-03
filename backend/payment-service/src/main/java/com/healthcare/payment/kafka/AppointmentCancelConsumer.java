package com.healthcare.payment.kafka;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.payment.service.RefundService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppointmentCancelConsumer {

    private final ObjectMapper objectMapper;
    private final RefundService refundService;

    // Lắng nghe sự kiện Hủy lịch từ Appointment Service
    @KafkaListener(topics = "appointment.cancelled", groupId = "payment-group")
    public void onAppointmentCancelled(@Payload String payload, Acknowledgment ack) {
        try {
            Map<String, Object> event = objectMapper.readValue(payload, new TypeReference<>() {});

            // Lấy ID Lịch khám vừa bị hủy
            Long appointmentId = Long.valueOf(event.get("appointmentId").toString());
            String cancelledBy = (String) event.get("cancelledBy"); // Ai là người hủy? (PATIENT, DOCTOR, ADMIN)

            log.info("Nhận sự kiện hủy lịch khám ID: {}. Đang kiểm tra để hoàn tiền...", appointmentId);

            // Bắt đầu luồng hoàn tiền
            refundService.processRefund(appointmentId, cancelledBy);

            // Báo cho Kafka biết đã xử lý xong
            ack.acknowledge();

        } catch (Exception e) {
            log.error("Lỗi khi xử lý sự kiện appointment.cancelled trong Payment Service: {}", e.getMessage(), e);
            // Không gọi ack.acknowledge() để Kafka thử lại nếu lỗi mạng
        }
    }
}