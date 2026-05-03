package com.healthcare.notification.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class NotificationLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String recipient; // Email hoặc Số điện thoại
    private String type;      // Loại thông báo (VD: OTP, APPOINTMENT)
    private String content;   // Nội dung
    private String status;    // SUCCESS hoặc FAILED
    private LocalDateTime sentAt;
}