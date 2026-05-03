//package com.healthcare.doctor.service;
//
//import com.healthcare.doctor.entity.DoctorProfile;
//import com.healthcare.doctor.repository.DoctorRepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.cache.annotation.CacheEvict;
//import org.springframework.cache.annotation.Cacheable;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//@Transactional(readOnly = true) // Cảnh báo: Class này mặc định chỉ được đọc DB, cấm ghi
//public class DoctorServiceImpl implements DoctorService {
//
//    private final DoctorRepository doctorRepo;
//
//    @Override
//    @Cacheable(value = "doctor:detail", key = "#id", unless = "#result == null") //
//    public DoctorProfile getDoctorById(Long id) {
//        log.info("CACHE MISS: Đang chạy xuống Database để lấy Bác sĩ ID: {}", id);
//        return doctorRepo.findByIdWithSpecialty(id)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));
//    }
//
//    @Override
//    public Page<DoctorProfile> searchDoctors(Long specialtyId, String city, int page, int size) {
//        return doctorRepo.searchDoctors(specialtyId, city, PageRequest.of(page, size));
//    }
//
//    @Override
//    @Transactional // Hàm này có ghi vào DB, nên phải ghi đè @Transactional(readOnly = true) ở trên
//    @CacheEvict(value = "doctor:detail", key = "#id") // XÓA CACHE CŨ ĐI!
//    public DoctorProfile updateDoctorInfo(Long id, String city, Double newFee) {
//        DoctorProfile doctor = doctorRepo.findById(id)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ"));
//
//        doctor.setClinicCity(city);
//        doctor.setConsultationFee(BigDecimal.valueOf(newFee));
//
//        log.info("Đã cập nhật Bác sĩ ID: {} và xóa Cache tương ứng", id);
//        return doctorRepo.save(doctor);
//    }
//}