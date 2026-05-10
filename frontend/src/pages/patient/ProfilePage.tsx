import React, { useEffect } from 'react';
import { Camera, CheckCircle, MapPin, PhoneCall, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { usePatientProfile, useUpdateProfile } from '@/hooks/useAuth';
import { Spinner } from '@/components/common/Spinner';

interface ProfileFormValues {
   fullName: string;
   gender: string;
   bloodType: string;
   weight: number | string;
   height: number | string;
   medicalHistory: string;
   dateOfBirth: string;
   address: string;
   emergencyContact: string;
}

const ProfilePage = () => {
   const { user } = useAuthStore();
   const { data: profileData, isLoading: isProfileLoading } = usePatientProfile();
   const { mutate: updateProfile, isPending } = useUpdateProfile();
   const { register, handleSubmit, reset } = useForm<ProfileFormValues>();

   useEffect(() => {
      if (profileData) {
         reset({
            fullName: profileData.fullName || user?.fullName || '',
            gender: profileData.gender || 'MALE',
            bloodType: profileData.bloodType || 'O+',
            weight: profileData.weight || '', // Nếu chưa có thì để trống
            height: profileData.height || '', // Nếu chưa có thì để trống
            medicalHistory: profileData.allergies || '',
            dateOfBirth: profileData.dateOfBirth || '',
            address: profileData.address || '',
            emergencyContact: profileData.emergencyContact || ''
         });
      }
   }, [profileData, user, reset]);

   const onSubmit = (data: ProfileFormValues) => {
      updateProfile({
         ...data,
         weight: Number(data.weight),
         height: Number(data.height),
         allergies: data.medicalHistory
      });
   };

   if (isProfileLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

   const displayId = user ? `BN-${user.id.toString().padStart(5, '0')}` : 'GUEST-00000';

   return (
      <div className="p-8 md:p-12 animate-fade-in max-w-5xl mx-auto w-full">
         <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Cập Nhật Hồ Sơ Y Tế</h1>

         <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col md:flex-row gap-12">
            {/* LEFT COLUMN: AVATAR */}
            <div className="flex flex-col items-center shrink-0">
               <div className="w-48 h-48 rounded-[2rem] border-[6px] border-gray-50 relative group overflow-hidden shadow-xl mb-6">
                  <img
                     src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0D8ABC&color=fff&size=200`}
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                     alt="Avatar"
                  />
                  <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white flex-col backdrop-blur-sm">
                     <Camera className="w-10 h-10 mb-2" />
                     <span className="text-sm font-black uppercase">Đổi Ảnh</span>
                  </div>
               </div>
               <p className="font-black text-xl text-gray-900 text-center">{user?.fullName}</p>
               <span className="mt-2 px-4 py-1.5 bg-gray-100 rounded-lg text-xs font-bold tracking-widest text-gray-500 border border-gray-200">ID: {displayId}</span>
               {user?.lastLoginAt && (
                  <p className="mt-4 text-[10px] text-gray-400 italic">Đăng nhập lần cuối: {new Date(user.lastLoginAt).toLocaleString('vi-VN')}</p>
               )}
            </div>

            {/* RIGHT COLUMN: FORM */}
            <div className="flex-1">
               <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid md:grid-cols-2 gap-6">
                     <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Họ và Tên</label>
                        <input {...register('fullName')} className="w-full p-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-primary-500 outline-none transition-all" />
                     </div>
                     <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Ngày sinh</label>
                        <div className="relative">
                           <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                           <input type="date" {...register('dateOfBirth')} className="w-full pl-12 p-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-primary-500 outline-none" />
                        </div>
                     </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                     <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Giới tính</label>
                        <select {...register('gender')} className="w-full p-4 border-2 border-gray-100 rounded-2xl font-bold bg-white outline-none">
                           <option value="MALE">Nam</option>
                           <option value="FEMALE">Nữ</option>
                           <option value="OTHER">Khác</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Nhóm máu</label>
                        <select {...register('bloodType')} className="w-full p-4 border-2 border-red-50 rounded-2xl font-black text-red-600 bg-red-50 outline-none">
                           <option value="O+">O+</option>
                           <option value="A">A</option>
                           <option value="B">B</option>
                           <option value="AB">AB</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Liên hệ khẩn cấp</label>
                        <div className="relative">
                           <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                           <input {...register('emergencyContact')} placeholder="Số điện thoại người thân" className="w-full pl-12 p-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-primary-500 outline-none" />
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Địa chỉ cư trú</label>
                     <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input {...register('address')} placeholder="Số nhà, tên đường, Phường/Xã..." className="w-full pl-12 p-4 border-2 border-gray-100 rounded-2xl font-bold focus:border-primary-500 outline-none" />
                     </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Cân nặng (kg)</label>
                        <input type="number" {...register('weight')} className="w-full p-4 border-2 border-gray-100 rounded-2xl font-bold outline-none" />
                     </div>
                     <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Chiều cao (cm)</label>
                        <input type="number" {...register('height')} className="w-full p-4 border-2 border-gray-100 rounded-2xl font-bold outline-none" />
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-black uppercase text-gray-400 mb-2 block">Tiền sử bệnh nền</label>
                     <textarea rows={3} {...register('medicalHistory')} className="w-full p-5 border-2 border-gray-100 rounded-2xl font-medium resize-none bg-yellow-50/30 focus:bg-white transition-all outline-none" placeholder="Dị ứng thuốc, bệnh mãn tính..." />
                  </div>

                  <div className="pt-6 border-t border-gray-100">
                     <button type="submit" disabled={isPending} className="px-10 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center w-full md:w-auto disabled:opacity-50">
                        {isPending ? 'Đang đồng bộ...' : <><CheckCircle className="w-5 h-5 mr-3" /> Lưu thay đổi hồ sơ</>}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default ProfilePage;