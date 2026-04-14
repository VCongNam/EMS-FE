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

    const fetchDashboard = async (start = '', end = '') => {
        setLoading(true);
        try {
            const data = await adminService.getDashboardStats(start, end);
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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

    const userGrowthData = stats?.userGrowthChart || [];
    const systemUsageData = stats?.systemUsageChart || [];

    return (
        <div className="!space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-text-main font-['Outfit'] tracking-tight">Tổng quan Hệ thống</h1>
                    <p className="text-sm text-text-secondary !mt-1">Giám sát tổng thể hoạt động của hệ thống EMS.</p>
                </div>
                {/* Placeholder for RangePicker or Date Filter */}
                {/* <RangePicker onChange={(dates) => handleDateChange(dates)} /> */}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Thẻ 1: Lớp học đang hoạt động */}
                <div className="!bg-white !p-6 rounded-3xl border border-border shadow-soft hover:shadow-lg transition-all border-l-4 border-l-blue-500 group">
                    <div className="flex items-center justify-between !mb-4">
                        <div className="w-12 h-12 !bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon icon="solar:round-transfer-horizontal-bold-duotone" className="text-2xl" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded-full">Classes</span>
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Lớp Đang Hoạt Động</p>
                        <h3 className="text-2xl font-black text-text-main !mt-1">{stats?.totalActiveClasses || 0}</h3>
                        <p className="text-xs text-blue-500 !mt-2 font-medium">Lớp học hiện tại</p>
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

                {/* Thẻ 4: Tổng Lượt tương tác */}
                <div className="!bg-white !p-6 rounded-3xl border border-border shadow-soft hover:shadow-lg transition-all border-l-4 border-l-amber-500 group">
                    <div className="flex items-center justify-between !mb-4">
                        <div className="w-12 h-12 !bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon icon="solar:user-id-bold-duotone" className="text-2xl" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-1 rounded-full">Engagement</span>
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-wider">Tổng tương tác</p>
                        <h3 className="text-2xl font-black text-text-main !mt-1">{stats?.engagementInPeriod || 0}</h3>
                        <p className="text-xs text-amber-600 !mt-2 font-bold flex items-center gap-1 bg-amber-50 w-fit px-2 py-1 rounded-lg">
                            <Icon icon="solar:user-plus-bold-duotone" /> +{stats?.newRegistrationsInPeriod || 0} <span className="text-[10px] opacity-70">đăng ký mới kì này</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Biểu đồ Tăng trưởng */}
                <div className="!bg-white !p-8 rounded-3xl border border-border shadow-soft">
                    <div className="flex items-center justify-between !mb-8">
                        <div>
                            <h3 className="text-lg font-black text-text-main font-['Outfit'] tracking-tight">Tăng trưởng Người dùng</h3>
                            <p className="text-xs text-text-secondary">Giáo viên (Value 1) vs Học sinh (Value 2)</p>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" name="Giáo viên" dataKey="value1" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                                <Line type="monotone" name="Học sinh" dataKey="value2" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Biểu đồ Hoạt động */}
                <div className="!bg-white !p-8 rounded-3xl border border-border shadow-soft">
                    <div className="flex items-center justify-between !mb-8">
                        <div>
                            <h3 className="text-lg font-black text-text-main font-['Outfit'] tracking-tight">Cường độ Hoạt động</h3>
                            <p className="text-xs text-text-secondary">Tương tác tính theo hệ thống (Post vs Assignment)</p>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={systemUsageData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                <Line type="step" name="Hoạt động 1" dataKey="value1" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                                <Line type="step" name="Hoạt động 2" dataKey="value2" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemDashboardPage;
