package com.healthcare.payment.service;

import com.healthcare.payment.dto.request.CreatePaymentRequest;
import com.healthcare.payment.dto.response.PaymentUrlResponse;
import com.healthcare.payment.entity.Payment;
import com.healthcare.payment.entity.PaymentStatus;
import com.healthcare.payment.kafka.PaymentEventProducer;
import com.healthcare.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepo;
    private final VNPayService vnPayService;
    private final PaymentEventProducer eventProducer;

    @Override
    @Transactional
    public PaymentUrlResponse createPayment(CreatePaymentRequest req, Long userId, String email, String ipAddress) {

        // 1. Kiểm tra xem lịch này đã có giao dịch nào chưa. Nếu chưa thì tạo mới.
        Payment payment = paymentRepo.findByAppointmentId(req.getAppointmentId())
                .orElseGet(() -> {
                    Payment newPayment = Payment.builder()
                            .appointmentId(req.getAppointmentId())
                            .patientId(userId)
                            .amount(req.getAmount())
                            .method("VNPAY")
                            .status(PaymentStatus.PENDING)
                            .build();
                    return paymentRepo.save(newPayment);
                });

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            throw new RuntimeException("Lịch khám này đã được thanh toán rồi");
        }

        // 2. Cập nhật lại số tiền (phòng khi giá khám thay đổi)
        payment.setAmount(req.getAmount());
        paymentRepo.save(payment);

        // 3. Gọi VNPayService (ở Phần 1) để lấy cái Link thanh toán[cite: 1]
        String paymentUrl = vnPayService.createPaymentUrl(
                req.getAppointmentId(),
                req.getAmount(),
                req.getOrderInfo() != null ? req.getOrderInfo() : "Thanh toan lich kham " + req.getAppointmentId(),
                ipAddress
        );

        payment.setMethod("VNPAY");
        payment.setPatientEmail(email);
        paymentRepo.save(payment);

        return PaymentUrlResponse.builder().paymentUrl(paymentUrl).build();
    }

    @Override
    @Transactional
    public void confirmPayment(Long appointmentId, String transactionId, BigDecimal amount) {
        Payment payment = paymentRepo.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn cho lịch khám này"));

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            log.info("Hóa đơn {} đã thành công trước đó rồi, bỏ qua", appointmentId);
            return;
        }

        // Cập nhật CSDL[cite: 1]
        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setTransactionId(transactionId);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepo.save(payment);

        // Bóc tách email mà ta đã "nhét lén" ở trên
        String patientEmail = payment.getPatientEmail() != null
                ? payment.getPatientEmail()
                : "unknown@email.com";

        // Phát sự kiện lên Kafka[cite: 1]
        eventProducer.publishPaymentSuccess(payment, patientEmail);
    }

    @Override
    @Transactional
    public void failPayment(Long appointmentId, String responseCode) {
        Payment payment = paymentRepo.findByAppointmentId(appointmentId).orElse(null);
        if (payment != null && payment.getStatus() != PaymentStatus.SUCCESS) {
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepo.save(payment);
            log.warn("Thanh toán thất bại cho lịch {}. Mã lỗi VNPay: {}", appointmentId, responseCode);
        }
    }
}