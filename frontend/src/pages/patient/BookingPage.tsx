import React, { useState } from 'react';
import { Calendar, Contact, CreditCard, CheckCircle2, FileText, UploadCloud, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (step < 4) setStep(step + 1);
        if (step === 3) {
           setTimeout(() => {
              setStep(4);
           }, 1000)
        }
    }

    return (
        <div className="bg-slate-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none"></div>

           <div className="max-w-5xl mx-auto relative z-10">
              <div className="text-center mb-12">
                 <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Quy trình Khám Bệnh - Bước {step}/4</h1>
                 <p className="text-gray-500 font-bold text-lg uppercase tracking-wider">PGS. TS Nguyễn Văn A - Khoa Tim mạch</p>
              </div>

              <div className="bg-white rounded-t-[2.5rem] shadow-sm border-b border-gray-100 p-8 flex justify-between relative overflow-hidden">
                 <div className="absolute top-1/2 left-12 right-12 h-2 bg-gray-100 -translate-y-1/2 z-0 rounded-full"></div>
                 <div className="absolute top-1/2 left-12 h-2 bg-primary-500 -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-in-out shadow-lg shadow-primary-200" style={{width: `calc(${(step-1)*33.3}%)`}}></div>
                 {[
                    { id: 1, icon: Calendar, label: 'LỊCH KHÁM' },
                    { id: 2, icon: FileText, label: 'KHAI BÁO' },
                    { id: 3, icon: CreditCard, label: 'THANH TOÁN' },
                    { id: 4, icon: CheckCircle2, label: 'HOÀN TẤT!' }
                 ].map(s => (
                    <div key={s.id} className="relative z-10 flex flex-col items-center group cursor-default">
                       <div className={`w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl transition-all duration-500 border-4 border-white ${step >= s.id ? 'bg-primary-600 text-white shadow-xl transform scale-110 ring-4 ring-primary-50' : 'bg-gray-200 text-gray-400'}`}>
                          <s.icon className={`w-7 h-7 ${step === s.id ? 'animate-pulse' : ''}`} />
                       </div>
                       <span className={`mt-4 font-black tracking-widest text-xs uppercase ${step >= s.id ? 'text-primary-800' : 'text-gray-400'}`}>{s.label}</span>
                    </div>
                 ))}
              </div>

              <div className="bg-white rounded-b-[2.5rem] shadow-2xl border border-t-0 border-gray-100 p-8 md:p-14 min-h-[500px]">
                 <form onSubmit={handleFormSubmit}>
                    {/* BƯỚC 1 */}
                    {step === 1 && (
                        <div className="animate-slide-up space-y-8">
                           <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-l-8 border-primary-500 pl-4">Khởi tạo Yêu cầu: Chọn Thời gian</h2>
                           <div className="grid lg:grid-cols-2 gap-10">
                              <div>
                                 <label className="text-gray-900 font-extrabold block mb-4 text-xl">Lịch ngày muốn khám (<span className="text-red-500">*</span>)</label>
                                 <input type="date" className="w-full p-5 border-2 border-primary-200 rounded-2xl bg-primary-50 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 font-extrabold text-primary-900 uppercase cursor-pointer outline-none shadow-inner text-lg" required />
                              </div>
                              <div>
                                 <label className="text-gray-900 font-extrabold block mb-4 text-xl">Chọn múi giờ (Slot)</label>
                                 <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-3">
                                   {['08:30', '09:00', '10:00', '13:30', '14:00', '15:30', '16:00', '16:30'].map((time, i) => (
                                     <div key={time} className={`border-2 border-teal-200 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 text-teal-600 font-black text-center py-4 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md ${i===2 ? 'bg-teal-500 text-white border-teal-500 shadow-md ring-4 ring-teal-100' : ''}`}>
                                        {time}
                                     </div>
                                   ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                    )}

                    {/* BƯỚC 2 */}
                    {step === 2 && (
                        <div className="animate-slide-up space-y-8">
                           <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-l-8 border-primary-500 pl-4">Lý do chuyên môn: Khai báo triệu chứng</h2>
                           <div>
                              <label className="text-gray-900 font-extrabold block mb-3 text-lg">Mô tả cụ thể (càng chi tiết bác sĩ càng nắm dễ)</label>
                              <textarea rows={5} className="w-full p-6 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 resize-none font-bold text-lg bg-gray-50 focus:bg-white transition-colors outline-none shadow-inner" placeholder="Ví dụ: Dạ dày đau rát kèm theo hoa mắt chóng mặt khi quá đói..."></textarea>
                           </div>
                           <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:border-primary-500 hover:bg-primary-50/50 hover:shadow-inner transition-all cursor-pointer group">
                              <div className="bg-white p-4 rounded-full shadow-lg mb-5 group-hover:scale-125 transition-transform duration-300"><UploadCloud className="w-10 h-10 text-primary-500" /></div>
                              <p className="font-extrabold text-gray-900 text-xl">Kéo thả File xét nghiệm cũ vào đây</p>
                              <p className="text-gray-500 font-medium mt-2">Đính kèm ảnh MRI, X-Quang, Đơn thuốc dạng PDF/JPG (Tối đa 5MB)</p>
                           </div>
                        </div>
                    )}

                    {/* BƯỚC 3 */}
                    {step === 3 && (
                        <div className="animate-slide-up space-y-10">
                           <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-l-8 border-primary-500 pl-4">Tổng kêt: Xác nhận Biên lai thanh toán</h2>
                           
                           <div className="bg-gradient-to-r from-primary-50 to-teal-50 p-8 rounded-3xl border border-primary-100 flex flex-col lg:flex-row justify-between items-center shadow-inner">
                              <div className="mb-6 lg:mb-0 text-center lg:text-left">
                                 <p className="text-primary-800 font-black text-2xl mb-2">Khám Lâm sàng Cao cấp</p>
                                 <p className="text-primary-600 font-bold text-lg">Bác sĩ: PGS. TS Nguyễn Văn A</p>
                                 <p className="text-primary-600 font-bold text-lg">Khung giờ: 10:00 Sáng, 28/10/2026</p>
                              </div>
                              <div className="text-center lg:text-right bg-white p-6 rounded-2xl shadow-lg border border-primary-100">
                                 <p className="text-gray-500 font-bold uppercase tracking-wider mb-1 text-sm">Tổng thanh toán</p>
                                 <p className="text-4xl font-black text-primary-700">500.000 ₫</p>
                              </div>
                           </div>

                           <div>
                              <label className="text-gray-900 font-extrabold block mb-6 text-xl">Phương thức cổng thanh toán số</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                 <div className="border-[3px] border-green-500 bg-green-50 rounded-2xl p-6 flex flex-col items-center cursor-pointer shadow-md relative overflow-hidden hover:-translate-y-1 transition-transform text-center">
                                     <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-black uppercase px-3 py-1 rounded-bl-xl shadow">Đề xuất</div>
                                     <Banknote className="w-12 h-12 text-green-600 mb-4" />
                                     <div>
                                        <p className="font-extrabold text-green-900 text-xl mb-1">Momo / VNPay App</p>
                                        <p className="text-sm text-green-700 font-bold">Mã QR Code thao tác liền tay</p>
                                     </div>
                                 </div>
                                 <div className="border-2 border-gray-200 rounded-2xl p-6 flex flex-col items-center hover:border-gray-400 cursor-pointer transition-colors text-center bg-white shadow-sm">
                                     <CreditCard className="w-12 h-12 text-gray-400 mb-4" />
                                     <div>
                                        <p className="font-extrabold text-gray-900 text-xl mb-1">Tiền mặt tại Bệnh viện</p>
                                        <p className="text-sm text-gray-500 font-bold">Nhận phiếu khám, đợi thanh toán</p>
                                     </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                    )}

                    {/* BƯỚC 4 */}
                    {step === 4 && (
                        <div className="animate-slide-up text-center py-10">
                           <div className="w-32 h-32 bg-green-100 rounded-full flex mx-auto items-center justify-center mb-8 shadow-inner ring-8 ring-green-50">
                              <CheckCircle2 className="w-16 h-16 text-green-500" />
                           </div>
                           <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">Đặt lịch Thành Công!</h2>
                           <p className="text-gray-500 font-bold text-xl mb-10 max-w-2xl mx-auto">Thông tin cuộc hẹn đã được chốt. Hệ thống đã gửi vé điện tử SMS đến số điện thoại đăng ký.</p>
                           
                           <div className="bg-gray-50 rounded-[2rem] p-10 max-w-xl mx-auto text-left border border-gray-200 shadow-md mb-12 border-t-8 border-t-primary-500 relative overflow-hidden">
                              <div className="absolute -right-10 -top-10 text-primary-100 opacity-50"><Calendar className="w-40 h-40" /></div>
                              <p className="text-sm text-gray-400 font-black uppercase tracking-widest mb-6 border-b-2 border-gray-200 border-dashed pb-4 relative z-10">Phiếu xác nhận khám bệnh</p>
                              <div className="space-y-5 font-bold text-gray-700 text-lg relative z-10">
                                 <div className="flex justify-between items-center"><span className="text-gray-500">Mã Booking:</span> <span className="text-2xl font-black text-gray-900 bg-gray-200 px-3 py-1 rounded">#BK-9482X</span></div>
                                 <div className="flex justify-between items-center"><span className="text-gray-500">Bệnh nhân:</span> <span className="text-gray-900">Trần Trọng Thái</span></div>
                                 <div className="flex justify-between items-center"><span className="text-gray-500">Thời gian:</span> <span className="text-primary-700 font-extrabold bg-primary-50 px-3 py-1 rounded-lg border border-primary-100">10:00 C | 28/10</span></div>
                                 <div className="flex justify-between items-center"><span className="text-gray-500">Bác sĩ:</span> <span className="text-gray-900">PGS Nguyễn Văn A</span></div>
                              </div>
                           </div>

                           <div className="flex justify-center gap-6">
                               <button type="button" onClick={() => navigate('/patient/dashboard')} className="px-10 py-5 bg-gradient-to-r from-primary-600 to-teal-500 text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                                 Quản lý Lịch trong Profile
                               </button>
                           </div>
                        </div>
                    )}

                    {step < 4 && (
                        <div className="flex justify-between mt-16 pt-8 border-t border-gray-100">
                           <button type="button" onClick={() => step > 1 ? setStep(step-1) : navigate(-1)} className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold rounded-2xl transition-colors text-lg">
                              {step === 1 ? 'X Bỏ Qua' : '← Trở Lại Bước Trước'}
                           </button>
                           <button type="submit" className="px-12 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] text-lg flex items-center">
                              {step === 3 ? 'Kết thúc lệnh Thanh toán' : 'Chuyển Bước Kế Tiếp'} <span className="ml-2 font-light">→</span>
                           </button>
                        </div>
                    )}
                 </form>
              </div>
           </div>
        </div>
    )
}
export default BookingPage;
