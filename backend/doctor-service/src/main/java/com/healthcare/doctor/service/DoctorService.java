package com.healthcare.doctor.service;

import com.healthcare.doctor.dto.request.DoctorSearchFilter;
import com.healthcare.doctor.dto.response.DoctorDetailResponse;
import com.healthcare.doctor.dto.response.DoctorListResponse;
import com.healthcare.doctor.entity.DoctorProfile;
import org.springframework.data.domain.Page;

public interface DoctorService {
    DoctorDetailResponse getDoctorById(Long id);
    Page<DoctorListResponse> searchDoctors(DoctorSearchFilter filter, int page, int size);
    DoctorProfile updateDoctorInfo(Long id, String city, Double newFee);
}
