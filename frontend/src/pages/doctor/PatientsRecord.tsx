import React from 'react';
import { Search, MapPin, SearchCode, ChevronRight } from 'lucide-react';

const PatientsRecord = () => {
    return (
        <div className="p-8 md:p-12 animate-fade-in max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">Base Kho Dữ Liệu Bệnh Nhân Local</h1>
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 md:p-10 overflow-hidden">
               <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-8 mb-8">
                  <div className="relative flex-1">
                     <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                     <input type="text" placeholder="Scan mã QR sổ hoặc gõ tên bệnh truy vết..." className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-gray-900 outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-500 transition-all text-lg" />
                  </div>
                  <button className="bg-gray-900 text-white font-black px-10 py-4 rounded-2xl hover:bg-gray-800 shadow-md hover:-translate-y-1 transition-all text-lg flex items-center">Scan Database Mạng</button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1,2,3,4,5,6].map(i => (
                     <div key={i} className="border-2 border-gray-100 rounded-[2rem] p-8 hover:shadow-2xl transition-all bg-white hover:border-primary-100 cursor-pointer group flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-4">
                              <img src={`https://ui-avatars.com/api/?name=Khach+${i}&background=E5E7EB&color=4B5563`} className="w-16 h-16 rounded-[1rem] shadow-inner" />
                              <div>
                                 <p className="font-black text-gray-900 text-xl group-hover:text-primary-600 transition-colors">BN Nguyễn Đăng User {i}</p>
                                 <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-1">Nam • SN 1998 • HN</p>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-3 mb-8">
                           <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mã bệnh án Cũ nhất (Node Index)</p>
                             <p className="text-sm font-extrabold text-gray-700 flex items-center"><SearchCode className="w-5 h-5 mr-2 text-primary-400" /> Ngày 10/10/2026</p>
                           </div>
                           <div className="px-4 py-3 bg-yellow-50 rounded-xl border border-yellow-100">
                             <p className="text-xs font-bold text-yellow-600 uppercase tracking-widest mb-1">Cảnh báo Auto</p>
                             <p className="text-sm font-extrabold text-yellow-800 flex items-center"><MapPin className="w-5 h-5 mr-2 text-yellow-500" /> Dị ứng Penicilin mức Nhẹ</p>
                           </div>
                        </div>
                        <button className="w-full bg-white text-gray-700 font-black py-4 border-2 border-gray-200 rounded-xl group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-500 transition-all flex justify-center items-center">Open Full File Bệnh Án <ChevronRight className="w-5 h-5 ml-2"/></button>
                     </div>
                  ))}
               </div>
            </div>
        </div>
    )
}
export default PatientsRecord;
