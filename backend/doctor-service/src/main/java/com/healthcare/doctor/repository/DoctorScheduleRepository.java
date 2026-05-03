package com.healthcare.doctor.repository;

import com.healthcare.doctor.entity.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {

    @Query("""
        SELECT s FROM DoctorSchedule s
        WHERE s.doctorId = :doctorId
          AND s.scheduleDate = :date
          AND s.isAvailable = true
          AND s.isBooked = false
        ORDER BY s.startTime
        """)
    List<DoctorSchedule> findAvailableSlots(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
}