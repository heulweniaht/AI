import React from 'react';
import { Search, MoreVertical, Mail, Calendar } from 'lucide-react';

const UserManagement = () => {
   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert('Thực hiện search via Enter key.');
   }
   return (
      <div className="p-8 md:p-12 animate-fade-in w-full max-w-7xl mx-auto">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Quản lý Tài Khoản</h1>
            <button className="bg-primary-600 text-white font-bold px-6 py-3 rounded-xl shadow hover:bg-primary-700 transition-colors">+ Thêm quyền mới</button>
         </div>

         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex gap-4 bg-gray-50/50">
               <form onSubmit={handleSubmit} className="relative w-96 max-w-full">
                  <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2"><Search className="text-gray-400 w-5 h-5 hover:text-primary-600"/></button>
                  <input type="text" placeholder="Tìm kiếm tài khoản (nhấn Enter)..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:shadow-sm font-medium transition-all" />
               </form>
               <select className="border border-gray-200 bg-white rounded-xl px-4 py-3 font-medium text-gray-600 outline-none">
                  <option>Tất cả Role</option>
                  <option>Bệnh nhân</option>
                  <option>Bác sĩ</option>
                  <option>Admin</option>
               </select>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-400 font-black tracking-widest">
                        <th className="p-5">Cá Nhân / Email</th>
                        <th className="p-5">Phân quyền</th>
                        <th className="p-5">Trạng thái Auth</th>
                        <th className="p-5">Ngày tạo</th>
                        <th className="p-5 text-center">Hành động</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                     {[1,2,3,4,5].map(id => (
                        <tr key={id} className="hover:bg-primary-50/30 transition-colors group">
                           <td className="p-5 flex items-center">
                              <img src={`https://ui-avatars.com/api/?name=User+${id}&background=random`} alt="avt" className="w-12 h-12 rounded-full mr-4 shadow-sm border border-gray-100" />
                              <div>
                                 <p className="font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors text-lg">Khách hàng số {id}</p>
                                 <p className="text-gray-500 text-sm font-bold flex items-center mt-1"><Mail className="w-3 h-3 mr-1.5"/> thaii.mail{id}@gmail.com</p>
                              </div>
                           </td>
                           <td className="p-5">
                              <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${id === 2 ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                 {id === 2 ? 'Doctor' : 'Patient'}
                              </span>
                           </td>
                           <td className="p-5">
                              <span className={`flex items-center text-sm font-black uppercase tracking-wider ${id === 4 ? 'text-red-600' : 'text-green-600'}`}>
                                  <div className={`w-2.5 h-2.5 rounded-full mr-2 shadow-sm ${id === 4 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                  {id === 4 ? 'Lock Banned' : 'Active'}
                              </span>
                           </td>
                           <td className="p-5">
                              <span className="flex items-center text-gray-600 font-bold text-sm">
                                 <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                 12/10/2026
                              </span>
                           </td>
                           <td className="p-5 text-center text-gray-400 cursor-pointer hover:text-gray-900">
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical className="w-6 h-6"/></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   )
}
export default UserManagement;
