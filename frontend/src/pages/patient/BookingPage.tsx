import React, { useState, useEffect } from 'react';
import { Calendar, Contact, CreditCard, CheckCircle2, FileText, UploadCloud, Banknote } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDoctorDetail, useDoctorSchedules } from '@/hooks/useDoctors';
import { useBookAppointment } from '@/hooks/useAppointments';
import { paymentApi } from '@/api/paymentApi';
import { useBookingStore } from '@/store/bookingStore';
import { Spinner } from '@/components/common/Spinner';

const BookingPage = () => {
   const { doctorId } = useParams<{ doctorId: string }>();
   const navigate = useNavigate();

   // 2. Zustand Store: Lấy các biến state lưu trữ tạm thời
   const {
      currentStep, nextStep, prevStep, reset,
      selectedSlot, setSlot,
      reason, symptoms, attachments, setFormData,
      paymentMethod, setPaymentMethod,
      isSubmitting
   } = useBookingStore();

   // 3. React Query: Gọi API lấy chi tiết bác sĩ
   const { data: doctor, isLoading: isDoctorLoading } = useDoctorDetail(Number(doctorId));

   // 4. State cho việc chọn ngày ở Bước 1
   // Mặc định chọn ngày hiện tại
   const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

   // 5. React Query: Gọi API lấy các slot giờ trống dựa trên ngày đã chọn
   const { data: availableSchedules, isLoading: isSchedulesLoading } = useDoctorSchedules(Number(doctorId), selectedDate);

   // 6. React Query: Gửi dữ liệu Đặt lịch
   const { mutate: bookAppointment, isPending: isBookingPending, data: createdAppointment } = useBookAppointment();

   // Reset store khi load trang để tránh lỗi dính dữ liệu cũ
   useEffect(() => {
      reset();
   }, [reset]);

   // 7. Hàm xử lý khi bấm nút "Chuyển Bước/Thanh toán"
   const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (currentStep === 1) {
         if (!selectedSlot) {
            alert("Vui lòng chọn 1 khung giờ trước khi tiếp tục!");
            return;
         }
         nextStep();
      } else if (currentStep === 2) {
         if (!reason.trim()) {
            alert("Vui lòng điền mô tả triệu chứng!");
            return;
         }
         nextStep();
      } else if (currentStep === 3) {
         // Gửi API tạo lịch khám
         if (!selectedSlot || !doctor) return;

         bookAppointment(
            {
               doctorId: doctor.id,
               scheduleId: selectedSlot.id,
               reason,
               symptoms,
               attachments,
               paymentMethod: paymentMethod as any, // Ép kiểu vì DB yêu cầu Enum cụ thể
            },
            {
               onSuccess: async (appointmentResponse: any) => {
                  // Nếu chọn VNPay -> Gửi tiếp request lấy link VNPay và chuyển trang
                  if (paymentMethod === 'VNPAY') {
                     try {
                        const { paymentUrl } = await paymentApi.createPaymentUrl({
                           appointmentId: appointmentResponse.id,
                           method: 'VNPAY',
                        });
                        if (paymentUrl) {
                           window.location.href = paymentUrl;
                           return;
                        }
                     } catch (error) {
                        console.error("Lỗi khi tạo VNPay url", error);
                     }
                  }
               }
            }
         );
      }
   };

   if (isDoctorLoading) return <div className="min-h-[50vh] flex justify-center py-20"><Spinner /></div>;
   if (!doctor) return <div className="text-center py-20 text-red-500 font-bold">Không tìm thấy thông tin bác sĩ!</div>;

   return (
      <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none"></div>

         <div className="max-w-5xl mx-auto relative z-10">
            {/* TIÊU ĐỀ */}
            <div className="text-center mb-12">
               <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Quy trình Khám Bệnh - Bước {currentStep}/4</h1>
               <p className="text-gray-500 font-bold text-lg uppercase tracking-wider">{doctor.fullName} - {doctor.specialtyName}</p>
            </div>

            {/* THANH TRẠNG THÁI TIẾN TRÌNH */}
            <div className="bg-white rounded-t-[2.5rem] shadow-sm border-b border-gray-100 p-8 flex justify-between relative overflow-hidden">
               <div className="absolute top-1/2 left-12 right-12 h-2 bg-gray-100 -translate-y-1/2 z-0 rounded-full"></div>
               <div className="absolute top-1/2 left-12 h-2 bg-primary-500 -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-in-out shadow-lg shadow-primary-200" style={{ width: `calc(${(currentStep - 1) * 33.3}%)` }}></div>
               {[
                  { id: 1, icon: Calendar, label: 'LỊCH KHÁM' },
                  { id: 2, icon: FileText, label: 'KHAI BÁO' },
                  { id: 3, icon: CreditCard, label: 'THANH TOÁN' },
                  { id: 4, icon: CheckCircle2, label: 'HOÀN TẤT!' }
               ].map(s => (
                  <div key={s.id} className="relative z-10 flex flex-col items-center group cursor-default">
                     <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl transition-all duration-500 border-4 border-white ${currentStep >= s.id ? 'bg-primary-600 text-white shadow-xl transform scale-110 ring-4 ring-primary-50' : 'bg-gray-200 text-gray-400'}`}>
                        <s.icon className={`w-7 h-7 ${currentStep === s.id ? 'animate-pulse' : ''}`} />
                     </div>
                     <span className={`mt-4 font-black tracking-widest text-xs uppercase ${currentStep >= s.id ? 'text-primary-800' : 'text-gray-400'}`}>{s.label}</span>
                  </div>
               ))}
            </div>

            <div className="bg-white rounded-b-[2.5rem] shadow-2xl border border-t-0 border-gray-100 p-8 md:p-14 min-h-[500px]">
               <form onSubmit={handleFormSubmit}>
                  {/* BƯỚC 1: CHỌN GIỜ */}
                  {currentStep === 1 && (
                     <div className="animate-slide-up space-y-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-l-8 border-primary-500 pl-4">Khởi tạo Yêu cầu: Chọn Thời gian</h2>
                        <div className="grid lg:grid-cols-2 gap-10">
                           <div>
                              <label className="text-gray-900 font-extrabold block mb-4 text-xl">Lịch ngày muốn khám (<span className="text-red-500">*</span>)</label>
                              <input
                                 type="date"
                                 value={selectedDate}
                                 // Chặn chọn ngày quá khứ
                                 min={new Date().toISOString().split('T')[0]}
                                 onChange={(e) => {
                                    setSelectedDate(e.target.value);
                                    setSlot(null as any); // Bỏ slot đã chọn cũ
                                 }}
                                 className="w-full p-5 border-2 border-primary-200 rounded-2xl bg-primary-50 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 font-extrabold text-primary-900 uppercase cursor-pointer outline-none shadow-inner text-lg"
                                 required
                              />
                           </div>
                           <div>
                              <label className="text-gray-900 font-extrabold block mb-4 text-xl">Chọn múi giờ (Slot)</label>
                              {isSchedulesLoading ? (
                                 <div className="py-4"><Spinner /></div>
                              ) : availableSchedules && availableSchedules.length > 0 ? (
                                 <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                                    {availableSchedules.map((schedule) => (
                                       <div
                                          key={schedule.id}
                                          onClick={() => {
                                             if (!schedule.isBooked && schedule.isAvailable) setSlot(schedule);
                                          }}
                                          className={`border-2 text-center py-4 rounded-xl cursor-pointer transition-all shadow-sm font-black
                                                            ${schedule.isBooked || !schedule.isAvailable
                                                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                                                : selectedSlot?.id === schedule.id
                                                   ? 'bg-teal-500 text-white border-teal-500 shadow-md ring-4 ring-teal-100 hover:shadow-lg'
                                                   : 'border-teal-200 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 text-teal-600'
                                             }`}
                                       >
                                          {schedule.startTime.substring(0, 5)}
                                       </div>
                                    ))}
                                 </div>
                              ) : (
                                 <p className="text-red-500 font-bold">Không có lịch trống vào ngày này.</p>
                              )}
                           </div>
                        </div>
                     </div>
                  )}

                  {/* BƯỚC 2: KHAI BÁO TRIỆU CHỨNG */}
                  {currentStep === 2 && (
                     <div className="animate-slide-up space-y-8">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-l-8 border-primary-500 pl-4">Lý do chuyên môn: Khai báo triệu chứng</h2>
                        <div>
                           <label className="text-gray-900 font-extrabold block mb-3 text-lg">Mô tả cụ thể (càng chi tiết bác sĩ càng nắm dễ)</label>
                           <textarea
                              value={reason}
                              onChange={(e) => setFormData({ reason: e.target.value, symptoms, attachments })}
                              rows={5}
                              className="w-full p-6 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 resize-none font-bold text-lg bg-gray-50 focus:bg-white transition-colors outline-none shadow-inner"
                              placeholder="Ví dụ: Dạ dày đau rát kèm theo hoa mắt chóng mặt khi quá đói..."
                           ></textarea>
                        </div>
                        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:border-primary-500 hover:bg-primary-50/50 hover:shadow-inner transition-all cursor-pointer group">
                           <div className="bg-white p-4 rounded-full shadow-lg mb-5 group-hover:scale-125 transition-transform duration-300"><UploadCloud className="w-10 h-10 text-primary-500" /></div>
                           <p className="font-extrabold text-gray-900 text-xl">Kéo thả File xét nghiệm cũ vào đây</p>
                           <p className="text-gray-500 font-medium mt-2">Tính năng này sẽ được tích hợp sau (Minio S3)</p>
                        </div>
                     </div>
                  )}

                  {/* BƯỚC 3: THANH TOÁN */}
                  {currentStep === 3 && (
                     <div className="animate-slide-up space-y-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-l-8 border-primary-500 pl-4">Tổng kêt: Xác nhận Biên lai thanh toán</h2>

                        <div className="bg-gradient-to-r from-primary-50 to-teal-50 p-8 rounded-3xl border border-primary-100 flex flex-col lg:flex-row justify-between items-center shadow-inner">
                           <div className="mb-6 lg:mb-0 text-center lg:text-left">
                              <p className="text-primary-800 font-black text-2xl mb-2">Khám Lâm sàng Chuyên khoa</p>
                              <p className="text-primary-600 font-bold text-lg">Bác sĩ: {doctor.fullName}</p>
                              <p className="text-primary-600 font-bold text-lg">Khung giờ: {selectedSlot?.startTime.substring(0, 5)} - Ngày {selectedDate.split('-').reverse().join('/')}</p>
                           </div>
                           <div className="text-center lg:text-right bg-white p-6 rounded-2xl shadow-lg border border-primary-100">
                              <p className="text-gray-500 font-bold uppercase tracking-wider mb-1 text-sm">Tổng thanh toán</p>
                              <p className="text-4xl font-black text-primary-700">
                                 {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(doctor.consultationFee)}
                              </p>
                           </div>
                        </div>

                        <div>
                           <label className="text-gray-900 font-extrabold block mb-6 text-xl">Phương thức cổng thanh toán số</label>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div
                                 onClick={() => setPaymentMethod('VNPAY')}
                                 className={`border-[3px] rounded-2xl p-6 flex flex-col items-center cursor-pointer shadow-md relative overflow-hidden transition-all text-center
                                                ${paymentMethod === 'VNPAY' ? 'border-green-500 bg-green-50 scale-[1.02]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                              >
                                 {paymentMethod === 'VNPAY' && <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-black uppercase px-3 py-1 rounded-bl-xl shadow">Đề xuất</div>}
                                 <Banknote className={`w-12 h-12 mb-4 ${paymentMethod === 'VNPAY' ? 'text-green-600' : 'text-gray-400'}`} />
                                 <div>
                                    <p className={`font-extrabold text-xl mb-1 ${paymentMethod === 'VNPAY' ? 'text-green-900' : 'text-gray-900'}`}>VNPay App</p>
                                    <p className={`text-sm font-bold ${paymentMethod === 'VNPAY' ? 'text-green-700' : 'text-gray-500'}`}>Thanh toán trực tuyến bảo mật</p>
                                 </div>
                              </div>

                              <div
                                 onClick={() => setPaymentMethod('CASH')}
                                 className={`border-[3px] rounded-2xl p-6 flex flex-col items-center cursor-pointer shadow-md transition-all text-center
                                                ${paymentMethod === 'CASH' ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                              >
                                 <CreditCard className={`w-12 h-12 mb-4 ${paymentMethod === 'CASH' ? 'text-blue-600' : 'text-gray-400'}`} />
                                 <div>
                                    <p className={`font-extrabold text-xl mb-1 ${paymentMethod === 'CASH' ? 'text-blue-900' : 'text-gray-900'}`}>Tiền mặt tại viện</p>
                                    <p className={`text-sm font-bold ${paymentMethod === 'CASH' ? 'text-blue-700' : 'text-gray-500'}`}>Thanh toán sau tại quầy lễ tân</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* BƯỚC 4: HOÀN TẤT */}
                  {currentStep === 4 && createdAppointment && (
                     <div className="animate-slide-up text-center py-10">
                        <div className="w-32 h-32 bg-green-100 rounded-full flex mx-auto items-center justify-center mb-8 shadow-inner ring-8 ring-green-50">
                           <CheckCircle2 className="w-16 h-16 text-green-500" />
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Đặt lịch Thành Công!</h2>
                        <p className="text-gray-500 font-bold text-xl mb-10 max-w-2xl mx-auto">Thông tin cuộc hẹn đã được chốt. Hệ thống đã gửi thông báo đến bạn.</p>

                        <div className="bg-gray-50 rounded-[2rem] p-10 max-w-xl mx-auto text-left border border-gray-200 shadow-md mb-12 border-t-8 border-t-primary-500 relative overflow-hidden">
                           <div className="absolute -right-10 -top-10 text-primary-100 opacity-50"><Calendar className="w-40 h-40" /></div>
                           <p className="text-sm text-gray-400 font-black uppercase tracking-widest mb-6 border-b-2 border-gray-200 border-dashed pb-4 relative z-10">Phiếu xác nhận khám bệnh</p>
                           <div className="space-y-5 font-bold text-gray-700 text-lg relative z-10">
                              <div className="flex justify-between items-center"><span className="text-gray-500">Mã Booking:</span> <span className="text-2xl font-black text-gray-900 bg-gray-200 px-3 py-1 rounded">#{createdAppointment.id}</span></div>
                              <div className="flex justify-between items-center"><span className="text-gray-500">Bệnh nhân:</span> <span className="text-gray-900">{createdAppointment.patientName}</span></div>
                              <div className="flex justify-between items-center"><span className="text-gray-500">Thời gian:</span> <span className="text-primary-700 font-extrabold bg-primary-50 px-3 py-1 rounded-lg border border-primary-100">{new Date(createdAppointment.appointmentTime).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</span></div>
                              <div className="flex justify-between items-center"><span className="text-gray-500">Bác sĩ:</span> <span className="text-gray-900">{createdAppointment.doctorName}</span></div>
                              <div className="flex justify-between items-center"><span className="text-gray-500">Thanh toán:</span> <span className="text-green-600">{createdAppointment.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Chờ khám'}</span></div>
                           </div>
                        </div>

                        <div className="flex justify-center gap-6">
                           <button type="button" onClick={() => { reset(); navigate('/patient/dashboard'); }} className="px-10 py-5 bg-gradient-to-r from-primary-600 to-teal-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                              Quản lý Lịch trong Profile
                           </button>
                        </div>
                     </div>
                  )}

                  {/* NÚT CHUYỂN HƯỚNG DƯỚI CÙNG */}
                  {currentStep < 4 && (
                     <div className="flex justify-between mt-16 pt-8 border-t border-gray-100">
                        <button type="button" onClick={() => currentStep > 1 ? prevStep() : navigate(-1)} className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold rounded-2xl transition-colors text-lg">
                           {currentStep === 1 ? 'X Bỏ Qua' : '← Trở Lại Bước Trước'}
                        </button>
                        <button
                           type="submit"
                           disabled={isBookingPending}
                           className="px-12 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] text-lg flex items-center disabled:opacity-50"
                        >
                           {isBookingPending ? 'Đang xử lý...' : currentStep === 3 ? 'Kết thúc lệnh Thanh toán' : 'Chuyển Bước Kế Tiếp'}
                           {!isBookingPending && <span className="ml-2 font-light">→</span>}
                        </button>
                     </div>
                  )}
               </form>
            </div>
         </div>
      </div>
   );
};

export default BookingPage;