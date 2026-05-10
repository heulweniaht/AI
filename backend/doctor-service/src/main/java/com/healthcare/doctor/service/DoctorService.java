package com.healthcare.doctor.service;

import com.healthcare.doctor.dto.request.DoctorSearchFilter;
import com.healthcare.doctor.dto.request.UpdateDoctorProfileRequest;
import com.healthcare.doctor.dto.response.DoctorDetailResponse;
import com.healthcare.doctor.dto.response.DoctorListResponse;
import com.healthcare.doctor.entity.DoctorProfile;
import org.springframework.data.domain.Page;

import java.util.List;

public interface DoctorService {
    DoctorDetailResponse getDoctorById(Long id);
    Page<DoctorListResponse> searchDoctors(DoctorSearchFilter filter, int page, int size);
    DoctorProfile updateDoctorInfo(Long id, String city, Double newFee);
    List<DoctorDetailResponse> getPendingDoctors();
    void initDoctorProfile(Long userId, String fullName);
    Long updateDoctorStatus(Long id, String status);
    void updateFullProfile(Long id, UpdateDoctorProfileRequest request);
}
