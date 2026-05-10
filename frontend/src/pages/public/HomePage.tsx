import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Star,
  Sparkles,
  Search,
  MessageSquare
} from 'lucide-react';
import { useSpecialties, useDoctors } from '@/hooks/useDoctors';
import { Spinner } from '@/components/common/Spinner';

// Hàm helper lấy Icon (đồng bộ với trang Specialties)
const getSpecialtyIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('tim')) return '❤️';
  if (lowerName.includes('nhi')) return '👶';
  if (lowerName.includes('da liễu')) return '✨';
  if (lowerName.includes('thần kinh')) return '🧠';
  if (lowerName.includes('nha')) return '🦷';
  if (lowerName.includes('mắt')) return '👁️';
  return '🩺';
};

const HomePage = () => {
  const navigate = useNavigate();

  // LẤY DỮ LIỆU TỪ BACKEND
  const { data: specialties, isLoading: isSpecLoading } = useSpecialties();
  const { data: topDoctors, isLoading: isDocsLoading } = useDoctors(
    { sort: 'ratingAvg,desc' },
    { page: 0, size: 4 }
  );

  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-blue-50 pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-black uppercase tracking-wider">Trí tuệ nhân tạo y khoa tiên phong</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6">
              Chăm Sóc Sức Khỏe <br />
              <span className="text-primary-600 italic">Thông Minh 4.0</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-xl font-medium leading-relaxed">
              Đặt lịch khám với các chuyên gia đầu ngành, phân tích triệu chứng bằng AI và quản lý hồ sơ y tế tập trung. Tất cả trong một nền tảng.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/doctors')}
                className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1 transition-all flex items-center justify-center"
              >
                Đặt lịch ngay <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/ai-checker')}
                className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-black text-lg hover:bg-gray-50 transition-all flex items-center justify-center shadow-sm"
              >
                Thử AI Checker
              </button>
            </div>

            {/* THỐNG KÊ THẬT */}
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-8 border-t border-gray-100 pt-8">
              <div>
                <p className="text-3xl font-black text-gray-900">{isSpecLoading ? '...' : (specialties?.length || 0)}+</p>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Chuyên khoa</p>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">{isDocsLoading ? '...' : (topDoctors?.totalElements || 0)}+</p>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Bác sĩ chuyên gia</p>
              </div>
              <div>
                <p className="text-3xl font-black text-gray-900">24/7</p>
                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Hỗ trợ AI</p>
              </div>
            </div>
          </div>

          <div className="flex-1 relative animate-fade-in hidden lg:block">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop"
                alt="Medical Professional"
                className="w-full h-[550px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl z-20 flex items-center gap-4 animate-bounce-slow border border-gray-50">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-gray-900">An toàn tuyệt đối</p>
                <p className="text-xs text-gray-500 font-medium">Bảo mật dữ liệu chuẩn HIPAA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DỊCH VỤ CỐT LÕI */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Tại sao chọn SmartHealth?</h2>
            <div className="w-24 h-2 bg-primary-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Calendar, title: 'Đặt lịch 30 giây', desc: 'Chọn bác sĩ, chọn khung giờ và xác nhận thanh toán chỉ trong nháy mắt.', color: 'bg-blue-50 text-blue-600' },
              { icon: Stethoscope, title: 'Chuyên gia đầu ngành', desc: 'Hàng trăm bác sĩ được kiểm định chứng chỉ và tay nghề bởi đội ngũ Admin.', color: 'bg-purple-50 text-purple-600' },
              { icon: MessageSquare, title: 'AI Tư vấn sơ bộ', desc: 'Sử dụng mô hình ngôn ngữ lớn để phân tích triệu chứng trước khi gặp bác sĩ.', color: 'bg-green-50 text-green-600' },
            ].map((feature, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] border border-gray-100 hover:border-primary-100 hover:shadow-xl transition-all group">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CHUYÊN KHOA TIÊU BIỂU (DỮ LIỆU ĐỘNG) */}
      <section className="py-24 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Chuyên Khoa Phổ Biến</h2>
              <p className="text-lg text-gray-500 font-medium mt-2">Đa dạng lựa chọn cho mọi nhu cầu sức khỏe của bạn.</p>
            </div>
            <button onClick={() => navigate('/specialties')} className="hidden sm:flex items-center text-primary-600 font-black hover:translate-x-1 transition-transform">
              Xem tất cả khoa <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          {isSpecLoading ? <div className="flex justify-center py-12"><Spinner /></div> : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {specialties?.slice(0, 6).map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/doctors?specialtyId=${s.id}`)}
                  className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer text-center group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                    {getSpecialtyIcon(s.name)}
                  </div>
                  <p className="font-black text-gray-900 text-sm group-hover:text-primary-600 transition-colors">{s.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. AI CHECKER CALL-TO-ACTION */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto bg-primary-600 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
          <div className="text-white relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Bạn không biết mình gặp vấn đề gì?</h2>
            <p className="text-xl text-primary-100 font-medium max-w-xl">
              Hãy mô tả triệu chứng của bạn cho Chatbot AI của chúng tôi. Hệ thống sẽ gợi ý bệnh lý và bác sĩ chuyên khoa phù hợp nhất.
            </p>
            <button
              onClick={() => navigate('/ai-checker')}
              className="mt-8 px-10 py-4 bg-white text-primary-600 font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-lg"
            >
              Thử ngay miễn phí
            </button>
          </div>
          <div className="w-full md:w-1/3 flex justify-center relative z-10">
            <div className="w-48 h-48 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse shadow-inner">
              <Sparkles className="w-24 h-24 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP BÁC SĨ (DỮ LIỆU ĐỘNG) */}
      <section className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Bác Sĩ Nổi Bật</h2>
            <p className="text-lg text-gray-500 font-medium mt-3">Đội ngũ y bác sĩ dày dặn kinh nghiệm, tận tâm với bệnh nhân.</p>
          </div>

          {isDocsLoading ? <div className="flex justify-center py-12"><Spinner /></div> : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {topDoctors?.content.map((dr) => (
                <div
                  key={dr.id}
                  onClick={() => navigate(`/doctors/${dr.id}`)}
                  className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={dr.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(dr.fullName)}&background=random`}
                      alt={dr.fullName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center shadow-sm border border-white">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-black text-sm text-gray-900">{dr.ratingAvg?.toFixed(1) || '5.0'}</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <p className="text-primary-600 font-black text-xs uppercase tracking-widest mb-1">{dr.specialtyName}</p>
                    <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">BS. {dr.fullName}</h3>
                    <div className="flex items-center text-gray-500 text-sm font-bold">
                      <Users className="w-4 h-4 mr-2" />
                      {dr.experienceYears}+ năm kinh nghiệm
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/doctors')}
              className="px-10 py-4 border-2 border-primary-600 text-primary-600 font-black rounded-2xl hover:bg-primary-600 hover:text-white transition-all shadow-md"
            >
              Xem tất cả danh sách bác sĩ
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;