package com.healthcare.payment.controller;

import com.healthcare.payment.dto.request.CreatePaymentRequest;
import com.healthcare.payment.dto.response.PaymentUrlResponse;
import com.healthcare.payment.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentUrlResponse> createPayment(
            @Valid @RequestBody CreatePaymentRequest request,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Email") String email,
            HttpServletRequest httpServletRequest) { // Dùng để lấy IP của bệnh nhân

        // VNPay bắt buộc phải cung cấp IP của người mua hàng[cite: 1]
        String ipAddress = httpServletRequest.getRemoteAddr();

        PaymentUrlResponse response = paymentService.createPayment(request, userId, email, ipAddress);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}