import React, { useState, useEffect } from 'react';
import { useCreateBulkSchedules } from '@/hooks/useDoctors';
import toast from 'react-hot-toast';

// Các khung giờ chuẩn theo thiết kế của bạn
const TIMES = ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'];
const DAYS_LABEL = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

// Hàm tiện ích: Lấy ra danh sách các ngày trong tuần hiện tại (Từ Thứ 2 đến Thứ 7)
const getWeekDates = () => {
   const dates = [];
   const curr = new Date();
   // Tính ngày Thứ 2 của tuần này
   const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1);

   for (let i = 0; i < 6; i++) { // Chỉ lấy 6 ngày đến Thứ 7
      const day = new Date(curr.setDate(first + i));
      dates.push(day.toISOString().split('T')[0]); // Format: YYYY-MM-DD
   }
   return dates;
};

const ScheduleManagement = () => {
   // Lấy ngày thật của tuần hiện tại
   const weekDates = getWeekDates();

   // Quản lý trạng thái của từng ô lưới. Key: "YYYY-MM-DD|HH:mm", Value: true (Mở) / false (Khóa)
   const [slotMatrix, setSlotMatrix] = useState<Record<string, boolean>>({});

   // Lấy hook tạo lịch hàng loạt từ React Query
   const { mutate: bulkCreate, isPending } = useCreateBulkSchedules();

   // Khởi tạo trạng thái mặc định (Mở toàn bộ Slot ban đầu)
   useEffect(() => {
      const initialMatrix: Record<string, boolean> = {};
      weekDates.forEach((date) => {
         TIMES.forEach((time) => {
            initialMatrix[`${date}|${time}`] = true; // Mặc định true = Khớp Nhận
         });
      });
      setSlotMatrix(initialMatrix);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   // Hàm xử lý khi Bác sĩ bấm vào 1 ô giờ
   const toggleSlot = (date: string, time: string) => {
      const key = `${date}|${time}`;
      setSlotMatrix((prev) => ({
         ...prev,
         [key]: !prev[key], // Lật trạng thái true <-> false
      }));
   };

   // Hàm xử lý khi bấm nút "Lưu & Đẩy Database"
   const handleSaveSchedules = () => {
      // Chuyển đổi slotMatrix thành mảng DTO để gửi xuống Backend
      const payload = Object.entries(slotMatrix)
         // Lọc ra chỉ lấy các slot được bác sĩ mở (true)
         .filter(([_, isAvailable]) => isAvailable)
         .map(([key, _]) => {
            const [date, time] = key.split('|');
            return {
               scheduleDate: date,
               startTime: `${time}:00`,
               endTime: `${time.substring(0, 2)}:45:00`, // Tạm giả định mỗi slot kéo dài 45p
               isAvailable: true
            };
         });

      if (payload.length === 0) {
         toast.error("Vui lòng mở ít nhất 1 khung giờ trước khi lưu!");
         return;
      }

      // Gọi API
      bulkCreate(payload, {
         onSuccess: () => {
            toast.success("Đã cấu hình & đẩy lịch lên hệ thống thành công!");
         },
         onError: () => {
            toast.error("Có lỗi xảy ra khi đồng bộ lịch lên Server.");
         }
      });
   };

   return (
      <div className="p-8 md:p-12 animate-fade-in max-w-7xl mx-auto w-full">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Cấu hình Slot Lịch Khám</h1>
            <button
               onClick={handleSaveSchedules}
               disabled={isPending}
               className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-primary-700 shadow-xl border border-primary-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
            >
               {isPending ? 'Đang đồng bộ...' : 'Lưu & Đẩy Database Lên Server'}
            </button>
         </div>

         <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-12">
            <p className="text-gray-500 font-medium mb-8 text-lg bg-gray-50 p-4 rounded-xl border border-gray-200">
               <strong>Hướng dẫn:</strong> Bấm click vào các ô (Khung giờ) bên dưới để giao diện "Tắt đỏ" tức là Khoá Slot, "Mở xanh" là BN được đặt lịch. Dữ liệu sẽ update vào API Gateway khi Lưu.
            </p>

            <div className="overflow-x-auto pb-4">
               <div className="min-w-[800px] border-l border-t border-gray-200 flex flex-col uppercase text-sm font-black text-gray-500 tracking-widest text-center shadow-inner bg-gray-50">

                  {/* DÒNG TIÊU ĐỀ KHUNG GIỜ */}
                  <div className="flex border-b border-gray-200">
                     <div className="w-40 py-5 px-2 border-r border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
                        Ngày Lịch
                     </div>
                     {TIMES.map(t => (
                        <div key={t} className="flex-1 py-5 border-r border-gray-200 text-gray-900">
                           {t}
                        </div>
                     ))}
                  </div>

                  {/* LƯỚI NGÀY TRONG TUẦN */}
                  {DAYS_LABEL.map((dayLabel, i) => {
                     const currentDate = weekDates[i]; // Lấy ngày thật tương ứng

                     return (
                        <div key={dayLabel} className="flex border-b border-gray-200 bg-white hover:bg-gray-50">
                           {/* Cột Tên ngày (Thứ 2, Thứ 3...) kèm Ngày tháng */}
                           <div className="w-40 py-6 px-2 border-r border-gray-200 font-extrabold flex flex-col items-center justify-center shrink-0 bg-gray-50/50">
                              <span className="text-gray-900">{dayLabel}</span>
                              <span className="text-xs text-gray-400 mt-1">{currentDate.split('-').reverse().join('/')}</span>
                           </div>

                           {/* Các ô chọn giờ */}
                           {TIMES.map((time) => {
                              // Kiểm tra trạng thái hiện tại từ State
                              const key = `${currentDate}|${time}`;
                              const isAvailable = slotMatrix[key];

                              // Logic Đỏ (Khóa) / Xanh (Mở)
                              const bg = !isAvailable
                                 ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                                 : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
                              const val = !isAvailable ? '🔒 Blocked' : 'Khớp Nhận';

                              return (
                                 <div
                                    key={time}
                                    onClick={() => toggleSlot(currentDate, time)}
                                    className="flex-1 p-3 border-r border-gray-200 transition-colors cursor-pointer"
                                 >
                                    <div className={`w-full h-full min-h-[60px] flex items-center justify-center rounded-xl border-2 ${bg} font-black text-xs transition-transform hover:scale-105 shadow-sm select-none`}>
                                       {val}
                                    </div>
                                 </div>
                              )
                           })}
                        </div>
                     )
                  })}
               </div>
            </div>
         </div>
      </div>
   )
}

export default ScheduleManagement;