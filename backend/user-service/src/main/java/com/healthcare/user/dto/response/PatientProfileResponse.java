package com.healthcare.user.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class PatientProfileResponse {
    private Long id;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodType;
    private String address;
    private String emergencyContact;
    private String allergies;
}