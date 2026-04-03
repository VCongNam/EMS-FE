import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const DashboardDeadlines = ({ deadlines }) => {
    const MOCK_DEADLINES = deadlines || [
        { id: 1, title: 'Bài tập Giải tích 1', subject: 'Toán học', dueDate: 'Hôm nay, 23:59', status: 'Urgent' },
        { id: 2, title: 'Báo cáo Thí nghiệm Lý', subject: 'Vật lý', dueDate: 'Ngày mai, 12:00', status: 'Soon' },
        { id: 3, title: 'Tiểu luận Triết học', subject: 'Triết học', dueDate: '15/10/2026', status: 'Normal' },
    ];

    return (
        <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm !space-y-6">
            <div className="!flex !items-center !justify-between">
                <div className="!flex !items-center !gap-3">
                    <div className="!w-10 !h-10 !rounded-xl !bg-red-50 !text-red-500 !flex !items-center !justify-center">
                        <Icon icon="solar:fire-bold-duotone" className="!text-2xl" />
                    </div>
                    <h3 className="!text-lg !font-black !text-text-main !tracking-tight">Hạn nộp bài tập</h3>
                </div>
                <Link to="/student/classes" className="!text-xs !font-black !text-primary hover:!underline">Xem tất cả</Link>
            </div>

            <div className="!space-y-4">
                {MOCK_DEADLINES.map((item) => (
                    <div key={item.id} className="!group !flex !items-center !justify-between !p-4 !rounded-2xl !bg-background hover:!bg-primary/5 !border !border-transparent hover:!border-primary/20 !transition-all">
                        <div className="!flex !items-start !gap-4">
                            <div className={`!w-2 !h-12 !rounded-full ${
                                item.status === 'Urgent' ? '!bg-red-500' : item.status === 'Soon' ? '!bg-orange-500' : '!bg-emerald-500'
                            }`} />
                            <div>
                                <h4 className="!text-sm !font-black !text-text-main group-hover:!text-primary !transition-colors">{item.title}</h4>
                                <p className="!text-[11px] !font-bold !text-text-muted mt-1">{item.subject} • {item.dueDate}</p>
                            </div>
                        </div>
                        <button className="!p-2 !bg-white !rounded-xl !text-text-muted hover:!text-primary !shadow-sm !transition-all opacity-0 group-hover:opacity-100">
                            <Icon icon="solar:upload-bold-duotone" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardDeadlines;
