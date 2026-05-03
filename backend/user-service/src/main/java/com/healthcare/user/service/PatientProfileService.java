package com.healthcare.user.service;

import com.healthcare.user.dto.request.AddHealthMetricRequest;
import com.healthcare.user.dto.request.UpdateProfileRequest;
import com.healthcare.user.dto.response.PatientProfileResponse;
import com.healthcare.user.entity.HealthMetric;
import com.healthcare.user.entity.PatientProfile;
import com.healthcare.user.repository.PatientProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientProfileService {

    private final PatientProfileRepository profileRepository;

    public PatientProfileResponse getProfile(Long userId) {
        PatientProfile profile = profileRepository.findById(userId)
                .orElse(PatientProfile.builder().id(userId).build()); // Nếu chưa có thì tạo object rỗng

        return PatientProfileResponse.builder()
                .id(profile.getId())
                .fullName(profile.getFullName())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .bloodType(profile.getBloodType())
                .address(profile.getAddress())
                .emergencyContact(profile.getEmergencyContact())
                .allergies(profile.getAllergies())
                .build();
    }

    @Transactional
    public PatientProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        PatientProfile profile = profileRepository.findById(userId)
                .orElse(PatientProfile.builder().id(userId).build());

        profile.setFullName(request.getFullName());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setBloodType(request.getBloodType());
        profile.setAddress(request.getAddress());
        profile.setEmergencyContact(request.getEmergencyContact());
        profile.setAllergies(request.getAllergies());

        profileRepository.save(profile);
        return getProfile(userId);
    }
}