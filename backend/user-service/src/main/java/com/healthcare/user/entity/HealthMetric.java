package com.healthcare.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_metrics")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class HealthMetric {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;
    private Double weight;
    private Double height;
    private String bloodPressure;
    private Double heartRate;

    private LocalDateTime recordedAt;

    @PrePersist
    public void onPrePersist() {
        this.recordedAt = LocalDateTime.now();
    }
}
