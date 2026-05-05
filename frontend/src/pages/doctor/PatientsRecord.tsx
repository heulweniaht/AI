import React, { useState, useMemo } from 'react';
import { Search, MapPin, SearchCode, ChevronRight, X, FileText, Clock } from 'lucide-react';
import { useDoctorAppointments } from '@/hooks/useDoctors';
import { useUpdateAppointmentNotes } from '@/hooks/useAppointments';
import { Spinner } from '@/components/common/Spinner';

const PatientsRecord = () => {
   // 1. Quản lý trạng thái tìm kiếm
   const [searchTerm, setSearchTerm] = useState('');

   // 2. Quản lý Modal điền bệnh án
   const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
   const [notes, setNotes] = useState('');

   // 3. Gọi API
   const { data: appointmentsData, isLoading } = useDoctorAppointments({ size: 100, sort: 'appointmentTime,desc' });
   const { mutate: completeAppointment, isPending: isUpdating } = useUpdateAppointmentNotes();

   // 4. Lọc dữ liệu bệnh nhân dựa vào thanh tìm kiếm (bỏ qua những ca đã hủy)
   const filteredPatients = useMemo(() => {
      if (!appointmentsData?.content) return [];
      let list = appointmentsData.content.filter((app: any) => app.status !== 'CANCELLED');

      if (searchTerm.trim()) {
         const lowerTerm = searchTerm.toLowerCase();
         list = list.filter((app: any) =>
            app.patientName.toLowerCase().includes(lowerTerm) ||
            app.id.toString().includes(lowerTerm)
         );
      }
      return list;
   }, [appointmentsData, searchTerm]);

   // 5. Xử lý khi lưu bệnh án
   const handleSaveNotes = () => {
      if (!selectedAppointment) return;
      if (!notes.trim()) {
         alert('Vui lòng nhập kết luận khám trước khi hoàn tất!');
         return;
      }

      completeAppointment(
         { id: selectedAppointment.id, notes },
         {
            onSuccess: () => {
               setSelectedAppointment(null); // Đóng Modal
               setNotes(''); // Xóa text cũ
            }
         }
      );
   };

   if (isLoading) return <div className="py-20 flex justify-center"><Spinner /></div>;

   return (
      <div className="p-8 md:p-12 animate-fade-in max-w-7xl mx-auto w-full relative">
         <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">Base Kho Dữ Liệu Bệnh Nhân Local</h1>

         <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10 overflow-hidden">
            {/* THANH TÌM KIẾM */}
            <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-8 mb-8">
               <div className="relative flex-1">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <input
                     type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Scan mã QR sổ hoặc gõ tên bệnh truy vết..."
                     className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-gray-900 outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all text-lg"
                  />
               </div>
               <button className="bg-gray-900 text-white font-black px-10 py-4 rounded-2xl hover:bg-gray-800 shadow-md hover:-translate-y-1 transition-all text-lg flex items-center">
                  Scan Database Mạng
               </button>
            </div>

            {/* LƯỚI DANH SÁCH BỆNH NHÂN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredPatients.length > 0 ? filteredPatients.map((app: any) => {
                  const appointmentDate = new Date(app.appointmentTime);
                  const isCompleted = app.status === 'COMPLETED';

                  return (
                     <div key={app.id} className={`border-2 rounded-[2rem] p-8 transition-all bg-white cursor-pointer group flex flex-col justify-between ${isCompleted ? 'border-green-100 hover:border-green-300' : 'border-gray-100 hover:border-primary-100 hover:shadow-2xl'}`}>
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(app.patientName)}&background=E5E7EB&color=4B5563`} className="w-16 h-16 rounded-[1rem] shadow-inner" alt="patient avatar" />
                              <div>
                                 <p className="font-black text-gray-900 text-xl group-hover:text-primary-600 transition-colors">BN {app.patientName}</p>
                                 <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-1">
                                    Mã Booking: #{app.id}
                                 </p>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-3 mb-8">
                           <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Thời gian Khám</p>
                              <p className="text-sm font-extrabold text-gray-700 flex items-center">
                                 <Clock className="w-5 h-5 mr-2 text-primary-400" />
                                 {appointmentDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {appointmentDate.toLocaleDateString('vi-VN')}
                              </p>
                           </div>

                           {/* Hiển thị triệu chứng bệnh nhân khai báo */}
                           {app.reason && (
                              <div className="px-4 py-3 bg-yellow-50 rounded-xl border border-yellow-100">
                                 <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">Triệu chứng khai báo</p>
                                 <p className="text-sm font-extrabold text-yellow-800 flex items-start">
                                    <SearchCode className="w-5 h-5 mr-2 text-yellow-500 shrink-0 mt-0.5" />
                                    <span className="line-clamp-2">{app.reason}</span>
                                 </p>
                              </div>
                           )}
                        </div>

                        {/* NÚT THAO TÁC */}
                        {isCompleted ? (
                           <div className="w-full bg-green-50 text-green-700 font-black py-4 border-2 border-green-200 rounded-xl flex justify-center items-center">
                              <FileText className="w-5 h-5 mr-2" /> Đã cập nhật hồ sơ
                           </div>
                        ) : (
                           <button
                              onClick={() => {
                                 setSelectedAppointment(app);
                                 setNotes('');
                              }}
                              className="w-full bg-white text-gray-700 font-black py-4 border-2 border-gray-200 rounded-xl group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-500 transition-all flex justify-center items-center"
                           >
                              Open Full File Bệnh Án <ChevronRight className="w-5 h-5 ml-2" />
                           </button>
                        )}
                     </div>
                  )
               }) : (
                  <div className="col-span-full py-12 text-center text-gray-500 font-bold text-xl">
                     Không tìm thấy hồ sơ bệnh nhân nào.
                  </div>
               )}
            </div>
         </div>

         {/* MODAL NHẬP BỆNH ÁN */}
         {selectedAppointment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4 animate-fade-in">
               <div className="bg-white rounded-[2rem] w-full max-w-2xl p-8 shadow-2xl animate-slide-up relative">
                  <button
                     onClick={() => setSelectedAppointment(null)}
                     className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors"
                  >
                     <X className="w-8 h-8" />
                  </button>

                  <h2 className="text-3xl font-black text-gray-900 mb-2">Hồ Sơ Điện Tử</h2>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-6">Bệnh nhân: {selectedAppointment.patientName} (Mã: #{selectedAppointment.id})</p>

                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6">
                     <span className="font-extrabold text-yellow-800 text-sm">Lời khai bệnh:</span>
                     <p className="text-yellow-900 font-medium mt-1">{selectedAppointment.reason || 'Bệnh nhân không ghi chú triệu chứng.'}</p>
                  </div>

                  <div className="mb-8">
                     <label className="block text-gray-900 font-extrabold mb-3 text-lg">Ghi chú chẩn đoán & Đơn thuốc (Node)</label>
                     <textarea
                        rows={6}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-5 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-primary-50 focus:border-primary-500 font-medium text-lg outline-none resize-none"
                        placeholder="Gõ chẩn đoán lâm sàng, tên thuốc cần cấp phát..."
                     />
                  </div>

                  <div className="flex justify-end gap-4">
                     <button
                        onClick={() => setSelectedAppointment(null)}
                        className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
                     >
                        Hủy bỏ
                     </button>
                     <button
                        disabled={isUpdating}
                        onClick={handleSaveNotes}
                        className="px-8 py-3 rounded-xl font-black text-white bg-primary-600 hover:bg-primary-700 shadow-lg disabled:opacity-50 flex items-center"
                     >
                        {isUpdating ? 'Đang lưu...' : 'Lưu File & Hoàn tất Ca Khám'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}
export default PatientsRecord;
