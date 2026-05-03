package com.healthcare.notification.consumer;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.notification.service.EmailService;
import com.healthcare.notification.service.NotificationLogService;
import com.healthcare.notification.service.SmsService;
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
public class AppointmentEventConsumer {

    private final EmailService emailService;
    private final SmsService smsService;
    private final NotificationLogService logService;
    private final ObjectMapper objectMapper; // Dùng để ép kiểu chuỗi JSON thành Map

    // 1. Lắng nghe sự kiện: ĐẶT LỊCH THÀNH CÔNG
    @KafkaListener(topics = "appointment.booked", groupId = "notification-group")
    public void onAppointmentBooked(@Payload String payload, Acknowledgment ack) {
        try {
            // Chuyển JSON thành Map để đọc dữ liệu
            Map<String, Object> event = objectMapper.readValue(payload, new TypeReference<>() {});

            String patientEmail = (String) event.get("patientEmail");
            String patientName = (String) event.get("patientName");
            String doctorName = (String) event.get("doctorName");
            String phone = (String) event.get("patientPhone");

            log.info("Xử lý gửi email xác nhận đặt lịch cho: {}", patientEmail);

            // emailService.sendAppointmentConfirmation(patientEmail, patientName, doctorName);

            if (phone != null) {
                smsService.sendAppointmentReminder(phone, doctorName, LocalDateTime.now().plusDays(1));
            }

            logService.saveLog(patientEmail, "APPOINTMENT_BOOKED", "Xác nhận lịch khám với " + doctorName, "SUCCESS");

            // Báo Kafka: Xong việc!
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Lỗi khi xử lý appointment.booked: {}", e.getMessage());
        }
    }

    // 2. Lắng nghe sự kiện: HỦY LỊCH
    @KafkaListener(topics = "appointment.cancelled", groupId = "notification-group")
    public void onAppointmentCancelled(@Payload String payload, Acknowledgment ack) {
        try {
            Map<String, Object> event = objectMapper.readValue(payload, new TypeReference<>() {});

            // 1. Trích xuất dữ liệu từ JSON event
            String patientEmail = (String) event.get("patientEmail");
            String doctorEmail = (String) event.get("doctorEmail");
            String reason = (String) event.get("cancellationReason");

            // Xử lý an toàn cho RefundAmount (có thể null nếu thanh toán tiền mặt)
            Object refundObj = event.get("refundAmount");
            String refundAmount = refundObj != null ? refundObj.toString() : null;

            log.info("Xử lý gửi thông báo hủy lịch cho user: {}", patientEmail);

            // 2. GỌI LOGIC GỬI EMAIL THỰC TẾ
            emailService.sendCancellationNotification(patientEmail, reason, refundAmount);
            if (doctorEmail != null) {
                emailService.sendDoctorCancellationNotification(doctorEmail);
            }

            // 3. Ghi log vào Database
            logService.saveLog(patientEmail, "APPOINTMENT_CANCELLED", "Hủy lịch do: " + reason, "SUCCESS");

            // 4. Báo Kafka đã xử lý xong
            ack.acknowledge();
        } catch (Exception e) {
            log.error("Lỗi khi xử lý appointment.cancelled", e);
            // Bỏ qua ack.acknowledge() để Kafka gửi lại nếu bị lỗi mạng
        }
    }
}