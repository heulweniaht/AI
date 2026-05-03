package com.healthcare.payment.repository;

import com.healthcare.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByAppointmentId(Long appointmentId);

    // THÊM MỚI: Tính tổng tiền của tháng hiện tại (Chỉ tính các giao dịch SUCCESS)
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCESS' AND MONTH(p.paidAt) = MONTH(CURRENT_DATE) AND YEAR(p.paidAt) = YEAR(CURRENT_DATE)")
    BigDecimal calculateCurrentMonthRevenue();

    // THÊM MỚI: Lấy danh sách giao dịch SUCCESS theo tháng/năm truyền vào
    @Query("SELECT p FROM Payment p WHERE p.status = 'SUCCESS' AND MONTH(p.paidAt) = :month AND YEAR(p.paidAt) = :year")
    List<Payment> findSuccessfulTransactionsByMonthAndYear(@Param("month") int month, @Param("year") int year);
}