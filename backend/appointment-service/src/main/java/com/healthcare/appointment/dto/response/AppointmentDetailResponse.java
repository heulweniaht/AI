package com.healthcare.appointment.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AppointmentDetailResponse {
    private Long appointmentId;
    private String patientName;
    private String doctorName;
    private String status;
    private String reason;
    private List<String> symptoms;
    private String doctorNotes;
    private LocalDateTime appointmentTime;
}