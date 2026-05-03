package com.healthcare.user.service;

import com.healthcare.user.dto.response.MedicalRecordResponse;
import com.healthcare.user.repository.MedicalRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository recordRepository;

    public List<MedicalRecordResponse> getPatientRecords(Long patientId) {
        return recordRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(record -> MedicalRecordResponse.builder()
                        .recordId(record.getId())
                        .doctorId(record.getDoctorId())
                        .appointmentId(record.getAppointmentId())
                        .diagnosis(record.getDiagnosis())
                        .prescription(record.getPrescription())
                        .attachmentsJson(record.getAttachmentsJson())
                        .createdAt(record.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}