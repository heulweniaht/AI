package com.healthcare.admin.controller;

import com.healthcare.admin.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/revenue/export")
    public ResponseEntity<byte[]> exportRevenueReport(
            @RequestParam int month,
            @RequestParam int year) {

        // Lấy nội dung file CSV từ Service
        String csvContent = reportService.generateRevenueCsvReport(month, year);
        byte[] csvBytes = csvContent.getBytes();

        // Cấu hình Header để ép trình duyệt tải file xuống thay vì hiển thị chữ trên web
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=DoanhThu_" + month + "_" + year + ".csv");
        headers.setContentType(MediaType.parseMediaType("text/csv"));

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvBytes);
    }
}