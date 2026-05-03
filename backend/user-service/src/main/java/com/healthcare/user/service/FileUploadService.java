package com.healthcare.user.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.url}")
    private String minioUrl;

    public String uploadFile(MultipartFile file) {
        try {
            // Tạo tên file ngẫu nhiên để không bị trùng (VD: 123e4567-e89b-12d3-a456-426614174000.jpg)
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            InputStream inputStream = file.getInputStream();

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            log.info("Upload file thành công: {}", fileName);
            // Trả về đường link tĩnh để frontend có thể hiển thị ảnh
            return minioUrl + "/" + bucketName + "/" + fileName;

        } catch (Exception e) {
            log.error("Lỗi khi upload file lên MinIO: {}", e.getMessage());
            throw new RuntimeException("Không thể upload file đính kèm");
        }
    }
}