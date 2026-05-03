package com.healthcare.payment.entity;

public enum PaymentStatus {
    PENDING,  // Đang chờ khách quẹt thẻ
    SUCCESS,  // Thanh toán thành công
    FAILED,   // Lỗi quẹt thẻ, thiếu tiền
    REFUNDED  // Đã hoàn tiền (khi khách hủy lịch)
}