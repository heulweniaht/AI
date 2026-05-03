package com.healthcare.doctor.controller;

import com.healthcare.doctor.dto.response.AvailableSlotResponse;
import com.healthcare.doctor.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/doctors/{doctorId}/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    // Lấy danh sách slot trống trong ngày
    @GetMapping
    public ResponseEntity<List<AvailableSlotResponse>> getAvailableSlots(
            @PathVariable Long doctorId,
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(scheduleService.getAvailableSlots(doctorId, date));
    }

    // Đánh dấu slot đã được đặt (Được gọi ngầm từ Appointment Service qua Feign Client)
    @PatchMapping("/{scheduleId}/book")
    public ResponseEntity<Void> markSlotBooked(
            @PathVariable Long doctorId,
            @PathVariable Long scheduleId) {
        scheduleService.markSlotBooked(scheduleId);
        return ResponseEntity.ok().build();
    }

    // Giải phóng slot khi bệnh nhân hủy lịch
    @PatchMapping("/{scheduleId}/release")
    public ResponseEntity<Void> releaseSlot(
            @PathVariable Long doctorId,
            @PathVariable Long scheduleId) {
        scheduleService.releaseSlot(scheduleId);
        return ResponseEntity.ok().build();
    }
}