package com.healthcare.admin.dto;

import lombok.Data;

@Data
public class DoctorApprovalRequest {
    private boolean isApproved; // true = Duyệt, false = Từ chối
    private String reason;      // Lý do (bắt buộc nếu từ chối)
}