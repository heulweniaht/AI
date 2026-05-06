package com.healthcare.doctor.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "doctor_schedules")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DoctorSchedule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long doctorId;
    private LocalDate scheduleDate;
    private LocalTime startTime;
    private LocalTime endTime;

    @JsonProperty("isAvailable")
    @Builder.Default
    private boolean isAvailable = true;

    @JsonProperty("isBooked")
    @Builder.Default
    private boolean isBooked = false;
}
