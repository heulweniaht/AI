package com.healthcare.appointment.kafka;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.entity.AppointmentStatus;
import com.healthcare.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventConsumer {

    private final AppointmentRepository appointmentRepo;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "payment.success", groupId = "appointment-group") // Group riêng của Appointment
    @Transactional
    public void onPaymentSuccess(@Payload String payload, Acknowledgment ack) {
        try {
            Map<String, Object> event = objectMapper.readValue(payload, new TypeReference<>() {});

            // Lấy ID lịch khám từ sự kiện thanh toán
            Long appointmentId = Long.valueOf(event.get("appointmentId").toString());

            log.info("Xác nhận thanh toán thành công. Đổi trạng thái lịch khám ID: {}", appointmentId);

            // Tìm lịch khám trong DB
            Appointment appt = appointmentRepo.findById(appointmentId).orElse(null);

            if (appt != null && appt.getStatus() == AppointmentStatus.PENDING) {
                // Đổi trạng thái thành CONFIRMED
                appt.setStatus(AppointmentStatus.CONFIRMED);
                appointmentRepo.save(appt);
                log.info("Lịch khám {} đã được cập nhật thành CONFIRMED", appointmentId);
            }

            ack.acknowledge(); // Báo Kafka đã xong
        } catch (Exception e) {
            log.error("Lỗi khi xử lý sự kiện payment.success: {}", e.getMessage());
        }
    }
}