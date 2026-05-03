package com.healthcare.payment.controller;

import com.healthcare.payment.service.PaymentService;
import com.healthcare.payment.service.VNPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments/vnpay/callback") // Nhớ API này đã được mở toang trong SecurityConfig chưa?[cite: 1]
@RequiredArgsConstructor
@Slf4j
public class VNPayCallbackController {

    private final VNPayService vnPayService;
    private final PaymentService paymentService;

    // VNPay sẽ tự động gọi GET vào đây, ném một đống tham số vào URL (?vnp_Amount=...&vnp_TxnRef=...)
    @GetMapping
    public ResponseEntity<String> vnPayIpn(@RequestParam Map<String, String> params) {
        log.info(">>> Nhận Callback IPN từ VNPay: {}", params);
        try {
            // 1. Dùng chìa khóa bí mật kiểm tra Chữ ký xem có đúng là VNPay gọi không, hay hacker gọi[cite: 1]
            if (!vnPayService.verifyIpn(new HashMap<>(params))) {
                log.warn("Sai chữ ký bảo mật từ VNPay!");
                return ResponseEntity.ok("{\"RspCode\":\"97\",\"Message\":\"Invalid Signature\"}");
            }

            // 2. Chữ ký chuẩn rồi! Lấy thông tin ra
            String responseCode = params.get("vnp_ResponseCode"); // "00" là thành công
            String txnRef = params.get("vnp_TxnRef"); // Mã đơn hàng ta tạo ban nãy (VD: "5_1714000000")

            // Tách chuỗi lấy ID Lịch Khám (số 5)
            Long appointmentId = Long.parseLong(txnRef.split("_")[0]);

            // 3. Cập nhật hệ thống
            if ("00".equals(responseCode)) {
                // Tiền thật của VNPay gửi về bị nhân 100 lần, ta phải chia đi[cite: 1]
                BigDecimal amount = new BigDecimal(params.get("vnp_Amount")).divide(BigDecimal.valueOf(100));
                String transactionNo = params.get("vnp_TransactionNo"); // Mã GD nội bộ của ngân hàng

                paymentService.confirmPayment(appointmentId, transactionNo, amount);
                log.info("Thanh toán thành công cho lịch: {}", appointmentId);

                return ResponseEntity.ok("{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}");
            } else {
                paymentService.failPayment(appointmentId, responseCode);
                return ResponseEntity.ok("{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}"); // Vẫn trả 00 để báo cho VNPay là "Tôi đã nhận thông tin thất bại của bạn"
            }
        } catch (Exception e) {
            log.error("Lỗi xử lý IPN: {}", e.getMessage());
            return ResponseEntity.ok("{\"RspCode\":\"99\",\"Message\":\"Unknown error\"}");
        }
    }
}