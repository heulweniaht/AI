package com.healthcare.doctor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SpecialtyDTO {
    private Long id;
    private String name;
    private String description;
    private String iconUrl;
    private Long doctorCount;
}