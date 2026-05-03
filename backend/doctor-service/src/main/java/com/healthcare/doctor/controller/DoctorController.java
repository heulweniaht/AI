package com.healthcare.doctor.controller;

import com.healthcare.doctor.dto.request.DoctorSearchFilter;
import com.healthcare.doctor.dto.response.DoctorDetailResponse;
import com.healthcare.doctor.dto.response.DoctorListResponse;
import com.healthcare.doctor.entity.DoctorProfile;
import com.healthcare.doctor.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    //Xem chi tiết bác sĩ
    @GetMapping("/{id}")
    public ResponseEntity<DoctorDetailResponse> getDoctor(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    //Tìm kiếm bác sĩ
    @GetMapping
    public ResponseEntity<Page<DoctorListResponse>> searchDoctors(
            @ModelAttribute DoctorSearchFilter filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(doctorService.searchDoctors(filter, page, size));
    }

    // API này giả lập việc bác sĩ cập nhật giá tiền khám (Bắt buộc phải xóa Cache)
    @PatchMapping("/{id}/update")
    public ResponseEntity<DoctorProfile> updateDoctor(
            @PathVariable Long id,
            @RequestParam String city,
            @RequestParam Double fee) {
        return ResponseEntity.ok(doctorService.updateDoctorInfo(id, city, fee));
    }
}
