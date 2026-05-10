package com.healthcare.doctor.repository;

import com.healthcare.doctor.dto.response.SpecialtyDTO;
import com.healthcare.doctor.entity.Specialty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecialtyRepository extends JpaRepository<Specialty, Long> {
    List<Specialty> findByIsActiveTrue();
    @Query("""
        SELECT new com.healthcare.doctor.dto.response.SpecialtyDTO(s.id, s.name, s.description, s.iconUrl, COUNT(d.id))
        FROM Specialty s
        LEFT JOIN DoctorProfile d ON s.id = d.specialty.id AND d.status = 'ACTIVE'
        WHERE s.isActive = true
        GROUP BY s.id, s.name, s.description, s.iconUrl
    """)
    List<SpecialtyDTO> findAllWithDoctorCount();
}
