package com.healthcare.user.controller;

import com.healthcare.user.dto.request.UpdateProfileRequest;
import com.healthcare.user.dto.response.PatientProfileResponse;
import com.healthcare.user.service.PatientProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users/profile")
@RequiredArgsConstructor
public class PatientProfileController {

    private final PatientProfileService profileService;

    // Lấy hồ sơ của TÔI (dựa vào Token header)
    @GetMapping("/me")
    public ResponseEntity<PatientProfileResponse> getMyProfile(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    // Cập nhật hồ sơ của TÔI
    @PutMapping("/me")
    public ResponseEntity<PatientProfileResponse> updateMyProfile(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(userId, request));
    }
}