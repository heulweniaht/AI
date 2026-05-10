package com.healthcare.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalDoctors;
    private long todayAppointments;
    private BigDecimal monthlyRevenue;

    // Thêm 2 danh sách này cho biểu đồ
    private List<RevenueChartPoint> revenueChart;
    private List<SpecialtyChartPoint> specialtyChart;

    @Data
    @AllArgsConstructor
    public static class RevenueChartPoint {
        private String name; // Thứ 2, T3...
        private BigDecimal DoanhThu;
        private Long Kham;
    }

    @Data
    @AllArgsConstructor
    public static class SpecialtyChartPoint {
        private String name; // Tên chuyên khoa
        private Long value;  // Số lượng bác sĩ
    }
}