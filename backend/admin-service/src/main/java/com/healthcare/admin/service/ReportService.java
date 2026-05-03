package com.healthcare.admin.service;

import com.healthcare.admin.client.PaymentServiceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReportService {

    private final PaymentServiceClient paymentClient;

    public String generateRevenueCsvReport(int month, int year) {
        log.info("Đang tạo báo cáo doanh thu tháng {}/{}", month, year);

        // 1. Gọi sang Payment Service lấy cục data (Danh sách hóa đơn)
        List<Map<String, Object>> transactions = paymentClient.getTransactionsByMonth(month, year);

        // 2. Dùng StringBuilder để vẽ ra cấu trúc file CSV
        StringBuilder csvBuilder = new StringBuilder();

        // Dòng 1: Tiêu đề cột (Headers)
        csvBuilder.append("\uFEFF"); // Thêm mã BOM để Excel đọc được Tiếng Việt có dấu không bị lỗi font
        csvBuilder.append("Mã Giao Dịch,Mã Lịch Khám,ID Bệnh Nhân,Số Tiền (VND),Thời Gian Thanh Toán\n");

        // Dòng 2 trở đi: Đổ dữ liệu vào
        for (Map<String, Object> txn : transactions) {
            csvBuilder.append(txn.get("transactionId")).append(",")
                    .append(txn.get("appointmentId")).append(",")
                    .append(txn.get("patientId")).append(",")
                    .append(txn.get("amount")).append(",")
                    .append(txn.get("paidAt")).append("\n");
        }

        log.info("Tạo báo cáo CSV thành công ({} dòng)", transactions.size());
        return csvBuilder.toString();
    }
}