package com.healthcare.appointment.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Appointment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId; // Liên kết tới bảng User

    @Column(nullable = false)
    private Long doctorId;  // Liên kết tới bảng DoctorProfile

    @Column(nullable = false)
    private Long scheduleId; // Liên kết tới bảng DoctorSchedule

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "JSON")
    private String symptomsJson; // Lưu mảng triệu chứng dưới dạng chuỗi JSON

    @Column(columnDefinition = "TEXT")
    private String doctorNotes;

    @Column(nullable = false)
    private LocalDateTime appointmentTime;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}