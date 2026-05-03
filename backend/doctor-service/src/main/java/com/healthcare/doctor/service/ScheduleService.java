package com.healthcare.doctor.service;

import com.healthcare.doctor.dto.response.AvailableSlotResponse;
import com.healthcare.doctor.entity.DoctorSchedule;
import com.healthcare.doctor.repository.DoctorScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service // Bắt buộc phải có @Service để Spring tạo Bean
@RequiredArgsConstructor
@Slf4j
public class ScheduleService {

    private final DoctorScheduleRepository scheduleRepository;

    // Hàm lấy danh sách slot
    public List<AvailableSlotResponse> getAvailableSlots(Long doctorId, LocalDate date) {
        List<DoctorSchedule> slots = scheduleRepository.findAvailableSlots(doctorId, date);
        return slots.stream().map(slot -> AvailableSlotResponse.builder()
                .scheduleId(slot.getId())
                .scheduleDate(slot.getScheduleDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .build()).collect(Collectors.toList());
    }

    // Hàm khóa slot
    @Transactional
    public void markSlotBooked(Long scheduleId) {
        DoctorSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy slot khám"));
        schedule.setBooked(true);
        scheduleRepository.save(schedule);
        log.info("Slot {} đã được đánh dấu là BOOKED", scheduleId);
    }

    // Hàm giải phóng slot
    @Transactional
    public void releaseSlot(Long scheduleId) {
        DoctorSchedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy slot khám"));
        schedule.setBooked(false);
        scheduleRepository.save(schedule);
        log.info("Slot {} đã được giải phóng (RELEASED)", scheduleId);
    }
}