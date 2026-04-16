import React from 'react';
import { Download, FileText } from 'lucide-react';

const PatientHistoryPage = () => {
    return (
        <div className="p-8 md:p-12 animate-fade-in max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">Danh bạ Lịch Sử Chữa Bệnh Số</h1>
            
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-6 md:p-10">
               <div className="flex flex-col sm:flex-row justify-between mb-8 gap-4 border-b border-gray-100 pb-6">
                  <h3 className="font-extrabold text-2xl">Bảng Ghi log điện tử (Auto Backup)</h3>
                  <button className="bg-gray-100 text-gray-700 font-bold px-6 py-2 rounded-xl flex items-center hover:bg-gray-200 shadow-sm border border-gray-200"><Download className="w-4 h-4 mr-2"/> Tải Bản PDF Sao lưu Lịch Sử Ra Viện</button>
               </div>
               <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-100 font-black text-xs uppercase tracking-widest text-gray-500">
                        <tr>
                           <th className="p-6">Index Lệnh Data</th>
                           <th className="p-6">Thời Gian Lên Lịch</th>
                           <th className="p-6 text-center">Bác sĩ Móc Node</th>
                           <th className="p-6">Kết luận Auto NLP</th>
                           <th className="p-6 text-right">Chi Phí Hoá Đơn</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 font-medium bg-white">
                        {[
                           { id: '#BK-991', d: '10/10/2026', doc: 'PGS. TS Nguyễn Văn A (Tim Mạch)', n: 'Huyết áp bình thường. Đã ký nhận thuốc nội trú.', c: '0 ₫' },
                           { id: '#BK-882', d: '12/05/2026', doc: 'BS. Trần Ngọc C (Nha khoa RHM)', n: 'Cạo vôi răng siêu âm. Tẩy trắng men răng.', c: '1.200.000 ₫' },
                           { id: '#BK-115', d: '02/01/2026', doc: 'BS. Lê Trọng (Khoa Da liễu Dị ứng)', n: 'Khám ngoài giờ, cấp phát bôi trị liệu dự phòng.', c: '500.000 ₫' },
                        ].map(h => (
                           <tr key={h.id} className="hover:bg-primary-50/50 transition-colors">
                              <td className="p-6"><span className="bg-gray-100 text-gray-700 px-4 py-2 font-black rounded-lg border border-gray-200">{h.id}</span></td>
                              <td className="p-6 font-black text-gray-900">{h.d}</td>
                              <td className="p-6 text-primary-700 font-extrabold text-sm text-center"><span className="bg-primary-50 px-3 py-1.5 rounded">{h.doc}</span></td>
                              <td className="p-6 text-gray-500 text-sm max-w-[280px] break-words line-clamp-2">{h.n}</td>
                              <td className="p-6 text-right font-black text-gray-900 text-lg">{h.c}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
        </div>
    )
}
export default PatientHistoryPage;
