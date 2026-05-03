package com.healthcare.appointment.controller;

import com.healthcare.appointment.dto.request.BookAppointmentRequest;
import com.healthcare.appointment.dto.response.AppointmentResponse;
import com.healthcare.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> book(
            @Valid @RequestBody BookAppointmentRequest request,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader("X-User-Email") String email) {

        // Kiểm tra quyền: Chỉ có Bệnh nhân mới được đặt lịch
        if (!"PATIENT".equals(role)) {
            throw new RuntimeException("Chỉ có bệnh nhân mới được phép đặt lịch khám");
        }

        AppointmentResponse response = appointmentService.bookAppointment(request, userId, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/internal/check-completed")
    public ResponseEntity<Boolean> checkCompleted(
            @RequestParam Long appointmentId,
            @RequestParam Long patientId,
            @RequestParam Long doctorId) {

        boolean isCompleted = appointmentService.checkAppointmentCompleted(appointmentId, patientId, doctorId);
        return ResponseEntity.ok(isCompleted);
    }
}