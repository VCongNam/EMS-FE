import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';

const MOCK_STUDENTS = [
    { id: 'S101', name: 'Nguyễn Văn A', due: 1500000, paid: 1500000, balance: 0, status: 'Paid' },
    { id: 'S102', name: 'Trần Thị B', due: 1500000, paid: 500000, balance: 1000000, status: 'Partial' },
    { id: 'S103', name: 'Lê Hoàng C', due: 1200000, paid: 0, balance: 1200000, status: 'Overdue' },
    { id: 'S104', name: 'Phạm Văn D', due: 1500000, paid: 1500000, balance: 0, status: 'Paid' },
    { id: 'S105', name: 'Hoàng Thị E', due: 1200000, paid: 1200000, balance: 0, status: 'Paid' },
    { id: 'S106', name: 'Bùi Minh F', due: 1500000, paid: 0, balance: 1500000, status: 'Overdue' },
];

const STATUS_CONFIG = {
    Paid: { label: 'Đã đóng', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'solar:check-read-bold' },
    Partial: { label: 'Một phần', color: 'text-amber-600', bg: 'bg-amber-50', icon: 'solar:clock-circle-bold' },
    Overdue: { label: 'Quá hạn', color: 'text-red-600', bg: 'bg-red-50', icon: 'solar:danger-bold' },
};

const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

const StudentPaymentTable = ({ onStudentClick }) => {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const filteredStudents = useMemo(() => {
        return MOCK_STUDENTS.filter(s => {
            const matchesFilter = filter === 'All' || s.status === filter;
            const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [filter, search]);

    return (
        <div className="!space-y-4">
            {/* Filters Row */}
            <div className="!flex !flex-col sm:!flex-row !items-center !justify-between !gap-4">
                <div className="!relative !w-full sm:!w-72">
                    <Icon icon="solar:magnifer-linear" className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-text-muted" />
                    <input 
                        type="text" 
                        placeholder="Tìm học sinh..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="!w-full !pl-10 !pr-4 !py-3 !bg-white !border !border-border !rounded-2xl !text-sm !font-medium focus:!outline-none focus:!border-primary !transition-all"
                    />
                </div>
                <div className="!flex !items-center !gap-2 !w-full sm:!w-auto">
                    <span className="!text-xs !font-black !text-text-muted !uppercase !tracking-wider">Lọc:</span>
                    <div className="!flex !bg-background !p-1 !rounded-xl !border !border-border">
                        {['All', 'Paid', 'Partial', 'Overdue'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`!px-4 !py-1.5 !rounded-lg !text-xs !font-black !transition-all ${
                                    filter === f 
                                    ? '!bg-white !text-primary !shadow-sm' 
                                    : '!text-text-muted hover:!text-text-main'
                                }`}
                            >
                                {f === 'All' ? 'Tất cả' : STATUS_CONFIG[f].label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content - Responsive */}
            <div className="!bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden">
                {/* ── Desktop Table (md+) ─────────────────────────── */}
                <div className="!hidden md:!block">
                    <div className="!overflow-x-auto custom-scrollbar">
                        <table className="!w-full !text-left !border-collapse">
                            <thead>
                                <tr className="!bg-[#F8FAFC] !border-b !border-border">
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Học sinh</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Phải nộp</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Đã nộp</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Còn lại</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Trạng thái</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest !text-right">Chi tiết</th>
                                </tr>
                            </thead>
                            <tbody className="!divide-y !divide-border">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="!py-20 !text-center">
                                            <div className="!flex !flex-col !items-center !gap-2 !opacity-40">
                                                <Icon icon="solar:folder-error-bold" className="!text-5xl" />
                                                <p className="!font-bold">Không tìm thấy dữ liệu</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => {
                                        const config = STATUS_CONFIG[student.status];
                                        return (
                                            <tr key={student.id} className="!group hover:!bg-[#F8FAFC] !transition-all">
                                                <td className="!px-6 !py-5">
                                                    <div className="!flex !items-center !gap-3">
                                                        <div className="!w-9 !h-9 !rounded-full !bg-primary/5 !border !border-primary/10 !flex !items-center !justify-center">
                                                            <Icon icon="solar:user-bold" className="!text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="!text-sm !font-bold !text-text-main">{student.name}</p>
                                                            <p className="!text-[10px] !font-black !text-text-muted !uppercase">{student.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <span className="!text-sm !font-black !text-text-main">{formatVND(student.due)}</span>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <span className="!text-sm !font-black !text-emerald-600">{formatVND(student.paid)}</span>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <span className={`!text-sm !font-black ${student.balance > 0 ? '!text-red-500' : '!text-text-muted'}`}>
                                                        {formatVND(student.balance)}
                                                    </span>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <div className={`!inline-flex !items-center !gap-1.5 !px-3 !py-1 !rounded-full !text-[11px] !font-black ${config.bg} ${config.color}`}>
                                                        <Icon icon={config.icon} />
                                                        {config.label}
                                                    </div>
                                                </td>
                                                <td className="!px-6 !py-5 !text-right">
                                                    <button 
                                                        onClick={() => onStudentClick(student)}
                                                        className="!p-2 !rounded-xl !bg-background !border !border-border hover:!border-primary hover:!text-primary !transition-all"
                                                    >
                                                        <Icon icon="solar:history-bold-duotone" className="!text-lg" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Mobile Card List (below md) ─────────────────── */}
                <div className="md:!hidden !divide-y !divide-border">
                    {filteredStudents.length === 0 ? (
                        <div className="!py-16 !text-center !opacity-40">
                             <p className="!font-bold">Không tìm thấy dữ liệu</p>
                        </div>
                    ) : (
                        filteredStudents.map((student) => {
                            const config = STATUS_CONFIG[student.status];
                            return (
                                <div key={student.id} className="!p-4 !space-y-4">
                                    {/* Row 1: Student + Status */}
                                    <div className="!flex !items-center !justify-between">
                                        <div className="!flex !items-center !gap-3">
                                            <div className="!w-10 !h-10 !rounded-full !bg-primary/5 !border !border-primary/10 !flex !items-center !justify-center">
                                                <Icon icon="solar:user-bold" className="!text-primary" />
                                            </div>
                                            <div>
                                                <p className="!text-sm !font-bold !text-text-main">{student.name}</p>
                                                <p className="!text-[10px] !font-black !text-text-muted">{student.id}</p>
                                            </div>
                                        </div>
                                        <div className={`!inline-flex !items-center !gap-1.5 !px-3 !py-1 !rounded-full !text-[11px] !font-black ${config.bg} ${config.color}`}>
                                            <Icon icon={config.icon} />
                                            {config.label}
                                        </div>
                                    </div>

                                    {/* Row 2: Financial Grid */}
                                    <div className="!grid !grid-cols-3 !gap-2 !p-3 !bg-background !rounded-2xl !border !border-border">
                                        <div className="!space-y-1">
                                            <p className="!text-[9px] !font-black !text-text-muted !uppercase">Phải nộp</p>
                                            <p className="!text-xs !font-black !text-text-main">{formatVND(student.due)}</p>
                                        </div>
                                        <div className="!space-y-1">
                                            <p className="!text-[9px] !font-black !text-text-muted !uppercase">Đã nộp</p>
                                            <p className="!text-xs !font-black !text-emerald-600">{formatVND(student.paid)}</p>
                                        </div>
                                        <div className="!space-y-1">
                                            <p className="!text-[9px] !font-black !text-text-muted !uppercase">Còn lại</p>
                                            <p className={`!text-xs !font-black ${student.balance > 0 ? '!text-red-500' : '!text-text-muted'}`}>{formatVND(student.balance)}</p>
                                        </div>
                                    </div>

                                    {/* Row 3: Action */}
                                    <div className="!flex !justify-end">
                                        <button 
                                            onClick={() => onStudentClick(student)}
                                            className="!flex !items-center !gap-2 !px-4 !py-2 !rounded-xl !bg-white !border !border-border !text-xs !font-bold hover:!border-primary !transition-all"
                                        >
                                            <Icon icon="solar:history-bold-duotone" className="!text-base !text-primary" />
                                            Xem lịch sử
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentPaymentTable;
