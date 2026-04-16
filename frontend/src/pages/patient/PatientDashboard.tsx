import React from 'react';
import { Calendar, FileText, Activity, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="p-8 md:p-12 animate-fade-in max-w-6xl mx-auto w-full">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Cổng Quản lý Dành Cho Bệnh Nhân</h1>

            <div className="mb-12 relative overflow-hidden bg-gradient-to-r from-primary-900 to-primary-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
               <div className="absolute -top-32 -right-32 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                  <div>
                      <p className="text-primary-200 font-bold uppercase tracking-widest text-sm mb-3">Lịch Khám Sắp tới Nhất</p>
                      <h2 className="text-4xl font-black mb-2 tracking-tight">10:00 Sáng - Ngày 28/10</h2>
                      <div className="flex items-center text-primary-100 font-medium mt-4">
                         <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm mr-3 font-bold"><Calendar className="w-4 h-4 mr-2"/> Thứ Sáu Mùa Thu</span>
                         <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm font-bold"><Clock className="w-4 h-4 mr-2"/> Còn đúng 2 ngày tới</span>
                      </div>
                  </div>
                  <div className="mt-8 md:mt-0 bg-white p-6 rounded-[1.5rem] w-full md:w-auto shadow-xl border-4 border-primary-800 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate('/doctors/1')}>
                      <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-3">Bác sĩ phụ trách của bạn</p>
                      <div className="flex items-center gap-4">
                          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop" className="w-16 h-16 rounded-full border-2 border-gray-100 shadow-sm object-cover" />
                          <div>
                              <p className="font-extrabold text-gray-900 text-xl">PGS. Nguyễn Văn A</p>
                              <p className="text-primary-600 font-bold text-sm bg-primary-50 px-2 py-0.5 rounded mt-1 inline-block">Khoa Tim mạch - P.104</p>
                          </div>
                      </div>
                  </div>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
               <div className="flex-1">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-extrabold text-gray-900 flex items-center"><Activity className="mr-3 w-6 h-6 text-primary-600" /> Báo cáo Sức khỏe Nhanh</h3>
                   </div>
                   <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                      <div className="grid grid-cols-2 gap-6 mb-8">
                          <div className="p-6 bg-red-50 rounded-[1.5rem] border border-red-100 hover:shadow-md transition-shadow">
                             <p className="text-red-500 text-sm font-black uppercase tracking-wider mb-2">Nhóm máu</p>
                             <p className="text-4xl font-black text-red-600 drop-shadow-sm">O+</p>
                          </div>
                          <div className="p-6 bg-gray-50 rounded-[1.5rem] border border-gray-200 hover:shadow-md transition-shadow">
                             <p className="text-gray-500 text-sm font-black uppercase tracking-wider mb-2">Cao / Nặng (BMI Chuẩn)</p>
                             <p className="text-4xl font-black text-gray-900">175<span className="text-lg text-gray-400 font-bold">cm</span> / 70<span className="text-lg text-gray-400 font-bold">kg</span></p>
                          </div>
                      </div>
                      <div className="border-t border-gray-100 pt-6">
                          <p className="text-gray-900 font-extrabold mb-4 text-lg">Tiền sử Dị ứng / Ghi chú</p>
                          <div className="flex flex-wrap gap-3">
                             <span className="px-5 py-2.5 bg-yellow-50 text-yellow-700 font-extrabold text-sm rounded-xl border-2 border-yellow-100 shadow-sm">⚠️ Dị ứng Hải sản nhẹ</span>
                             <span className="px-5 py-2.5 bg-blue-50 text-blue-700 font-extrabold text-sm rounded-xl border-2 border-blue-100 shadow-sm">💊 Huyết áp dao động</span>
                          </div>
                      </div>
                   </div>
               </div>
               
               <div className="lg:w-2/5">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-extrabold text-gray-900">Activity Gần nhất</h3>
                      <button onClick={() => navigate('/patient/history')} className="text-primary-600 font-bold hover:bg-primary-50 px-3 py-1.5 rounded-lg text-sm truncate flex items-center transition-colors">Lịch sử đầy đủ <ChevronRight className="w-4 h-4 ml-1"/></button>
                   </div>
                   <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 text-gray-600 font-medium">
                      
                      <div className="p-5 hover:bg-gray-50 rounded-[1.5rem] transition-colors cursor-pointer border-b border-gray-50 flex items-center gap-5 group">
                         <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex justify-center items-center shrink-0 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-7 h-7" />
                         </div>
                         <div>
                            <p className="text-gray-900 font-extrabold pb-1 text-lg leading-tight">Đặt Khám Lần Nội Trú Lặp Lại Thành Công</p>
                            <p className="text-sm font-bold text-gray-400 mt-1">Đã chốt giờ với BS. Văn A (#BK9482)</p>
                         </div>
                      </div>
                      
                      <div className="p-5 hover:bg-gray-50 rounded-[1.5rem] transition-colors cursor-pointer flex items-center gap-5 group">
                         <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center shrink-0 group-hover:scale-110 transition-transform">
                            <FileText className="w-7 h-7" />
                         </div>
                         <div>
                            <p className="text-gray-900 font-extrabold pb-1 text-lg leading-tight">Cập Nhật Hồ Sơ Bệnh Án Đi Kèm File</p>
                            <p className="text-sm border-l-2 border-primary-500 pl-3 mt-2 font-medium text-gray-500 bg-gray-50 py-1 rounded">KQ: Viêm mũi dị ứng, toa đính kèm (PDF tải xuống).</p>
                         </div>
                      </div>

                   </div>
               </div>
            </div>
        </div>
    )
}
export default PatientDashboard;
