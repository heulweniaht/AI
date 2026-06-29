import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, AlertCircle, Send } from 'lucide-react';
import { authApi } from '@/api/authApi';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        setMessage('');
        setIsError(false);
        try {
            const msg = await authApi.forgotPassword(email);
            setMessage(msg);
            setSent(true);
            setIsError(false);
        } catch (err: any) {
            setMessage(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex bg-white animate-fade-in">
            {/* Left — Hero Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
                <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
                    alt="Medical"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-primary-900/60 to-transparent"></div>
                <div className="absolute bottom-20 left-16 right-16 text-white">
                    <span className="bg-primary-500 text-white font-bold px-3 py-1 text-sm rounded-md mb-6 inline-block">
                        SmartHealth Portal
                    </span>
                    <h2 className="text-5xl font-extrabold mb-6 leading-tight">
                        Bảo mật<br />tài khoản của bạn.
                    </h2>
                    <p className="text-xl opacity-80 font-medium">
                        Chúng tôi sẽ giúp bạn khôi phục mật khẩu một cách an toàn.
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50">
                <div className="w-full max-w-lg bg-white p-10 sm:p-14 rounded-[2rem] shadow-2xl border border-gray-100">

                    {/* Back to login */}
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-primary-600 transition mb-8 group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Quay lại đăng nhập
                    </Link>

                    {!sent ? (
                        <>
                            {/* Header */}
                            <div className="mb-10 text-left">
                                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="h-8 w-8 text-primary-600" />
                                </div>
                                <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                                    Quên mật khẩu?
                                </h1>
                                <p className="text-gray-500 text-base font-medium leading-relaxed">
                                    Đừng lo! Nhập email đăng ký và chúng tôi sẽ gửi mật khẩu mới về hộp thư của bạn.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Địa chỉ Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Nhập email của bạn"
                                            required
                                            className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary-500 transition-colors text-base font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Error message */}
                                {isError && message && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm font-medium text-red-700">{message}</p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                                >
                                    {loading ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang gửi...
                                        </span>
                                    ) : (
                                        <>
                                            <Send className="h-5 w-5" />
                                            Gửi mật khẩu mới
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Success State */
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                                Kiểm tra hộp thư!
                            </h2>
                            <p className="text-gray-500 text-base font-medium leading-relaxed mb-2">
                                {message || 'Mật khẩu mới đã được gửi về email của bạn.'}
                            </p>
                            <p className="text-gray-400 text-sm mb-8">
                                Gửi đến: <span className="font-semibold text-gray-600">{email}</span>
                            </p>

                            <div className="space-y-3">
                                <Link
                                    to="/login"
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none transition-all hover:scale-[1.02]"
                                >
                                    Đăng nhập ngay
                                </Link>
                                <button
                                    onClick={() => { setSent(false); setMessage(''); setEmail(''); setIsError(false); }}
                                    className="w-full py-3 text-sm font-semibold text-gray-500 hover:text-primary-600 transition"
                                >
                                    Gửi lại với email khác
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    {!sent && (
                        <div className="mt-8 text-center text-sm font-medium text-gray-500">
                            Đã nhớ mật khẩu?{' '}
                            <Link to="/login" className="text-primary-600 hover:underline">
                                Đăng nhập
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}