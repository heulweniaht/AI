package com.healthcare.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "APPOINTMENT-SERVICE")
public interface AppointmentServiceClient {
    @GetMapping("/api/v1/appointments/admin/today/count")
    long getTodayAppointmentsCount();
}