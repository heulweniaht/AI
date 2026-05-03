package com.healthcare.payment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HexFormat;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class VNPayService {

    // Lấy cấu hình từ file application.yml[cite: 1]
    @Value("${vnpay.tmn-code}") private String tmnCode;
    @Value("${vnpay.hash-secret}") private String hashSecret;
    @Value("${vnpay.pay-url}") private String payUrl;
    @Value("${vnpay.return-url}") private String returnUrl;

    // --- 1. HÀM TẠO ĐƯỜNG LINK THANH TOÁN ---
    public String createPaymentUrl(Long appointmentId, java.math.BigDecimal amount, String orderInfo, String ipAddress) {
        String txnRef = appointmentId + "_" + System.currentTimeMillis(); // Mã đơn hàng (Phải duy nhất)

        // Dùng TreeMap để VNPay yêu cầu: Tham số gửi đi PHẢI được sắp xếp theo thứ tự bảng chữ cái A-Z
        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", "2.1.0");
        params.put("vnp_Command", "pay");
        params.put("vnp_TmnCode", tmnCode);
        params.put("vnp_Amount", amount.multiply(java.math.BigDecimal.valueOf(100)).longValue() + ""); // VNPay quy định tiền phải nhân 100[cite: 1]
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", orderInfo);
        params.put("vnp_OrderType", "healthcare");
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", ipAddress);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        params.put("vnp_CreateDate", LocalDateTime.now().format(formatter));
        params.put("vnp_ExpireDate", LocalDateTime.now().plusMinutes(15).format(formatter)); // Link chỉ sống 15 phút[cite: 1]

        // Tạo chuỗi Hash (Chữ ký)
        String signData = buildQueryString(params);
        String vnpSecureHash = hmacSha512(hashSecret, signData);
        params.put("vnp_SecureHash", vnpSecureHash); // Gắn chữ ký vào gói hàng[cite: 1]

        return payUrl + "?" + buildQueryString(params);
    }

    // --- 2. HÀM KIỂM TRA CHỮ KÝ KHI VNPAY TRẢ KẾT QUẢ VỀ (IPN) ---
    public boolean verifyIpn(Map<String, String> params) {
        // Lấy chữ ký do VNPay gửi về, sau đó xóa nó đi để tính toán lại các tham số còn lại[cite: 1]
        String receivedHash = params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        // Xếp lại thứ tự A-Z
        Map<String, String> sortedParams = new TreeMap<>(params);
        String signData = buildQueryString(sortedParams);

        // Lấy chìa khóa bí mật của mình, băm các tham số xem có ra đúng cái chữ ký VNPay gửi không
        String expectedHash = hmacSha512(hashSecret, signData);

        // Nếu trùng nhau 100% -> Hợp lệ, không bị Hacker can thiệp[cite: 1]
        return expectedHash.equalsIgnoreCase(receivedHash);
    }

    // --- HÀM PHỤ TRỢ MÃ HÓA SHA-512 ---
    private String hmacSha512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi mã hóa HMAC-SHA512", e);
        }
    }

    // --- HÀM PHỤ TRỢ NỐI CHUỖI ĐỂ TẠO URL ĐÚNG CHUẨN ---
    private String buildQueryString(Map<String, String> params) {
        return params.entrySet().stream()
                .filter(e -> e.getValue() != null && !e.getValue().isBlank())
                .map(e -> URLEncoder.encode(e.getKey(), StandardCharsets.UTF_8) + "=" + URLEncoder.encode(e.getValue(), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));
    }
}