import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import Button from '../../../../../../../components/ui/Button';

const ReportSendConfirmModal = ({ isOpen, onClose, onConfirm, report, className }) => {
    if (!isOpen || !report) return null;

    return createPortal(
        <>
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001] animate-fade-in" 
                onClick={onClose} 
            />
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-surface rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in-up pointer-events-auto flex flex-col border border-border">
                    
                    {/* Header */}
                    <div className="!p-6 sm:!p-8 border-b border-border bg-background/30 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0 rotate-3">
                            <Icon icon="material-symbols:send-and-archive-rounded" className="text-3xl" />
                        </div>
                        <div>
                            <h3 className="text-xl sm:text-2xl font-black text-text-main tracking-tight">Xác nhận gửi báo cáo</h3>
                            <p className="text-sm text-text-muted font-medium mt-0.5">Vui lòng kiểm tra kỹ nội dung trước khi gửi cho phụ huynh.</p>
                        </div>
                    </div>

                    {/* Paper Preview Content */}
                    <div className="!p-6 sm:!p-10 !bg-[#F1F5F9] !overflow-y-auto !max-h-[65vh] custom-scrollbar">
                        
                        {/* The "Paper" */}
                        <div className="!w-full !max-w-[550px] !mx-auto !bg-white !shadow-xl !rounded-sm !flex !flex-col !overflow-hidden !border !border-border/50">
                            {/* Decorative Top Bar */}
                            <div className="!h-1.5 !bg-primary !w-full" />
                            
                            <div className="!p-8 sm:!p-10 !flex-1 !flex !flex-col !gap-8">
                                {/* Report Header */}
                                <div className="!flex !justify-between !items-start">
                                    <div className="!space-y-1">
                                        <h3 className="!text-xl !font-black !text-text-main !tracking-tighter !uppercase">Học bạ điện tử</h3>
                                        <p className="!text-[10px] !font-bold !text-primary !uppercase !tracking-widest">EMS Analytics System</p>
                                    </div>
                                    <div className="!w-10 !h-10 !bg-background !border !border-border !rounded-xl !flex !items-center !justify-center !text-primary/40">
                                        <Icon icon="solar:qr-code-bold-duotone" className="!text-2xl" />
                                    </div>
                                </div>

                                {/* Student Meta */}
                                <div className="!grid !grid-cols-2 !gap-6 !p-5 !bg-background/40 !rounded-2xl !border !border-dashed !border-border">
                                    <div>
                                        <p className="!text-[9px] !font-black !text-text-muted !uppercase !tracking-widest">Học sinh</p>
                                        <p className="!text-sm !font-bold !text-text-main !mt-1">{report.studentName}</p>
                                    </div>
                                    <div>
                                        <p className="!text-[9px] !font-black !text-text-muted !uppercase !tracking-widest">Kỳ học</p>
                                        <p className="!text-xs !font-bold !text-text-main !mt-1">Tháng {report.periodMonth}/{report.periodYear}</p>
                                    </div>
                                </div>

                                {/* Stats Overview */}
                                <div className="!grid !grid-cols-2 !gap-4">
                                    <div className="!p-4 !bg-emerald-50 !rounded-2xl !text-center !border !border-emerald-100">
                                        <p className="!text-[9px] !font-black !text-emerald-700 !uppercase !tracking-widest">GPA</p>
                                        <p className="!text-2xl !font-black !text-emerald-600">{report.gpa || 0}</p>
                                    </div>
                                    <div className="!p-4 !bg-blue-50 !rounded-2xl !text-center !border !border-blue-100">
                                        <p className="!text-[9px] !font-black !text-blue-700 !uppercase !tracking-widest">Chuyên cần</p>
                                        <p className="!text-2xl !font-black !text-blue-600">{report.attendanceRate || 0}%</p>
                                    </div>
                                </div>

                                {/* Evaluation */}
                                <div className="!space-y-3">
                                    <div className="!flex !items-center !gap-2 !border-b !border-border !pb-1">
                                        <Icon icon="material-symbols:comment-rounded" className="!text-primary !text-sm" />
                                        <span className="!text-[10px] !font-black !text-text-main !uppercase !tracking-widest">Nhận xét của giáo viên</span>
                                    </div>
                                    <div className="!text-xs !text-text-main !leading-relaxed !italic !min-h-[80px] !font-serif !whitespace-pre-wrap">
                                        {report.content || "Chưa có nội dung nhận xét."}
                                    </div>
                                </div>

                                {/* Detailed Breakdown */}
                                <div className="!grid !grid-cols-2 !gap-6 !pt-2">
                                    <div className="!space-y-2">
                                        <h4 className="!text-[9px] !font-black !text-text-muted !uppercase !tracking-tighter !border-b !border-border/50 !pb-1">Chi tiết điểm (Top 5)</h4>
                                        <table className="!w-full !text-[9px]">
                                            <tbody>
                                                {report.gradeHistory?.slice(0, 5).map((s, idx) => (
                                                    <tr key={idx} className="!border-b !border-border/20">
                                                        <td className="!py-1 !text-text-muted !truncate !max-w-[80px]">{s.assignmentTitle}</td>
                                                        <td className="!py-1 !text-right !font-black !text-primary">{s.grade}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="!space-y-2">
                                        <h4 className="!text-[9px] !font-black !text-text-muted !uppercase !tracking-tighter !border-b !border-border/50 !pb-1">Chuyên cần (Top 5)</h4>
                                        <table className="!w-full !text-[9px]">
                                            <tbody>
                                                {report.attendanceHistory?.slice(0, 5).map((att, idx) => (
                                                    <tr key={idx} className="!border-b !border-border/20">
                                                        <td className="!py-1 !text-text-muted">{new Date(att.date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}</td>
                                                        <td className="!py-1 !text-right">
                                                            <div className={`!w-1.5 !h-1.5 !rounded-full !ml-auto ${att.status === 'Present' ? '!bg-emerald-500' : '!bg-red-500'}`}></div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Footer Sign */}
                                <div className="!mt-auto !pt-6 !border-t !border-border !flex !justify-between !items-end">
                                    <div className="!text-center">
                                        <p className="!text-[8px] !font-bold !text-text-muted !uppercase">Ngày ký</p>
                                        <p className="!text-[10px] !font-bold !text-text-main !mt-1">{new Date().toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div className="!w-16 !h-8 !bg-slate-50 !rounded !border !border-dashed !border-slate-200 !flex !items-center !justify-center">
                                        <Icon icon="material-symbols:signature-rounded" className="!text-2xl !text-primary/10" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Updated Warning Box below the paper */}
                        <div className="!p-5 !mt-8 !bg-amber-500/10 !border !border-amber-200 !rounded-3xl !flex !items-start !gap-4 !max-w-[550px] !mx-auto">
                            <Icon icon="material-symbols:warning-rounded" className="!text-amber-600 !text-2xl !mt-0.5 !shrink-0" />
                            <p className="!text-sm !text-amber-900 !font-semibold !leading-relaxed">
                                Kiểm tra kỹ tờ học bạ trên. Sau khi xác nhận, báo cáo sẽ được gửi cho phụ huynh và <span className="!underline !decoration-amber-500 !decoration-2">không thể chỉnh sửa</span> nội dung này nữa.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="!p-6 sm:!p-8 border-t border-border bg-background/30 flex items-center justify-end gap-4 mt-auto">
                        <Button 
                            variant="outline" 
                            className="!px-6 !py-3 !rounded-2xl !text-sm !font-black !text-text-muted hover:!bg-white transition-all" 
                            onClick={onClose}
                        >
                            Quay lại
                        </Button>
                        <Button 
                            className="!bg-primary !text-white !px-10 !py-3 !rounded-2xl !font-black !shadow-xl !shadow-primary/20 hover:!bg-primary/90 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-95" 
                            onClick={onConfirm}
                        >
                            <Icon icon="material-symbols:send-rounded" className="text-xl" />
                            Xác nhận Gửi
                        </Button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default ReportSendConfirmModal;
