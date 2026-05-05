import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/hooks/useAuth';
import type { LoginRequest } from '@/types/auth.types';

const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();

  const from = location.state?.from || null;

  // 2. Khởi tạo Hook gọi API Đăng nhập
  const { mutate: login, isPending, isError, error } = useLogin();

  // 3. Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = (data: LoginRequest) => {

    login(data, {
      onSuccess: () => {
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-white animate-fade-in">
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
        <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop" alt="Hospital" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-primary-900/60 to-transparent"></div>
        <div className="absolute bottom-20 left-16 right-16 text-white">
          <span className="bg-primary-500 text-white font-bold px-3 py-1 text-sm rounded-md mb-6 inline-block">SmartHealth Portal</span>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Chăm sóc sức khoẻ<br />Thông minh hơn</h2>
          <p className="text-xl opacity-80 font-medium">Đăng nhập để đặt lịch khám ngay hôm nay.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50">
        <div className="w-full max-w-lg bg-white p-10 sm:p-14 rounded-[2rem] shadow-2xl border border-gray-100">
          <div className="mb-10 text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Chào mừng<br />quay trở lại.</h1>
            {from && <div className="text-red-600 font-bold mb-4 text-sm bg-red-50 p-3 rounded-lg border border-red-200">Vui lòng đăng nhập để bắt đầu đặt lịch khám của bạn.</div>}

          </div>

          <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Tài khoản (Email)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  type="email"
                  {...register('email')}
                  className={`block w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-base font-medium 
                             ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                  placeholder="Nhập email của bạn"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-900">Mật khẩu</label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:underline">Quên mật khẩu?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  className={`block w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-base font-medium 
                             ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`}
                  placeholder="Nhập mật khẩu"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Hiển thị lỗi từ Backend trả về (VD: Sai pass, khóa acc) */}
            {isError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <p className="text-sm font-medium text-red-700">
                  {(error as any)?.response?.data?.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.'}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isPending ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Đang xử lý...
                </span>
              ) : 'Đăng Nhập An Toàn'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-500">
            Chưa có tài khoản? <Link to="/register" className="text-primary-600 hover:underline">Tạo tài khoản mới</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;