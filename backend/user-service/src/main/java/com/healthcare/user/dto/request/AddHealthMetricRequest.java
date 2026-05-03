package com.healthcare.user.dto.request;

import lombok.Data;

@Data
public class AddHealthMetricRequest {
    private Double weight;
    private Double height;
    private String bloodPressure;
    private Double heartRate;
}
