package com.healthcare.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "patient_profiles")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PatientProfile {

    @Id
    private Long id;

    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String bloodType;
    private String address;
    private String emergencyContact;

    @Column(columnDefinition = "TEXT")
    private String allergies;

}
