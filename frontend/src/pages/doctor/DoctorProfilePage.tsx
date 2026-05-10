import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/store/authStore';
import { useDoctorDetail, useSpecialties, useUpdateDoctorProfile } from '@/hooks/useDoctors';
import { Spinner } from '@/components/common/Spinner';
import { CheckCircle, Camera, Stethoscope, MapPin, DollarSign, Award } from 'lucide-react';

const DoctorProfilePage = () => {
    const { user } = useAuthStore();
    const { data: doctor, isLoading } = useDoctorDetail(user?.id || 0);
    const { data: specialties } = useSpecialties();
    const { mutate: updateProfile, isPending } = useUpdateDoctorProfile();

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (doctor) {
            reset({
                fullName: doctor.fullName,
                clinicName: doctor.clinicName,
                clinicAddress: doctor.clinicAddress,
                clinicCity: doctor.clinicCity,
                consultationFee: doctor.consultationFee,
                experienceYears: doctor.experienceYears,
                bio: doctor.description,
                gender: doctor.gender,
                specialtyId: specialties?.find(s => s.name === doctor.specialtyName)?.id
            });
        }
    }, [doctor, reset, specialties]);

    const onSubmit = (data: any) => {
        updateProfile({
            id: user!.id,
            data: { ...data, consultationFee: Number(data.consultationFee), experienceYears: Number(data.experienceYears) }
        });
    };

    if (isLoading) return <div className="py-20 flex justify-center"><Spinner /></div>;

    return (
        <div className="p-8 md:p-12 animate-fade-in max-w-6xl mx-auto w-full">
            <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tight">Hồ Sơ Chuyên Môn Bác Sĩ</h1>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10 flex flex-col md:flex-row gap-12">
                {/* Avatar Section */}
                <div className="flex flex-col items-center shrink-0">
                    <div className="w-56 h-56 rounded-[2.5rem] border-[6px] border-primary-50 relative group overflow-hidden cursor-pointer shadow-xl mb-6">
                        <img
                            src={doctor?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor?.fullName || '')}&background=1565C0&color=fff&size=256`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            alt="Doctor Avatar"
                        />
                        <div className="absolute inset-0 bg-primary-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white flex-col backdrop-blur-sm">
                            <Camera className="w-10 h-10 mb-2" />
                            <span className="text-sm font-black uppercase">Đổi ảnh đại diện</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="font-black text-2xl text-gray-900">BS. {doctor?.fullName}</p>
                        <p className="text-primary-600 font-bold text-sm bg-primary-50 px-3 py-1 rounded-full mt-2 border border-primary-100 inline-block">
                            {doctor?.specialtyName}
                        </p>
                    </div>
                </div>

                {/* Form Section */}
                <form className="flex-1 space-y-8" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Họ và Tên</label>
                            <input {...register('fullName')} className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-primary-500 font-bold outline-none" />
                        </div>
                        <div>
                            <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Chuyên khoa</label>
                            <select {...register('specialtyId')} className="w-full p-4 border-2 border-gray-200 rounded-2xl font-bold bg-white outline-none cursor-pointer">
                                {specialties?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Kinh nghiệm (Năm)</label>
                            <div className="relative">
                                <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input type="number" {...register('experienceYears')} className="w-full pl-12 p-4 border-2 border-gray-200 rounded-2xl font-bold" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Phí khám (VND)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input type="number" {...register('consultationFee')} className="w-full pl-12 p-4 border-2 border-gray-200 rounded-2xl font-bold text-primary-700" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Giới tính</label>
                            <select {...register('gender')} className="w-full p-4 border-2 border-gray-200 rounded-2xl font-bold bg-white outline-none">
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-extrabold text-gray-900 block uppercase tracking-wider">Thông tin Phòng khám</label>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input {...register('clinicName')} placeholder="Tên phòng khám/bệnh viện" className="w-full p-4 border-2 border-gray-100 bg-gray-50 rounded-2xl font-bold" />
                            <input {...register('clinicCity')} placeholder="Thành phố" className="w-full p-4 border-2 border-gray-100 bg-gray-50 rounded-2xl font-bold" />
                        </div>
                        <input {...register('clinicAddress')} placeholder="Địa chỉ chi tiết" className="w-full p-4 border-2 border-gray-100 bg-gray-50 rounded-2xl font-bold" />
                    </div>

                    <div>
                        <label className="text-sm font-extrabold text-gray-900 block mb-3 uppercase tracking-wider">Giới thiệu bản thân & Tiểu sử</label>
                        <textarea rows={5} {...register('bio')} className="w-full p-5 border-2 border-gray-200 rounded-2xl font-medium resize-none focus:border-primary-500 text-lg transition-all" placeholder="Viết mô tả ngắn gọn về quá trình công tác và chuyên môn của bạn..." />
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex mt-8">
                        <button type="submit" disabled={isPending} className="px-10 py-5 bg-primary-600 text-white font-black rounded-2xl shadow-xl hover:bg-primary-700 hover:-translate-y-1 transition-all flex items-center text-lg w-full md:w-auto justify-center disabled:opacity-50">
                            {isPending ? 'Đang đồng bộ...' : <><CheckCircle className="w-6 h-6 mr-3" /> Chốt Lưu Thay Đổi Hồ Sơ</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorProfilePage;