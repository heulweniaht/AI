package com.healthcare.doctor.controller;

import com.healthcare.doctor.entity.Specialty;
import com.healthcare.doctor.repository.SpecialtyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/specialties")
@RequiredArgsConstructor
public class SpecialtyController {

    private final SpecialtyRepository specialtyRepository;

    @GetMapping
    public ResponseEntity<List<Specialty>> getAllSpecialties() {
        // Trả về tất cả chuyên khoa đang Active
        return ResponseEntity.ok(specialtyRepository.findByIsActiveTrue());
    }
}