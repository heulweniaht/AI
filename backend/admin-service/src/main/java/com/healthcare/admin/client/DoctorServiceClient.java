package com.healthcare.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "DOCTOR-SERVICE")
public interface DoctorServiceClient {

    @GetMapping("/api/v1/doctors/admin/count")
    long getTotalDoctors();

    // API để admin đổi trạng thái bác sĩ (Active/Inactive/Rejected)
    @PatchMapping("/api/v1/doctors/admin/{id}/status")
    void updateDoctorStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}