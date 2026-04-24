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

const StudentPaymentTable = ({ 
    students = [], 
    onExtendClick, 
    onRemindClick,
    onFinalBillClick,
    isLoadingFinal,
    targetStudentId,
    currentPage: externalPage,
    totalPages: externalTotalPages,
    onPageChange
}) => {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [localPage, setLocalPage] = useState(1);
    const rowsPerPage = 10;

    const currentPage = onPageChange ? externalPage : localPage;
    const setCurrentPage = onPageChange ? onPageChange : setLocalPage;

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
    }, [filter, search, setCurrentPage]);

    // If external pagination is used, totalPages is passed from parent.
    // Otherwise, calculate locally based on the filtered list.
    const totalPages = onPageChange ? externalTotalPages : Math.ceil(filteredStudents.length / rowsPerPage);
    
    // If external pagination is used, provided students array IS the current page.
    const paginatedStudents = onPageChange ? filteredStudents : filteredStudents.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
                <div className="!overflow-x-auto custom-scrollbar">
                    <table className="!w-full !text-left !border-collapse">
                        <thead>
                            <tr className="!bg-[#F8FAFC] !border-b !border-border">
                                <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Học sinh</th>
                                <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Đơn giá</th>
                                <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Cần nộp</th>
                                <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Trạng thái</th>
                                <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Hạn nộp</th>
                                <th className="!px-6 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="!divide-y !divide-border">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="!py-20 !text-center">
                                        <div className="!flex !flex-col !items-center !gap-2 !opacity-40">
                                            <Icon icon="solar:folder-error-bold" className="!text-5xl" />
                                            <p className="!font-bold">Chưa có dữ liệu học sinh</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedStudents.map((student) => {
                                 const config = STATUS_CONFIG[student.status] || STATUS_CONFIG['Pending'];
                                 
                                 // New API mapping
                                 const theoreticalFee = student.originalAmount || 0;
                                 const creditBalance = student.creditBalance || 0;
                                 const amountToPay = student.totalAmount || 0;
                                 const unitPrice = student.unitPrice || 0;
                                 const sessions = student.sessionCount || 0;

                                 return (
                                    <tr key={student.invoiceId || student.studentId || student.id} className="!group hover:!bg-[#F8FAFC] !transition-all">
                                         <td className="!px-6 !py-5">
                                             <div className="!flex !items-center !gap-3">
                                                 <div className="!w-9 !h-9 !rounded-full !bg-primary/5 !border !border-primary/10 !flex !items-center !justify-center !overflow-hidden">
                                                     <Icon icon="solar:user-bold" className="!text-primary" />
                                                 </div>
                                                 <div>
                                                     <p className="!text-sm !font-bold !text-text-main">{student.studentName || student.name}</p>
                                                     <div className="!flex !items-center !gap-2 !mt-0.5">
                                                         <span className="!text-[9px] !font-black !px-1.5 !rounded !bg-slate-100 !text-slate-500 !uppercase">
                                                             {sessions} buổi thực tế
                                                         </span>
                                                         {student.phoneNumber && <p className="!text-[10px] !text-text-muted">{student.phoneNumber}</p>}
                                                     </div>
                                                 </div>
                                             </div>
                                         </td>
                                         <td className="!px-6 !py-5">
                                             <span className="!text-xs !font-bold !text-text-muted">{formatVND(unitPrice)}</span>
                                         </td>

                                         <td className="!px-6 !py-5">
                                            <div className="!flex !flex-col">
                                                <span className="!text-sm !font-black !text-text-main">
                                                    {formatVND(amountToPay)}
                                                </span>
                                            </div>
                                         </td>
                                         <td className="!px-6 !py-5">
                                             <div className={`!inline-flex !items-center !gap-1.5 !px-3 !py-1 !rounded-full !text-[11px] !font-black ${config.bg} ${config.color}`}>
                                                 <Icon icon={config.icon} />
                                                 {config.label}
                                             </div>
                                         </td>
                                         <td className="!px-6 !py-5">
                                             <span className={`!text-xs !font-bold ${student.status === 'Overdue' ? '!text-red-500' : '!text-text-muted'}`}>
                                                 {formatDate(student.dueDate)}
                                             </span>
                                         </td>
                                            <td className="!px-6 !py-5">
                                                <div className="!flex !items-center !justify-end !gap-2">
                                                    {/* Nút Tất Toán Lẻ - Chỉ hiện nếu chưa có hóa đơn */}
                                                    {!student.invoiceId && (
                                                        <button
                                                            onClick={() => onFinalBillClick && onFinalBillClick(student)}
                                                            disabled={isLoadingFinal && (targetStudentId === (student.studentId || student.id))}
                                                            className="!p-2 !rounded-xl !bg-blue-50 !text-blue-600 hover:!bg-blue-600 hover:!text-white !transition-all !flex !items-center !justify-center"
                                                            title="Tất toán học phí (Ghi nghỉ học/Tất toán sớm)"
                                                        >
                                                            {isLoadingFinal && (targetStudentId === (student.studentId || student.id)) ? (
                                                                <Icon icon="line-md:loading-loop" className="!text-lg" />
                                                            ) : (
                                                                <Icon icon="solar:bill-list-bold-duotone" className="!text-lg" />
                                                            )}
                                                            <span className="!text-[10px] !font-black !ml-1 hidden lg:inline">Tất toán</span>
                                                        </button>
                                                    )}

                                                    {(student.status === 'Overdue' || student.status === 'Pending') && student.invoiceId && (
                                                        <button 
                                                            onClick={() => onExtendClick && onExtendClick(student)}
                                                            className="!p-2 !rounded-xl !bg-amber-50 !text-amber-600 hover:!bg-amber-500 hover:!text-white !transition-all"
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
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="!flex !items-center !justify-between !p-6 !border-t !border-border !bg-[#F8FAFC]">
                        <span className="!text-sm !font-bold !text-text-muted">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <div className="!flex !items-center !gap-2">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="!w-9 !h-9 !rounded-xl !bg-white !border !border-border !flex !items-center !justify-center hover:!border-primary hover:!text-primary disabled:!opacity-30 !transition-all"
                            >
                                <Icon icon="solar:round-alt-arrow-left-bold-duotone" className="!text-xl" />
                            </button>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="!w-9 !h-9 !rounded-xl !bg-white !border !border-border !flex !items-center !justify-center hover:!border-primary hover:!text-primary disabled:!opacity-30 !transition-all"
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
