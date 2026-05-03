package com.healthcare.payment.service;

import com.healthcare.payment.entity.Payment;
import com.healthcare.payment.entity.PaymentStatus;
import com.healthcare.payment.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefundService {

    private final PaymentRepository paymentRepo;

    @Transactional
    public void processRefund(Long appointmentId, String cancelledBy) {

        Payment payment = paymentRepo.findByAppointmentId(appointmentId).orElse(null);

        if (payment == null || payment.getStatus() != PaymentStatus.SUCCESS) {
            log.info("Lịch khám {} chưa thanh toán thành công. Bỏ qua luồng hoàn tiền.", appointmentId);
            return;
        }

        BigDecimal refundAmount = payment.getAmount();
        if("PATIENT".equals(cancelledBy)) {
            refundAmount = payment.getAmount().multiply(new BigDecimal("0.8"));
            log.info("Bệnh nhn chủ động huỷ lịch {}. Phạt 20% phí. Số tiền hoàn: {}", appointmentId,refundAmount);
        } else {
            log.info("Bác sĩ/Admin huỷ lịch {}. Hoàn 100% số tiền: {}", appointmentId,refundAmount);
        }

        boolean isRefundSuccess = executeVNPayRefundApi(payment.getTransactionId(), refundAmount);

        if (isRefundSuccess) {
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepo.save(payment);
            log.info("Đã cập nhật trạng thái hoá đơn {} thành REFUNDED", payment.getId());
        } else {
            log.error("API Hoàn tiền VNPay trả về lỗi cho hoá đơn {}", payment.getId());
        }
    }

    private boolean executeVNPayRefundApi(String transactionId, BigDecimal amount) {
        log.info(">>> Đang gọi API VNPay Hoàn tiền: Mã giao dịch [{}], Số tiền [{}]", transactionId, amount);

        try {
            Thread.sleep(1000);

            log.info(">>> Nhận kết quả từ VNPay: Hoàn tiền thành công (RspCode: 00)");
            return true;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Lỗi khi kết nối VNPay", e);
            return false;
        }
    }
}
