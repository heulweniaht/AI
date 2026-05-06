import React, { useState } from 'react';
import { Search, Mail, Calendar, Lock, Unlock, MoreVertical, Trash2 } from 'lucide-react';
import { useAdminUsers, useToggleUserStatus, useDeleteUser } from '@/hooks/useAdmin';
import { Spinner } from '@/components/common/Spinner';

const UserManagement = () => {
   const [keyword, setKeyword] = useState('');
   const [role, setRole] = useState('');
   const [page, setPage] = useState(0);
   // State để quản lý menu 3 chấm nào đang mở
   const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

   const { data: usersData, isLoading } = useAdminUsers({ keyword, role, page, size: 10 });
   const { mutate: toggleStatus, isPending: isToggling } = useToggleUserStatus();
   const { mutate: deleteUser } = useDeleteUser(); // Hook xóa tài khoản

   const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      setPage(0);
   };

   const handleDeleteUser = (id: number, name: string) => {
      if (window.confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của ${name}? Hành động này không thể hoàn tác!`)) {
         deleteUser(id);
      }
      setOpenDropdownId(null);
   };

   const getRoleStyle = (userRole: string) => {
      if (userRole === 'ADMIN') return 'bg-orange-50 text-orange-700 border-orange-200';
      if (userRole === 'DOCTOR') return 'bg-purple-50 text-purple-700 border-purple-200';
      return 'bg-blue-50 text-blue-700 border-blue-200';
   };

   // Hàm render trạng thái chuẩn theo Database
   const renderStatus = (status: string) => {
      if (status === 'ACTIVE') {
         return (
            <span className="flex items-center text-sm font-black uppercase tracking-wider text-green-600">
               <div className="w-2.5 h-2.5 rounded-full mr-2 shadow-sm bg-green-500"></div>HOẠT ĐỘNG
            </span>
         );
      }
      if (status === 'PENDING_VERIFY') {
         return (
            <span className="flex items-center text-sm font-black uppercase tracking-wider text-yellow-600">
               <div className="w-2.5 h-2.5 rounded-full mr-2 shadow-sm bg-yellow-500"></div>CHỜ DUYỆT / OTP
            </span>
         );
      }
      return (
         <span className="flex items-center text-sm font-black uppercase tracking-wider text-red-600">
            <div className="w-2.5 h-2.5 rounded-full mr-2 shadow-sm bg-red-500"></div>BỊ KHÓA
         </span>
      );
   };

   return (
      <div className="p-8 md:p-12 animate-fade-in w-full max-w-7xl mx-auto">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Quản lý Tài Khoản</h1>
            <button className="bg-primary-600 text-white font-bold px-6 py-3 rounded-xl shadow hover:bg-primary-700 transition-colors">
               + Thêm quyền mới
            </button>
         </div>

         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 bg-gray-50/50">
               <form onSubmit={handleSearch} className="relative w-full sm:w-96">
                  <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                     <Search className="text-gray-400 w-5 h-5 hover:text-primary-600" />
                  </button>
                  <input
                     type="text"
                     value={keyword}
                     onChange={(e) => setKeyword(e.target.value)}
                     placeholder="Tìm kiếm email, tên (nhấn Enter)..."
                     className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:shadow-sm font-medium transition-all"
                  />
               </form>
               <select
                  value={role}
                  onChange={(e) => {
                     setRole(e.target.value);
                     setPage(0);
                  }}
                  className="border border-gray-200 bg-white rounded-xl px-4 py-3 font-medium text-gray-600 outline-none w-full sm:w-auto cursor-pointer"
               >
                  <option value="">Tất cả Role</option>
                  <option value="PATIENT">Bệnh nhân</option>
                  <option value="DOCTOR">Bác sĩ</option>
                  <option value="ADMIN">Admin</option>
               </select>
            </div>

            {isLoading ? (
               <div className="py-20 flex justify-center"><Spinner /></div>
            ) : (
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
                        {usersData?.content && usersData.content.length > 0 ? (
                           usersData.content.map((user: any) => (
                              <tr key={user.id} className={`hover:bg-primary-50/30 transition-colors group ${user.status === 'BANNED' ? 'opacity-70 bg-gray-50' : ''}`}>
                                 <td className="p-5 flex items-center">
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=random`} alt="avt" className={`w-12 h-12 rounded-full mr-4 shadow-sm border border-gray-100 ${user.status === 'BANNED' ? 'grayscale' : ''}`} />
                                    <div>
                                       <p className="font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors text-lg">
                                          {user.fullName}
                                       </p>
                                       <p className="text-gray-500 text-sm font-bold flex items-center mt-1">
                                          <Mail className="w-3 h-3 mr-1.5" /> {user.email}
                                       </p>
                                    </div>
                                 </td>
                                 <td className="p-5">
                                    <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${getRoleStyle(user.role)}`}>
                                       {user.role}
                                    </span>
                                 </td>
                                 <td className="p-5">
                                    {/* Render đúng status từ Backend trả về */}
                                    {renderStatus(user.status)}
                                 </td>
                                 <td className="p-5">
                                    <span className="flex items-center text-gray-600 font-bold text-sm">
                                       <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                       {new Date(user.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                                    </span>
                                 </td>
                                 <td className="p-5 flex justify-center items-center gap-2 relative">

                                    {/* Nút Khóa / Mở khóa Tài khoản dựa vào status */}
                                    <button
                                       disabled={isToggling}
                                       onClick={() => {
                                          // Nếu đang BANNED thì truyền isLocked = false (để mở)
                                          // Ngược lại truyền isLocked = true (để khóa)
                                          toggleStatus({ id: user.id, isLocked: user.status !== 'BANNED' })
                                       }}
                                       title={user.status === 'BANNED' ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                                       className={`p-2 rounded-lg transition-colors border ${user.status === 'BANNED' ? 'text-green-600 border-green-200 bg-green-50 hover:bg-green-100' : 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100'} disabled:opacity-50`}
                                    >
                                       {user.status === 'BANNED' ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                    </button>

                                    {/* Menu 3 chấm và Nút Xóa */}
                                    <div className="relative">
                                       <button
                                          onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                                          className="p-2 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-lg transition-colors"
                                       >
                                          <MoreVertical className="w-5 h-5" />
                                       </button>

                                       {openDropdownId === user.id && (
                                          <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fade-in overflow-hidden">
                                             <button
                                                onClick={() => handleDeleteUser(user.id, user.fullName)}
                                                className="w-full text-left px-4 py-3 text-sm text-red-600 font-bold hover:bg-red-50 flex items-center"
                                             >
                                                <Trash2 className="w-4 h-4 mr-2" /> Xóa tài khoản
                                             </button>
                                          </div>
                                       )}
                                    </div>

                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">
                                 Không tìm thấy tài khoản nào khớp với bộ lọc.
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            )}

            {(usersData?.totalPages ?? 0) > 1 && (
               <div className="flex justify-between items-center p-6 border-t border-gray-100 bg-gray-50/50">
                  <span className="text-sm font-bold text-gray-500">
                     Trang {page + 1} / {usersData?.totalPages}
                  </span>
                  <div className="flex space-x-2">
                     <button
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-50"
                     >
                        Trước
                     </button>
                     <button
                        disabled={usersData?.last}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 border border-gray-200 bg-white rounded-lg text-gray-700 font-bold hover:bg-gray-100 disabled:opacity-50"
                     >
                        Sau
                     </button>
                  </div>
               </div>
            )}
         </div>
      </div>
   )
}

export default UserManagement;