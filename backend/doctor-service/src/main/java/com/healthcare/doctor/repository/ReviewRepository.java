package com.healthcare.doctor.repository;

import com.healthcare.doctor.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByPatientIdAndDoctorId(Long patientId, Long doctorId);

    Long countByDoctorId(Long doctorId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.doctorId = :doctorId")
    Double calculateAverageRating(@Param("doctorId") Long doctorId);
}
