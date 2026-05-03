package com.healthcare.payment.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentUrlResponse {
    private String paymentUrl; // Chuỗi URL dài ngoằng của VNPay để Frontend chuyển hướng khách sang đó
}