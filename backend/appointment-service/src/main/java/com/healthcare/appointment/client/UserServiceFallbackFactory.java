package com.healthcare.appointment.client;

import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.stereotype.Component;

@Component
class UserServiceFallbackFactory implements FallbackFactory<UserServiceClient> {
    @Override
    public UserServiceClient create(Throwable cause) {
        return userId -> "Bệnh nhân ẩn danh"; // Nếu User Service sập, trả về tên mặc định
    }
}