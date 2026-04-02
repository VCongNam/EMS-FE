import React from 'react';
import { 
    PieChart, 
    Pie, 
    Cell, 
    Tooltip, 
    ResponsiveContainer,
    Legend
} from 'recharts';

const MOCK_DATA = [
    { name: 'Toán Nâng Cao', value: 35 },
    { name: 'Vật Lý Cơ Bản', value: 25 },
    { name: 'Hóa Học-Hữu Cơ', value: 20 },
    { name: 'Tiếng Anh ielts', value: 15 },
    { name: 'Lớp khác', value: 5 },
];

const COLORS = ['#355872', '#4B7C9D', '#6CA8C7', '#A0CED9', '#D1E8ED'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="!bg-white !p-3 !rounded-xl !border !border-border !shadow-lg">
                <p className="!text-xs !font-black !text-text-main !mb-1">{payload[0].name}</p>
                <p className="!text-sm !font-black !text-primary">Tỷ trọng: {payload[0].value}%</p>
            </div>
        );
    }
    return null;
};

const RevenueDistributionChart = ({ data = MOCK_DATA }) => {
    return (
        <div className="!h-[350px] !w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        animationDuration={1500}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        iconType="circle"
                        formatter={(value) => <span className="!text-[11px] !font-bold !text-text-muted">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RevenueDistributionChart;
