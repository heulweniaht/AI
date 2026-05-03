package com.healthcare.doctor.service;

import com.healthcare.doctor.dto.request.DoctorSearchFilter;
import com.healthcare.doctor.dto.response.DoctorDetailResponse;
import com.healthcare.doctor.dto.response.DoctorListResponse;
import com.healthcare.doctor.entity.DoctorProfile;
import com.healthcare.doctor.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DoctorSearchService implements DoctorService {

    private final DoctorRepository doctorRepo;

    @Override
    @Cacheable(value = "doctor:detail", key = "#id", unless = "#result == null")
    public DoctorDetailResponse getDoctorById(Long id) {
        log.info("CACHE MISS: Tìm bác sĩ ID {} từ Database", id);
        DoctorProfile doctor = doctorRepo.findByIdWithSpecialty(id)
                .orElseThrow(() -> new RuntimeException("Bác sĩ không tồn tại: " + id));

        return DoctorDetailResponse.builder()
                .id(doctor.getId())
                .fullName(doctor.getFullName())
                .specialtyName(doctor.getSpecialty() != null ? doctor.getSpecialty().getName() : "Chưa cập nhật")
                .clinicCity(doctor.getClinicCity())
                .gender(doctor.getGender())
                .ratingAvg(doctor.getRatingAvg())
                .totalReviews(doctor.getTotalReviews())
                .consultationFee(doctor.getConsultationFee())
                .build();
    }

    @Override
    public Page<DoctorListResponse> searchDoctors(DoctorSearchFilter filter, int page, int size) {
        Page<DoctorProfile> doctorPages = doctorRepo.searchDoctors(
                filter.getSpecialtyId(), filter.getCity(), PageRequest.of(page, size)
        );

        return doctorPages.map(doctor -> DoctorListResponse.builder()
                .id(doctor.getId())
                .fullName(doctor.getFullName())
                .specialtyName(doctor.getSpecialty() != null ? doctor.getSpecialty().getName() : "")
                .clinicCity(doctor.getClinicCity())
                .ratingAvg(doctor.getRatingAvg())
                .consultationFee(doctor.getConsultationFee())
                .build());
    }


    @Override
    @Transactional // Hàm này có ghi vào DB nên phải ghi đè Transactional(readOnly = true)
    @CacheEvict(value = "doctor:detail", key = "#id") // Xóa cache sau khi update
    public DoctorProfile updateDoctorInfo(Long id, String city, Double newFee) {
        DoctorProfile doctor = doctorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));

        doctor.setClinicCity(city);
        doctor.setConsultationFee(BigDecimal.valueOf(newFee));

        log.info("Đã cập nhật Bác sĩ ID: {} và xóa Cache tương ứng", id);
        return doctorRepo.save(doctor);
    }
}