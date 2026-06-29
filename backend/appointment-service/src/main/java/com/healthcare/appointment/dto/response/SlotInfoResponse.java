package com.healthcare.appointment.dto.response;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class SlotInfoResponse {
    private Long id;
    private LocalDate scheduleDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean available;
    private boolean booked;
}