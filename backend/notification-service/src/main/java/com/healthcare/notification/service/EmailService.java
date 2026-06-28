package com.healthcare.notification.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    // ── OTP Verification ─────────────────────────────────────────────────
    public void sendOtpEmail(String toEmail, String fullName, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã xác thực OTP - Smart Healthcare");
        message.setText(
                "Xin chào " + fullName + ",\n\n" +
                "Mã xác thực OTP của bạn là: " + otp + "\n" +
                "Mã này sẽ hết hạn trong 5 phút.\n\n" +
                "Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.\n\n" +
                "Trân trọng,\nĐội ngũ Smart Healthcare"
        );
        sendAndLog(toEmail, message, "OTP");
    }

    // ── Forgot Password ───────────────────────────────────────────────────
    public void sendForgotPasswordEmail(String toEmail, String fullName, String newPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mật khẩu mới - Smart Healthcare");
        message.setText(
                "Xin chào " + fullName + ",\n\n" +
                "Bạn đã yêu cầu đặt lại mật khẩu.\n" +
                "Mật khẩu mới của bạn là: " + newPassword + "\n\n" +
                "⚠️ Vui lòng đăng nhập và đổi mật khẩu ngay sau khi nhận được email này.\n\n" +
                "Trân trọng,\nĐội ngũ Smart Healthcare"
        );
        sendAndLog(toEmail, message, "ForgotPassword");
    }

    // ── Appointment Confirmation ──────────────────────────────────────────
    public void sendAppointmentConfirmation(String toEmail, String patientName,
                                            String doctorName, String time) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Xác nhận đặt lịch khám - Smart Healthcare");
        message.setText(
                "Xin chào " + patientName + ",\n\n" +
                "Lịch khám với Bác sĩ " + doctorName + " vào lúc " + time + " đã được xác nhận.\n" +
                "Vui lòng đến trước 15 phút để làm thủ tục.\n\n" +
                "Trân trọng,\nĐội ngũ Smart Healthcare"
        );
        sendAndLog(toEmail, message, "AppointmentConfirm");
    }

    // ── Cancellation ──────────────────────────────────────────────────────
    public void sendCancellationNotification(String toEmail, String reason, String refundAmount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Thông báo hủy lịch khám");
        message.setText(
                "Lịch khám của bạn đã bị hủy.\nLý do: " + reason + "\n" +
                (refundAmount != null ? "Số tiền " + refundAmount + " VND sẽ được hoàn lại.\n" : "") +
                "\nTrân trọng,\nĐội ngũ Smart Healthcare"
        );
        sendAndLog(toEmail, message, "Cancellation");
    }

    public void sendDoctorCancellationNotification(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Thông báo: Bệnh nhân hủy lịch");
        message.setText(
                "Xin chào Bác sĩ,\n\nMột lịch khám vừa bị bệnh nhân hủy. " +
                "Vui lòng kiểm tra hệ thống để biết thêm chi tiết."
        );
        sendAndLog(toEmail, message, "DoctorCancellation");
    }

    // ── Payment Receipt ───────────────────────────────────────────────────
    public void sendPaymentReceipt(String toEmail, String amount, String transactionId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Biên lai thanh toán - Smart Healthcare");
        message.setText(
                "Cảm ơn bạn đã thanh toán.\n" +
                "Số tiền: " + amount + " VND\n" +
                "Mã giao dịch: " + transactionId + "\n\n" +
                "Trân trọng!"
        );
        sendAndLog(toEmail, message, "PaymentReceipt");
    }

    // ── Internal Helper ───────────────────────────────────────────────────
    private void sendAndLog(String toEmail, SimpleMailMessage message, String type) {
        try {
            mailSender.send(message);
            log.info("[Email] {} gửi thành công tới: {}", type, toEmail);
        } catch (Exception e) {
            log.error("[Email] {} gửi thất bại tới {}: {}", type, toEmail, e.getMessage());
            throw new RuntimeException("Gửi email thất bại: " + e.getMessage(), e);
        }
    }
}
