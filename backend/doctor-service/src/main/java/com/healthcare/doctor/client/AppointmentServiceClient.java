package com.healthcare.doctor.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "APPOINTMENT-SERVICE")
public interface AppointmentServiceClient {

    // Gọi sang Appointment Service để hỏi xem bệnh nhân này đã khám xong lịch này chưa
    @GetMapping("/api/v1/appointments/internal/check-completed")
    boolean checkAppointmentCompleted(@RequestParam("appointmentId") Long appointmentId,
                                      @RequestParam("patientId") Long patientId,
                                      @RequestParam("doctorId") Long doctorId);
}