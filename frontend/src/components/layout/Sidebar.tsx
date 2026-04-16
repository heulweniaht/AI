import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Home, Calendar, Users, FileText, Settings, ShieldAlert, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = ({ role }: { role: 'patient' | 'doctor' | 'admin' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const menus = {
    patient: [
      { name: 'Tổng quan', path: '/patient/dashboard', icon: Home },
      { name: 'Lịch sử khám', path: '/patient/history', icon: FileText },
      { name: 'Hồ sơ cá nhân', path: '/patient/profile', icon: Settings },
    ],
    doctor: [
      { name: 'Bảng điều khiển', path: '/doctor/dashboard', icon: Home },
      { name: 'Quản lý lịch', path: '/doctor/schedule', icon: Calendar },
      { name: 'Khách hàng', path: '/doctor/patients', icon: Users },
    ],
    admin: [
      { name: 'Thống kê KPI', path: '/admin/dashboard', icon: Activity },
      { name: 'Người dùng', path: '/admin/users', icon: Users },
      { name: 'Duyệt Bác sĩ', path: '/admin/doctors', icon: ShieldAlert },
      { name: 'Báo cáo', path: '/admin/reports', icon: FileText },
    ],
  };

  const navLinks = menus[role] || [];

  const handleLogout = () => {
     logout();
     navigate('/');
  }

  return (
    <div className="w-64 bg-slate-900 text-white h-full flex flex-col shadow-2xl z-20 transition-all duration-300 shrink-0">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="p-2 bg-primary-600 rounded-lg">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div>
           <Link to="/" className="text-xl font-bold block hover:text-primary-400">SmartHealth</Link>
           <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">{role.toUpperCase()} PORTAL</span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-8">
           <img src={`https://ui-avatars.com/api/?name=${role.toUpperCase()}&background=0D8ABC&color=fff`} className="w-12 h-12 rounded-full border-2 border-slate-700" alt="Avatar" />
           <div>
              <p className="text-sm font-bold leading-tight">Xin chào,</p>
              <p className="text-xs text-slate-400">{role === 'admin' ? 'Quản trị viên' : 'Đang sử dụng'}</p>
           </div>
        </div>
        <nav className="space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname.includes(link.path);
            return (
              <Link key={link.name} to={link.path} className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary-600 text-white font-bold shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white font-medium'}`}>
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-800">
         <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 font-medium transition-colors">
            <LogOut className="h-5 w-5" />
            <span>Đăng xuất</span>
         </button>
      </div>
    </div>
  );
};

export default Sidebar;
