package com.healthcare.user.controller;

import com.healthcare.user.dto.response.MedicalRecordResponse;
import com.healthcare.user.service.FileUploadService;
import com.healthcare.user.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService recordService;
    private final FileUploadService fileUploadService;

    // Bệnh nhân xem toàn bộ lịch sử khám của mình[cite: 2]
    @GetMapping("/me")
    public ResponseEntity<List<MedicalRecordResponse>> getMyRecords(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(recordService.getPatientRecords(userId));
    }

    // API Upload ảnh xét nghiệm rườm rà (thường bác sĩ gọi API này để đính kèm kết quả)
    @PostMapping("/upload")
    public ResponseEntity<String> uploadAttachment(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileUploadService.uploadFile(file);
        return ResponseEntity.ok(fileUrl);
    }
}