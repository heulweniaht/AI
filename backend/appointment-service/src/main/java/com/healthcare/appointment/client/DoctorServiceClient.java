package com.healthcare.appointment.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;

// @FeignClient sẽ tự động dò tìm "DOCTOR-SERVICE" trong danh bạ Eureka để gọi API
@FeignClient(name = "DOCTOR-SERVICE")
public interface DoctorServiceClient {
    
    // Gọi API cập nhật trạng thái "Đã đặt" sang Doctor Service
    @PatchMapping("/api/v1/doctors/{doctorId}/schedules/{scheduleId}/book")
    void markSlotBooked(@PathVariable("doctorId") Long doctorId, @PathVariable("scheduleId") Long scheduleId);

    // Gọi API giải phóng lịch sang Doctor Service
    @PatchMapping("/api/v1/doctors/{doctorId}/schedules/{scheduleId}/release")
    void releaseSlot(@PathVariable("doctorId") Long doctorId, @PathVariable("scheduleId") Long scheduleId);
}