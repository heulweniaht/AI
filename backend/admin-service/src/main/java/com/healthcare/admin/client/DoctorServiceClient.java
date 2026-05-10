package com.healthcare.admin.client;

import com.healthcare.admin.dto.DashboardStatsResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "DOCTOR-SERVICE")
public interface DoctorServiceClient {

    @GetMapping("/api/v1/doctors/admin/count")
    long getTotalDoctors();

    // API để admin đổi trạng thái bác sĩ (Active/Inactive/Rejected)
    @PutMapping("/api/v1/doctors/admin/{id}/status")
    Long updateDoctorStatus(@PathVariable("id") Long id, @RequestParam("status") String status);

    @GetMapping("/api/v1/doctors/admin/specialty-stats")
    List<DashboardStatsResponse.SpecialtyChartPoint> getSpecialtyStats();

    @GetMapping("/api/v1/doctors/admin/pending")
    Object getPendingDoctors();
}