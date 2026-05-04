import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // VD: ['patient'], ['doctor'], ['admin']
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  // Lấy trạng thái từ Zustand Store mà ta đã tạo ở phần trước
  const { isLoggedIn, user } = useAuthStore();
  const location = useLocation();

  // 1. Nếu chưa đăng nhập -> Chặn lại và đẩy về trang /login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Kiểm tra Role (Vai trò)
  if (allowedRoles && user) {
    // Lưu ý: Trong DB/Zustand role là chữ hoa ('PATIENT'), 
    // nhưng trong App.tsx của bạn đang truyền chữ thường (['patient']).
    // Ta dùng .toUpperCase() để so sánh cho chắc chắn khớp nhau.
    const hasRequiredRole = allowedRoles.some(
      (role) => role.toUpperCase() === user.role.toUpperCase()
    );

    // Nếu không khớp quyền -> Đẩy về trang lỗi
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-red-500 text-xl font-bold">
            🚫 Bạn không có quyền truy cập trang này!
          </div>
        </div>
      );
    }
  }

  // 3. Đã đăng nhập và đúng quyền -> Hiển thị Giao diện (PageWrapper hoặc DashboardWrapper)
  return <>{children}</>;
}