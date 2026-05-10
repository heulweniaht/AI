import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, LayoutGrid, Star, MapPin, Award, Sparkles } from 'lucide-react';
import { useSpecialties, useDoctors } from '@/hooks/useDoctors';
import { Spinner } from '@/components/common/Spinner';

// Hàm helper để gán cứng Icon tương ứng với tên chuyên khoa
const getSpecialtyIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('tim')) return '❤️';
    if (lowerName.includes('nhi')) return '👶';
    if (lowerName.includes('da liễu')) return '✨';
    if (lowerName.includes('thần kinh')) return '🧠';
    if (lowerName.includes('nha')) return '🦷';
    if (lowerName.includes('sản') || lowerName.includes('phụ')) return '🤰';
    if (lowerName.includes('nhãn') || lowerName.includes('mắt')) return '👁️';
    if (lowerName.includes('tai mũi họng')) return '👂';
    if (lowerName.includes('xương') || lowerName.includes('khớp')) return '🦴';
    if (lowerName.includes('hô hấp') || lowerName.includes('phổi')) return '🫁';
    if (lowerName.includes('tiêu hóa') || lowerName.includes('dạ dày')) return '🍎';
    return '🩺'; // Mặc định
};

const SpecialtiesPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: specialties, isLoading: isSpecLoading } = useSpecialties();

    const { data: topDoctors, isLoading: isDocsLoading } = useDoctors(
        { sort: 'ratingAvg,desc' },
        { page: 0, size: 4 }
    );

    const filteredSpecs = useMemo(() => {
        if (!specialties) return [];
        return specialties.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [specialties, searchTerm]);

    if (isSpecLoading) return <div className="py-20 flex justify-center"><Spinner /></div>;

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-64px)] pb-24 animate-fade-in">
            {/* HERO SECTION */}
            <div className="bg-white border-b border-gray-100 py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Danh Mục Chuyên Khoa</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">Khám phá và đặt lịch với các bác sĩ hàng đầu theo từng chuyên môn phù hợp với bạn.</p>

                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2">
                            <Search className="w-6 h-6 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm tên chuyên khoa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-6 py-4 rounded-full border-2 border-gray-200 shadow-sm focus:ring-4 focus:ring-primary-50 focus:border-primary-500 text-lg font-medium outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* SPECIALTIES GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                {filteredSpecs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredSpecs.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => navigate(`/doctors?specialtyId=${s.id}`)}
                                className="bg-white rounded-[2rem] p-8 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 transition-all cursor-pointer group flex flex-col h-full"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    {/* Render Icon Cứng */}
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 border-primary-50 bg-primary-50 group-hover:bg-primary-600 group-hover:text-white transition-all">
                                        {getSpecialtyIcon(s.name)}
                                    </div>
                                    <span className="text-primary-600 font-bold bg-primary-50 px-3 py-1 rounded-full text-xs border border-primary-100">
                                        {s.doctorCount || 0} Bác sĩ
                                    </span>
                                </div>

                                <h3 className="font-extrabold text-gray-900 text-2xl mb-3">{s.name}</h3>

                                <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6 line-clamp-2">
                                    {s.description || `Hệ thống cung cấp dịch vụ khám và điều trị chuyên sâu về ${s.name} với đội ngũ y bác sĩ đầu ngành.`}
                                </p>

                                <div className="mt-auto flex items-center text-primary-600 font-bold text-sm">
                                    Xem danh sách bác sĩ chuyên khoa <ChevronRight className="ml-1 w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                        <LayoutGrid className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold text-xl">Không tìm thấy chuyên khoa nào khớp với từ khóa!</p>
                    </div>
                )}
            </div>

            {/* TOP DOCTORS SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <div className="flex items-center space-x-2 text-primary-600 mb-2">
                            <Sparkles className="w-5 h-5" />
                            <span className="font-black uppercase tracking-widest text-sm">Đội ngũ tinh hoa</span>
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Bác Sĩ Tiêu Biểu Của Tuần</h2>
                        <p className="text-lg text-gray-500 font-medium mt-2">Dựa trên lượt đặt lịch và đánh giá tích cực từ cộng đồng bệnh nhân.</p>
                    </div>
                    <button
                        onClick={() => navigate('/doctors')}
                        className="bg-primary-50 text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-100 transition-colors"
                    >
                        Xem tất cả bác sĩ
                    </button>
                </div>

                {isDocsLoading ? (
                    <div className="flex justify-center py-10"><Spinner /></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {topDoctors?.content.map((dr) => (
                            <div
                                key={dr.id}
                                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all border border-gray-100 flex flex-col group cursor-pointer"
                                onClick={() => navigate(`/doctors/${dr.id}`)}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={dr.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(dr.fullName)}&background=random`}
                                        alt={dr.fullName}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center shadow-sm">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                                        <span className="font-black text-sm text-gray-900">{dr.ratingAvg?.toFixed(1) || '5.0'}</span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <p className="text-primary-600 font-bold text-xs uppercase tracking-wider mb-1">{dr.specialtyName}</p>
                                    <h3 className="font-black text-xl text-gray-900 mb-4 line-clamp-1">BS. {dr.fullName}</h3>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <Award className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="font-medium">{dr.experienceYears}+ năm kinh nghiệm</span>
                                        </div>
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                            <span className="font-medium line-clamp-1">{dr.clinicName}</span>
                                        </div>
                                    </div>

                                    <button className="mt-auto w-full py-3 bg-gray-900 text-white font-black rounded-xl hover:bg-primary-600 transition-colors shadow-lg">
                                        Đặt Hẹn Ngay
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpecialtiesPage;