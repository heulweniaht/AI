package com.healthcare.user.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MedicalRecordResponse {
    private Long recordId;
    private Long doctorId;
    private Long appointmentId;
    private String diagnosis;
    private String prescription;
    private String attachmentsJson;
    private LocalDateTime createdAt;
}