package com.healthcare.appointment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class SlotAvailabilityService {

    private final StringRedisTemplate redis;

    private static final long LOCK_TTL = 10; // Giây - Thời gian giữ ổ khóa
    private static final long SLOT_TTL = 24; // Giờ - Thời gian lưu thông tin lịch đã đặt

    // Hàm thử lấy chìa khóa đặt lịch
    public boolean tryReserveSlot(Long scheduleId, Long patientId) {
        String lockKey = "slot:lock:" + scheduleId;
        String slotKey = "slot:booked:" + scheduleId;

        // 1. Kỹ thuật SETNX (Set If Absent - Chỉ lưu nếu chưa tồn tại)
        // Nếu Redis chưa có key này, nó sẽ lưu chữ "LOCKED" và trả về TRUE (Lấy được khóa).
        // Nếu đã có (tức là có người khác đang giữ khóa), nó trả về FALSE.
        Boolean lockAcquired = redis.opsForValue()
                .setIfAbsent(lockKey, "LOCKED", LOCK_TTL, TimeUnit.SECONDS);

        if (Boolean.FALSE.equals(lockAcquired)) {
            log.warn("Không lấy được khóa cho lịch {}. Có người đang thao tác.", scheduleId);
            return false;
        }

        try {
            // 2. Kiểm tra xem lịch này đã bị người khác đặt thành công trước đó chưa
            if (Boolean.TRUE.equals(redis.hasKey(slotKey))) {
                log.warn("Lịch {} đã có người đặt thành công.", scheduleId);
                return false;
            }

            // 3. Nếu còn trống, ghi tên người đặt vào Redis
            redis.opsForValue().set(slotKey, patientId.toString(), SLOT_TTL, TimeUnit.HOURS);
            log.info("Bệnh nhân {} đã xí chỗ thành công lịch {}.", patientId, scheduleId);
            return true;

        } finally {
            // 4. LUÔN LUÔN phải trả lại chìa khóa (xóa lock) dù thành công hay bị lỗi
            redis.delete(lockKey);
        }
    }

    // Hàm giải phóng lịch (Dùng khi bệnh nhân bấm hủy)
    public void releaseSlot(Long scheduleId) {
        redis.delete("slot:booked:" + scheduleId);
        log.info("Đã giải phóng lịch trống cho slot {}", scheduleId);
    }

    public boolean isSlotAvailable(Long scheduleId) {
        return Boolean.FALSE.equals(redis.hasKey("slot:booked:" + scheduleId));
    }

}