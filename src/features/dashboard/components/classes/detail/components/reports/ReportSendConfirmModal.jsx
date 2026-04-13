import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import Button from '../../../../../../../components/ui/Button';

const ReportSendConfirmModal = ({ isOpen, onClose, onConfirm, report, className }) => {
    if (!isOpen || !report) return null;

    return createPortal(
        <>
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] animate-fade-in" 
                onClick={onClose} 
            />
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
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

                    {/* Content Preview */}
                    <div className="!p-6 sm:!p-8 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar bg-white">
                        
                        {/* Student Info Card */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-background rounded-2xl border border-border">
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Học sinh</p>
                                <p className="text-base font-bold text-text-main">{report.studentName}</p>
                                <p className="text-xs text-text-muted font-medium">{report.studentId}</p>
                            </div>
                            <div className="p-4 bg-background rounded-2xl border border-border">
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Lớp học / Kỳ học</p>
                                <p className="text-base font-bold text-text-main">{className || report.classId}</p>
                                <p className="text-xs text-text-muted font-medium">Tháng {report.periodMonth}/{report.periodYear}</p>
                            </div>
                        </div>

                        {/* Academic Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
                                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Điểm TB (GPA)</p>
                                <div className="text-3xl font-black text-emerald-600">{report.gpa || 0}</div>
                                <div className="w-full h-1.5 bg-emerald-200/50 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${(report.gpa || 0) * 10}%` }}></div>
                                </div>
                            </div>
                            <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
                                <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-2">Chuyên cần</p>
                                <div className="text-3xl font-black text-blue-600">{report.attendanceRate || 0}%</div>
                                <div className="w-full h-1.5 bg-blue-200/50 rounded-full mt-3 overflow-hidden">
                                    <div className="h-full bg-blue-500" style={{ width: `${report.attendanceRate || 0}%` }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Evaluation Message */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-text-main">
                                <Icon icon="material-symbols:comment-rounded" className="text-primary" />
                                <span className="text-xs font-black uppercase tracking-widest">Nội dung nhận xét</span>
                            </div>
                            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl italic text-sm text-text-main leading-relaxed font-serif min-h-[100px] shadow-inner">
                                {report.content || "Chưa có nội dung nhận xét."}
                            </div>
                        </div>

                        {/* Warning Box */}
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                            <Icon icon="material-symbols:warning-rounded" className="text-amber-500 text-xl mt-0.5 shrink-0" />
                            <p className="text-[12px] text-amber-800 font-medium leading-relaxed">
                                <span className="font-bold">Lưu ý:</span> Sau khi xác nhận gửi, báo cáo sẽ được hiển thị ngay lập tức trên ứng dụng của Phụ huynh và học sinh. Bạn sẽ <span className="font-bold underline">không thể chỉnh sửa</span> nội dung báo cáo này nữa.
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
