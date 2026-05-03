package com.healthcare.doctor.controller;

import com.healthcare.doctor.dto.request.AddReviewRequest;
import com.healthcare.doctor.dto.response.ReviewResponse;
import com.healthcare.doctor.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/doctors/{doctorId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long doctorId,
            @RequestHeader("X-User-Id") Long patientId,
            @Valid @RequestBody AddReviewRequest request) {

        ReviewResponse response = reviewService.addReview(doctorId, patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}