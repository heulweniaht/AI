import React, { useState } from 'react';
import { Star, MapPin, Calendar, CheckCircle2, Award, Flame } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDoctorDetail, useDoctorSchedules } from '@/hooks/useDoctors';
import { Spinner } from '@/components/common/Spinner';

const DoctorDetailPage = () => {
   const navigate = useNavigate();
   // Lấy ID bác sĩ từ URL (VD: /doctors/1)
   const { id } = useParams<{ id: string }>();
   const doctorId = Number(id);

   const [activeTab, setActiveTab] = useState('intro');
   // Trạng thái ngày để xem lịch ở Tab Schedule (Mặc định hôm nay)
   const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

   // Gọi API lấy chi tiết bác sĩ
   const { data: doctor, isLoading: isDoctorLoading } = useDoctorDetail(doctorId);

   // Gọi API lấy lịch làm việc theo ngày
   const { data: schedules, isLoading: isSchedulesLoading } = useDoctorSchedules(doctorId, selectedDate);

   const handleScheduleClick = () => {
      navigate(`/booking/${doctorId}`);
   };

   if (isDoctorLoading) return <div className="min-h-screen flex justify-center py-32"><Spinner /></div>;
   if (!doctor) return <div className="min-h-screen flex justify-center py-32 text-2xl font-bold text-gray-500">Không tìm thấy thông tin Bác sĩ!</div>;

   return (
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] pb-20 animate-fade-in">
         {/* Header Cover */}
         <div className="h-64 md:h-80 w-full bg-gradient-to-r from-primary-900 to-teal-800 relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=2000&q=80" alt="Hospital Cover" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-12 border border-gray-100">
               <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                  <div className="flex-shrink-0 mx-auto md:mx-0 relative">
                     <img
                        src={doctor.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName)}&background=E5E7EB&color=047857&size=256`}
                        alt="Doctor Avatar"
                        className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-[2rem] border-[8px] border-white shadow-lg object-cover bg-gray-50"
                     />
                     <div className="absolute -bottom-4 -right-4 bg-red-500 text-white rounded-full p-4 shadow-xl border-4 border-white" title="Trưởng Khoa / Chuyên Gia">
                        <Award className="w-8 h-8" />
                     </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                     <div className="flex items-center space-x-3 mb-4 justify-center md:justify-start flex-wrap gap-y-2">
                        <span className="bg-teal-50 text-teal-700 px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wide border border-teal-100 flex items-center shadow-sm">
                           <CheckCircle2 className="w-4 h-4 mr-1.5" /> Chuyên gia Y tế
                        </span>
                        {doctor.ratingAvg >= 4.8 && (
                           <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wide border border-red-100 flex items-center shadow-sm">
                              <Flame className="w-4 h-4 mr-1.5" /> BS Đặt lịch nhiều
                           </span>
                        )}
                     </div>

                     <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 text-center md:text-left tracking-tight">
                        BS. {doctor.fullName}
                     </h1>
                     <p className="text-xl text-primary-600 font-bold mb-6 text-center md:text-left">
                        Chuyên khoa {doctor.specialtyName}
                     </p>

                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 font-medium mb-8">
                        <div className="flex items-center">
                           <Star className="w-6 h-6 text-yellow-400 fill-current mr-2" />
                           <span className="text-gray-900 font-extrabold text-lg mr-1">{doctor.ratingAvg ? doctor.ratingAvg.toFixed(1) : '5.0'}</span>
                           ({doctor.totalReviews || 0} đánh giá)
                        </div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden sm:block"></div>
                        <div className="flex items-center">
                           <MapPin className="w-5 h-5 mr-2 text-gray-400 shrink-0" />
                           {doctor.clinicName}, {doctor.clinicCity}
                        </div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden lg:block"></div>
                        <div className="flex items-center text-gray-900">
                           <strong className="mr-1">{doctor.experienceYears}+ năm</strong> thâm niên
                        </div>
                     </div>

                     <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <button onClick={handleScheduleClick} className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-extrabold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center hover:-translate-y-1">
                           Đặt Lịch Khám Ngay <Calendar className="ml-3 w-6 h-6" />
                        </button>
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-8 rounded-xl transition-colors text-lg flex items-center justify-center">
                           Bấm Theo Dõi Bác Sĩ
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Tabs & Content */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white rounded-[2rem] p-2 border border-gray-100 flex overflow-x-auto shadow-sm">
                     {['intro', 'schedule', 'certs', 'reviews'].map(tab => {
                        const labels: any = { intro: 'Giới thiệu Chung', schedule: 'Lịch Làm Việc Chọn Ngày', certs: 'Bằng cấp Y Khoa', reviews: `Review (${doctor.totalReviews || 0})` };
                        return (
                           <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 px-6 text-center font-bold text-lg rounded-2xl transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary-600 text-white shadow-md border border-primary-500' : 'text-gray-500 hover:bg-primary-50'}`}>
                              {labels[tab]}
                           </button>
                        )
                     })}
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm min-h-[400px]">
                     {/* TAB GIỚI THIỆU */}
                     {activeTab === 'intro' && (
                        <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium">
                           <h3 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">Tiểu sử & Lý lịch Y khoa</h3>
                           {/* Ưu tiên hiển thị description từ DB, nếu không có thì dùng text fallback */}
                           <p className="whitespace-pre-line">{doctor.description || `Bác sĩ ${doctor.fullName} là một trong những chuyên gia giàu kinh nghiệm tại ${doctor.clinicName}. Với hơn ${doctor.experienceYears} năm kinh nghiệm trong lĩnh vực ${doctor.specialtyName}, bác sĩ luôn tận tâm và mang đến phương pháp điều trị tối ưu nhất cho từng bệnh nhân.`}</p>
                        </div>
                     )}

                     {/* TAB LỊCH LÀM VIỆC */}
                     {activeTab === 'schedule' && (
                        <div className="animate-fade-in">
                           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Khung giờ hiện có</h3>
                              <input
                                 type="date"
                                 value={selectedDate}
                                 min={new Date().toISOString().split('T')[0]}
                                 onChange={(e) => setSelectedDate(e.target.value)}
                                 className="px-4 py-2 border-2 border-primary-200 rounded-xl font-bold text-primary-800 outline-none focus:border-primary-500"
                              />
                           </div>

                           <p className="text-gray-500 mb-6 font-medium bg-teal-50 p-4 rounded-xl border border-teal-100 text-teal-800">
                              💡 <strong>Mẹo:</strong> Click chọn khung thời gian khám có nền màu xanh lá để tiến hành <strong>đặt hẹn online</strong> (chặn trước Slot khám không chờ).
                           </p>

                           {isSchedulesLoading ? (
                              <div className="py-10 flex justify-center"><Spinner /></div>
                           ) : schedules && schedules.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                 {schedules.map((schedule: any) => {
                                    // Logic xanh (trống) - xám (đã đặt)
                                    const isAvailable = schedule.isAvailable && !schedule.isBooked;
                                    return isAvailable ? (
                                       <div key={schedule.id} onClick={handleScheduleClick} className="border-2 border-teal-200 bg-teal-50 hover:bg-teal-500 hover:border-teal-500 hover:text-white text-teal-800 font-extrabold text-center py-4 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-lg transform hover:-translate-y-1 flex flex-col justify-center items-center">
                                          {schedule.startTime.substring(0, 5)}
                                          <span className="text-[10px] uppercase mt-1 opacity-80">Trống</span>
                                       </div>
                                    ) : (
                                       <div key={schedule.id} className="border-2 border-gray-100 bg-gray-100 text-gray-400 font-bold text-center py-4 rounded-2xl cursor-not-allowed flex flex-col justify-center items-center">
                                          {schedule.startTime.substring(0, 5)}
                                          <span className="text-[10px] uppercase mt-1">(Kín Slot)</span>
                                       </div>
                                    )
                                 })}
                              </div>
                           ) : (
                              <div className="text-center py-10 text-red-500 font-bold border-2 border-dashed border-red-200 rounded-2xl">
                                 Không có lịch trống vào ngày này. Vui lòng chọn ngày khác.
                              </div>
                           )}
                        </div>
                     )}

                     {/* TAB BẰNG CẤP & REVIEW */}
                     {(activeTab === 'certs' || activeTab === 'reviews') && (
                        <div className="animate-fade-in h-[300px] flex flex-col items-center justify-center text-gray-400 font-medium">
                           <Award className="w-16 h-16 mb-4 opacity-50" />
                           Dữ liệu đang được hệ thống cập nhật thêm...
                        </div>
                     )}
                  </div>
               </div>

               <div className="space-y-8">
                  <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-40 h-40 bg-teal-50 rounded-bl-full -z-10 transition-transform hover:scale-110"></div>
                     <h3 className="text-2xl font-extrabold text-gray-900 mb-8">Bảng Giá Dịch Vụ</h3>
                     <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center pb-6 border-b border-gray-100 border-dashed gap-2">
                           <span className="text-gray-600 font-bold text-base">Khám lâm sàng tư vấn:</span>
                           <span className="font-black text-2xl text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(doctor.consultationFee)}
                           </span>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center pb-6 border-b border-gray-100 border-dashed gap-2">
                           <span className="text-gray-600 font-bold text-base">Khám thứ 7, CN, Lễ:</span>
                           <span className="font-black text-xl text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(doctor.consultationFee * 1.2)}
                           </span>
                        </div>
                     </div>
                     <div className="mt-6 p-4 rounded-xl bg-orange-50 text-orange-700 text-sm font-bold border border-orange-100 flex items-start">
                        <span className="mr-2">⚠️</span>
                        Giá trên chỉ mang tính tham khảo dịch vụ gốc khám cùng bác sĩ. Phí chưa bao gồm thuốc thang và các can thiệp sâu.
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default DoctorDetailPage;