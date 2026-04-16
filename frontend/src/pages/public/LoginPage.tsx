import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore(state => state.login);

  // Lấy đường dẫn đã lưu nếu người dùng bị ném qua đây do chưa Login
  const from = location.state?.from || null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Hardcoded logic Mocking
    let dest = '/patient/dashboard';
    if (email === 'thai') {
       login('admin');
       dest = '/admin/dashboard';
    } else if (email === 'doctor') {
       login('doctor');
       dest = '/doctor/dashboard';
    } else {
       login('patient');
    }

    // Ưu tiên trả về đích cũ nếu tồn tại
    navigate(from ? from : dest, { replace: true });
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-white animate-fade-in">
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
        <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop" alt="Hospital" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-primary-900/60 to-transparent"></div>
        <div className="absolute bottom-20 left-16 right-16 text-white">
          <span className="bg-primary-500 text-white font-bold px-3 py-1 text-sm rounded-md mb-6 inline-block">SmartHealth Portal</span>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">Chăm sóc sức khoẻ<br/>Thông minh hơn</h2>
          <p className="text-xl opacity-80 font-medium">Đăng nhập để đặt lịch khám ngay hôm nay.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50">
        <div className="w-full max-w-lg bg-white p-10 sm:p-14 rounded-[2rem] shadow-2xl border border-gray-100">
          <div className="mb-10 text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Chào mừng<br/>quay trở lại.</h1>
            {from && <div className="text-red-600 font-bold mb-4 text-sm bg-red-50 p-3 rounded-lg border border-red-200">Vui lòng đăng nhập để bắt đầu đặt lịch khám của bạn.</div>}
            <div className="text-gray-500 text-sm font-medium bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4 leading-relaxed">
              <strong>Tài khoản Demo (Nhập email nhấn Enter):</strong><br/>
              - <span className="text-primary-700 font-bold">thai</span> (vào quyền Admin)<br/>
              - <span className="text-primary-700 font-bold">doctor</span> (vào quyền Bác sĩ)<br/>
              - <i>Gõ tên bất kỳ khác</i> (vào quyền Bệnh nhân)
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Tài khoản (Tên / Email)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary-500 transition-colors text-base font-medium" placeholder="Nhập doctor hoặc thai" />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary-500 transition-colors text-base font-medium" placeholder="Mật khẩu tùy ý" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none transition-all hover:scale-[1.02]">
              Đăng Nhập An Toàn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
