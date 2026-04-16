import React from 'react';
import { Camera, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
    return (
        <div className="p-8 md:p-12 animate-fade-in max-w-5xl mx-auto w-full">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Khu vực Chỉnh Sửa Hồ Sơ Y Tế</h1>
            
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col md:flex-row gap-12">
               <div className="flex flex-col items-center shrink-0">
                  <div className="w-48 h-48 rounded-[2rem] border-[6px] border-gray-50 relative group overflow-hidden cursor-pointer shadow-xl mb-6">
                     <img src="https://ui-avatars.com/api/?name=Thai+Tr&background=0D8ABC&color=fff&size=200" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white flex-col backdrop-blur-sm">
                        <Camera className="w-10 h-10 mb-2" />
                        <span className="text-sm font-black uppercase tracking-widest">Đổi Hình Nền</span>
                     </div>
                  </div>
                  <p className="font-black text-2xl text-gray-900 uppercase">Trần Trọng Thái</p>
                  <p className="font-bold text-gray-500 bg-gray-100 px-4 py-1.5 rounded-lg mt-3 text-sm tracking-widest uppercase border border-gray-200">ID: PAT-84920A</p>
               </div>
               
               <div className="flex-1">
                  <h3 className="text-2xl font-black border-b border-gray-100 pb-4 mb-8 text-gray-900 flex justify-between items-center">
                     Data Khung Cơ Bản <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200">Đã đồng bộ hệ thống</span>
                  </h3>
                  <form className="space-y-8">
                     <div className="grid md:grid-cols-2 gap-8">
                        <div>
                           <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Họ và Tên chuẩn</label>
                           <input type="text" defaultValue="Trần Trọng Thái" className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 shadow-sm font-bold text-gray-900 outline-none text-lg transition-all" />
                        </div>
                        <div>
                           <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Chọn Giới Tính Sinh học</label>
                           <select className="w-full p-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-900 outline-none shadow-sm focus:border-primary-500 text-lg">
                              <option>Nam (Male)</option><option>Nữ (Female)</option><option>Bỏ Qua</option>
                           </select>
                        </div>
                     </div>
                     <div className="grid md:grid-cols-3 gap-8">
                        <div>
                           <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Nhóm máu</label>
                           <select className="w-full p-4 border-2 border-gray-200 rounded-2xl font-black text-red-600 outline-none focus:border-primary-500 text-lg bg-red-50"><option>O+</option><option>A</option><option>B</option><option>AB</option></select>
                        </div>
                        <div>
                           <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Nặng (Kg)</label>
                           <input type="number" defaultValue="70" className="w-full p-4 border-2 border-gray-200 rounded-2xl font-bold outline-none text-lg" />
                        </div>
                        <div>
                           <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Cao (cm)</label>
                           <input type="number" defaultValue="175" className="w-full p-4 border-2 border-gray-200 rounded-2xl font-bold outline-none text-lg" />
                        </div>
                     </div>
                     <div>
                           <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Bệnh Nền (nếu có để Bác sĩ lưu ý cực hạn)</label>
                           <textarea rows={4} className="w-full p-5 border-2 border-gray-200 rounded-2xl shadow-sm outline-none font-medium resize-none focus:border-primary-500 text-lg bg-yellow-50 focus:bg-white" defaultValue="Triệu chứng gan tự động, dị ứng kháng sinh loại NẶNG. Không được tự ý kê don có Amoxicillin!" />
                     </div>
                     
                     <div className="pt-6 border-t border-gray-100 flex mt-8">
                        <button type="button" className="px-10 py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black hover:-translate-y-1 transition-all flex items-center text-lg w-full md:w-auto justify-center">
                           <CheckCircle className="w-6 h-6 mr-3" /> Chốt Lưu Thay Đổi API
                        </button>
                     </div>
                  </form>
               </div>
            </div>
        </div>
    )
}
export default ProfilePage;
