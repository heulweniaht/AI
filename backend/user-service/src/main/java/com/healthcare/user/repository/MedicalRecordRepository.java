package com.healthcare.user.repository;

import com.healthcare.user.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    // Lấy toàn bộ lịch sử khám của 1 bệnh nhân, sắp xếp mới nhất lên đầu
    List<MedicalRecord> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    // Tìm hồ sơ y tế theo ID cuộc hẹn
    Optional<MedicalRecord> findByAppointmentId(Long appointmentId);
}