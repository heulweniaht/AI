package com.healthcare.admin.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalDoctors;
    private long todayAppointments;
    private BigDecimal monthlyRevenue;
}