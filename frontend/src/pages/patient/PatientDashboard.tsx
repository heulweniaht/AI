import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useMyAppointments } from '@/hooks/useAppointments';
import { useDoctorDetail } from '@/hooks/useDoctors';
import { Spinner } from '@/components/common/Spinner';
import { Calendar, Clock, ChevronRight, Activity, CheckCircle2, FileText } from 'lucide-react';
import { usePatientProfile } from '@/hooks/useAuth';

// Sub-component để load tên Bác sĩ cho phần Activity List (Tránh gọi API rườm rà ở component cha)
const ActivityDoctorName = ({ doctorId }: { doctorId: number }) => {
   const { data: doctor } = useDoctorDetail(doctorId);
   return <span>BS. {doctor?.fullName || 'Đang cập nhật'}</span>;
};

const PatientDashboard = () => {
   const navigate = useNavigate();
   const { user } = useAuthStore();

   // Gọi API lấy All lịch khám của bệnh nhân này (Sửa lại dấu phẩy cho sort)
   const { data: appointmentData, isLoading } = useMyAppointments({ size: 10, sort: 'appointmentTime,desc' });

   const { data: profileData, isLoading: isProfileLoading } = usePatientProfile();
   // Tính toán (Filter) dữ liệu để lấy ra: 1 lịch gần nhất (UPCOMING) và danh sách lịch sử ngắn (PAST)
   const { nextAppointment, recentActivities } = useMemo(() => {
      if (!appointmentData?.content) return { nextAppointment: null, recentActivities: [] };

      const allAppointments = appointmentData.content;
      const now = new Date();

      // 1. Tìm lịch sắp tới gần nhất (Trạng thái PENDING hoặc CONFIRMED, thời gian phải ở tương lai)
      const upcoming = allAppointments
         .filter((app: any) => ['PENDING', 'CONFIRMED'].includes(app.status) && new Date(app.appointmentTime) > now)
         .sort((a: any, b: any) => new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime());

      // 2. Các hoạt động gần nhất (Lấy 3 cái mới nhất của mọi trạng thái để hiển thị activity)
      const activities = allAppointments.slice(0, 3);

      return {
         nextAppointment: upcoming.length > 0 ? upcoming[0] : null,
         recentActivities: activities
      };
   }, [appointmentData]);

   // FETCH THÔNG TIN BÁC SĨ CHO LỊCH KHÁM SẮP TỚI
   const { data: upcomingDoctor } = useDoctorDetail(nextAppointment?.doctorId || 0);

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

   const bmiInfo = useMemo(() => {
      if (!profileData?.weight || !profileData?.height) {
         return { value: '--', label: 'Chưa đo', color: 'text-gray-400' };
      }
      const heightInMeters = profileData.height / 100;
      const bmi = profileData.weight / (heightInMeters * heightInMeters);

      if (bmi < 18.5)
         return { value: bmi.toFixed(1), label: 'Gầy (Thiếu cân)', color: 'text-blue-500' };
      if (bmi < 23)
         return { value: bmi.toFixed(1), label: 'Bình thường (Cân đối)', color: 'text-green-500' };
      if (bmi < 25)
         return { value: bmi.toFixed(1), label: 'Thừa cân', color: 'text-yellow-500' };
      if (bmi < 30)
         return { value: bmi.toFixed(1), label: 'Béo phì độ I', color: 'text-orange-500' };

      return { value: bmi.toFixed(1), label: 'Béo phì độ II trở lên', color: 'text-red-500' };
   }, [profileData]);

   if (isLoading) return <div className="min-h-[calc(100vh-64px)] flex justify-center py-32"><Spinner /></div>;

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
                     <button
                        onClick={() => navigate('/doctors')}
                        className="mt-6 bg-white text-primary-800 font-extrabold px-6 py-2.5 rounded-xl hover:shadow-lg transition-all hover:scale-105 shadow-sm flex items-center"
                     >
                        + Đặt thêm lịch khám mới
                     </button>
                  </div>

                  {/* BẢNG THÔNG TIN BÁC SĨ (Đã tích hợp API chuẩn) */}
                  <div className="mt-8 md:mt-0 bg-white p-6 rounded-[1.5rem] w-full md:w-auto shadow-xl border-4 border-primary-800 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigate(`/doctors/${nextAppointment.doctorId}`)}>
                     <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-3">Bác sĩ phụ trách của bạn</p>
                     <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary-100 border-2 border-primary-200 flex items-center justify-center text-primary-600 font-black text-xl">
                           {upcomingDoctor?.fullName?.charAt(0) || 'B'}
                        </div>
                        <div>
                           <p className="font-extrabold text-gray-900 text-xl">BS. {upcomingDoctor?.fullName || 'Đang cập nhật'}</p>
                           <p className="text-primary-600 font-bold text-sm bg-primary-50 px-2 py-0.5 rounded mt-1 inline-block">
                              Khoa {upcomingDoctor?.specialtyName || 'Đang cập nhật'}
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
            {/* PHẦN PROFILE */}
            <div className="flex-1">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-extrabold text-gray-900 flex items-center"><Activity className="mr-3 w-6 h-6 text-primary-600" /> Hồ Sơ Cơ Bản</h3>
               </div>
               <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                  <div className="flex items-center mb-8 gap-4 border-b border-gray-100 pb-6">
                     <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl">
                        {user?.fullName?.charAt(0) || 'U'}
                     </div>
                     <div>
                        <p className="font-extrabold text-2xl text-gray-900">{user?.fullName}</p>
                        <p className="text-gray-500 font-medium">Bệnh nhân mang mã số: <span className="font-bold text-primary-600">#PT{user?.id}</span></p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                     <div className="p-6 bg-red-50 rounded-[1.5rem] border border-red-100 hover:shadow-md transition-shadow">
                        <p className="text-red-500 text-sm font-black uppercase tracking-wider mb-2">Nhóm máu</p>
                        <p className="text-4xl font-black text-red-600 drop-shadow-sm">
                           {profileData?.bloodType || 'Chưa rõ'}
                        </p>
                     </div>
                     <div className="p-6 bg-gray-50 rounded-[1.5rem] border border-gray-200 hover:shadow-md transition-shadow">
                        <p className="text-gray-500 text-sm font-black uppercase tracking-wider mb-2">
                           Chỉ số BMI
                        </p>
                        <div className="flex items-baseline gap-2">
                           <p className="text-4xl font-black text-gray-900">{bmiInfo.value}</p>
                        </div>
                        <p className={`text-xs mt-3 font-extrabold uppercase tracking-tight ${bmiInfo.color}`}>
                           Tình trạng: {bmiInfo.label}
                        </p>
                     </div>
                  </div>
                  <div className="border-t border-gray-100 pt-6">
                     <button onClick={() => navigate('/patient/profile')} className="w-full py-3 bg-primary-50 text-primary-600 font-bold rounded-xl hover:bg-primary-100 transition-colors">
                        Cập nhật chỉ số cơ thể
                     </button>
                  </div>
               </div>
            </div>
            {/* HOẠT ĐỘNG GẦN NHẤT */}
            <div className="lg:w-2/5">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-extrabold text-gray-900">Activity Gần nhất</h3>
                  <button onClick={() => navigate('/patient/history')} className="text-primary-600 font-bold hover:bg-primary-50 px-3 py-1.5 rounded-lg text-sm truncate flex items-center transition-colors">
                     Lịch sử đầy đủ <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
               </div>

               <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 text-gray-600 font-medium">
                  {recentActivities.length > 0 ? (
                     recentActivities.map((activity: any, index: number) => (
                        <div key={activity.appointmentId || index} className="p-5 hover:bg-gray-50 rounded-[1.5rem] transition-colors cursor-pointer border-b border-gray-50 last:border-b-0 flex items-center gap-5 group">
                           <div className={`w-14 h-14 rounded-full flex justify-center items-center shrink-0 group-hover:scale-110 transition-transform ${activity.status === 'COMPLETED' ?
                              'bg-green-100 text-green-600' : activity.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                              {activity.status === 'COMPLETED' ? <CheckCircle2 className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
                           </div>
                           <div>
                              <p className="text-gray-900 font-extrabold pb-1 text-lg leading-tight">
                                 {activity.status === 'COMPLETED' ? 'Khám Thành Công' : activity.status === 'CANCELLED' ? 'Đã Hủy Lịch' : 'Đã Lên Lịch Khám'}
                              </p>
                              {/* Sử dụng Component load tên thay vì hardcode */}
                              <p className="text-sm font-bold text-gray-400 mt-1">
                                 <ActivityDoctorName doctorId={activity.doctorId} /> (#BK{activity.appointmentId || 'N/A'})
                              </p>
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