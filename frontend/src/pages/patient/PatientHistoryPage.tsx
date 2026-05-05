import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { useMyAppointments } from '@/hooks/useAppointments';
import { Spinner } from '@/components/common/Spinner';

const PatientHistoryPage = () => {
   // 1. Phân trang và lấy dữ liệu API
   const [page, setPage] = useState(0);
   // Lấy 10 lịch khám mỗi trang, sắp xếp theo thời gian mới nhất
   const { data: historyData, isLoading } = useMyAppointments({ page, size: 10, sort: 'appointmentTime.desc' });

   //Format dữ liệu
   const formatMoney = (amount: number) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
   }
   return (
      <div className="p-8 md:p-12 animate-fade-in max-w-7xl mx-auto w-full">
         <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">Danh bạ Lịch Sử Chữa Bệnh Số</h1>

         <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-6 md:p-10">
            <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
               <h3 className="font-extrabold text-2xl">Bảng Ghi log điện tử (Auto Backup)</h3>
               <button className="bg-gray-100 text-gray-700 font-bold px-6 py-2 rounded-xl flex items-center hover:bg-gray-200 shadow-sm border border-gray-200">
                  <Download className="w-4 h-4 mr-2" /> Tải Bản PDF Sao lưu
               </button>
            </div>

            {isLoading ? (
               <div className="py-20 flex justify-center"><Spinner /></div>
            ) : historyData?.content.length === 0 ? (
               <div className="py-20 text-center text-gray-500 font-bold">
                  <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  Chưa có dữ liệu lịch sử khám bệnh nào.
               </div>
            ) : (
               <>
                  <div className="overflow-x-auto rounded-2xl border border-gray-100">
                     <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 font-black text-xs uppercase tracking-widest text-gray-500">
                           <tr>
                              <th className="p-6">Mã Booking</th>
                              <th className="p-6">Thời Gian Lên Lịch</th>
                              <th className="p-6 text-center">Bác sĩ Móc Node</th>
                              <th className="p-6">Trạng thái / Lý do khám</th>
                              <th className="p-6 text-right">Chi Phí Hoá Đơn</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium bg-white">
                           {historyData?.content.map(appointment => (
                              <tr key={appointment.id} className="hover:bg-primary-50/50 transition-colors">
                                 <td className="p-6">
                                    <span className="bg-gray-100 text-gray-700 px-4 py-2 font-black rounded-lg border border-gray-200">
                                       #{appointment.id}
                                    </span>
                                 </td>
                                 <td className="p-6 font-black text-gray-900">
                                    {new Date(appointment.appointmentTime).toLocaleString('vi-VN')}
                                 </td>
                                 <td className="p-6 text-primary-700 font-extrabold text-sm text-center">
                                    <span className="bg-primary-50 px-3 py-1.5 rounded block whitespace-nowrap">
                                       BS. {appointment.doctorName}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium mt-1 block">
                                       ({appointment.specialtyName})
                                    </span>
                                 </td>
                                 <td className="p-6 text-gray-500 text-sm max-w-[280px]">
                                    {/* Hiển thị Trạng thái */}
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold mb-2
                                                    ${appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                          appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                             'bg-yellow-100 text-yellow-700'}`}>
                                       {appointment.status}
                                    </span>
                                    {/* Hiển thị lý do khám, có truncate nếu dài */}
                                    <div className="break-words line-clamp-2" title={appointment.reason}>
                                       {appointment.reason || "Không ghi chú"}
                                    </div>
                                    {/* Nếu có ghi chú của bác sĩ sau khi khám xong */}
                                    {appointment.doctorNotes && (
                                       <div className="text-primary-600 mt-1 font-bold">BS: {appointment.doctorNotes}</div>
                                    )}
                                 </td>
                                 <td className="p-6 text-right font-black text-gray-900 text-lg">
                                    {/* Mặc định lấy phí tư vấn của BS hoặc fix cứng một mức. Vì object Appointment không lưu thẳng phí, ta có thể hiển thị trạng thái thanh toán */}
                                    {appointment.status === 'COMPLETED' ? 'Đã thu tiền' : '---'}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Phân trang History */}
                  {(historyData?.totalPages ?? 0) > 1 && (
                     <div className="flex justify-between items-center mt-8 px-4">
                        <span className="text-sm font-bold text-gray-500">
                           Trang {page + 1} trên {historyData?.totalPages}
                        </span>
                        <div className="flex space-x-2">
                           <button
                              disabled={page === 0}
                              onClick={() => setPage(p => p - 1)}
                              className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50"
                           >
                              Trang trước
                           </button>
                           <button
                              disabled={historyData?.last}
                              onClick={() => setPage(p => p + 1)}
                              className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-50"
                           >
                              Trang sau
                           </button>
                        </div>
                     </div>
                  )}
               </>
            )}
         </div>
      </div>
   )
}
export default PatientHistoryPage;
