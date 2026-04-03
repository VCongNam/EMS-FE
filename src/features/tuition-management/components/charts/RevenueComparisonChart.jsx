import React from 'react';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    Cell
} from 'recharts';

const MOCK_DATA = [
    { name: 'TC101', revenue: 42000000 },
    { name: 'TC102', revenue: 38500000 },
    { name: 'TC103', revenue: 21000000 },
    { name: 'TC104', revenue: 15600000 },
    { name: 'TC105', revenue: 9800000 },
];

const COLORS = ['#355872', '#4B7C9D', '#6CA8C7', '#A0CED9', '#D1E8ED'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="!bg-white !p-3 !rounded-xl !border !border-border !shadow-lg">
                <p className="!text-xs !font-black !text-text-muted !uppercase !mb-1">Lớp: {label}</p>
                <p className="!text-sm !font-black !text-text-main">
                    Thực thu: {payload[0].value.toLocaleString('vi-VN')} ₫
                </p>
            </div>
        );
    }
    return null;
};

const RevenueComparisonChart = ({ data = MOCK_DATA }) => {
    return (
        <div className="!h-[350px] !w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
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
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar 
                        dataKey="revenue" 
                        radius={[6, 6, 0, 0]} 
                        barSize={40}
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueComparisonChart;
