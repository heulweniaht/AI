package com.healthcare.doctor.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DoctorListResponse {
    private Long id;
    private String fullName;
    private String specialtyName;
    private String clinicCity;
    private Double ratingAvg;
    private BigDecimal consultationFee;
}
