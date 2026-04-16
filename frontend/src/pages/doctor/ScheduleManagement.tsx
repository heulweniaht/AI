import React from 'react';

const ScheduleManagement = () => {
    return (
        <div className="p-8 md:p-12 animate-fade-in max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
               <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Cấu hình Slot Lịch Khám</h1>
               <button className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-primary-700 shadow-xl border border-primary-700 hover:-translate-y-1 transition-all">Lưu & Đẩy Database Lên Server</button>
            </div>
            
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12">
                <p className="text-gray-500 font-medium mb-8 text-lg bg-gray-50 p-4 rounded-xl border border-gray-200">
                   <strong>Hướng dẫn:</strong> Bấm click vào các ô (Khung giờ) bên dưới để giao diện "Tắt đỏ" tức là Khoá Slot, "Mở xanh" là BN được đặt lịch. Dữ liệu sẽ update vào API Gateway khi Lưu.
                </p>
                <div className="overflow-x-auto pb-4">
                   <div className="min-w-[800px] border-l border-t border-gray-200 flex flex-col uppercase text-sm font-black text-gray-500 tracking-widest text-center shadow-inner bg-gray-50">
                       <div className="flex border-b border-gray-200">
                          <div className="w-40 py-5 px-2 border-r border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">Ngày Lịch</div>
                          {['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'].map(t => <div key={t} className="flex-1 py-5 border-r border-gray-200 text-gray-900">{t}</div>)}
                       </div>
                       
                       {['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'].map((day, i) => (
                          <div key={day} className="flex border-b border-gray-200 bg-white hover:bg-gray-50">
                             <div className="w-40 py-6 px-2 border-r border-gray-200 font-extrabold text-gray-900 flex items-center justify-center shrink-0 bg-gray-50/50">{day}</div>
                             {['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'].map((t, index) => {
                                 let isClosed = (i % 2 === 0 && index % 2 === 0);
                                 let bg = isClosed ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
                                 let val = isClosed ? '🔒 Blocked' : 'Khớp Nhận';
                                 return (
                                    <div key={t} className={`flex-1 p-3 border-r border-gray-200 transition-colors cursor-pointer`}>
                                       <div className={`w-full h-full min-h-[60px] flex items-center justify-center rounded-xl border-2 ${bg} font-black text-xs transition-transform hover:scale-105 shadow-sm`}>
                                          {val}
                                       </div>
                                    </div>
                                 )
                             })}
                          </div>
                       ))}
                   </div>
                </div>
            </div>
        </div>
    )
}
export default ScheduleManagement;
