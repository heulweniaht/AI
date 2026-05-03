package com.healthcare.payment.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Payment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long appointmentId; // Giao dịch này trả tiền cho lịch khám nào?

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private BigDecimal amount; // Số tiền

    private String method; // Ví dụ: "VNPAY", "CASH"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PaymentStatus status = PaymentStatus.PENDING;

    private String transactionId; // Mã giao dịch của VNPay trả về để đối soát

    private LocalDateTime createdAt;
    private LocalDateTime paidAt; // Thời điểm quẹt thẻ thành công

    @PrePersist
    public void onPrePersist() {
        this.createdAt = LocalDateTime.now();
    }
}