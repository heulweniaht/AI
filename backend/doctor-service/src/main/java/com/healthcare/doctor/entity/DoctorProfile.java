package com.healthcare.doctor.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "doctor_profiles")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class DoctorProfile {
    @Id
    private Long id;

    private Long userId;

    private String fullName;
    private String clinicCity;
    private String gender;

    @Builder.Default
    private Double ratingAvg = 0.0;

    @Builder.Default
    private Long totalReviews = 0L;

    private BigDecimal consultationFee;

    @Builder.Default
    private String status = "ACTIVE";

    // Mối quan hệ Nhiều-Bác-Sĩ thuộc về Một-Chuyên-Khoa
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "specialty_id")
    private Specialty specialty;
}
