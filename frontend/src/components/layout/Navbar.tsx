import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { isLoggedIn, user, logout } = useAuthStore();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToDashboard = () => {
    if (!user) return;
    const role = user.role.toUpperCase();
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'DOCTOR') navigate('/doctor/dashboard');
    else navigate('/patient/dashboard');
  };

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Bác sĩ', path: '/doctors' },
    { name: 'Chuyên khoa', path: '/specialties' },
    { name: 'AI Checker', path: '/ai-checker' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary-600 rounded-lg group-hover:bg-primary-700 transition">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">SmartHealth</span>
          </Link>

          <div className="hidden md:flex space-x-4 items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="font-bold text-gray-700">Chào, {user?.fullName}</span>
                <button
                  onClick={goToDashboard}
                  className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full font-bold transition-all shadow-sm hover:bg-primary-100"
                >
                  Vào Dashboard
                </button>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-red-500 font-bold hover:text-red-700 transition"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-primary-600 font-bold hover:text-primary-800 transition">Đăng nhập</Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-full font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600">
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-xl absolute w-full left-0 border-t animate-slide-up top-full">
          <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-3 rounded-md text-base font-bold text-gray-700 hover:text-primary-600 hover:bg-primary-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t my-2 pt-4 px-3 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <div className="text-center text-gray-700 font-bold py-2">
                    Chào, {user?.fullName}
                  </div>
                  <button
                    onClick={() => { goToDashboard(); setMobileMenuOpen(false); }}
                    className="w-full text-center bg-primary-50 text-primary-700 font-bold py-3 rounded-xl border-2 border-primary-100 hover:bg-primary-100 transition"
                  >
                    Vào Dashboard
                  </button>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                    className="w-full text-center text-red-500 font-bold py-3 rounded-xl border-2 border-red-100 bg-red-50 hover:bg-red-100 transition"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full text-center text-primary-600 font-bold py-3 rounded-xl border-2 border-primary-600 hover:bg-primary-50 transition" onClick={() => setMobileMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition" onClick={() => setMobileMenuOpen(false)}>
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
