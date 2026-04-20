import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { formatViFullDate } from '../../../utils/dateUtils';

const STATUS_CONFIG = {
    Paid: { label: 'Đã đóng', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'solar:check-read-bold' },
    Pending: { label: 'Chờ nộp', color: 'text-blue-600', bg: 'bg-blue-50', icon: 'solar:hourglass-line-bold' },
    Overdue: { label: 'Quá hạn', color: 'text-red-600', bg: 'bg-red-50', icon: 'solar:danger-bold' },
};

const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

const formatDate = (dateStr) => {
    return formatViFullDate(dateStr) || '--';
};

const StudentPaymentTable = ({ students = [], onExtendClick }) => {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;

    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesFilter = filter === 'All' || s.status === filter;
            const matchesSearch = (s.name || s.studentName || '').toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [filter, search, students]);

    // Reset pagination when filter/search changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filter, search]);

    const totalPages = Math.ceil(filteredStudents.length / rowsPerPage);
    const paginatedStudents = filteredStudents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
                        {['All', 'Paid', 'Pending', 'Overdue'].map((f) => (
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
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Mô tả</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest text-center">Đơn giá</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest text-center">Số buổi</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Tổng tiền</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Đã nộp</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Ngày hết hạn</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Trạng thái</th>
                                    <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest !text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="!divide-y !divide-border">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="!py-20 !text-center">
                                            <div className="!flex !flex-col !items-center !gap-2 !opacity-40">
                                                <Icon icon="solar:folder-error-bold" className="!text-5xl" />
                                                <p className="!font-bold">Chưa có hoặc không tìm thấy dữ liệu hóa đơn</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedStudents.map((student) => {
                                        const config = STATUS_CONFIG[student.status] || STATUS_CONFIG['Pending'];
                                        const expectedAmount = student.totalAmount || student.expectedAmount || 0;
                                        const paidAmount = student.paidAmount || 0;
                                        const sessionCount = student.sessionCount || student.totalSessions || 0;

                                        return (
                                            <tr key={student.invoiceId || student.studentId || student.id} className="!group hover:!bg-[#F8FAFC] !transition-all">
                                                <td className="!px-6 !py-5">
                                                    <div className="!flex !items-center !gap-3">
                                                        <div className="!w-9 !h-9 !rounded-full !bg-primary/5 !border !border-primary/10 !flex !items-center !justify-center !overflow-hidden">
                                                            {student.avatarUrl ? (
                                                                <img src={student.avatarUrl} alt={student.studentName} className="!w-full !h-full !object-cover" />
                                                            ) : (
                                                                <Icon icon="solar:user-bold" className="!text-primary" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="!text-sm !font-bold !text-text-main">{student.studentName || student.name}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <p className="!text-xs !font-medium !text-text-muted !max-w-[180px] !truncate" title={student.description || '--'}>
                                                        {student.description || '--'}
                                                    </p>
                                                </td>
                                                <td className="!px-6 !py-5 text-center">
                                                    <span className="!text-sm !font-black !text-text-main">
                                                        {formatVND(student.unitPrice || student.pricePerSession || 0)}
                                                    </span>
                                                </td>
                                                <td className="!px-6 !py-5 text-center">
                                                    <span className="!text-sm !font-black !text-text-main !bg-background !px-3 !py-1 !rounded-lg !border !border-border">
                                                        {sessionCount}
                                                    </span>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <span className="!text-sm !font-black !text-text-main">{formatVND(expectedAmount)}</span>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <span className="!text-sm !font-black !text-emerald-600">{formatVND(paidAmount)}</span>
                                                </td>
                                                <td className="!px-6 !py-5">
                                                    <span className={`!text-sm !font-bold ${student.status === 'Overdue' ? '!text-red-600' : '!text-text-main'}`}>
                                                        {formatDate(student.dueDate)}
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
                                                        {(student.status === 'Overdue' || student.status === 'Pending') && student.invoiceId && (
                                                            <button 
                                                                onClick={() => onExtendClick && onExtendClick(student)}
                                                                className={`!p-2 !rounded-xl !bg-background !border !border-border !transition-all !group/btn ${
                                                                    student.status === 'Overdue' ? 'hover:!border-amber-500 hover:!text-amber-600' : 'hover:!border-blue-500 hover:!text-blue-600'
                                                                }`}
                                                                title="Gia hạn nộp"
                                                            >
                                                                <Icon icon="solar:calendar-add-bold-duotone" className="!text-lg" />
                                                            </button>
                                                        )}
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
                        paginatedStudents.map((student) => {
                            const config = STATUS_CONFIG[student.status] || STATUS_CONFIG['Pending'];
                            const expectedAmount = student.totalAmount || student.expectedAmount || 0;
                            const paidAmount = student.paidAmount || 0;
                            const sessionCount = student.sessionCount || student.totalSessions || 0;

                            return (
                                <div key={student.invoiceId || student.studentId || student.id} className="!p-4 !space-y-4">
                                    <div className="!flex !items-center !justify-between">
                                        <div className="!flex !items-center !gap-3">
                                            <div className="!w-10 !h-10 !rounded-full !bg-primary/5 !border !border-primary/10 !flex !items-center !justify-center !overflow-hidden">
                                                {student.avatarUrl ? (
                                                    <img src={student.avatarUrl} alt={student.studentName} className="!w-full !h-full !object-cover" />
                                                ) : (
                                                    <Icon icon="solar:user-bold" className="!text-primary" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="!text-sm !font-bold !text-text-main">{student.studentName || student.name}</p>
                                            </div>
                                        </div>
                                        <div className={`!inline-flex !items-center !gap-1.5 !px-3 !py-1 !rounded-full !text-[11px] !font-black ${config.bg} ${config.color}`}>
                                            <Icon icon={config.icon} />
                                            {config.label}
                                        </div>
                                    </div>

                                    {student.description && (
                                        <p className="!text-xs !font-medium !text-text-muted !px-1">{student.description}</p>
                                    )}

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
                                            <p className="!text-[9px] !font-black !text-text-muted !uppercase">Hạn nộp</p>
                                            <p className={`!text-xs !font-black ${student.status === 'Overdue' ? '!text-red-600' : '!text-text-main'}`}>
                                                {formatDate(student.dueDate)}
                                            </p>
                                        </div>
                                    </div>

                                    {(student.status === 'Overdue' || student.status === 'Pending') && student.invoiceId && (
                                        <div className="!flex !justify-end !gap-2">
                                            <button 
                                                onClick={() => onExtendClick && onExtendClick(student)}
                                                className={`!flex !items-center !gap-2 !px-4 !py-2 !rounded-xl !bg-white !border !border-border !text-xs !font-bold !transition-all ${
                                                    student.status === 'Overdue' ? 'hover:!border-amber-500 hover:!text-amber-600' : 'hover:!border-blue-500 hover:!text-blue-600'
                                                }`}
                                            >
                                                <Icon icon="solar:calendar-add-bold-duotone" className="!text-base" />
                                                Gia hạn
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="!flex !items-center !justify-between !p-6 !border-t !border-border !bg-[#F8FAFC]">
                        <span className="!text-sm !font-bold !text-text-muted">
                            Hiển thị {(currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, filteredStudents.length)} trên tổng {filteredStudents.length} hóa đơn
                        </span>
                        <div className="!flex !items-center !gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="!w-9 !h-9 !rounded-xl !bg-white !border !border-border !flex !items-center !justify-center !text-text-main disabled:!opacity-40 hover:!border-primary hover:!text-primary !transition-all !shadow-sm"
                            >
                                <Icon icon="solar:round-alt-arrow-left-bold-duotone" className="!text-xl" />
                            </button>
                            <span className="!text-sm !font-black !text-text-main !px-2">
                                {currentPage} / {totalPages}
                            </span>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="!w-9 !h-9 !rounded-xl !bg-white !border !border-border !flex !items-center !justify-center !text-text-main disabled:!opacity-40 hover:!border-primary hover:!text-primary !transition-all !shadow-sm"
                            >
                                <Icon icon="solar:round-alt-arrow-right-bold-duotone" className="!text-xl" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentPaymentTable;
