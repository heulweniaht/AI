package com.healthcare.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    private String phone;

    @NotBlank(message = "Vai trò không được để trống")
    @Pattern(regexp = "^(PATIENT|DOCTOR)$", message = "Vai trò phải là PATIENT hoặc DOCTOR")
    private String role;
}
