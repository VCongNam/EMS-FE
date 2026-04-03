import React from 'react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

const MOCK_DATA = [
    { name: 'Tháng 10/25', total: 45000000 },
    { name: 'Tháng 11/25', total: 52000000 },
    { name: 'Tháng 12/25', total: 48000000 },
    { name: 'Tháng 01/26', total: 61000000 },
    { name: 'Tháng 02/26', total: 55000000 },
    { name: 'Tháng 03/26', total: 72000000 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="!bg-white/90 !backdrop-blur-md !p-4 !rounded-2xl !border !border-border !shadow-xl">
                <p className="!text-xs !font-black !text-text-muted !uppercase !mb-1">{label}</p>
                <div className="!flex !items-center !gap-2">
                    <div className="!w-2 !h-2 !rounded-full !bg-primary" />
                    <p className="!text-sm !font-black !text-text-main">
                        Doanh thu: {payload[0].value.toLocaleString('vi-VN')} ₫
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const RevenueTrendChart = ({ data = MOCK_DATA }) => {
    return (
        <div className="!h-[350px] !w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#355872" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#355872" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                        tickFormatter={(value) => `${value / 1000000}M`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#355872" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorTotal)" 
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueTrendChart;
