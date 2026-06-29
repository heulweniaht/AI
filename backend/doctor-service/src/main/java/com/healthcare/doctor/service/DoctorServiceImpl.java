package com.healthcare.doctor.service;

import com.healthcare.doctor.dto.request.DoctorSearchFilter;
import com.healthcare.doctor.dto.request.UpdateDoctorProfileRequest;
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

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepo;

    @Override
    @Cacheable(value = "doctor:detail", key = "#id", unless = "#result == null")
    public DoctorDetailResponse getDoctorById(Long id) {
        log.info("CACHE MISS: Lấy bác sĩ ID {} từ DB", id);
        DoctorProfile d = doctorRepo.findByIdWithSpecialty(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));
        return toDetailResponse(d);
    }

    @Override
    public Page<DoctorListResponse> searchDoctors(DoctorSearchFilter filter, int page, int size) {
        return doctorRepo.searchDoctors(filter.getSpecialtyId(), filter.getCity(),
                        PageRequest.of(page, size))
                .map(this::toListResponse);
    }

    @Override
    @Transactional
    @CacheEvict(value = "doctor:detail", key = "#id")
    public DoctorProfile updateDoctorInfo(Long id, String city, Double newFee) {
        DoctorProfile doctor = doctorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));
        doctor.setClinicCity(city);
        if (newFee != null) {
            doctor.setConsultationFee(java.math.BigDecimal.valueOf(newFee));
        }
        log.info("Cập nhật bác sĩ ID {} và xóa cache", id);
        return doctorRepo.save(doctor);
    }

    @Override
    public List<DoctorDetailResponse> getPendingDoctors() {
        return doctorRepo.findByStatus("PENDING").stream()
                .map(this::toDetailResponse)
                .toList();
    }

    @Override
    @Transactional
    public void initDoctorProfile(Long userId, String fullName) {
        if (doctorRepo.existsById(userId)) return; // idempotent
        DoctorProfile profile = DoctorProfile.builder()
                .id(userId)
                .userId(userId)
                .fullName(fullName)
                .status("PENDING")
                .build();
        doctorRepo.save(profile);
        log.info("Khởi tạo DoctorProfile cho userId {}", userId);
    }

    @Override
    @Transactional
    @CacheEvict(value = "doctor:detail", key = "#id")
    public Long updateDoctorStatus(Long id, String status) {
        DoctorProfile doctor = doctorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));
        doctor.setStatus(status);
        doctorRepo.save(doctor);
        return id;
    }

    @Override
    @Transactional
    @CacheEvict(value = "doctor:detail", key = "#id")
    public void updateFullProfile(Long id, UpdateDoctorProfileRequest req) {
        DoctorProfile doctor = doctorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));
        if (req.getFullName()       != null) doctor.setFullName(req.getFullName());
        if (req.getClinicName()     != null) doctor.setClinicName(req.getClinicName());
        if (req.getClinicAddress()  != null) doctor.setClinicAddress(req.getClinicAddress());
        if (req.getClinicCity()     != null) doctor.setClinicCity(req.getClinicCity());
        if (req.getConsultationFee()!= null) doctor.setConsultationFee(req.getConsultationFee());
        if (req.getExperienceYears()!= null) doctor.setExperienceYears(req.getExperienceYears());
        if (req.getBio()            != null) doctor.setBio(req.getBio());
        if (req.getGender()         != null) doctor.setGender(req.getGender());
        if (req.getAvatarUrl()      != null) doctor.setAvatarUrl(req.getAvatarUrl());
        doctorRepo.save(doctor);
    }

    // ── Mapper helpers ────────────────────────────────────────────────────

    private DoctorDetailResponse toDetailResponse(DoctorProfile d) {
        return DoctorDetailResponse.builder()
                .id(d.getId())
                .fullName(d.getFullName())
                .specialtyName(d.getSpecialty() != null ? d.getSpecialty().getName() : null)
                .clinicCity(d.getClinicCity())
                .gender(d.getGender())
                .ratingAvg(d.getRatingAvg())
                .totalReviews(d.getTotalReviews())
                .consultationFee(d.getConsultationFee())
                .description(d.getBio())
                .clinicName(d.getClinicName())
                .clinicAddress(d.getClinicAddress())
                .experienceYears(d.getExperienceYears())
                .avatarUrl(d.getAvatarUrl())
                .build();
    }

    private DoctorListResponse toListResponse(DoctorProfile d) {
        return DoctorListResponse.builder()
                .id(d.getId())
                .fullName(d.getFullName())
                .specialtyName(d.getSpecialty() != null ? d.getSpecialty().getName() : null)
                .clinicCity(d.getClinicCity())
                .ratingAvg(d.getRatingAvg())
                .consultationFee(d.getConsultationFee())
                .clinicName(d.getClinicName())
                .clinicAddress(d.getClinicAddress())
                .experienceYears(d.getExperienceYears())
                .avatarUrl(d.getAvatarUrl())
                .build();
    }
}