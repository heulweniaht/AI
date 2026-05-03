package com.healthcare.doctor.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DoctorDetailResponse {
    private Long id;
    private String fullName;
    private String specialtyName;
    private String clinicCity;
    private String gender;
    private Double ratingAvg;
    private Long totalReviews;
    private BigDecimal consultationFee;
    private String description;
}
