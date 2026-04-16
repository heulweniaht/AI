import React, { useState } from 'react';
import { Star, MapPin, Calendar, CheckCircle2, Award, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorDetailPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('intro');

    const handleScheduleClick = () => {
        navigate('/booking/1');
    };

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
                        <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" alt="Doctor Avatar" className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-[2rem] border-[8px] border-white shadow-lg object-cover" />
                        <div className="absolute -bottom-4 -right-4 bg-red-500 text-white rounded-full p-4 shadow-xl border-4 border-white" title="Trưởng Khoa">
                           <Award className="w-8 h-8" />
                        </div>
                     </div>

                     <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center space-x-3 mb-4 justify-center md:justify-start">
                           <span className="bg-teal-50 text-teal-700 px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wide border border-teal-100 flex items-center shadow-sm">
                             <CheckCircle2 className="w-4 h-4 mr-1.5" /> Chuyên gia Y tế
                           </span>
                           <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wide border border-red-100 flex items-center shadow-sm">
                             <Flame className="w-4 h-4 mr-1.5" /> BS Đặt lịch nhiều
                           </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 text-center md:text-left tracking-tight">PGS. TS Nguyễn Văn A</h1>
                        <p className="text-xl text-primary-600 font-bold mb-6 text-center md:text-left">Chuyên khoa Tim mạch (Cardiology)</p>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-600 font-medium mb-8">
                           <div className="flex items-center"><Star className="w-6 h-6 text-yellow-400 fill-current mr-2" /> <span className="text-gray-900 font-extrabold text-lg mr-1">4.9</span> (342 đánh giá)</div>
                           <div className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden sm:block"></div>
                           <div className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-gray-400 shrink-0" /> BV Đa khoa Tâm Anh, Hà Nội</div>
                           <div className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden lg:block"></div>
                           <div className="flex items-center text-gray-900"><strong className="mr-1">25+ năm</strong> thâm niên</div>
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
                           const labels:any = { intro: 'Giới thiệu Chung', schedule: 'Lịch Làm Việc Chọn Ngày', certs: 'Bằng cấp Y Khoa', reviews: 'Review (342)' };
                           return (
                              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-4 px-6 text-center font-bold text-lg rounded-2xl transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary-600 text-white shadow-md border border-primary-500' : 'text-gray-500 hover:bg-primary-50'}`}>
                                 {labels[tab]}
                              </button>
                           )
                        })}
                     </div>

                     <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-gray-100 shadow-sm min-h-[400px]">
                        {activeTab === 'intro' && (
                           <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium">
                              <h3 className="text-2xl font-extrabold text-gray-900 mb-4 tracking-tight">Tiểu sử & Lý lịch Y khoa</h3>
                              <p>PGS. TS Nguyễn Văn A là một trong những chuyên gia hàng đầu về ứng dụng các phương pháp can thiệp tim mạch ít xâm lấn tại Việt Nam. Ông có 25 năm làm biên chế trưởng khoa tại Bạch Mai và từng có nhiều năm tu nghiệp nâng cao tại Đại học Y khoa Harvard (Hoa Kỳ).</p>
                              
                              <h4 className="text-xl font-bold text-gray-900 mt-8 tracking-tight">Thế mạnh điều trị chuyên môn</h4>
                              <ul className="list-disc pl-6 space-y-3 mt-4 text-gray-700">
                                 <li>Khám và điều trị các bệnh lý tim mạch tổng quát, kiểm soát cao huyết áp dai dẳng.</li>
                                 <li>Can thiệp ngoại khoa mạch vành qua đường ống chọc tĩnh mạch, đặt stent.</li>
                                 <li>Tư vấn dinh dưỡng chuyên biệt cho người bệnh biến chứng tiểu đường và mỡ máu cao.</li>
                                 <li>Khám nghiệm siêu âm tim tĩnh, đo điện đồ (ECG) cao cấp.</li>
                              </ul>
                           </div>
                        )}
                        {activeTab === 'schedule' && (
                            <div className="animate-fade-in">
                               <h3 className="text-2xl font-extrabold text-gray-900 mb-6 tracking-tight">Lịch làm việc trực tiếp (Tuần này)</h3>
                               <p className="text-gray-500 mb-6 font-medium bg-teal-50 p-4 rounded-xl border border-teal-100 text-teal-800">
                                  💡 <strong>Mẹo:</strong> Click chọn khung thời gian khám có nền màu xanh lá để tiến hành <strong>đặt hẹn online</strong> (chặn trước Slot khám không chờ).
                               </p>
                               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  {['08:00 T2', '08:30 T2', '10:00 T3', '14:00 T4', '14:30 T5', '16:00 T5', '09:00 T6', '10:30 T7'].map((time, i) => (
                                     <div key={i} onClick={handleScheduleClick} className="border-2 border-teal-200 bg-teal-50 hover:bg-teal-500 hover:border-teal-500 hover:text-white text-teal-800 font-extrabold text-center py-4 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-lg transform hover:-translate-y-1">
                                        {time}
                                     </div>
                                  ))}
                                  {['09:00 T2', '09:30 T3', '15:00 T5'].map((time, i) => (
                                     <div key={i} className="border-2 border-gray-100 bg-gray-100 text-gray-400 font-bold text-center py-4 rounded-2xl cursor-not-allowed">
                                        {time} <br/><span className="text-xs">(Kín Slot)</span>
                                     </div>
                                  ))}
                               </div>
                            </div>
                        )}
                        {(activeTab === 'certs' || activeTab === 'reviews') && (
                            <div className="animate-fade-in h-[300px] flex items-center justify-center text-gray-400 font-medium">Khung thông tin đang được cập nhật thêm...</div>
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
                              <span className="font-black text-2xl text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">500.000đ</span>
                           </div>
                           <div className="flex flex-col sm:flex-row justify-between lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center pb-6 border-b border-gray-100 border-dashed gap-2">
                              <span className="text-gray-600 font-bold text-base">Khám thứ 7, CN, Lễ:</span>
                              <span className="font-black text-2xl text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">700.000đ</span>
                           </div>
                           <div className="flex flex-col sm:flex-row justify-between lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center pb-6 gap-2">
                              <span className="text-gray-600 font-bold text-base">Siêu âm Tim cấp cấp:</span>
                              <span className="font-black text-2xl text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">1.500.000đ</span>
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
