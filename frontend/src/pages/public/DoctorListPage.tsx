import React, { useState } from 'react';
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDoctors, useSpecialties } from '@/hooks/useDoctors';
import type { DoctorSearchFilter } from '@/types/doctor.types';
import { Spinner } from '@/components/common/Spinner';
const DoctorListPage = () => {
   const navigate = useNavigate();

   // 1. Quản lý trạng thái bộ lọc (Filter) và Trang hiện tại (Page)
   const [filter, setFilter] = useState<DoctorSearchFilter>({});
   const [page, setPage] = useState(0);

   // 2. Gọi Hook lấy dữ liệu Bác Sĩ từ Backend
   const {
      data: doctorData,
      isLoading: isDoctorsLoading,
      isError: isDoctorsError
   } = useDoctors(filter, { page, size: 10, sort: filter.sort });

   // 3. Gọi Hook lấy danh sách Chuyên khoa
   const { data: specialties } = useSpecialties();

   // Xử lý khi chọn/bỏ chọn chuyên khoa
   const handleSpecialtyChange = (specialtyId: number) => {
      setFilter((prev) => ({
         ...prev,
         // Nếu bấm lại chính nó thì hủy lọc, nếu bấm cái khác thì lọc theo cái mới
         specialtyId: prev.specialtyId === specialtyId ? undefined : specialtyId
      }));
      setPage(0); // Luôn về trang 1 khi đổi bộ lọc
   };

   // Xử lý khi xóa tất cả bộ lọc
   const handleClearFilters = () => {
      setFilter({});
      setPage(0);
   };

   return (
      <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 animate-fade-in">

            {/* 
            SIDEBAR: BỘ LỌC (FILTER)
        */}
            <div className="w-full md:w-1/4">
               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="font-extrabold text-lg flex items-center"><Filter className="w-5 h-5 mr-2" /> Bộ Lọc</h3>
                     <button
                        onClick={handleClearFilters}
                        className="text-sm text-primary-600 font-bold hover:underline"
                     >
                        Xóa tất cả
                     </button>
                  </div>

                  <div className="space-y-6">
                     {/* Lọc theo Tên */}
                     <div>
                        <label className="font-bold text-gray-900 block mb-3">Tìm kiếm</label>
                        <input
                           type="text"
                           placeholder="Tên bác sĩ..."
                           value={filter.keyword || ''}
                           onChange={(e) => {
                              setFilter(prev => ({ ...prev, keyword: e.target.value }));
                              setPage(0);
                           }}
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 font-medium outline-none transition-colors"
                        />
                     </div>

                     {/* Lọc theo Chuyên khoa (Dữ liệu thật) */}
                     <div>
                        <label className="font-bold text-gray-900 block mb-3">Chuyên khoa</label>
                        {specialties?.map(s => (
                           <div key={s.id} className="flex items-center mb-3">
                              <input
                                 type="checkbox"
                                 checked={filter.specialtyId === s.id}
                                 onChange={() => handleSpecialtyChange(s.id)}
                                 className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer"
                              />
                              <span className="ml-3 text-gray-700 font-medium cursor-pointer" onClick={() => handleSpecialtyChange(s.id)}>
                                 {s.name}
                              </span>
                           </div>
                        ))}
                     </div>

                     {/* Lọc theo Đánh giá tối thiểu */}
                     <div>
                        <label className="font-bold text-gray-900 block mb-3">Đánh giá tối thiểu</label>
                        <div className="flex space-x-2">
                           {[4, 4.5, 5].map(r => (
                              <button
                                 key={r}
                                 onClick={() => {
                                    setFilter(prev => ({ ...prev, minRating: prev.minRating === r ? undefined : r }));
                                    setPage(0);
                                 }}
                                 className={`flex-1 py-2 border-2 rounded-xl text-sm font-bold transition-colors
                        ${filter.minRating === r ? 'bg-primary-100 border-primary-400 text-primary-800' : 'border-gray-100 bg-gray-50 hover:bg-primary-50 hover:border-primary-200 text-gray-700'}`}
                              >
                                 {r}★
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* 
            MAIN: DANH SÁCH BÁC SĨ
             */}
            <div className="w-full md:w-3/4">
               <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <p className="text-gray-600 font-medium">Tìm thấy <span className="font-extrabold text-gray-900 text-lg">{doctorData?.totalElements || 0}</span> Bác sĩ</p>
                  <select
                     value={filter.sort || ''}
                     onChange={(e) => setFilter(prev => ({ ...prev, sort: e.target.value }))}
                     className="bg-gray-50 border-2 border-gray-100 text-gray-700 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3 font-bold cursor-pointer outline-none"
                  >
                     <option value="">Sắp xếp mặc định</option>
                     <option value="ratingAvg,desc">Đánh giá cao nhất</option>
                     <option value="consultationFee,asc">Giá khám từ thấp đến cao</option>
                     <option value="experienceYears,desc">Nhiều kinh nghiệm nhất</option>
                  </select>
               </div>

               {/* Xử lý Trạng thái Đang tải hoặc Lỗi */}
               {isDoctorsLoading ? (
                  <div className="flex justify-center py-20">
                     <Spinner />
                  </div>
               ) : isDoctorsError ? (
                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center text-red-600 font-medium">
                     Không thể tải danh sách bác sĩ. Vui lòng tải lại trang.
                  </div>
               ) : doctorData?.content.length === 0 ? (
                  <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
                     <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                     <h3 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy bác sĩ nào!</h3>
                     <p className="text-gray-500">Hãy thử thay đổi tiêu chí bộ lọc của bạn.</p>
                  </div>
               ) : (
                  <div className="space-y-6">
                     {doctorData?.content.map(doctor => (
                        <div key={doctor.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col md:flex-row gap-8 group">

                           {/* Ảnh Bác sĩ */}
                           <div className="relative overflow-hidden rounded-2xl md:w-56 h-56 shrink-0">
                              <img
                                 src={doctor.avatarUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop"}
                                 alt={doctor.fullName}
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                           </div>

                           {/* Thông tin Bác sĩ */}
                           <div className="flex-1 flex flex-col">
                              <div className="flex justify-between items-start mb-2">
                                 <div>
                                    <h3
                                       className="text-2xl font-extrabold text-gray-900 hover:text-primary-600 cursor-pointer transition-colors"
                                       onClick={() => navigate(`/doctors/${doctor.id}`)}
                                    >
                                       {doctor.fullName}
                                    </h3>
                                    <p className="text-primary-600 font-extrabold mb-2 uppercase tracking-wide text-sm">
                                       {doctor.specialtyName}
                                    </p>
                                 </div>
                                 <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                    <span className="font-extrabold text-gray-900">{doctor.ratingAvg ? doctor.ratingAvg.toFixed(1) : "Chưa có"}</span>
                                    <span className="text-gray-500 ml-1 text-xs">({doctor.totalReviews})</span>
                                 </div>
                              </div>

                              <div className="space-y-3 mt-2">
                                 <div className="flex items-center text-gray-600">
                                    <MapPin className="w-5 h-5 mr-3 text-primary-400 shrink-0" />
                                    <span className="font-medium">{doctor.clinicName}, {doctor.clinicAddress} - {doctor.clinicCity}</span>
                                 </div>
                                 <div className="flex items-center text-gray-600">
                                    <Clock className="w-5 h-5 mr-3 text-primary-400 shrink-0" />
                                    <span className="font-medium">Kinh nghiệm: {doctor.experienceYears} năm</span>
                                 </div>
                              </div>

                              {/* Các Nút hành động */}
                              <div className="mt-auto pt-6 flex gap-4">
                                 <button
                                    className="px-6 py-3 border-2 border-primary-100 bg-primary-50 text-primary-700 font-extrabold rounded-xl hover:bg-primary-100 transition-colors shrink-0"
                                    onClick={() => navigate(`/doctors/${doctor.id}`)}
                                 >
                                    Xem hồ sơ
                                 </button>
                                 <button
                                    className="flex-1 py-3 bg-primary-600 text-white font-extrabold rounded-xl hover:bg-primary-700 transition-all hover:shadow-lg hover:-translate-y-0.5"
                                    onClick={() => navigate(`/booking/${doctor.id}`)}
                                 >
                                    Trực tiếp Đặt hẹn ngay ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(doctor.consultationFee)})
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {/* Phân trang (Nếu tổng trang > 1) */}
               {(doctorData?.totalPages ?? 0) > 1 && (
                  <div className="flex justify-center mt-10 space-x-2">
                     <button
                        disabled={page === 0}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                     >
                        Trước
                     </button>
                     <span className="px-4 py-2 bg-primary-50 text-primary-700 font-bold rounded-lg border border-primary-100">
                        {page + 1} / {doctorData?.totalPages}
                     </span>
                     <button
                        disabled={doctorData?.last}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
                     >
                        Tiếp
                     </button>
                  </div>
               )}

            </div>
         </div>
      </div>
   )
}

export default DoctorListPage;