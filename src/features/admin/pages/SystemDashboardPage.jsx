import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { adminService } from '../api/adminService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const SystemDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await adminService.getDashboardStats();
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-primary animate-pulse">Đang tải dữ liệu...</p>
            </div>
        </div>
    );

    // Dữ liệu giả cho biểu đồ & doanh thu theo yêu cầu
    const revenueData = [
        { name: 'Tháng 1', revenue: 40000000 },
        { name: 'Tháng 2', revenue: 30000000 },
        { name: 'Tháng 3', revenue: 50000000 },
        { name: 'Tháng 4', revenue: 45000000 },
        { name: 'Tháng 5', revenue: 60000000 },
        { name: 'Tháng 6', revenue: 55000000 },
    ];

    const mockRevenue = 1250000000;
    const mockGrowth = 15.5;

    return (
        <div className="!space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black text-text-main font-['Outfit'] tracking-tight">Tổng quan Hệ thống</h1>
                <p className="text-sm text-text-secondary !mt-1">Giám sát tổng thể hoạt động của hệ thống EMS.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Thẻ 1: Tổng doanh thu (Mock) */}
                <div className="!bg-white !p-6 rounded-3xl border border-border shadow-soft hover:shadow-lg transition-all border-l-4 border-l-blue-500 group">
                    <div className="flex items-center justify-between !mb-4">
                        <div className="w-12 h-12 !bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon icon="solar:round-transfer-horizontal-bold-duotone" className="text-2xl" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded-full">Revenue</span>
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Tổng Doanh thu</p>
                        <h3 className="text-2xl font-black text-text-main !mt-1">{formatCurrency(mockRevenue)}</h3>
                        <p className="text-xs text-green-500 !mt-2 font-bold flex items-center gap-1 bg-green-50 w-fit px-2 py-1 rounded-lg">
                            <Icon icon="solar:graph-up-bold-duotone" /> +{mockGrowth}% <span className="text-[10px] opacity-70">vs tháng trước</span>
                        </p>
                    </div>
                </div>

                {/* Thẻ 2: Học sinh */}
                <div className="!bg-white !p-6 rounded-3xl border border-border shadow-soft hover:shadow-lg transition-all border-l-4 border-l-emerald-500 group">
                    <div className="flex items-center justify-between !mb-4">
                        <div className="w-12 h-12 !bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon icon="solar:users-group-rounded-bold-duotone" className="text-2xl" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">Students</span>
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Học sinh đang học</p>
                        <h3 className="text-2xl font-black text-text-main !mt-1">{stats?.totalStudents || 0}</h3>
                        <p className="text-xs text-text-muted !mt-2 font-medium">Học sinh đang hoạt động</p>
                    </div>
                </div>

                {/* Thẻ 3: Giáo viên */}
                <div className="!bg-white !p-6 rounded-3xl border border-border shadow-soft hover:shadow-lg transition-all border-l-4 border-l-purple-500 group">
                    <div className="flex items-center justify-between !mb-4">
                        <div className="w-12 h-12 !bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon icon="solar:square-academic-cap-2-bold-duotone" className="text-2xl" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-50 px-2 py-1 rounded-full">Teachers</span>
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Giáo viên đang dạy</p>
                        <h3 className="text-2xl font-black text-text-main !mt-1">{stats?.totalTeachers || 0}</h3>
                        <p className="text-xs text-text-muted !mt-2 font-medium">Giáo viên trong hệ thống</p>
                    </div>
                </div>

                {/* Thẻ 4: Tổng tài khoản */}
                <div className="!bg-white !p-6 rounded-3xl border border-border shadow-soft hover:shadow-lg transition-all border-l-4 border-l-amber-500 group">
                    <div className="flex items-center justify-between !mb-4">
                        <div className="w-12 h-12 !bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon icon="solar:user-id-bold-duotone" className="text-2xl" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-1 rounded-full">Accounts</span>
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Tổng tài khoản</p>
                        <h3 className="text-2xl font-black text-text-main !mt-1">{stats?.totalUsers || 0}</h3>
                        <p className="text-xs text-amber-600 !mt-2 font-bold flex items-center gap-1 bg-amber-50 w-fit px-2 py-1 rounded-lg">
                            <Icon icon="solar:user-plus-bold-duotone" /> +{stats?.newRegistrationsThisMonth || 0} <span className="text-[10px] opacity-70">tháng này</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 gap-6">
                {/* Revenue Chart */}
                <div className="!bg-white !p-8 rounded-3xl border border-border shadow-soft">
                    <div className="flex items-center justify-between !mb-8">
                        <div>
                            <h3 className="text-lg font-black text-text-main font-['Outfit'] tracking-tight">Biểu đồ Doanh thu</h3>
                            <p className="text-xs text-text-secondary">Thống kê doanh thu theo 6 tháng gần nhất</p>
                        </div>
                        <button className="px-4 py-2 !bg-primary/10 text-primary text-xs font-bold rounded-xl hover:!bg-primary/20 transition-all">Xuất báo cáo PDF</button>
                    </div>
                    <div className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={15} />
                                <YAxis 
                                    tickFormatter={(value) => `${value / 1000000}Tr`} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                                    dx={-15} 
                                />
                                <Tooltip 
                                    formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#3b82f6" 
                                    strokeWidth={4} 
                                    dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#fff' }} 
                                    activeDot={{ r: 8, strokeWidth: 0 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemDashboardPage;
