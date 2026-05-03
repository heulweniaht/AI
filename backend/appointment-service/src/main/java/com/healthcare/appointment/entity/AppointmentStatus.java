package com.healthcare.appointment.entity;

public enum AppointmentStatus {
    PENDING,      // Chờ khám
    CONFIRMED,    // Đã xác nhận (thanh toán xong)
    IN_PROGRESS,  // Đang khám
    COMPLETED,    // Khám xong
    CANCELLED,    // Đã hủy
    NO_SHOW       // Bệnh nhân không đến
}