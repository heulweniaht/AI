package com.healthcare.appointment.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.healthcare.appointment.client.DoctorServiceClient;
import com.healthcare.appointment.dto.request.BookAppointmentRequest;
import com.healthcare.appointment.dto.response.AppointmentResponse;
import com.healthcare.appointment.entity.Appointment;
import com.healthcare.appointment.entity.AppointmentStatus;
import com.healthcare.appointment.exception.SlotNotAvailableException;
import com.healthcare.appointment.kafka.AppointmentEventProducer;
import com.healthcare.appointment.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepo;
    private final SlotAvailabilityService slotService; // Ở phần 1 (Redis Lock)
    private final DoctorServiceClient doctorClient;    // Feign Client
    private final AppointmentEventProducer eventProducer; // Kafka
    private final ObjectMapper objectMapper;

    @Override
    @Transactional // Mở giao dịch CSDL
    public AppointmentResponse bookAppointment(BookAppointmentRequest req, Long patientId, String patientEmail) {

        // 1. DÙNG REDIS LOCK: Cố gắng chốt cửa cái lịch này lại (Ngăn Race Condition)
        boolean isReserved = slotService.tryReserveSlot(req.getScheduleId(), patientId);
        if (!isReserved) {
            throw new SlotNotAvailableException("Rất tiếc, khung giờ này vừa có người đặt. Vui lòng chọn giờ khác.");
        }

        try {
            // 2. Lưu vào Database (Appointment Service)
            String symptomsJson = objectMapper.writeValueAsString(req.getSymptoms());

            Appointment appointment = Appointment.builder()
                    .patientId(patientId)
                    .doctorId(req.getDoctorId())
                    .scheduleId(req.getScheduleId())
                    .reason(req.getReason())
                    .symptomsJson(symptomsJson)
                    .status(AppointmentStatus.PENDING)
                    .appointmentTime(LocalDateTime.now().plusDays(1)) // Giả lập giờ khám
                    .build();

            Appointment savedAppt = appointmentRepo.save(appointment);

            // 3. GỌI FEIGN CLIENT: Sang Doctor Service đánh dấu Slot này là is_booked = true
            doctorClient.markSlotBooked(req.getDoctorId(), req.getScheduleId());

            // 4. KAFKA: Báo cho Notification gửi mail
            // (Tên bác sĩ và bệnh nhân giả lập tạm, thực tế sẽ gọi UserServiceClient để lấy)
            eventProducer.publishAppointmentBooked(savedAppt, patientEmail, "Bệnh Nhân", "Bác Sĩ");

            return AppointmentResponse.builder()
                    .appointmentId(savedAppt.getId())
                    .patientId(patientId)
                    .doctorId(req.getDoctorId())
                    .status(savedAppt.getStatus().name())
                    .reason(savedAppt.getReason())
                    .appointmentTime(savedAppt.getAppointmentTime())
                    .createdAt(savedAppt.getCreatedAt())
                    .build();

        } catch (Exception e) {
            // RẤT QUAN TRỌNG: Nếu lưu DB lỗi hoặc gọi Doctor Service bị đứt mạng
            // Phải nhả cái khóa Redis ra ngay lập tức để người khác còn đặt được
            slotService.releaseSlot(req.getScheduleId());
            log.error("Lỗi khi đặt lịch, đã nhả Redis Lock: {}", e.getMessage());
            throw new RuntimeException("Đặt lịch thất bại do lỗi hệ thống: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkAppointmentCompleted(Long appointmentId, Long patientId, Long doctorId) {
        log.info("Doctor Service đang kiểm tra trạng thái hoàn thành của Lịch khám ID: {}", appointmentId);

        // Gọi hàm repository vừa tạo, truyền trạng thái là COMPLETED
        return appointmentRepo.existsByIdAndPatientIdAndDoctorIdAndStatus(
                appointmentId,
                patientId,
                doctorId,
                AppointmentStatus.COMPLETED
        );
    }
}