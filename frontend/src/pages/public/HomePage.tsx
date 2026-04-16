import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Star, Sparkles, UserCheck, CalendarCheck, ChevronRight, MapPin, Map } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-primary-50 pt-24 pb-32 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-multiply"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block py-1.5 px-4 rounded-full bg-primary-100 text-primary-700 text-sm font-bold mb-6 animate-slide-up shadow-sm">
              Nền tảng y tế số 1 Việt Nam
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight animate-slide-up tracking-tight" style={{ animationDelay: '0.1s' }}>
              Đặt lịch khám dễ dàng <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">
                Chăm sóc sức khoẻ thông minh
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 animate-slide-up font-medium" style={{ animationDelay: '0.2s' }}>
              Tìm kiếm bác sĩ giỏi, xem đánh giá chân thực và đặt hẹn khám triệt để. Tích hợp phân tích triệu chứng tự động bằng AI mới nhất.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white p-3 rounded-full shadow-2xl flex flex-col sm:flex-row items-center mb-10 max-w-3xl mx-auto animate-slide-up border border-gray-200" style={{ animationDelay: '0.3s' }}>
              <div className="flex-grow flex items-center px-6 w-full sm:w-auto h-12 sm:border-r border-gray-200">
                <Search className="h-6 w-6 text-primary-500 mr-3 shrink-0" />
                <input type="text" placeholder="Tìm chuyên khoa, tên bác sĩ..." className="w-full focus:outline-none text-gray-800 font-medium placeholder-gray-400 text-lg" />
              </div>
              <div className="px-6 w-full sm:w-1/3 h-12 flex items-center border-t sm:border-t-0 border-gray-200 mt-2 sm:mt-0">
                <MapPin className="h-6 w-6 text-gray-400 mr-2 shrink-0" />
                <select className="w-full focus:outline-none text-gray-700 bg-transparent font-medium text-lg cursor-pointer appearance-none">
                  <option>Toàn quốc</option>
                  <option>Hà Nội</option>
                  <option>TP Hồ Chí Minh</option>
                </select>
              </div>
              <button className="w-full sm:w-auto mt-3 sm:mt-0 bg-primary-600 hover:bg-primary-700 text-white rounded-full px-8 py-4 font-bold text-lg transition-colors flex justify-center items-center shadow-lg">
                Tìm kiếm
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <button onClick={() => navigate('/ai-checker')} className="px-8 py-4 bg-gradient-to-r from-teal-500 to-secondary-500 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:from-teal-600 hover:to-secondary-600 transition transform hover:-translate-y-1 flex items-center justify-center">
                <Sparkles className="mr-2 h-6 w-6" /> Thử Khám Bệnh Trực Tuyến Với AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 -mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl p-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100 border border-gray-100">
          {[
            { label: 'Bác sĩ chuyên khoa', value: '500+', icon: UserCheck },
            { label: 'Chuyên khoa y tế', value: '50+', icon: Heart },
            { label: 'Lượt đặt lịch tháng', value: '10,000+', icon: CalendarCheck },
            { label: 'Điểm đánh giá', value: '4.8★', icon: Star },
          ].map((stat, idx) => (
            <div key={idx} className="text-center px-4 group cursor-default">
              <div className="mx-auto bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="text-4xl font-extrabold text-gray-900 mb-1 tracking-tight">{stat.value}</div>
              <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Chuyên khoa phổ biến</h2>
            <p className="text-xl text-gray-500 font-medium">Lựa chọn chuyên khoa để xem danh sách bác sĩ chuyên môn cao</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Tim mạch', dr: 120, color: 'bg-red-50 text-red-600 border-red-100', icon: '❤️' },
              { name: 'Nhi khoa', dr: 85, color: 'bg-blue-50 text-blue-600 border-blue-100', icon: '👶' },
              { name: 'Da liễu', dr: 92, color: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: '✨' },
              { name: 'Thần kinh', dr: 45, color: 'bg-purple-50 text-purple-600 border-purple-100', icon: '🧠' },
              { name: 'Nha khoa', dr: 150, color: 'bg-teal-50 text-teal-600 border-teal-100', icon: '🦷' },
              { name: 'Sản phụ khoa', dr: 110, color: 'bg-pink-50 text-pink-600 border-pink-100', icon: '🤰' },
              { name: 'Nhãn khoa', dr: 60, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: '👁️' },
              { name: 'Tổng quát', dr: 230, color: 'bg-green-50 text-green-600 border-green-100', icon: '🩺' },
            ].map((spec, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-6 text-center hover-card border-2 border-gray-100 shadow-sm cursor-pointer group">
                <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl mb-6 border group-hover:scale-110 transition-transform ${spec.color}`}>
                  {spec.icon}
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg">{spec.name}</h3>
                <p className="text-sm font-bold text-gray-400 mt-2">{spec.dr} bác sĩ</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="text-primary-600 font-bold text-lg hover:underline inline-flex items-center">
              Khám phá thêm 42 chuyên khoa <ChevronRight className="ml-1 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Booking Timeline */}
      <section className="py-24 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Quy trình trải nghiệm</h2>
            <p className="text-xl text-gray-500 font-medium">Chỉ với 4 bước nhanh chóng, dễ dàng từ xa trên điện thoại</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
             <div className="hidden md:block absolute top-[48px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-primary-100 via-teal-100 to-primary-100 z-0"></div>
            {[
              { title: 'Tìm kiếm Bác sĩ', desc: 'Chọn bác sĩ giỏi theo chuyên khoa, tên bệnh hoặc qua AI tư vấn.' },
              { title: 'Chọn Ngày Giờ', desc: 'Lựa chọn slot thời gian rảnh trực tiếp trên lịch làm việc của bác sĩ.' },
              { title: 'Xác Nhận Đặt', desc: 'Điền thông tin và thanh toán an toàn tiện lợi qua thẻ hoặc VNPay.' },
              { title: 'Khám Chữa Bệnh', desc: 'Nhận thông báo nhắc lịch tự động và đến gặp bác sĩ không cần chờ.' },
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 text-center px-4 group">
                <div className="w-28 h-28 mx-auto bg-white rounded-full shadow-xl border-4 border-white group-hover:border-primary-100 flex items-center justify-center text-primary-600 text-3xl font-extrabold mb-6 transition-colors">
                  0{idx + 1}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Teaser Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-teal-500 to-primary-600 rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-2xl overflow-hidden relative group cursor-default border border-teal-600">
            <div className="absolute -right-20 -top-20 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-[400px] h-[400px]" />
            </div>
            <div className="md:w-2/3 text-white z-10 mb-10 md:mb-0">
              <div className="flex items-center space-x-3 mb-6">
                <span className="bg-white text-primary-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">BETA AI Feature</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">Chưa biết tình trạng<br/>bệnh của mình?</h2>
              <p className="text-teal-50 text-xl font-medium mb-10 max-w-xl leading-relaxed">
                Hệ thống AI Checker độc quyền của chúng tôi sẽ phân tích các triệu chứng và gợi ý chuyên khoa chính xác lên đến 95%. Hoàn toàn miễn phí!
              </p>
              <button onClick={() => navigate('/ai-checker')} className="bg-white text-primary-700 font-extrabold px-10 py-5 rounded-xl hover:shadow-xl hover:scale-105 transition-all text-lg flex items-center">
                <Sparkles className="mr-2 h-6 w-6" /> Trải nghiệm Khám Bệnh AI
              </button>
            </div>
            <div className="md:w-1/3 flex justify-center z-10">
               <div className="w-56 h-56 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 animate-pulse-slow shadow-2xl">
                 <Sparkles className="w-28 h-28 text-white/90" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Doctors */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Bác sĩ Tiêu biểu</h2>
              <p className="text-xl text-gray-500 font-medium">Đội ngũ chuyên gia danh tiếng, có thâm niên cao</p>
            </div>
            <button className="bg-primary-50 text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-100 transition-colors shrink-0">
              Xem toàn bộ danh sách
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'PGS.TS Nguyễn Văn A', spec: 'Chuyên khoa Tim mạch', rating: 4.9, reviews: 342, price: '500.000đ', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&h=600&fit=crop' },
              { name: 'TS.BS Lê Thị B', spec: 'Chuyên khoa Nhi khoa', rating: 4.8, reviews: 256, price: '450.000đ', img: 'https://images.unsplash.com/photo-1594824416962-d27ab2d67d13?w=500&h=600&fit=crop' },
              { name: 'ThS.BS Trần Văn C', spec: 'Chuyên khoa Da liễu', rating: 4.7, reviews: 189, price: '400.000đ', img: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&h=600&fit=crop' },
              { name: 'BS.CK1 Phạm Thị D', spec: 'Chuyên khoa Nha khoa', rating: 5.0, reviews: 412, price: '300.000đ', img: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&h=600&fit=crop' },
            ].map((dr, idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-xl overflow-hidden hover-card border border-gray-100 flex flex-col">
                <div className="relative group">
                  <img src={dr.img} alt={dr.name} className="w-full h-64 object-cover object-top" />
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-gray-900 to-transparent p-4">
                     <span className="bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-md">Hot</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-extrabold text-xl text-gray-900 mb-1">{dr.name}</h3>
                  <p className="text-primary-600 text-sm font-bold mb-4">{dr.spec}</p>
                  
                  <div className="flex items-center text-sm font-bold text-gray-500 mb-4 pb-4 border-b border-gray-100">
                    <Star className="w-5 h-5 text-yellow-400 fill-current mr-1.5" />
                    <span className="text-gray-900 mr-2 text-base">{dr.rating}</span>
                    <span className="font-medium text-gray-400">({dr.reviews} đánh giá)</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto mb-6">
                     <span className="text-xs text-gray-500 font-bold">Giá khám từ</span>
                     <span className="text-lg font-black text-gray-900">{dr.price}</span>
                  </div>
                  
                  <button className="w-full py-4 text-center bg-gray-50 hover:bg-primary-600 text-gray-900 hover:text-white border border-gray-200 hover:border-transparent font-bold rounded-xl transition-all shadow-sm">
                    Đặt Lịch Khám Ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
