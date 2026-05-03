package com.healthcare.appointment.controller;

import com.healthcare.appointment.service.SlotAvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotAvailabilityService slotService;

    // API này cho phép Frontend kiểm tra nhanh xem slot này có đang bị ai "xí" tạm trong Redis không
    @GetMapping("/{scheduleId}/status")
    public ResponseEntity<String> checkSlotStatus(@PathVariable Long scheduleId) {
        boolean isAvailable = slotService.isSlotAvailable(scheduleId);
        return ResponseEntity.ok(isAvailable ? "AVAILABLE" : "LOCKED");
    }
}