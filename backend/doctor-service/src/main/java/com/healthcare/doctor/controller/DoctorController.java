package com.healthcare.doctor.controller;

import com.healthcare.doctor.dto.request.DoctorSearchFilter;
import com.healthcare.doctor.dto.request.UpdateDoctorProfileRequest;
import com.healthcare.doctor.dto.response.DoctorDetailResponse;
import com.healthcare.doctor.dto.response.DoctorListResponse;
import com.healthcare.doctor.entity.DoctorProfile;
import com.healthcare.doctor.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/admin/pending")
    public ResponseEntity<List<DoctorDetailResponse>> getPendingDoctors() {
        return ResponseEntity.ok(doctorService.getPendingDoctors());
    }

    @PutMapping("/admin/{id}/status")
    public ResponseEntity<Long> updateDoctorStatus( // Đổi Void thành Long
                                                    @PathVariable Long id,
                                                    @RequestParam String status) {

        return ResponseEntity.ok(doctorService.updateDoctorStatus(id, status));
    }

    @PostMapping("/internal/init-profile")
    public ResponseEntity<Void> initDoctorProfile(
            @RequestParam Long userId,
            @RequestParam String fullName) {

        // Gọi hàm từ tầng Service thay vì dùng trực tiếp Repository
        doctorService.initDoctorProfile(userId, fullName);

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<String> updateFullProfile(
            @PathVariable Long id,
            @RequestBody UpdateDoctorProfileRequest request) {
        doctorService.updateFullProfile(id, request);
        return ResponseEntity.ok("Cập nhật hồ sơ thành công");
    }

}
