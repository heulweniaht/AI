package com.healthcare.doctor.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateScheduleRequest {
    private LocalDate scheduleDate;
    private LocalTime startTime;
    private LocalTime endTime;
    @JsonProperty("isAvailable")
    private boolean isAvailable;
}