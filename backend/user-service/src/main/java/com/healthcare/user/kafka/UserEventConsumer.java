package com.healthcare.user.kafka;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.user.entity.MedicalRecord;
import com.healthcare.user.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventConsumer {

    private final MedicalRecordRepository recordRepository;
    private final ObjectMapper objectMapper;

    // Lắng nghe sự kiện Bác sĩ khám xong[cite: 1]
    @KafkaListener(topics = "appointment.completed", groupId = "user-service-group")
    public void onAppointmentCompleted(@Payload String payload) {
        try {
            Map<String, Object> event = objectMapper.readValue(payload, new TypeReference<>() {});

            Long patientId = Long.valueOf(event.get("patientId").toString());
            Long doctorId = Long.valueOf(event.get("doctorId").toString());
            Long appointmentId = Long.valueOf(event.get("appointmentId").toString());
            String notes = (String) event.get("notes"); // Ghi chú/Chẩn đoán của bác sĩ

            log.info("Nhận sự kiện khám xong. Tạo hồ sơ bệnh án cho bệnh nhân ID: {}", patientId);

            // Tạo hồ sơ y tế tự động lưu vào CSDL User[cite: 2]
            MedicalRecord record = MedicalRecord.builder()
                    .patientId(patientId)
                    .doctorId(doctorId)
                    .appointmentId(appointmentId)
                    .diagnosis(notes)
                    .build();

            recordRepository.save(record);
            log.info("Đã tạo hồ sơ bệnh án thành công cho Appointment ID: {}", appointmentId);

        } catch (Exception e) {
            log.error("Lỗi khi xử lý sự kiện appointment.completed: {}", e.getMessage());
        }
    }
}