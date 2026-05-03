package com.healthcare.payment.service;

import com.healthcare.payment.dto.request.CreatePaymentRequest;
import com.healthcare.payment.dto.response.PaymentUrlResponse;
import java.math.BigDecimal;

public interface PaymentService {
    PaymentUrlResponse createPayment(CreatePaymentRequest req, Long userId, String email, String ipAddress);
    void confirmPayment(Long appointmentId, String transactionId, BigDecimal amount);
    void failPayment(Long appointmentId, String responseCode);
}