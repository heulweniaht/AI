import React from 'react';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

const DoctorApproval = () => {
   return (
      <div className="p-8 md:p-12 animate-fade-in w-full max-w-7xl mx-auto">
         <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">Duyệt Hồ Sơ Bác Sĩ Mới</h1>
         
         <div className="grid grid-cols-1 gap-6">
            <div className="bg-white border-l-8 border-l-yellow-400 rounded-3xl shadow-sm p-8 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-yellow-50 to-white">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <img src="https://ui-avatars.com/api/?name=Quang+Vinh&background=D1D5DB" className="w-20 h-20 rounded-[1.5rem] shadow-sm" />
                  <div>
                      <h3 className="text-2xl font-black text-gray-900 flex items-center">BS. Trần Quang Vinh <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded uppercase">Pending</span></h3>
                      <p className="text-gray-600 font-bold text-sm mt-2 mb-4">Chuyên khoa Xương Khớp - Bệnh viện Răng Hàm Mặt TW</p>
                      <div className="flex gap-3">
                          <button className="text-xs font-extrabold text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-lg flex items-center hover:bg-primary-100 hover:shadow-sm transition-all"><FileText className="w-4 h-4 mr-1.5"/> Bang_DaiHoc.pdf</button>
                          <button className="text-xs font-extrabold text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1.5 rounded-lg flex items-center hover:bg-primary-100 hover:shadow-sm transition-all"><FileText className="w-4 h-4 mr-1.5"/> ChungChi_HanhNghe.pdf</button>
                      </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6 md:mt-0">
                    <button className="px-6 py-3 border-2 border-red-100 bg-red-50 text-red-600 font-extrabold rounded-xl hover:bg-red-100 transition-colors flex items-center"><XCircle className="w-5 h-5 mr-2"/> Bỏ Cấp Phép</button>
                    <button className="px-8 py-3 bg-green-500 text-white font-black rounded-xl border border-green-600 hover:bg-green-600 shadow-md hover:shadow-lg transition-all flex items-center"><CheckCircle className="w-5 h-5 mr-2"/> Phê Duyệt Cấp Phép</button>
                </div>
            </div>
            
            <div className="bg-gray-50 rounded-3xl p-20 text-center text-gray-400 border-2 border-gray-200 border-dashed mt-4 flex flex-col items-center">
               <CheckCircle className="w-16 h-16 mb-4 text-gray-300" />
               <p className="font-extrabold text-xl">Inbox dọn rác xanh!</p>
               <p className="font-medium text-gray-500 mt-2">Toàn bộ hồ sơ ứng tuyển từ hệ thống Master đã được kiểm tra.</p>
            </div>
         </div>
      </div>
   )
}
export default DoctorApproval;
