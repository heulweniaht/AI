import React from 'react';
import { Search } from 'lucide-react';

const SpecialtiesPage = () => {
    const specs = [
        { name: 'Tim mạch', dr: 120, color: 'bg-red-50 text-red-600 border-red-100', icon: '❤️' },
        { name: 'Nhi khoa', dr: 85, color: 'bg-blue-50 text-blue-600 border-blue-100', icon: '👶' },
        { name: 'Da liễu', dr: 92, color: 'bg-yellow-50 text-yellow-600 border-yellow-100', icon: '✨' },
        { name: 'Thần kinh', dr: 45, color: 'bg-purple-50 text-purple-600 border-purple-100', icon: '🧠' },
        { name: 'Nha khoa', dr: 150, color: 'bg-teal-50 text-teal-600 border-teal-100', icon: '🦷' },
        { name: 'Sản khoa', dr: 110, color: 'bg-pink-50 text-pink-600 border-pink-100', icon: '🤰' },
        { name: 'Nhãn khoa', dr: 60, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', icon: '👁️' },
        { name: 'Tổng quát', dr: 230, color: 'bg-green-50 text-green-600 border-green-100', icon: '🩺' },
        { name: 'Tai mũi họng', dr: 80, color: 'bg-orange-50 text-orange-600 border-orange-100', icon: '👂' },
        { name: 'Xương khớp', dr: 99, color: 'bg-slate-50 text-slate-600 border-slate-200', icon: '🦴' },
        { name: 'Hô hấp', dr: 70, color: 'bg-cyan-50 text-cyan-600 border-cyan-100', icon: '🫁' },
        { name: 'Tiêu hóa', dr: 130, color: 'bg-lime-50 text-lime-600 border-lime-100', icon: '🍎' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Tìm kiếm chuyên khoa!');
    }

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-16 animate-fade-in">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Chuyên khoa Y tế</h1>
                  <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-10">Khám phá và đặt lịch với các bác sĩ hàng đầu theo từng chuyên khoa phù hợp với tình trạng sức khỏe của bạn.</p>
                  
                  <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative group">
                     <button type="submit" className="absolute left-6 top-1/2 -translate-y-1/2"><Search className="w-6 h-6 text-gray-400 group-focus-within:text-primary-600 transition-colors" /></button>
                     <input type="text" placeholder="Tìm chuyên khoa và bấm Enter..." className="w-full pl-16 pr-6 py-4 rounded-full border-2 border-gray-200 shadow-sm focus:ring-0 focus:border-primary-500 text-lg font-medium outline-none transition-all focus:shadow-md" />
                  </form>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                  {specs.map((s, i) => (
                      <div key={i} className="bg-white rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 transition-all cursor-pointer flex flex-col items-center justify-center text-center group">
                          <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform ${s.color}`}>
                            {s.icon}
                          </div>
                          <h3 className="font-extrabold text-gray-900 text-xl">{s.name}</h3>
                          <p className="text-primary-600 font-bold mt-2 bg-primary-50 px-3 py-1 rounded-lg">{s.dr} Bác sĩ</p>
                      </div>
                  ))}
               </div>
           </div>
        </div>
    )
}
export default SpecialtiesPage;
