package com.healthcare.payment.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreatePaymentRequest {
    @NotNull(message = "Thiếu mã lịch khám")
    private Long appointmentId;

    @NotNull(message = "Thiếu số tiền")
    @Min(value = 10000, message = "Số tiền phải lớn hơn 10.000 VNĐ")
    private BigDecimal amount;

    private String orderInfo; // Mô tả: "Thanh toan tien kham benh..."
}