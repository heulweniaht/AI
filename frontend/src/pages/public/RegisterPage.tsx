import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Stethoscope, ChevronRight, CheckCircle2 } from 'lucide-react';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('PATIENT');

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

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if(step<3) setStep(step+1); else window.location.href='/login'; }}>
            {step === 1 && (
              <div className="animate-fade-in space-y-8">
                <div>
                  <label className="text-lg font-extrabold text-gray-900 mb-4 block">Chọn phân quyền hệ thống</label>
                  <div className="grid grid-cols-2 gap-6">
                    <div 
                      onClick={() => setRole('PATIENT')}
                      className={`border-2 rounded-2xl p-6 cursor-pointer flex flex-col items-center justify-center transition-all ${role === 'PATIENT' ? 'border-primary-600 bg-primary-50 text-primary-700 ring-4 ring-primary-50 scale-[1.02]' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}
                    >
                      <User className={`h-12 w-12 mb-3 ${role === 'PATIENT' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span className="font-extrabold text-lg">Bệnh nhân</span>
                      <span className="text-xs font-medium mt-1 text-center">Đặt khám & Quản lý hồ sơ</span>
                    </div>
                    <div 
                      onClick={() => setRole('DOCTOR')}
                      className={`border-2 rounded-2xl p-6 cursor-pointer flex flex-col items-center justify-center transition-all ${role === 'DOCTOR' ? 'border-primary-600 bg-primary-50 text-primary-700 ring-4 ring-primary-50 scale-[1.02]' : 'border-gray-200 hover:border-gray-300 text-gray-500'}`}
                    >
                      <Stethoscope className={`h-12 w-12 mb-3 ${role === 'DOCTOR' ? 'text-primary-600' : 'text-gray-400'}`} />
                      <span className="font-extrabold text-lg">Bác sĩ</span>
                      <span className="text-xs font-medium mt-1 text-center">Quản lý lịch & Bệnh nhân</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên đầy đủ</label>
                    <input type="text" className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary-500 text-base font-medium" placeholder="VD: Nguyễn Văn A" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Số điện thoại di động</label>
                    <input type="tel" className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary-500 text-base font-medium" placeholder="090 123 4567" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Địa chỉ Email</label>
                  <input type="email" className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary-500 text-base font-medium" placeholder="name@example.com" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
                    <input type="password" className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary-500 text-base font-medium" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Xác nhận mật khẩu</label>
                    <input type="password" className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary-500 text-base font-medium" placeholder="••••••••" />
                  </div>
                </div>

                <button type="submit" className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 mt-10 transition-all hover:scale-[1.02]">
                  Tiếp tục bước 2 <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}
            
            {step === 2 && (
              <div className="animate-fade-in text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <User className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thông tin hồ sơ (Demo)</h3>
                <p className="text-gray-500 mb-8">Sinh nhật, Giới tính, Địa chỉ,...</p>
                <div className="flex justify-center gap-4">
                  <button type="button" onClick={() => setStep(1)} className="px-8 py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50">Quay lại</button>
                  <button type="submit" className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md">Tiếp tục bước 3</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in text-center py-16">
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 className="h-10 w-10 text-green-600" />
                 </div>
                 <h3 className="text-2xl font-bold mb-2">Xác thực mã OTP</h3>
                 <p className="text-gray-500 mb-8">Một mã gồm 6 số đã được gửi đến email của bạn.</p>
                 
                 <div className="flex justify-center gap-2 mb-8">
                    {[1,2,3,4,5,6].map(i => (
                       <input key={i} type="text" maxLength={1} className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-0" placeholder="-" />
                    ))}
                 </div>

                 <div className="flex justify-center gap-4">
                  <button type="button" onClick={() => setStep(2)} className="px-8 py-4 border-2 text-gray-600 font-bold border-gray-200 rounded-xl hover:bg-gray-50">Quay lại</button>
                  <button type="submit" className="px-8 py-4 bg-green-600 hover:bg-green-700 shadow-xl text-white rounded-xl font-bold">Hoàn tất Đăng ký</button>
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
