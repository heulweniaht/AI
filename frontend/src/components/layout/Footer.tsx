import React from 'react';
import { Activity, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary-500" />
              <span className="text-2xl font-bold">SmartHealth</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Hệ thống đặt lịch khám bệnh thông minh, kết nối bạn với hàng ngàn bác sĩ giỏi trên toàn quốc một cách nhanh chóng.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-slate-700 pb-2 inline-block">Liên kết nhanh</h3>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-primary-500 transition font-medium">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-primary-500 transition font-medium">Danh sách bác sĩ</a></li>
              <li><a href="#" className="hover:text-primary-500 transition font-medium">Chuyên khoa</a></li>
              <li><a href="/ai-checker" className="hover:text-primary-500 transition font-medium">Chuẩn đoán AI</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-slate-700 pb-2 inline-block">Liên hệ</h3>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li className="flex items-start"><MapPin className="h-5 w-5 mr-3 text-primary-500 shrink-0" /> Số 1 Đại Cồ Việt, Hai Bà Trưng, HN</li>
              <li className="flex items-center"><Phone className="h-5 w-5 mr-3 text-primary-500 shrink-0" /> 1900 1234</li>
              <li className="flex items-center"><Mail className="h-5 w-5 mr-3 text-primary-500 shrink-0" /> hotro@smarthealth.vn</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-slate-700 pb-2 inline-block">Mạng xã hội</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary-600 transition"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary-600 transition"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="bg-slate-800 p-3 rounded-full hover:bg-primary-600 transition"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} SmartHealth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
