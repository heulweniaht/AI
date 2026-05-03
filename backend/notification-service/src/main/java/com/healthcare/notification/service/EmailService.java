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

    // Công cụ của Spring để gửi email
    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String fullName, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Mã xác thực OTP - Smart Healthcare");
            message.setText("Xin chào " + fullName + ",\n\n" +
                    "Mã xác thực OTP của bạn là: " + otp + "\n" +
                    "Mã này sẽ hết hạn trong 5 phút.\n\n" +
                    "Trân trọng,\nĐội ngũ Smart Healthcare");

            mailSender.send(message);
            log.info("Đã gửi email OTP thành công tới: {}", toEmail);
        } catch (Exception e) {
            log.error("Lỗi khi gửi email tới {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Gửi email thất bại", e);
        }
    }

    // Hàm gửi email xác nhận đặt lịch cho Bệnh nhân
    public void sendAppointmentConfirmation(String toEmail, String patientName, String doctorName, String time) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Xác nhận đặt lịch khám - Smart Healthcare");
            message.setText("Xin chào " + patientName + ",\n\n" +
                    "Lịch khám của bạn với Bác sĩ " + doctorName + " vào lúc " + time + " đã được xác nhận.\n" +
                    "Vui lòng đến trước 15 phút để làm thủ tục.\n\n" +
                    "Trân trọng,\nĐội ngũ Smart Healthcare");
            mailSender.send(message);
            log.info("Đã gửi email xác nhận đặt lịch tới: {}", toEmail);
        } catch (Exception e) {
            log.error("Lỗi khi gửi email xác nhận tới {}: {}", toEmail, e.getMessage());
        }
    }

    // Hàm gửi email thông báo hủy lịch cho Bệnh nhân
    public void sendCancellationNotification(String toEmail, String reason, String refundAmount) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Thông báo hủy lịch khám");
            message.setText("Lịch khám của bạn đã bị hủy.\nLý do: " + reason + "\n" +
                    (refundAmount != null ? "Số tiền " + refundAmount + " sẽ được hoàn lại vào tài khoản của bạn." : "") + "\n\n" +
                    "Trân trọng,\nĐội ngũ Smart Healthcare");
            mailSender.send(message);
            log.info("Đã gửi email hủy lịch tới: {}", toEmail);
        } catch (Exception e) {
            log.error("Lỗi gửi email hủy lịch tới {}: {}", toEmail, e.getMessage());
        }
    }

    // Hàm báo cho Bác sĩ biết bệnh nhân đã hủy lịch
    public void sendDoctorCancellationNotification(String toEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Thông báo: Bệnh nhân hủy lịch");
            message.setText("Xin chào Bác sĩ,\n\nMột lịch khám của bạn vừa bị hủy bởi bệnh nhân. Vui lòng kiểm tra lại hệ thống để biết thêm chi tiết.");
            mailSender.send(message);
            log.info("Đã báo hủy lịch cho bác sĩ: {}", toEmail);
        } catch (Exception e) {
            log.error("Lỗi báo hủy lịch cho bác sĩ {}: {}", toEmail, e.getMessage());
        }
    }

    // Hàm gửi biên lai thanh toán
    public void sendPaymentReceipt(String toEmail, String amount, String transactionId) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Biên lai thanh toán - Smart Healthcare");
            message.setText("Cảm ơn bạn đã thanh toán.\n" +
                    "Số tiền: " + amount + " VND\n" +
                    "Mã giao dịch: " + transactionId + "\n\n" +
                    "Trân trọng!");
            mailSender.send(message);
            log.info("Đã gửi biên lai tới: {}", toEmail);
        } catch (Exception e) {
            log.error("Lỗi gửi biên lai tới {}: {}", toEmail, e.getMessage());
        }
    }
}