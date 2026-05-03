package com.healthcare.appointment.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AppointmentResponse {
    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private String status;
    private String reason;
    private LocalDateTime appointmentTime;
    private LocalDateTime createdAt;
}