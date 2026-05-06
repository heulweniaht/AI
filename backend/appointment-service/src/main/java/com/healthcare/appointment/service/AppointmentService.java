package com.healthcare.appointment.service;

import com.healthcare.appointment.dto.request.BookAppointmentRequest;
import com.healthcare.appointment.dto.response.AppointmentResponse;
import org.springframework.data.domain.Page;

public interface AppointmentService {
    AppointmentResponse bookAppointment(BookAppointmentRequest req, Long patientId, String patientEmail);
    boolean checkAppointmentCompleted(Long appointmentId, Long patientId, Long doctorId);

    Page<AppointmentResponse> getMyAppointments(Long userId, String role, int page, int size);
}