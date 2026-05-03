package com.healthcare.admin.controller;

import com.healthcare.admin.dto.DoctorApprovalRequest;
import com.healthcare.admin.service.DoctorApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/doctors")
@RequiredArgsConstructor
public class DoctorApprovalController {

    private final DoctorApprovalService approvalService;

    @PostMapping("/{doctorId}/approval")
    public ResponseEntity<String> approveDoctor(
            @PathVariable Long doctorId,
            @RequestBody DoctorApprovalRequest request) {

        approvalService.processApproval(doctorId, request);

        String message = request.isApproved() ? "Đã duyệt hồ sơ bác sĩ" : "Đã từ chối hồ sơ bác sĩ";
        return ResponseEntity.ok(message);
    }
}