package com.healthcare.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PushNotificationService {
    public void sendPush(String userId, String title, String message) {
        log.info(">>> [PUSH MOCK] Tới user {}: {} - {}", userId, title, message);
    }
}