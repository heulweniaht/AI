package com.healthcare.appointment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RescheduleRequest {
    @NotNull(message = "Thiếu ID lịch mới")
    private Long newScheduleId;

    @NotBlank(message = "Vui lòng nhập lí do dời lịch")
    private String reason;
}
