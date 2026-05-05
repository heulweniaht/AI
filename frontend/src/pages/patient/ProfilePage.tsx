import React, { useEffect } from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { useUpdateProfile } from '@/hooks/useAuth';

// Interface hứng dữ liệu form
interface ProfileFormValues {
   fullName: string;
   gender: string;
   bloodType: string;
   weight: number;
   height: number;
   medicalHistory: string;
}

const ProfilePage = () => {
   // 1. Lấy thông tin user hiện tại từ Zustand
   const { user } = useAuthStore();

   // 2. Lấy hook gọi API cập nhật
   const { mutate: updateProfile, isPending } = useUpdateProfile();

   // 3. Khởi tạo Hook Form
   const { register, handleSubmit, reset } = useForm<ProfileFormValues>({
      defaultValues: {
         fullName: '',
         gender: 'MALE',
         bloodType: 'O+',
         weight: 0,
         height: 0,
         medicalHistory: ''
      }
   });

   // Điền dữ liệu thật của user vào Form khi component mount
   useEffect(() => {
      if (user) {
         reset({
            fullName: user.fullName || '',
            // Giả định backend trả về các thông số này (Nếu backend chưa có, form sẽ lấy default)
            gender: (user as any).gender || 'MALE',
            bloodType: (user as any).bloodType || 'O+',
            weight: (user as any).weight || 70,
            height: (user as any).height || 175,
            medicalHistory: (user as any).medicalHistory || ''
         });
      }
   }, [user, reset]);

   // 4. Xử lý khi ấn nút Submit
   const onSubmit = (data: ProfileFormValues) => {
      // Ép kiểu dữ liệu số cho an toàn trước khi gửi
      updateProfile({
         ...data,
         weight: Number(data.weight),
         height: Number(data.height)
      });
   };

   // Tiện ích tạo ID ngắn gọn hiển thị
   const displayId = user ? `${user.role.substring(0, 3).toUpperCase()}-${user.id.toString().padStart(5, '0')}` : 'GUEST-00000';

   return (
      <div className="p-8 md:p-12 animate-fade-in max-w-5xl mx-auto w-full">
         <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Khu vực Chỉnh Sửa Hồ Sơ Y Tế</h1>

         <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col md:flex-row gap-12">

            {/* CỘT TRÁI: AVATAR & THÔNG TIN CƠ BẢN */}
            <div className="flex flex-col items-center shrink-0">
               <div className="w-48 h-48 rounded-[2rem] border-[6px] border-gray-50 relative group overflow-hidden cursor-pointer shadow-xl mb-6">
                  <img
                     src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0D8ABC&color=fff&size=200`}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                     alt="Avatar"
                  />
                  <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white flex-col backdrop-blur-sm">
                     <Camera className="w-10 h-10 mb-2" />
                     <span className="text-sm font-black uppercase tracking-widest">Đổi Hình Nền</span>
                  </div>
               </div>
               <p className="font-black text-2xl text-gray-900 uppercase text-center">{user?.fullName || 'Tên người dùng'}</p>
               <p className="font-bold text-gray-500 bg-gray-100 px-4 py-1.5 rounded-lg mt-3 text-sm tracking-widest uppercase border border-gray-200">
                  ID: {displayId}
               </p>
               <p className="font-bold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-lg mt-2 text-xs tracking-widest uppercase border border-primary-100">
                  Quyền: {user?.role}
               </p>
            </div>

            {/* CỘT PHẢI: FORM CẬP NHẬT */}
            <div className="flex-1">
               <h3 className="text-2xl font-black border-b border-gray-100 pb-4 mb-8 text-gray-900 flex justify-between items-center">
                  Data Khung Cơ Bản
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full border border-green-200 hidden sm:inline-block">Đã đồng bộ hệ thống</span>
               </h3>

               <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div>
                        <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Họ và Tên chuẩn</label>
                        <input
                           type="text"
                           {...register('fullName', { required: true })}
                           className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary-500 shadow-sm font-bold text-gray-900 outline-none text-lg transition-all"
                        />
                     </div>
                     <div>
                        <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Chọn Giới Tính Sinh học</label>
                        <select
                           {...register('gender')}
                           className="w-full p-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-900 outline-none shadow-sm focus:border-primary-500 text-lg cursor-pointer bg-white"
                        >
                           <option value="MALE">Nam (Male)</option>
                           <option value="FEMALE">Nữ (Female)</option>
                           <option value="OTHER">Bỏ Qua / Khác</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                     <div>
                        <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Nhóm máu</label>
                        <select
                           {...register('bloodType')}
                           className="w-full p-4 border-2 border-gray-200 rounded-2xl font-black text-red-600 outline-none focus:border-primary-500 text-lg bg-red-50 cursor-pointer"
                        >
                           <option value="O+">O+</option>
                           <option value="A">A</option>
                           <option value="B">B</option>
                           <option value="AB">AB</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Nặng (Kg)</label>
                        <input
                           type="number"
                           {...register('weight')}
                           className="w-full p-4 border-2 border-gray-200 rounded-2xl font-bold outline-none focus:border-primary-500 text-lg"
                        />
                     </div>
                     <div>
                        <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Cao (cm)</label>
                        <input
                           type="number"
                           {...register('height')}
                           className="w-full p-4 border-2 border-gray-200 rounded-2xl font-bold outline-none focus:border-primary-500 text-lg"
                        />
                     </div>
                  </div>

                  <div>
                     <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Bệnh Nền (nếu có để Bác sĩ lưu ý cực hạn)</label>
                     <textarea
                        rows={4}
                        {...register('medicalHistory')}
                        className="w-full p-5 border-2 border-gray-200 rounded-2xl shadow-sm outline-none font-medium resize-none focus:border-primary-500 text-lg bg-yellow-50 focus:bg-white transition-colors"
                        placeholder="Ví dụ: Dị ứng Penicillin, Huyết áp cao..."
                     />
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex mt-8">
                     <button
                        type="submit"
                        disabled={isPending}
                        className="px-10 py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black hover:-translate-y-1 transition-all flex items-center text-lg w-full md:w-auto justify-center disabled:opacity-50 disabled:hover:translate-y-0"
                     >
                        {isPending ? (
                           <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              Đang đồng bộ...
                           </span>
                        ) : (
                           <>
                              <CheckCircle className="w-6 h-6 mr-3" /> Chốt Lưu Thay Đổi API
                           </>
                        )}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   )
}

export default ProfilePage;