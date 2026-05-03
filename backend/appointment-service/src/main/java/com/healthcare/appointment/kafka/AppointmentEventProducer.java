package com.healthcare.appointment.kafka;

import com.healthcare.appointment.entity.Appointment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AppointmentEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishAppointmentBooked(Appointment appt, String patientEmail, String patientName, String doctorName) {
        Map<String, Object> eventData = new HashMap<>();
        eventData.put("appointmentId", appt.getId());
        eventData.put("patientId", appt.getPatientId());
        eventData.put("patientEmail", patientEmail);
        eventData.put("patientName", patientName);
        eventData.put("doctorName", doctorName);
        eventData.put("appointmentTime", appt.getAppointmentTime().toString());

        kafkaTemplate.send("appointment.booked", appt.getId().toString(), eventData)
                .whenComplete((result, ex) -> {
                    if (ex == null) log.info("Đã phát sự kiện Đặt lịch thành công cho Appointment ID: {}", appt.getId());
                    else log.error("Lỗi phát sự kiện: {}", ex.getMessage());
                });
    }
}