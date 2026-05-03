package com.healthcare.doctor.dto.request;

import lombok.Data;

@Data
public class DoctorSearchFilter {
    private Long specialtyId;
    private String city;
    private String keyword;
}
