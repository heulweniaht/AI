import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Stethoscope, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/useAuth';

// 1. Định nghĩa luật kiểm tra dữ liệu đầu vào
const registerSchema = z.object({
  role: z.enum(['PATIENT', 'DOCTOR']),
  fullName: z.string().min(3, 'Tên phải có ít nhất 3 ký tự'),
  phone: z.string().min(10, 'Số điện thoại chưa hợp lệ'),
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  confirmPassword: z.string(),
  // Các trường cho Bước 2
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const { mutate: registerAccount, isPending } = useRegister();

  // 2. Khởi tạo Hook Form
  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'PATIENT',
      gender: 'MALE'
    }
  });

  const selectedRole = watch('role');
  const handleNextToStep2 = async () => {
    const isStep1Valid = await trigger(['fullName', 'phone', 'email', 'password', 'confirmPassword']);
    if (isStep1Valid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handleNextToStep3 = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const onFinalSubmit = (data: RegisterFormValues) => {
    // Gọi API xuống Spring Boot
    registerAccount({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-gray-50 pt-16 pb-24 px-4 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
      <div className="max-w-3xl w-full mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Tạo tài khoản mới</h1>
          <p className="text-lg text-gray-500 font-medium">Tham gia hệ thống y tế số 1 Việt Nam</p>
        </div>

        {/* Form Container */}
        <div className="bg-white py-10 px-6 shadow-2xl sm:rounded-[2rem] sm:px-12 border border-gray-100">

          {/* Stepper */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative px-6">
              <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-gray-100 rounded-full z-0"></div>
              <div className="absolute left-10 top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded-full z-0 transition-all duration-700 ease-in-out" style={{ width: `calc(${(step - 1) * 50}% - 40px)` }}></div>
              {[1, 2, 3].map((s) => (
                <div key={s} className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-base border-[4px] border-white transition-all duration-500 shadow-sm ${step >= s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {step > s ? <CheckCircle2 className="h-6 w-6" /> : s}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm font-bold text-gray-500 px-2">
              <span className={step >= 1 ? 'text-primary-600' : ''}>Thông tin cơ bản</span>
              <span className={`text-center ${step >= 2 ? 'text-primary-600' : ''}`}>Chi tiết hồ sơ</span>
              <span className={`text-right ${step >= 3 ? 'text-primary-600' : ''}`}>Xác thực OTP</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onFinalSubmit)}>

            {/* ==================== BƯỚC 1: THÔNG TIN CƠ BẢN ==================== */}
            {step === 1 && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <label className="text-lg font-extrabold text-gray-900 mb-4 block">Chọn phân quyền hệ thống</label>
                  <div className="grid grid-cols-2 gap-6">
                    <div
                      onClick={() => setValue('role', 'PATIENT')}
                      className={`border-2 rounded-2xl p-6 cursor-pointer flex flex-col items-center justify-center transition-all ${selectedRole === 'PATIENT' ? 'border-primary-600 bg-primary-50 text-primary-700 ring-4 ring-primary-50 scale-[1.02]' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}
                    >
                      <User className={`h-12 w-12 mb-3 ${selectedRole === 'PATIENT' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span className="font-extrabold text-lg">Bệnh nhân</span>
                      <span className="text-xs font-medium mt-1 text-center">Đặt khám & Quản lý hồ sơ</span>
                    </div>
                    <div
                      onClick={() => setValue('role', 'DOCTOR')}
                      className={`border-2 rounded-2xl p-6 cursor-pointer flex flex-col items-center justify-center transition-all ${selectedRole === 'DOCTOR' ? 'border-primary-600 bg-primary-50 text-primary-700 ring-4 ring-primary-50 scale-[1.02]' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}
                    >
                      <Stethoscope className={`h-12 w-12 mb-3 ${selectedRole === 'DOCTOR' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span className="font-extrabold text-lg">Bác sĩ</span>
                      <span className="text-xs font-medium mt-1 text-center">Quản lý lịch & Bệnh nhân</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên đầy đủ</label>
                    <input type="text" {...register('fullName')} className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-base font-medium ${errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`} placeholder="VD: Nguyễn Văn A" />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại di động</label>
                    <input type="tel" {...register('phone')} className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-base font-medium ${errors.phone ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`} placeholder="090 123 4567" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ Email</label>
                  <input type="email" {...register('email')} className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-base font-medium ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`} placeholder="name@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
                    <input type="password" {...register('password')} className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-base font-medium ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`} placeholder="••••••••" />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Xác nhận mật khẩu</label>
                    <input type="password" {...register('confirmPassword')} className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-0 transition-colors text-base font-medium ${errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'}`} placeholder="••••••••" />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <button type="button" onClick={handleNextToStep2} className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 mt-10 transition-all hover:scale-[1.02]">
                  Tiếp tục bước 2 <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}

            {/* ==================== BƯỚC 2: CHI TIẾT HỒ SƠ ==================== */}
            {step === 2 && (
              <div className="animate-fade-in space-y-8 py-4">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Thông tin y tế cơ bản</h3>
                  <p className="text-gray-500">Giúp {selectedRole === 'DOCTOR' ? 'hệ thống' : 'bác sĩ'} hiểu rõ bạn hơn.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ngày sinh</label>
                    <input type="date" {...register('dateOfBirth')} className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary-500 text-base font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Giới tính</label>
                    <select {...register('gender')} className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary-500 text-base font-medium bg-white outline-none cursor-pointer">
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ cư trú</label>
                  <input type="text" {...register('address')} className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary-500 text-base font-medium" placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/TP" />
                </div>

                <div className="flex justify-center gap-4 mt-10">
                  <button type="button" onClick={() => setStep(1)} className="px-8 py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 w-1/3">Quay lại</button>
                  <button type="button" onClick={handleNextToStep3} className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md w-2/3 flex justify-center items-center">Tiếp tục bước 3 <ChevronRight className="ml-2 h-5 w-5" /></button>
                </div>
              </div>
            )}

            {/* ==================== BƯỚC 3: XÁC THỰC OTP ==================== */}
            {step === 3 && (
              <div className="animate-fade-in text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Xác thực mã OTP</h3>
                <p className="text-gray-500 mb-8">Một mã định danh giả lập đã được chuẩn bị sẵn.</p>

                <div className="flex justify-center gap-2 mb-8">
                  {/* Giao diện OTP giả lập */}
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <input key={i} type="text" maxLength={1} defaultValue={Math.floor(Math.random() * 10)} className="w-12 h-14 text-center text-2xl font-bold border-2 border-green-200 bg-green-50 text-green-800 rounded-lg focus:outline-none pointer-events-none" />
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <button type="button" disabled={isPending} onClick={() => setStep(2)} className="px-8 py-4 border-2 text-gray-600 font-bold border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 w-1/3">Quay lại</button>
                  <button type="submit" disabled={isPending} className="px-8 py-4 bg-green-600 hover:bg-green-700 shadow-xl text-white rounded-xl font-bold w-2/3 flex justify-center items-center disabled:opacity-70 disabled:hover:scale-100 transition-transform hover:scale-[1.02]">
                    {isPending ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Đang xử lý...
                      </span>
                    ) : 'Hoàn tất Đăng ký'}
                  </button>
                </div>
              </div>
            )}
          </form>

          {step === 1 && (
            <p className="mt-10 text-center text-base text-gray-600 font-medium border-t border-gray-100 pt-8">
              Đã có tài khoản?{' '}
              <Link to="/login" className="font-extrabold text-primary-600 hover:text-primary-800 hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;