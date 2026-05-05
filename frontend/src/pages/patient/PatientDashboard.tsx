import React, { useMemo } from 'react';
import { Calendar, FileText, Activity, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useMyAppointments } from '@/hooks/useAppointments';
import { Spinner } from '@/components/common/Spinner';

const PatientDashboard = () => {
   const navigate = useNavigate();
   const { user } = useAuthStore();

   //Gọi API lấy All lịch khám của bệnh nhân này
   const { data: appointmentData, isLoading } = useMyAppointments({ size: 10, sort: 'appointmentTime.desc' });

   // Tính toán (Filter) dữ liệu để lấy ra: 1 lịch gần nhất (UPCOMING) và danh sách lịch sử ngắn (PAST)
   const { nextAppointment, recentActivities } = useMemo(() => {
      if (!appointmentData?.content) return { nextAppointment: null, recentActivities: [] };

      const allAppointments = appointmentData.content;
      const now = new Date();

      // 1. Tìm lịch sắp tới gần nhất (Trạng thái PENDING hoặc CONFIRMED, thời gian phải ở tương lai)
      const upcoming = allAppointments
         .filter(app => ['PENDING', 'CONFIRMED'].includes(app.status) && new Date(app.appointmentTime) > now)
         .sort((a, b) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime());

      // 2. Các hoạt động gần nhất (Lấy 3 cái mới nhất của mọi trạng thái để hiển thị activity)
      const activities = allAppointments.slice(0, 3);

      return {
         nextAppointment: upcoming.length > 0 ? upcoming[0] : null,
         recentActivities: activities
      };
   }, [appointmentData]);

   // Tính toán số ngày còn lại
   const getDaysRemaining = (targetDateString: string) => {
      const targetDate = new Date(targetDateString);
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Hôm nay';
      if (diffDays === 1) return 'Ngày mai';
      return `Còn ${diffDays} ngày nữa`;
   };

   if (isLoading) return <div className="min-h-screen flex justify-center py-32"><Spinner /></div>;

   return (
      <div className="p-8 md:p-12 animate-fade-in max-w-6xl mx-auto w-full">
         <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Cổng Quản lý Dành Cho Bệnh Nhân</h1>

         <div className="mb-12 relative overflow-hidden bg-gradient-to-r from-primary-900 to-primary-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl pointer-events-none"></div>

            {/* LỊCH KHÁM SẮP TỚI */}
            {nextAppointment ? (
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
                  <div>
                     <p className="text-primary-200 font-bold uppercase tracking-widest text-sm mb-3">
                        {nextAppointment.status === 'CONFIRMED' ? 'Lịch Khám Đã Xác Nhận' : 'Lịch Khám Đang Chờ Duyệt'}
                     </p>
                     <h2 className="text-4xl font-black mb-2 tracking-tight">
                        {new Date(nextAppointment.appointmentTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - Ngày {new Date(nextAppointment.appointmentTime).toLocaleDateString('vi-VN')}
                     </h2>
                     <div className="flex flex-wrap gap-3 items-center text-primary-100 font-medium mt-4">
                        <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm font-bold">
                           <Calendar className="w-4 h-4 mr-2" />
                           {new Date(nextAppointment.appointmentTime).toLocaleDateString('vi-VN', { weekday: 'long' })}
                        </span>
                        <span className="flex items-center bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm font-bold">
                           <Clock className="w-4 h-4 mr-2" />
                           {getDaysRemaining(nextAppointment.appointmentTime)}
                        </span>
                     </div>
                  </div>
                  <div className="mt-8 md:mt-0 bg-white p-6 rounded-[1.5rem] w-full md:w-auto shadow-xl border-4 border-primary-800 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate(`/doctors/${nextAppointment.doctorId}`)}>
                     <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-3">Bác sĩ phụ trách của bạn</p>
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center text-primary-600 font-black text-xl">
                           {nextAppointment.doctorName.charAt(0)}
                        </div>
                        <div>
                           <p className="font-extrabold text-gray-900 text-xl">{nextAppointment.doctorName}</p>
                           <p className="text-primary-600 font-bold text-sm bg-primary-50 px-2 py-0.5 rounded mt-1 inline-block">
                              Khoa {nextAppointment.specialtyName}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
               <div className="text-center relative z-10 py-4">
                  <p className="text-primary-200 font-bold uppercase tracking-widest text-sm mb-3">Thông báo hệ thống</p>
                  <h2 className="text-3xl font-black mb-6 tracking-tight">Bạn chưa có lịch hẹn nào sắp tới</h2>
                  <button onClick={() => navigate('/doctors')} className="bg-white text-primary-800 font-extrabold px-8 py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105">
                     Đặt lịch khám ngay
                  </button>
               </div>
            )}
         </div>

         <div className="flex flex-col lg:flex-row gap-8">
            {/* PHẦN PROFILE & SỨC KHỎE (Tạm giữ Mock/Dữ liệu mẫu vì chưa có API cho Medical Record) */}
            <div className="flex-1">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-extrabold text-gray-900 flex items-center"><Activity className="mr-3 w-6 h-6 text-primary-600" /> Hồ Sơ Cơ Bản</h3>
               </div>
               <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                  <div className="flex items-center mb-8 gap-4 border-b border-gray-100 pb-6">
                     <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                        {user?.fullName?.charAt(0)}
                     </div>
                     <div>
                        <p className="font-extrabold text-2xl text-gray-900">{user?.fullName}</p>
                        <p className="text-gray-500 font-medium">Bệnh nhân mang mã số: <span className="font-bold text-primary-600">#PT{user?.id}</span></p>
                     </div>
                  </div>
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

            {/* HOẠT ĐỘNG GẦN NHẤT (Đổ dữ liệu thật) */}
            <div className="lg:w-2/5">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-extrabold text-gray-900">Activity Gần nhất</h3>
                  <button onClick={() => navigate('/patient/history')} className="text-primary-600 font-bold hover:bg-primary-50 px-3 py-1.5 rounded-lg text-sm truncate flex items-center transition-colors">
                     Lịch sử đầy đủ <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
               </div>

               <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 text-gray-600 font-medium">
                  {recentActivities.length > 0 ? (
                     recentActivities.map((activity) => (
                        <div key={activity.id} className="p-5 hover:bg-gray-50 rounded-[1.5rem] transition-colors cursor-pointer border-b border-gray-50 last:border-b-0 flex items-center gap-5 group">
                           <div className={`w-14 h-14 rounded-full flex justify-center items-center shrink-0 group-hover:scale-110 transition-transform ${activity.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : activity.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                              {activity.status === 'COMPLETED' ? <CheckCircle2 className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                           </div>
                           <div>
                              <p className="text-gray-900 font-extrabold pb-1 text-lg leading-tight">
                                 {activity.status === 'COMPLETED' ? 'Khám Thành Công' : activity.status === 'CANCELLED' ? 'Đã Hủy Lịch' : 'Đã Lên Lịch Khám'}
                              </p>
                              <p className="text-sm font-bold text-gray-400 mt-1">BS. {activity.doctorName} (#BK{activity.id})</p>
                              <p className="text-xs text-primary-500 mt-1">{new Date(activity.appointmentTime).toLocaleString('vi-VN')}</p>
                           </div>
                        </div>
                     ))
                  ) : (
                     <div className="p-8 text-center">
                        <p className="text-gray-400 font-medium">Chưa có hoạt động nào được ghi nhận.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}
export default PatientDashboard;
