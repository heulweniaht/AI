package com.healthcare.doctor.repository;

import com.healthcare.doctor.entity.DoctorProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorProfile, Long> {
    // Lấy chi tiết bác sĩ kèm luôn chuyên khoa (Chống lại bệnh LAZY ở trên)
    @Query("SELECT d FROM DoctorProfile d LEFT JOIN FETCH d.specialty WHERE d.id = :id")
    Optional<DoctorProfile> findByIdWithSpecialty(@Param("id") Long id);

    // Tìm kiếm bác sĩ với bộ lọc động
    @Query("""
        SELECT d FROM DoctorProfile d
        Left JOIN FETCH d.specialty s
        WHERE (:specialtyId IS NULL OR s.id = :specialtyId)
          AND (:city IS NULL OR d.clinicCity = :city)
          AND d.status = 'ACTIVE'
        """)
    Page<DoctorProfile> searchDoctors(
            @Param("specialtyId") Long specialtyId,
            @Param("city") String city,
            Pageable pageable
    );
    @Modifying
    @Query("UPDATE DoctorProfile d SET d.ratingAvg = :avg, d.totalReviews = :total WHERE d.id = :id")
    void updateRating(@Param("id") Long id, @Param("avg") Double avg, @Param("total") Long total);
}
