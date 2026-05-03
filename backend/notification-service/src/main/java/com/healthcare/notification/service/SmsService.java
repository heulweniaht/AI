package com.healthcare.notification.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class SmsService {
    public void sendAppointmentReminder(String phone, String doctorName, LocalDateTime time) {
        //Gỉa lập logic gửi SMS
        log.info(">>> [SMS MOCK] Gửi tới {}: Nhắc lịch khám với bác sĩ {} vào lúc {}", phone, doctorName, time);    }
}
