import React from 'react';
import { Icon } from '@iconify/react';
import { formatViFullDate } from '../../../utils/dateUtils';

const PreviewInvoiceModal = ({ 
    isOpen, 
    onClose, 
    previewData, 
    dueDate, 
    setDueDate, 
    isSubmitting, 
    onConfirm,
    month,
    year
}) => {
    if (!isOpen) return null;

    const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center !p-4">
            <div className="absolute inset-0 !bg-black/60 backdrop-blur-sm" onClick={!isSubmitting ? onClose : undefined} />
            <div className="relative !bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-zoom-in">
                {/* Header */}
                <div className="!p-6 border-b border-border flex items-center justify-between !bg-surface">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 !bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Icon icon="solar:bill-list-bold-duotone" className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-text-main tracking-tight">
                                Xác nhận phát hành học phí tháng {month}/{year}
                            </h2>
                            <p className="text-xs text-text-muted !mt-0.5 font-medium">
                                Kiểm tra chi tiết danh sách dự kiến trước khi tiến hành tạo hóa đơn
                            </p>
                        </div>
                    </div>
                    {!isSubmitting && (
                        <button onClick={onClose} className="!p-2 rounded-xl hover:!bg-background transition-all text-text-muted">
                            <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                        </button>
                    )}
                </div>

                {/* Body - Read Only Data Grid */}
                <div className="!flex-1 overflow-x-auto max-h-[50vh] custom-scrollbar">
                    <table className="!w-full !text-left !border-collapse">
                        <thead className="!sticky !top-0 !bg-background !z-10 !shadow-sm">
                            <tr>
                                <th className="!py-4 !px-6 !text-xs !font-black !text-text-muted !uppercase !tracking-widest">Học sinh</th>
                                <th className="!py-4 !px-6 !text-xs !font-black !text-text-muted !uppercase !tracking-widest">Ngày nhập học</th>
                                <th className="!py-4 !px-6 !text-xs !font-black !text-text-muted !uppercase !tracking-widest !text-center">Trạng thái</th>
                                <th className="!py-4 !px-6 !text-xs !font-black !text-text-muted !uppercase !tracking-widest !text-center">Điểm danh</th>
                                <th className="!py-4 !px-6 !text-xs !font-black !text-text-muted !uppercase !tracking-widest !text-right">Đơn giá</th>
                                <th className="!py-4 !px-6 !text-xs !font-black !text-text-muted !uppercase !tracking-widest !text-right">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="!divide-y !divide-border">
                            {previewData && previewData.length > 0 ? (
                                previewData.map((student) => (
                                    <tr key={student.studentId} className="hover:!bg-background/30 !transition-colors">
                                        <td className="!py-4 !px-6">
                                            <p className="!font-bold !text-text-main">{student.studentName}</p>
                                        </td>
                                        <td className="!py-4 !px-6 !text-sm !font-bold !text-text-muted">
                                            {formatViFullDate(student.enrollmentDate) || '--'}
                                        </td>
                                        <td className="!py-4 !px-6 !text-center">
                                            <span className={`!px-3 !py-1 !rounded-full !text-[11px] !font-black ${student.studentStatus === 'Dropped' ? '!bg-red-50 !text-red-600' : '!bg-emerald-50 !text-emerald-600'}`}>
                                                {student.studentStatus === 'Dropped' ? 'Đã nghỉ học' : (student.studentStatus === 'Active' ? 'Đang học' : student.studentStatus)}
                                            </span>
                                        </td>
                                        <td className="!py-4 !px-6 !text-center">
                                            <div className="!flex !items-center !justify-center !gap-1 cursor-help" title={`Vắng có phép: ${student.excusedAbsences} | Vắng không phép: ${student.unexcusedAbsences}`}>
                                                <span className="!font-bold !text-primary">{student.attendedSessions}</span>
                                                <span className="!text-text-muted !text-sm">/ {student.totalSessionsInMonth} buổi</span>
                                            </div>
                                        </td>
                                        <td className="!py-4 !px-6 !text-right !font-medium !text-text-muted">
                                            {formatVND(student.unitPrice)}
                                        </td>
                                        <td className="!py-4 !px-6 !text-right !font-black !text-emerald-600">
                                            {formatVND(student.amount)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="!py-12 !text-center !text-text-muted">
                                        Không có dữ liệu học sinh
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer - Actions & DatePicker */}
                <div className="!p-6 border-t border-border !bg-background/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="!flex !items-center !gap-3 !w-full sm:!w-auto">
                        <label className="!text-sm !font-black !text-text-main !whitespace-nowrap">Hạn nộp tiền:</label>
                        <div className="!relative flex-1 sm:w-48">
                            <Icon icon="solar:calendar-bold-duotone" className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-text-muted !text-lg" />
                            <input 
                                type="date" 
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                                className="!w-full !pl-10 !pr-4 !py-3 !bg-white !border !border-border !rounded-xl !text-sm !font-bold focus:!outline-none focus:!border-primary !transition-all !shadow-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="!flex !items-center !gap-3 !w-full sm:!w-auto">
                        <button 
                            disabled={isSubmitting} 
                            onClick={onClose} 
                            className="flex-1 sm:flex-none !px-6 !py-3 !rounded-xl text-sm font-black text-text-muted hover:!bg-border/50 hover:!text-text-main transition-all disabled:!opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            disabled={isSubmitting || !previewData || previewData.length === 0 || !dueDate}
                            onClick={onConfirm}
                            className="flex-1 sm:flex-none !bg-blue-600 !text-white !px-8 !py-3 !rounded-xl text-sm font-black shadow-lg shadow-blue-500/30 hover:!bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:!opacity-50 disabled:!cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Icon icon="line-md:loading-loop" className="text-xl" />
                                    Đang phát hành...
                                </>
                            ) : (
                                <>
                                    <Icon icon="solar:check-circle-bold-duotone" className="text-xl" />
                                    Xác nhận phát hành
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewInvoiceModal;
