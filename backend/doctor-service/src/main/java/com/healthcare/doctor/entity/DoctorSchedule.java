package com.healthcare.doctor.entity;

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

    @Builder.Default
    private boolean isAvailable = true;

    @Builder.Default
    private boolean isBooked = false;
}
