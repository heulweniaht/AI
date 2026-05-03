package com.healthcare.admin.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishDoctorApprovalEvent(Long doctorId, String doctorEmail, boolean isApproved, String reason) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("doctorId", doctorId);
        eventData.put("doctorEmail", doctorEmail);
        eventData.put("isApproved", isApproved);
        eventData.put("reason", reason != null ? reason : "");

        // Bắn vào topic "admin.doctor.approval"
        kafkaTemplate.send("admin.doctor.approval", doctorId.toString(), eventData)
                .whenComplete((result, ex) -> {
                    if (ex == null) log.info("Đã phát sự kiện Duyệt Bác sĩ ID: {}", doctorId);
                    else log.error("Lỗi phát sự kiện: {}", ex.getMessage());
                });
    }
}