package com.healthcare.doctor.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class AvailableSlotResponse {
    private Long id; // Đổi từ scheduleId thành id để khớp với Frontend
    private LocalDate scheduleDate;
    private LocalTime startTime;
    private LocalTime endTime;

    // Bổ sung 2 trường trạng thái
    @JsonProperty("isAvailable")
    private boolean isAvailable;

    @JsonProperty("isBooked")
    private boolean isBooked;
}