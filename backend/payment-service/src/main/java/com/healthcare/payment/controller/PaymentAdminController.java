package com.healthcare.payment.controller;

import com.healthcare.payment.service.PaymentAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments/admin")
@RequiredArgsConstructor
public class PaymentAdminController {

    private final PaymentAdminService paymentAdminService;

    // Cấp doanh thu tháng này cho Dashboard của Admin
    @GetMapping("/revenue/monthly")
    public ResponseEntity<BigDecimal> getMonthlyRevenue() {
        return ResponseEntity.ok(paymentAdminService.getMonthlyRevenue());
    }

    // Cấp danh sách hóa đơn để Admin xuất file Excel (CSV)
    @GetMapping("/transactions")
    public ResponseEntity<List<Map<String, Object>>> getTransactions(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(paymentAdminService.getTransactionsForReport(month, year));
    }
}