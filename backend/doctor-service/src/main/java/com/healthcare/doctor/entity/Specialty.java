package com.healthcare.doctor.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "specialties")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Specialty {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;
    private String iconUrl;

    @Builder.Default
    private boolean isActive = true;
}
