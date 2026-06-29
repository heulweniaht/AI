package com.healthcare.doctor.kafka;

import com.healthcare.doctor.entity.DoctorSchedule;
import com.healthcare.doctor.repository.DoctorScheduleRepository;
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
public class AppointmentEventConsumer {

    private final DoctorScheduleRepository scheduleRepo;

    /**
     * Lắng nghe topic "appointment.booked" — đánh dấu slot là đã đặt.
     * Đây là cơ chế backup nếu Feign Client bị timeout.
     */
    @KafkaListener(topics = "appointment.booked", groupId = "doctor-service-group")
    @Transactional
    public void onAppointmentBooked(@Payload Map<String, Object> event, Acknowledgment ack) {
        try {
            Object scheduleIdObj = event.get("scheduleId");
            if (scheduleIdObj == null) {
                ack.acknowledge();
                return;
            }

            Long scheduleId = Long.valueOf(scheduleIdObj.toString());

            DoctorSchedule slot = scheduleRepo.findById(scheduleId).orElse(null);
            if (slot == null) {
                log.warn("[Kafka] Không tìm thấy slot ID {}, bỏ qua.", scheduleId);
                ack.acknowledge();
                return;
            }

            if (!slot.isBooked()) {
                slot.setBooked(true);
                slot.setAvailable(false);
                scheduleRepo.save(slot);
                log.info("[Kafka] Đã đánh dấu slot {} là booked.", scheduleId);
            }

            ack.acknowledge();

        } catch (Exception e) {
            log.error("[Kafka] Lỗi xử lý appointment.booked: {}", e.getMessage());
            // Không ack → Kafka retry
        }
    }

    /**
     * Lắng nghe topic "appointment.cancelled" — giải phóng slot khi hủy lịch.
     */
    @KafkaListener(topics = "appointment.cancelled", groupId = "doctor-service-group")
    @Transactional
    public void onAppointmentCancelled(@Payload Map<String, Object> event, Acknowledgment ack) {
        try {
            Object scheduleIdObj = event.get("scheduleId");
            if (scheduleIdObj == null) {
                ack.acknowledge();
                return;
            }

            Long scheduleId = Long.valueOf(scheduleIdObj.toString());

            scheduleRepo.findById(scheduleId).ifPresent(slot -> {
                slot.setBooked(false);
                slot.setAvailable(true);
                scheduleRepo.save(slot);
                log.info("[Kafka] Đã giải phóng slot {} sau khi hủy lịch.", scheduleId);
            });

            ack.acknowledge();

        } catch (Exception e) {
            log.error("[Kafka] Lỗi xử lý appointment.cancelled: {}", e.getMessage());
        }
    }
}