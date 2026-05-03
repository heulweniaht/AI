package com.healthcare.admin.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@FeignClient(name = "PAYMENT-SERVICE")
public interface PaymentServiceClient {
    @GetMapping("/api/v1/payments/admin/revenue/monthly")
    BigDecimal getMonthlyRevenue();

    @GetMapping("/api/v1/payments/admin/transactions")
    List<Map<String, Object>> getTransactionsByMonth(@RequestParam("month") int month, @RequestParam("year") int year);
}