import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const ViewSchedulePage = () => {
    const [currentWeek, setCurrentWeek] = useState('02/10 - 08/10/2026');

    // Dummy schedule data
    const scheduleData = [
        { id: 1, day: 'Thứ 2', date: '02/10', class: 'Toán Cao Cấp (MATH101)', time: '08:00 - 10:00', room: 'P.301', type: 'lecture' },
        { id: 2, day: 'Thứ 4', date: '04/10', class: 'Vật Lý Đại Cương (PHYS101)', time: '13:30 - 15:30', room: 'P.405', type: 'practice' },
        { id: 3, day: 'Thứ 6', date: '06/10', class: 'Toán Cao Cấp (MATH101)', time: '08:00 - 10:00', room: 'P.301', type: 'lecture' },
    ];

    const handleDelete = (id) => {
        toast.success('Đã xóa buổi học!');
    };

    const handleEdit = (id) => {
        toast.info('Tính năng chỉnh sửa đang được phát triển.');
    };

    return (
        <div className="w-full mx-auto space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-[2rem] border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
                        <Icon icon="material-symbols:calendar-month-rounded" className="text-primary text-3xl" />
                        Lịch học tuần
                    </h1>
                    <p className="text-text-muted mt-1">Tuần {currentWeek}</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 border border-border rounded-xl text-text-muted hover:bg-background transition-colors">
                        <Icon icon="material-symbols:chevron-left-rounded" className="text-xl" />
                    </button>
                    <button className="px-4 py-2 border border-border rounded-xl font-semibold text-text-main hover:bg-background transition-colors">
                        Hôm nay
                    </button>
                    <button className="p-2 border border-border rounded-xl text-text-muted hover:bg-background transition-colors">
                        <Icon icon="material-symbols:chevron-right-rounded" className="text-xl" />
                    </button>
                    
                    <button className="ml-4 px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 shadow-md hover:shadow-primary/30 transition-all flex items-center gap-2">
                        <Icon icon="material-symbols:add-rounded" className="text-xl" /> Đăng ký sự kiện
                    </button>
                </div>
            </div>

            {/* List / Calendar View */}
            <div className="bg-surface p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="space-y-4">
                    {scheduleData.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            <Icon icon="material-symbols:event-busy-outline-rounded" className="mx-auto text-5xl mb-4 opacity-50" />
                            <p>Không có lịch học nào trong tuần này.</p>
                        </div>
                    ) : (
                        scheduleData.map(item => (
                            <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md bg-background transition-all group">
                                <div className="flex items-center gap-6 w-full sm:w-auto">
                                    <div className="flex flex-col items-center justify-center min-w-[80px] px-4 py-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                                        <span className="text-sm font-bold uppercase">{item.day}</span>
                                        <span className="text-xl font-extrabold">{item.date}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-lg text-text-main">{item.class}</h3>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded uppercase tracking-wider ${
                                                item.type === 'lecture' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                            }`}>
                                                {item.type === 'lecture' ? 'Lý thuyết' : 'Thực hành'}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                                            <span className="flex items-center gap-1 font-medium">
                                                <Icon icon="material-symbols:schedule-rounded" className="text-lg text-primary/70" />
                                                {item.time}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Icon icon="material-symbols:door-open-outline-rounded" className="text-lg text-orange-500/70" />
                                                {item.room}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleEdit(item.id)}
                                        className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-xl transition-colors border border-transparent hover:border-primary/20"
                                    >
                                        <Icon icon="material-symbols:edit-calendar-rounded" className="text-xl" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200"
                                    >
                                        <Icon icon="material-symbols:delete-outline-rounded" className="text-xl" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewSchedulePage;
