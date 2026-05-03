package com.healthcare.notification.service;

import com.healthcare.notification.entity.NotificationLog;
import com.healthcare.notification.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationLogService {

    private final NotificationLogRepository logRepository;

    public void saveLog(String recipient, String type, String content, String status) {
        NotificationLog notifLog = NotificationLog.builder()
                .recipient(recipient)
                .type(type)
                .content(content)
                .status(status)
                .sentAt(LocalDateTime.now())
                .build();
        logRepository.save(notifLog);
        log.debug("Đã lưu log thông báo cho: {}", recipient);
    }
}