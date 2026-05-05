import React, { useMemo } from 'react';
import { Calendar, Users, Activity, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDoctorAppointments } from '@/hooks/useDoctors';
import { Spinner } from '@/components/common/Spinner';

const DoctorDashboard = () => {
   const navigate = useNavigate();
   // Lấy danh sách các ca khám
   const { data: appointmentsData, isLoading } = useDoctorAppointments({ size: 50, sort: 'appointmentTime,asc' });

   //Xử lý
   const { todayQueue, stats } = useMemo(() => {
      if (!appointmentsData?.content) return { todayQueue: [], stats: { upcoming: 0, completed: 0, rating: 'Chưa có' } };

      const allApps = appointmentsData.content;
      const todayString = new Date().toISOString().split('T')[0];

      //Lấy hôm nay
      const todayAppointments = allApps.filter((app: any) =>
         app.appointmentTime.startsWith(todayString)
      );

      // Thống kê cơ bản
      const upcoming = allApps.filter((app: any) => ['PENDING', 'CONFIRMED'].includes(app.status)).length;
      const completed = allApps.filter((app: any) => app.status === 'COMPLETED').length;

      return {
         todayQueue: todayAppointments,
         stats: { upcoming, completed, rating: '4.9 ⭐' }
      };
   }, [appointmentsData]);

   if (isLoading) return <div className="py-20 flex justify-center"><Spinner /></div>;

   return (
      <div className="p-8 md:p-12 animate-fade-in max-w-7xl mx-auto w-full">
         <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Khu vực Chuyên môn Bác sĩ (Doctor Hub)</h1>

         {/* THỐNG KÊ */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
               { label: 'Booking Sắp Tới', val: `${stats.upcoming} Ca Khám`, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
               { label: 'Khách Đã Xử Lý', val: `${stats.completed} BN`, icon: Users, color: 'bg-green-50 text-green-600' },
               { label: 'Rating Hệ Thống', val: stats.rating, icon: Activity, color: 'bg-orange-50 text-orange-600' },
            ].map((stat, i) => (
               <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mr-5 shrink-0 ${stat.color}`}>
                     <stat.icon className="w-8 h-8" />
                  </div>
                  <div>
                     <p className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                     <p className="text-3xl font-black text-gray-900 mt-1">{stat.val}</p>
                  </div>
               </div>
            ))}
         </div>

         {/* HÀNG CHỜ KHÁM TRỰC TUYẾN */}
         <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-100 pb-6 gap-4">
               <h3 className="text-2xl font-black text-gray-900 flex items-center">
                  <Clock className="w-8 h-8 mr-3 text-primary-500 animate-pulse" />
                  Hàng chờ Khám bệnh Trực tuyến Live (Hôm nay)
               </h3>
               <span className="bg-red-50 text-red-600 px-4 py-2 font-black text-sm tracking-widest uppercase rounded-xl border-2 border-red-200 shrink-0">Live Queue</span>
            </div>

            <div className="space-y-5">
               {todayQueue.length > 0 ? todayQueue.map((p: any, i: number) => {
                  // Xác định màu sắc dựa theo Status
                  let stColor = 'yellow';
                  let statusText = 'Đang đợi';
                  if (p.status === 'CONFIRMED') { stColor = 'blue'; statusText = 'Đã chốt, chờ khám'; }
                  if (p.status === 'COMPLETED') { stColor = 'green'; statusText = 'Đã hoàn tất'; }
                  if (p.status === 'CANCELLED') { stColor = 'red'; statusText = 'Đã hủy'; }

                  const timeString = new Date(p.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

                  return (
                     <div key={p.id} className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white border-2 border-gray-100 rounded-[2rem] hover:shadow-lg transition-all gap-5 ${i === 0 && p.status !== 'COMPLETED' ? 'ring-4 ring-yellow-100 bg-yellow-50/30' : ''}`}>
                        <div className="flex items-center gap-5">
                           <div className="w-16 h-16 bg-gray-50 font-black text-gray-400 flex items-center justify-center rounded-[1.2rem] shadow-inner border border-gray-200 shrink-0 text-xl">
                              {timeString.split(':')[0]}h
                           </div>
                           <div>
                              <p className="font-black text-gray-900 text-xl mb-1">{p.patientName} <span className="text-sm font-bold text-gray-400 ml-2">(#{p.id})</span></p>
                              <span className="text-primary-700 font-extrabold text-sm bg-primary-50 px-3 py-1 rounded-lg border border-primary-100">{timeString}</span>
                           </div>
                        </div>
                        <div className="flex gap-4 items-center w-full sm:w-auto mt-2 sm:mt-0">
                           <span className={`px-4 py-2 font-black text-sm rounded-xl uppercase tracking-widest bg-${stColor}-100 text-${stColor}-800 border border-${stColor}-200 shrink-0`}>{statusText}</span>

                           {/* Nút bấm điều hướng sang trang PatientsRecord (Quản lý bệnh nhân) */}
                           {p.status !== 'COMPLETED' && p.status !== 'CANCELLED' && (
                              <button onClick={() => navigate('/doctor/patients')} className="ml-auto px-8 py-3 bg-gray-900 text-white font-black rounded-xl shadow-md hover:bg-gray-800 hover:scale-105 transition-all text-sm shrink-0 flex items-center">
                                 Bấm Mở Hồ sơ Online <ChevronRight className="ml-2 w-4 h-4" />
                              </button>
                           )}
                           {p.status === 'COMPLETED' && (
                              <button className="ml-auto px-6 py-3 bg-gray-100 text-gray-500 font-bold rounded-xl text-sm shrink-0 cursor-not-allowed">Đã xong ca khám</button>
                           )}
                        </div>
                     </div>
                  )
               }) : (
                  <div className="text-center py-10 text-gray-500 font-bold text-lg">
                     Hôm nay phòng khám chưa có ca bệnh nào hoặc bạn chưa mở slot.
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}
export default DoctorDashboard;
