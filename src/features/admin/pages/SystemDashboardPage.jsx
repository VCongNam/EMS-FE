import React from 'react';
import { Icon } from '@iconify/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const SystemDashboardPage = () => {
    // Mock Data
    const revenueData = [
        { name: 'Tháng 1', revenue: 40000000 },
        { name: 'Tháng 2', revenue: 30000000 },
        { name: 'Tháng 3', revenue: 50000000 },
        { name: 'Tháng 4', revenue: 45000000 },
        { name: 'Tháng 5', revenue: 60000000 },
        { name: 'Tháng 6', revenue: 55000000 },
    ];

    const roleData = [
        { name: 'Học sinh', value: 850, color: '#3b82f6' }, // blue-500
        { name: 'Giáo viên', value: 45, color: '#10b981' }, // emerald-500
        { name: 'Trợ giảng', value: 30, color: '#f59e0b' }, // amber-500
    ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="!space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-main font-['Outfit']">Tổng quan Hệ thống</h1>
                <p className="text-sm text-text-secondary !mt-1">Giám sát tổng thể hoạt động của hệ thống EMS.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="!bg-white !p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-text-secondary font-medium">Tổng Doanh thu</p>
                        <h3 className="text-2xl font-bold text-text-main !mt-2">1,250,000,000 ₫</h3>
                        <p className="text-xs text-green-500 !mt-2 font-medium flex items-center gap-1">
                            <Icon icon="material-symbols:trending-up-rounded" /> +15.5% so với tháng trước
                        </p>
                    </div>
                    <div className="w-14 h-14 !bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Icon icon="solar:wallet-money-bold-duotone" className="text-3xl" />
                    </div>
                </div>

                <div className="!bg-white !p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-text-secondary font-medium">Giáo viên Hoạt động</p>
                        <h3 className="text-2xl font-bold text-text-main !mt-2">45</h3>
                        <p className="text-xs text-text-secondary !mt-2 font-medium">
                            Giáo viên đang phụ trách lớp
                        </p>
                    </div>
                    <div className="w-14 h-14 !bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <Icon icon="material-symbols:school-rounded" className="text-3xl" />
                    </div>
                </div>

                <div className="!bg-white !p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-text-secondary font-medium">Học sinh / Trợ giảng</p>
                        <h3 className="text-2xl font-bold text-text-main !mt-2">880</h3>
                        <p className="text-xs text-text-secondary !mt-2 font-medium">
                            Đang hoạt động trong tháng
                        </p>
                    </div>
                    <div className="w-14 h-14 !bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <Icon icon="material-symbols:group-rounded" className="text-3xl" />
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="!bg-white !p-6 rounded-2xl border border-border shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between !mb-6">
                        <h3 className="text-lg font-bold text-text-main font-['Outfit']">Doanh thu 6 tháng gần nhất</h3>
                        <button className="text-sm text-primary font-medium hover:underline">Xem báo cáo chi tiết</button>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis 
                                    tickFormatter={(value) => `${value / 1000000}Tr`} 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#64748b', fontSize: 12 }} 
                                    dx={-10} 
                                />
                                <Tooltip 
                                    formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Role Distribution Pie Chart */}
                <div className="!bg-white !p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-text-main font-['Outfit'] !mb-6">Phân bổ Vai trò</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => [value, 'Người dùng']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Legend */}
                    <div className="!mt-4 !space-y-3">
                        {roleData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-text-secondary">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-text-main">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemDashboardPage;
