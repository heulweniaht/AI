package com.healthcare.appointment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

@Data
public class BookAppointmentRequest {
    @NotNull(message = "Thiếu ID Bác sĩ")
    private Long doctorId;

    @NotNull(message = "Thiếu ID Lịch khám (Slot)")
    private Long scheduleId;

    @NotBlank(message = "Vui lòng nhập lý do khám")
    private String reason;

    private List<String> symptoms; // Danh sách triệu chứng (Mảng chuỗi)
    private String paymentMethod;  // CASH (Tiền mặt) hoặc VNPAY
}