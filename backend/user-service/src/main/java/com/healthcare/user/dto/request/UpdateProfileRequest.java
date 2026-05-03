package com.healthcare.user.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodType;
    private String address;
    private String emergencyContact;
    private String allergies;
}
