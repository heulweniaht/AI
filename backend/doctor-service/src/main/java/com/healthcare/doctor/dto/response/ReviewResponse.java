package com.healthcare.doctor.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Long doctorId;
    private Long patientId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}