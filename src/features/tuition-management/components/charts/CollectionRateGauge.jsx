import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const CollectionRateGauge = ({ rate = 0 }) => {
    // Valid values: 0 to 100
    const clampedRate = Math.min(Math.max(rate, 0), 100);
    const data = [
        { name: 'Collected', value: clampedRate },
        { name: 'Remaining', value: 100 - clampedRate }
    ];

    // Colors mapping
    let color = '#3b82f6'; // default blue
    if (clampedRate >= 80) color = '#10b981'; // emerald-500
    else if (clampedRate >= 50) color = '#f59e0b'; // amber-500
    else if (clampedRate > 0) color = '#ef4444'; // red-500
    
    const COLORS = [color, '#f1f5f9']; // Tỷ lệ và phần trống (slate-100)

    return (
        <div className="!relative !w-full !flex !flex-col !items-center !justify-center">
            <div className="!h-[100px] !w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={40}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            {/* Center Label */}
            <div className="!absolute !bottom-2 !left-1/2 !-translate-x-1/2 !text-center">
                <h3 className="!text-xl !font-black !text-text-main !tracking-tight">
                    {clampedRate}%
                </h3>
            </div>
        </div>
    );
};

export default CollectionRateGauge;
