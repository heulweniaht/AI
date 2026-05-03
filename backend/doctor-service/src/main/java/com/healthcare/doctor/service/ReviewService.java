package com.healthcare.doctor.service;

import com.healthcare.doctor.client.AppointmentServiceClient;
import com.healthcare.doctor.dto.request.AddReviewRequest;
import com.healthcare.doctor.dto.response.ReviewResponse;
import com.healthcare.doctor.entity.Review;
import com.healthcare.doctor.repository.DoctorRepository;
import com.healthcare.doctor.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepo;
    private final DoctorRepository doctorRepo;
    private final AppointmentServiceClient appointmentClient;

    @Transactional
    // CỰC KỲ QUAN TRỌNG: Khi có review mới, ta phải xóa bộ nhớ đệm (Cache) của Bác sĩ này đi
    // để lần tới người dùng xem, hệ thống sẽ chọc xuống DB lấy Rating mới nhất.
    @CacheEvict(value = {"doctor:detail", "doctor:list"}, key = "#doctorId")
    public ReviewResponse addReview(Long doctorId, Long patientId, AddReviewRequest request) {

        // 1. Dùng Feign kiểm tra xem bệnh nhân ĐÃ KHÁM XONG chưa?
        boolean isCompleted = appointmentClient.checkAppointmentCompleted(
                request.getAppointmentId(), patientId, doctorId
        );
        if (!isCompleted) {
            throw new RuntimeException("Chỉ được phép đánh giá sau khi đã hoàn thành lịch khám!");
        }

        // 2. Kiểm tra xem đã đánh giá lần nào chưa (Chống spam đánh giá)[cite: 1]
        if (reviewRepo.existsByPatientIdAndDoctorId(patientId, doctorId)) {
            throw new RuntimeException("Bạn đã đánh giá bác sĩ này rồi!");
        }

        // 3. Lưu đánh giá vào DB
        Review review = Review.builder()
                .doctorId(doctorId)
                .patientId(patientId)
                .appointmentId(request.getAppointmentId())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        reviewRepo.save(review);

        // 4. Tính toán lại Rating Trung Bình của Bác sĩ[cite: 1]
        Double newAvgRating = reviewRepo.calculateAverageRating(doctorId);
        Long totalReviews = reviewRepo.countByDoctorId(doctorId);

        // Cập nhật vào hồ sơ Bác sĩ[cite: 1]
        doctorRepo.updateRating(doctorId, newAvgRating, totalReviews);
        log.info("Đã cập nhật Rating cho Bác sĩ {}: {} sao ({} lượt đánh giá)", doctorId, newAvgRating, totalReviews);

        return ReviewResponse.builder()
                .id(review.getId())
                .doctorId(doctorId)
                .patientId(patientId)
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}