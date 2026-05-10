package com.healthcare.doctor.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateDoctorProfileRequest {
    private String fullName;
    private String clinicName;
    private String clinicAddress;
    private String clinicCity;
    private BigDecimal consultationFee;
    private Integer experienceYears;
    private String bio;
    private String gender;
    private Long specialtyId;
    private String avatarUrl;
}