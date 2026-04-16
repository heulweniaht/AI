import React from 'react';
import { Search, Filter, Star, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorListPage = () => {
   const navigate = useNavigate();
   return (
     <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 animate-fade-in">
           
           <div className="w-full md:w-1/4">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-extrabold text-lg flex items-center"><Filter className="w-5 h-5 mr-2"/> Bộ Lọc</h3>
                   <button className="text-sm text-primary-600 font-bold hover:underline">Xóa tất cả</button>
                </div>
                
                <div className="space-y-6">
                   <div>
                     <label className="font-bold text-gray-900 block mb-3">Tìm kiếm</label>
                     <input type="text" placeholder="Tên bác sĩ..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 font-medium" />
                   </div>
                   
                   <div>
                     <label className="font-bold text-gray-900 block mb-3">Chuyên khoa</label>
                     {['Tim mạch', 'Thần kinh', 'Da liễu', 'Nha khoa', 'Sản khoa', 'Nhi khoa'].map(s => (
                        <div key={s} className="flex items-center mb-3">
                           <input type="checkbox" className="w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
                           <span className="ml-3 text-gray-700 font-medium">{s}</span>
                        </div>
                     ))}
                   </div>
                   
                   <div>
                     <label className="font-bold text-gray-900 block mb-3">Đánh giá tối thiểu</label>
                     <div className="flex space-x-2">
                        {['4★', '4.5★', '5★'].map(r => (
                           <button key={r} className="flex-1 py-2 border-2 border-gray-100 rounded-xl bg-gray-50 hover:bg-primary-50 hover:border-primary-200 text-sm font-bold text-gray-700 transition-colors">
                             {r}
                           </button>
                        ))}
                     </div>
                   </div>
                </div>
             </div>
           </div>

           <div className="w-full md:w-3/4">
              <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                 <p className="text-gray-600 font-medium">Tìm thấy <span className="font-extrabold text-gray-900 text-lg">45</span> Bác sĩ</p>
                 <select className="bg-gray-50 border-2 border-gray-100 text-gray-700 text-sm rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3 font-bold cursor-pointer outline-none">
                    <option>Ưu tiên: Phổ biến nhất</option>
                    <option>Ưu tiên: Đánh giá cao</option>
                    <option>Ưu tiên: Giá thấp đến cao</option>
                 </select>
              </div>

              <div className="space-y-6">
                 {[1,2,3,4].map(idx => (
                    <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col md:flex-row gap-8 group">
                       <div className="relative overflow-hidden rounded-2xl md:w-56 h-56 shrink-0">
                          <img src={`https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop`} alt="Doctor" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       </div>
                       <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                             <div>
                               <h3 className="text-2xl font-extrabold text-gray-900 hover:text-primary-600 cursor-pointer transition-colors" onClick={() => navigate('/doctors/1')}>PGS. TS Cấp cao Nguyễn Văn {idx}</h3>
                               <p className="text-primary-600 font-extrabold mb-2 uppercase tracking-wide text-sm">Chuyên khoa Tim Mạch</p>
                             </div>
                             <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                <span className="font-extrabold text-gray-900">4.{9-idx}</span>
                             </div>
                          </div>
                          
                          <div className="space-y-3 mt-2">
                             <div className="flex items-center text-gray-600">
                                <MapPin className="w-5 h-5 mr-3 text-primary-400 shrink-0" />
                                <span className="font-medium">Bệnh viện Đa khoa Tâm Anh, Số 1 Hoàng Minh Giám, Hà Nội</span>
                             </div>
                             <div className="flex items-center text-gray-600">
                                <Clock className="w-5 h-5 mr-3 text-primary-400 shrink-0" />
                                <span className="font-medium">Có lịch trống: Hôm nay, 14:00 - 16:30</span>
                             </div>
                          </div>
                          
                          <div className="mt-auto pt-6 flex gap-4">
                             <button className="px-6 py-3 border-2 border-primary-100 bg-primary-50 text-primary-700 font-extrabold rounded-xl hover:bg-primary-100 transition-colors shrink-0" onClick={() => navigate('/doctors/1')}>Xem hồ sơ</button>
                             <button className="flex-1 py-3 bg-primary-600 text-white font-extrabold rounded-xl hover:bg-primary-700 transition-all hover:shadow-lg hover:-translate-y-0.5" onClick={() => navigate('/booking/1')}>Trực tiếp Đặt hẹn ngay</button>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
     </div>
   )
}
export default DoctorListPage;
