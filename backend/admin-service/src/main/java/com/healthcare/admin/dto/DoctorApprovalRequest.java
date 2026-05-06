package com.healthcare.admin.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DoctorApprovalRequest {

    @JsonProperty("isApproved")
    private boolean isApproved;

    private String reason;
}