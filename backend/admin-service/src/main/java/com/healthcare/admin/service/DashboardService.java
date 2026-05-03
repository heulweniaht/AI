package com.healthcare.admin.service;

import com.healthcare.admin.client.AppointmentServiceClient;
import com.healthcare.admin.client.DoctorServiceClient;
import com.healthcare.admin.client.PaymentServiceClient;
import com.healthcare.admin.client.UserServiceClient;
import com.healthcare.admin.dto.DashboardStatsResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    // Nhúng (Inject) 4 "cánh tay nối dài" vào đây
    private final UserServiceClient userClient;
    private final DoctorServiceClient doctorClient;
    private final AppointmentServiceClient appointmentClient;
    private final PaymentServiceClient paymentClient;

    public DashboardStatsResponse getDashboardStats() {
        log.info("Bắt đầu tổng hợp dữ liệu Dashboard từ các Microservices...");

        long totalUsers = 0;
        long totalDoctors = 0;
        long todayAppointments = 0;
        BigDecimal monthlyRevenue = BigDecimal.ZERO;

        // Bọc Try-Catch cho từng khối gọi Feign.
        // Vì nếu Payment Service bị sập, ta vẫn muốn Admin xem được số User, không để sập lây toàn bộ Dashboard.

        try {
            totalUsers = userClient.getTotalUsers();
        } catch (Exception e) {
            log.error("Không lấy được số User từ Auth Service: {}", e.getMessage());
        }

        try {
            totalDoctors = doctorClient.getTotalDoctors();
        } catch (Exception e) {
            log.error("Không lấy được số Bác sĩ từ Doctor Service: {}", e.getMessage());
        }

        try {
            todayAppointments = appointmentClient.getTodayAppointmentsCount();
        } catch (Exception e) {
            log.error("Không lấy được số Lịch khám từ Appointment Service: {}", e.getMessage());
        }

        try {
            monthlyRevenue = paymentClient.getMonthlyRevenue();
        } catch (Exception e) {
            log.error("Không lấy được Doanh thu từ Payment Service: {}", e.getMessage());
        }

        // Đóng gói dữ liệu trả về cho Frontend
        return DashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalDoctors(totalDoctors)
                .todayAppointments(todayAppointments)
                .monthlyRevenue(monthlyRevenue)
                .build();
    }
}