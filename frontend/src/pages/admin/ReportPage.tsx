import React from 'react';
import { DownloadCloud, FileText } from 'lucide-react';

const ReportPage = () => {
    return (
       <div className="p-8 md:p-12 animate-fade-in w-full max-w-7xl mx-auto">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Xuất Data Báo Cáo (.XLSX)</h1>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {['Báo cáo Doanh thu Tháng 10', 'Thống kê Lượt Khám Cả Năm KPIs', 'Xuất File Data Bác sĩ Bất thường'].map((rp, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col justify-between">
                    <div>
                        <div className="w-16 h-16 bg-primary-50 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileText className="w-8 h-8 text-primary-600" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight">{rp}</h3>
                        <p className="text-gray-500 font-medium text-base mb-8 leading-relaxed">System Data Node tự động tổng hợp File định dạng Excel gốc từ Microservices để report.</p>
                    </div>
                    <button className="w-full flex justify-center items-center py-4 rounded-xl border-[3px] border-primary-100 text-primary-700 font-black text-lg hover:bg-primary-50 hover:border-primary-200 transition-colors shadow-sm">
                       <DownloadCloud className="w-6 h-6 mr-2"/> Download Báo cáo
                    </button>
                </div>
            ))}

         </div>
       </div>
    )
}
export default ReportPage;
