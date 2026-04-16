import React, { useState } from 'react';
import { Sparkles, Send, ShieldAlert, CheckCircle2, User, Activity } from 'lucide-react';

const SymptomCheckerPage = () => {
  const [symptom, setSymptom] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<null | boolean>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom) return;
    setAnalyzing(true);
    setResult(null);
    // Fake typing/analyzing delay
    setTimeout(() => {
      setAnalyzing(false);
      setResult(true);
    }, 2800);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-fade-in relative">
        
        {/* Background elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-20 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-40 left-0 -ml-20 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow font-delay-200"></div>

        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex h-24 w-24 bg-gradient-to-br from-teal-400 to-teal-600 text-white rounded-[2rem] shadow-xl shadow-teal-200 items-center justify-center mb-8 transform rotate-3">
            <Sparkles className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">AI Khai Báo Triệu Chứng</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Hệ thống sẽ phân tích các triệu chứng của bạn bằng trí tuệ nhân tạo và đưa ra kết quả cùng chuyên khoa phù hợp để đặt lịch khám ngay lập tức.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 relative z-10">
          <div className="p-8 md:p-14">
            <div className="bg-teal-50 rounded-2xl p-6 mb-10 border border-teal-100 flex items-start">
              <ShieldAlert className="h-8 w-8 text-teal-600 mr-4 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-teal-900 text-lg mb-1">Lưu ý y tế quan trọng</h4>
                <p className="text-teal-700 font-medium">Công cụ này chỉ mang tính chất tham khảo dựa trên mô hình AI, KHÔNG thay thế cho chẩn đoán y khoa chuyên nghiệp từ bác sĩ. Trong trường hợp khẩn cấp cấp cứu, vui lòng gọi 115.</p>
              </div>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-8">
              <div>
                <div className="flex items-center mb-4 text-gray-900">
                    <User className="w-6 h-6 mr-3 text-primary-600" />
                    <label className="block text-xl font-extrabold">Mô tả chi tiết triệu chứng của bạn</label>
                </div>
                <textarea 
                  rows={5}
                  className="w-full px-6 py-5 border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-teal-50 focus:border-teal-500 text-lg transition-all bg-gray-50 focus:bg-white font-medium resize-none shadow-sm"
                  placeholder="Ví dụ: Tôi bị đau đầu liên tục 3 ngày nay, có kèm theo sốt nhẹ về chiều và mỏi cơ. Uống Panadol không đỡ..."
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  disabled={analyzing}
                ></textarea>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-4 items-center">
                 <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mr-2">Gợi ý nhanh</span>
                 {['Sốt cao liên tục', 'Đau dạ dày', 'Ho khan kéo dài', 'Đau nửa đầu', 'Mất ngủ'].map(tag => (
                   <button key={tag} type="button" disabled={analyzing} onClick={() => setSymptom(prev => prev ? prev + ', ' + tag : tag)} className="px-5 py-2.5 bg-gray-100 hover:bg-teal-100 hover:text-teal-700 hover:-translate-y-0.5 text-gray-600 text-sm font-bold rounded-full transition-all border border-transparent hover:border-teal-200 shadow-sm disabled:opacity-50">
                     + {tag}
                   </button>
                 ))}
              </div>

              <div className="border-t border-gray-100 pt-8 mt-4">
                <button 
                  type="submit" 
                  disabled={analyzing || !symptom}
                  className={`w-full py-5 rounded-2xl flex items-center justify-center text-xl font-extrabold shadow-xl transition-all ${analyzing ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : symptom ? 'bg-gradient-to-r from-teal-500 to-primary-600 text-white hover:shadow-2xl hover:scale-[1.02]' : 'bg-gray-200 text-gray-400 shadow-none'}`}
                >
                  {analyzing ? (
                    <span className="flex items-center">AI Đang phân tích dữ liệu... <Activity className="ml-3 h-6 w-6 animate-pulse" /></span>
                  ) : (
                    <>
                      Phân Tích Ngay <Send className="ml-3 h-6 w-6" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {analyzing && (
              <div className="mt-12 bg-slate-50 rounded-3xl p-10 text-center animate-fade-in border border-slate-100">
                <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-teal-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="h-8 w-8 text-teal-500 animate-pulse" />
                    </div>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Đang phân tích triệu chứng...</h3>
                <p className="text-gray-500 font-medium">So khớp với thư viện y khoa và hàng ngàn hồ sơ bệnh án.</p>
              </div>
            )}

            {result && (
              <div className="mt-12 bg-white rounded-3xl p-10 border-2 border-teal-500 animate-slide-up shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-3 h-full bg-teal-500"></div>
                <div className="flex flex-col md:flex-row items-start">
                  <div className="bg-teal-100 p-4 rounded-full mr-8 shrink-0 mb-6 md:mb-0">
                    <CheckCircle2 className="h-10 w-10 text-teal-600" />
                  </div>
                  <div className="flex-grow w-full">
                    <h3 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Kết quả Trí tuệ Nhân tạo</h3>
                    <p className="text-lg text-gray-600 mb-8 font-medium">Dựa trên mô tả của bạn, đây là các chuyên khoa AI đề nghị để thăm khám chính xác nhất.</p>
                    
                    <div className="space-y-6">
                      {/* Result 1 */}
                      <div>
                        <div className="flex justify-between text-base font-extrabold mb-3">
                          <span className="text-gray-900">Khoa Nội Cơ Xương Khớp</span>
                          <span className="text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">85% độ khớp</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3.5 shadow-inner">
                          <div className="bg-gradient-to-r from-teal-400 to-teal-500 h-3.5 rounded-full relative" style={{ width: '85%' }}>
                             {/* Animated stripe */}
                             <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Result 2 */}
                      <div>
                        <div className="flex justify-between text-base font-extrabold mb-3">
                          <span className="text-gray-900">Khoa Nội Thần Kinh</span>
                          <span className="text-teal-400 bg-teal-50 px-3 py-1 rounded-full">45% độ khớp</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3.5 shadow-inner">
                          <div className="bg-teal-300 h-3.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row gap-4">
                       <button className="bg-primary-600 text-white w-full py-4 rounded-xl font-extrabold text-lg hover:bg-primary-700 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                         Tìm Bác Sĩ Chuyên Khoa
                       </button>
                       <button onClick={() => {setResult(null); setSymptom('');}} className="bg-gray-100 text-gray-600 w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors">
                         Khám lại
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SymptomCheckerPage;
