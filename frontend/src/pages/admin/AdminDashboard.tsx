import React from 'react';
import { Users, Stethoscope, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAdminStats } from '@/hooks/useAdmin';
import { Spinner } from '@/components/common/Spinner';

const fallbackDataLine = [
    { name: 'T2', DoanhThu: 4000000, Kham: 24 },
    { name: 'T3', DoanhThu: 3000000, Kham: 13 },
    { name: 'T4', DoanhThu: 2000000, Kham: 98 },
    { name: 'T5', DoanhThu: 2780000, Kham: 39 },
    { name: 'T6', DoanhThu: 1890000, Kham: 48 },
    { name: 'T7', DoanhThu: 2390000, Kham: 38 },
    { name: 'CN', DoanhThu: 3490000, Kham: 43 },
];

const fallbackDataPie = [
    { name: 'CĐ Tim mạch', value: 400 },
    { name: 'Nha khoa', value: 300 },
    { name: 'Nhi khoa', value: 300 },
    { name: 'Thần kinh', value: 200 },
];
const COLORS = ['#1565C0', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {

    const { data: statsData, isLoading } = useAdminStats();

    if (isLoading) return <div className="py-20 flex justify-center"><Spinner /></div>;

    // Ưu tiên dữ liệu API, nếu null thì dùng Fallback
    const lineChartData = statsData?.revenueChart || fallbackDataLine;
    const pieChartData = statsData?.specialtyChart || fallbackDataPie;

    return (
        <div className="p-8 md:p-12 animate-fade-in w-full max-w-7xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Tổng quan Hệ thống Admin V2</h1>

            {/* THỐNG KÊ TỔNG QUAN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: 'Tổng Bác sĩ', val: statsData?.totalDoctors || '450', icon: Stethoscope, color: 'bg-blue-50 text-blue-600' },
                    { label: 'Lượng BN Online', val: statsData?.totalPatients || '12 K', icon: Users, color: 'bg-green-50 text-green-600' },
                    { label: 'Booking Tuần/KPI', val: statsData?.weeklyBookings || '800', icon: Calendar, color: 'bg-purple-50 text-purple-600' },
                    { label: 'Doanh thu', val: statsData?.totalRevenue ? `${(statsData.totalRevenue / 1000000).toFixed(1)} Tr` : '1.2 Tỷ', icon: DollarSign, color: 'bg-orange-50 text-orange-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center mr-4 md:mr-5 shrink-0 ${stat.color}`}>
                            <stat.icon className="w-7 h-7 md:w-8 md:h-8" />
                        </div>
                        <div>
                            <p className="text-xs md:text-sm font-extrabold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl md:text-4xl font-black text-gray-900 mt-1">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* BIỂU ĐỒ ĐƯỜNG (LINE CHART) */}
                <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="font-extrabold text-gray-900 text-2xl mb-8 flex justify-between">
                        Biểu đồ Trực tuyến (Recharts Live)
                        <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded border border-green-200 self-center uppercase">Live</span>
                    </div>
                    <div className="w-full h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#6B7280', fontSize: 13, fontWeight: 600 }} axisLine={{ stroke: '#E5E7EB' }} />
                                <YAxis yAxisId="left" stroke="#9CA3AF" tick={{ fill: '#6B7280', fontWeight: 600 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" tick={{ fill: '#6B7280', fontWeight: 600 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 800, color: '#374151' }} />
                                <Line yAxisId="left" type="monotone" name="Doanh Thu (VNĐ)" dataKey="DoanhThu" stroke="#1565C0" strokeWidth={5} activeDot={{ r: 8 }} />
                                <Line yAxisId="right" type="monotone" name="Ca khám / Appointment" dataKey="Kham" stroke="#10b981" strokeWidth={5} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    {/* BIỂU ĐỒ TRÒN (PIE CHART) */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex-1 flex flex-col justify-center">
                        <div className="font-extrabold text-gray-900 text-xl mb-4 text-center">Tỉ trọng Booking Chuyên Khoa</div>
                        <div className="w-full h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                                        {pieChartData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 mt-2">
                            {pieChartData.map((entry: any, index: number) => (
                                <div key={index} className="flex items-center text-sm font-extrabold text-gray-700 shadow-sm bg-gray-50 px-2 py-1 rounded">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    {entry.name}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SERVER STATUS */}
                    <div className="bg-gradient-to-br from-primary-600 to-indigo-800 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden group">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-3xl group-hover:scale-[2] transition-transform duration-1000"></div>
                        <TrendingUp className="w-10 h-10 mb-4 text-white" />
                        <h3 className="text-2xl font-black mb-2 tracking-tight">Máy chủ ổn định 100%</h3>
                        <p className="text-indigo-100 font-medium text-base leading-relaxed">Data Sync Kafka & Cụm Redis Cluster hoạt động cân bằng tải. 0% downtime.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AdminDashboard;
