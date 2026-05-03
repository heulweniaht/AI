package com.healthcare.payment.service;

import com.healthcare.payment.entity.Payment;
import com.healthcare.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentAdminService {

    private final PaymentRepository paymentRepository;

    public BigDecimal getMonthlyRevenue() {
        BigDecimal revenue = paymentRepository.calculateCurrentMonthRevenue();
        return revenue != null ? revenue : BigDecimal.ZERO; // Nếu tháng này chưa có ai khám thì trả về 0
    }

    public List<Map<String, Object>> getTransactionsForReport(int month, int year) {
        List<Payment> payments = paymentRepository.findSuccessfulTransactionsByMonthAndYear(month, year);

        // Đổi từ Object Payment sang dạng Map để trả về đúng chuẩn mà Admin Service (Feign) đang chờ
        return payments.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("transactionId", p.getTransactionId());
            map.put("appointmentId", p.getAppointmentId());
            map.put("patientId", p.getPatientId());
            map.put("amount", p.getAmount());
            map.put("paidAt", p.getPaidAt() != null ? p.getPaidAt().toString() : "");
            return map;
        }).collect(Collectors.toList());
    }
}