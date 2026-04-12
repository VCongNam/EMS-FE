import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';

const STATUS_CONFIG = {
    Paid: { label: 'Đã đóng', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'solar:check-read-bold' },
    Partial: { label: 'Một phần', color: 'text-amber-600', bg: 'bg-amber-50', icon: 'solar:clock-circle-bold' },
    Pending: { label: 'Chờ nộp', color: 'text-blue-600', bg: 'bg-blue-50', icon: 'solar:hourglass-line-bold' },
    Overdue: { label: 'Quá hạn', color: 'text-red-600', bg: 'bg-red-50', icon: 'solar:danger-bold' },
};

const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

const StudentPaymentTable = ({ students = [], onHistoryClick, onExtendClick }) => {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesFilter = filter === 'All' || s.status === filter;
            const matchesSearch = (s.name || s.studentName || '').toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [filter, search, students]);

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
                    <div className="!flex !bg-background !p-1 !rounded-xl !border !border-border !overflow-x-auto custom-scrollbar">
                        {['All', 'Paid', 'Partial', 'Pending', 'Overdue'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`!whitespace-nowrap !px-4 !py-1.5 !rounded-lg !text-xs !font-black !transition-all ${
                                    filter === f 
                                    ? '!bg-white !text-primary !shadow-sm' 
                                    : '!text-text-muted hover:!text-text-main'
                                }`}
                            >
                                {f === 'All' ? 'Tất cả' : STATUS_CONFIG[f]?.label || f}
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
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest text-center">Số buổi</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Sổ nợ / Cấn trừ</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Đã nộp</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Còn lại</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Trạng thái</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest !text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="!divide-y !divide-border">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="!py-20 !text-center">
                                            <div className="!flex !flex-col !items-center !gap-2 !opacity-40">
                                                <Icon icon="solar:folder-error-bold" className="!text-5xl" />
                                                <p className="!font-bold">Chưa có hoặc không tìm thấy dữ liệu hóa đơn</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student) => {
                                        const config = STATUS_CONFIG[student.status] || STATUS_CONFIG['Pending'];
                                        const expectedAmount = student.expectedAmount || student.due || 0;
                                        const paidAmount = student.paidAmount || student.paid || 0;
                                        const creditBalance = student.creditBalance || 0;
                                        const balance = student.remainingAmount || (expectedAmount - paidAmount - creditBalance);

                                        return (
                                            <tr key={student.studentId || student.id} className="!group hover:!bg-[#F8FAFC] !transition-all">
                                                <td className="!px-6 !py-5">
                                                    <div className="!flex !items-center !gap-3">
                                                        <div className="!w-9 !h-9 !rounded-full !bg-primary/5 !border !border-primary/10 !flex !items-center !justify-center">
                                                            <Icon icon="solar:user-bold" className="!text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="!text-sm !font-bold !text-text-main">{student.studentName || student.name}</p>
                                                            <p className="!text-[10px] !font-black !text-text-muted !uppercase">{student.studentId || student.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="!px-6 !py-5 text-center">
                                                    <span className="!text-sm !font-black !text-text-main !bg-background !px-3 !py-1 !rounded-lg !border !border-border">
                                                        {student.totalSessions || '--'}
                                                    </span>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <div className="!flex !flex-col">
                                                        <span className="!text-sm !font-black !text-text-main">{formatVND(expectedAmount)}</span>
                                                        {creditBalance > 0 && (
                                                            <span className="!text-[10px] !font-bold !text-emerald-500">- Dư cấn trừ: {formatVND(creditBalance)}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <span className="!text-sm !font-black !text-emerald-600">{formatVND(paidAmount)}</span>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <span className={`!text-sm !font-black ${balance > 0 ? '!text-red-500' : '!text-text-muted'}`}>
                                                        {formatVND(Math.max(0, balance))}
                                                    </span>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <div className={`!inline-flex !items-center !gap-1.5 !px-3 !py-1 !rounded-full !text-[11px] !font-black ${config.bg} ${config.color}`}>
                                                        <Icon icon={config.icon} />
                                                        {config.label}
                                                    </div>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <div className="!flex !items-center !justify-end !gap-2">
                                                        <button 
                                                            className="!p-2 !rounded-xl !bg-background !border !border-border hover:!border-emerald-500 hover:!text-emerald-600 !transition-all"
                                                            title="Thu tiền mặt"
                                                        >
                                                            <Icon icon="solar:wad-of-money-bold-duotone" className="!text-lg" />
                                                        </button>
                                                        {balance > 0 && (
                                                            <button 
                                                                className="!p-2 !rounded-xl !bg-background !border !border-border hover:!border-amber-500 hover:!text-amber-600 !transition-all"
                                                                title="Nhắc nợ"
                                                            >
                                                                <Icon icon="solar:bell-bing-bold-duotone" className="!text-lg" />
                                                            </button>
                                                        )}
                                                        {student.invoiceId && (
                                                            <button 
                                                                onClick={() => onExtendClick && onExtendClick(student)}
                                                                className="!p-2 !rounded-xl !bg-background !border !border-border hover:!border-primary hover:!text-primary !transition-all !group/btn"
                                                                title="Gia hạn nộp"
                                                            >
                                                                <Icon icon="solar:calendar-add-bold-duotone" className="!text-lg" />
                                                            </button>
                                                        )}
                                                        <button 
                                                            onClick={() => onHistoryClick && onHistoryClick(student)}
                                                            className="!p-2 !rounded-xl !bg-background !border !border-border hover:!border-purple-500 hover:!text-purple-600 !transition-all"
                                                            title="Lịch sử giao dịch"
                                                        >
                                                            <Icon icon="solar:history-bold-duotone" className="!text-lg" />
                                                        </button>
                                                    </div>
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
                             <p className="!font-bold">Chưa có dữ liệu</p>
                        </div>
                    ) : (
                        filteredStudents.map((student) => {
                            const config = STATUS_CONFIG[student.status] || STATUS_CONFIG['Pending'];
                            const expectedAmount = student.expectedAmount || student.due || 0;
                            const paidAmount = student.paidAmount || student.paid || 0;
                            const balance = student.remainingAmount || Math.max(0, expectedAmount - paidAmount - (student.creditBalance || 0));

                            return (
                                <div key={student.studentId || student.id} className="!p-4 !space-y-4">
                                    <div className="!flex !items-center !justify-between">
                                        <div className="!flex !items-center !gap-3">
                                            <div className="!w-10 !h-10 !rounded-full !bg-primary/5 !border !border-primary/10 !flex !items-center !justify-center">
                                                <Icon icon="solar:user-bold" className="!text-primary" />
                                            </div>
                                            <div>
                                                <p className="!text-sm !font-bold !text-text-main">{student.studentName || student.name}</p>
                                                <p className="!text-[10px] !font-black !text-text-muted">{student.studentId || student.id}</p>
                                            </div>
                                        </div>
                                        <div className={`!inline-flex !items-center !gap-1.5 !px-3 !py-1 !rounded-full !text-[11px] !font-black ${config.bg} ${config.color}`}>
                                            <Icon icon={config.icon} />
                                            {config.label}
                                        </div>
                                    </div>

                                    <div className="!grid !grid-cols-3 !gap-2 !p-3 !bg-background !rounded-2xl !border !border-border">
                                        <div className="!space-y-1">
                                            <p className="!text-[9px] !font-black !text-text-muted !uppercase">Phải nộp</p>
                                            <p className="!text-xs !font-black !text-text-main">{formatVND(expectedAmount)}</p>
                                        </div>
                                        <div className="!space-y-1">
                                            <p className="!text-[9px] !font-black !text-text-muted !uppercase">Đã nộp</p>
                                            <p className="!text-xs !font-black !text-emerald-600">{formatVND(paidAmount)}</p>
                                        </div>
                                        <div className="!space-y-1">
                                            <p className="!text-[9px] !font-black !text-text-muted !uppercase">Còn lại</p>
                                            <p className={`!text-xs !font-black ${balance > 0 ? '!text-red-500' : '!text-text-muted'}`}>{formatVND(balance)}</p>
                                        </div>
                                    </div>

                                    <div className="!flex !justify-end !gap-2">
                                        {student.invoiceId && (
                                            <button 
                                                onClick={() => onExtendClick && onExtendClick(student)}
                                                className="!flex !items-center !gap-2 !px-4 !py-2 !rounded-xl !bg-white !border !border-border !text-xs !font-bold hover:!border-amber-500 hover:!text-amber-600 !transition-all"
                                            >
                                                <Icon icon="solar:calendar-add-bold-duotone" className="!text-base" />
                                                Gia hạn
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => onHistoryClick && onHistoryClick(student)}
                                            className="!flex !items-center !gap-2 !px-4 !py-2 !rounded-xl !bg-white !border !border-border !text-xs !font-bold hover:!border-primary hover:!text-primary !transition-all"
                                        >
                                            <Icon icon="solar:history-bold-duotone" className="!text-base" />
                                            Lịch sử
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
