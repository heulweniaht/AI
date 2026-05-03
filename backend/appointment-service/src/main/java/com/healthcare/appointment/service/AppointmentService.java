package com.healthcare.appointment.service;

import com.healthcare.appointment.dto.request.BookAppointmentRequest;
import com.healthcare.appointment.dto.response.AppointmentResponse;

public interface AppointmentService {
    AppointmentResponse bookAppointment(BookAppointmentRequest req, Long patientId, String patientEmail);
    // Thêm hàm này vào dưới các hàm đã có
    boolean checkAppointmentCompleted(Long appointmentId, Long patientId, Long doctorId);
}