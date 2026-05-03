package com.healthcare.admin.controller;

import com.healthcare.admin.dto.DashboardStatsResponse;
import com.healthcare.admin.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getStats() {
        // Chỉ có người có Role ADMIN mới được API Gateway cho đi vào đây
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }
}