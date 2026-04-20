import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../store/authStore';
import ReportSendConfirmModal from '../../dashboard/components/classes/detail/components/reports/ReportSendConfirmModal';

const AcademicReportModal = ({ isOpen, onClose, onSave, defaultClass, editData, month, year, className }) => {
    const { user } = useAuthStore();
    const isStudent = user?.role === 'student';

    const [evaluation, setEvaluation] = useState('');
    const [selectedClass, setSelectedClass] = useState(defaultClass || 'TC101');
    const [selectedPeriod, setSelectedPeriod] = useState(`Tháng ${month?.toString().padStart(2, '0')}/${year}`);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);

    const isEdit = !!editData?.reportId;

    useEffect(() => {
        if (isOpen) {
            const periodStr = `Tháng ${month?.toString().padStart(2, '0')}/${year}`;
            setSelectedPeriod(periodStr);
            
            if (editData) {
                setSelectedClass(editData.classId || defaultClass);
                setSelectedStudent(editData.studentId || '');
                setEvaluation(editData.content || '');
            } else {
                setEvaluation('');
                setSelectedClass(defaultClass);
                setSelectedStudent('');
            }
        }
    }, [editData, isOpen, defaultClass, month, year]);

    if (!isOpen) return null;

    const handleAction = (status) => {
        if (!evaluation || evaluation.trim().length < 10) {
            toast.warning('Nội dung nhận xét phải ít nhất 10 ký tự.');
            return;
        }

        if (status === 'Published') {
            setShowConfirm(true);
        } else {
            submitData(status);
        }
    };

    const submitData = (status) => {
        onSave({
            reportId: isEdit ? editData.reportId : null,
            title: `Báo cáo học tập Tháng ${month?.toString().padStart(2, '0')}/${year}`,
            studentId: isEdit ? editData.studentId : selectedStudent,
            studentName: editData?.studentName || 'Học sinh',
            classId: selectedClass,
            periodMonth: month,
            periodYear: year,
            content: evaluation,
            status: status || 'Draft',
            gpa: Number(editData?.gpa || 0),
            attendanceRate: Number(editData?.attendanceRate || 0),
            gradeHistory: editData?.gradeHistory || [],
            attendanceHistory: editData?.attendanceHistory || []
        });
        setShowConfirm(false);
    };

    return createPortal(
        <div className="!fixed !inset-0 !z-[9999] !flex !items-center !justify-center !p-4">
            <div className="!absolute !inset-0 !bg-black/60 !backdrop-blur-sm !animate-fade-in" onClick={onClose}></div>
            
            <div className="!relative !bg-[#F8FAFC] !w-full !max-w-7xl !max-h-[90vh] !rounded-[2.5rem] !shadow-2xl !overflow-hidden !flex !flex-col !animate-zoom-in">
                {/* Header */}
                <div className="!p-5 sm:!p-8 !border-b !border-border !bg-white !flex !items-center !justify-between">
                    <div className="!flex !items-center !gap-3 sm:!gap-4">
                        <div className="!w-12 !h-12 sm:!w-14 sm:!h-14 !bg-primary !rounded-[1rem] sm:!rounded-[1.25rem] !flex !items-center !justify-center !shadow-xl !shadow-primary/20">
                            <Icon 
                                icon={isEdit ? "material-symbols:edit-document-rounded" : "material-symbols:add-chart-rounded"} 
                                className="!text-white !text-2xl sm:!text-3xl" 
                            />
                        </div>
                        <div>
                            <h2 className="!text-lg sm:!text-2xl !font-black !text-text-main !tracking-tight">
                                {isStudent ? 'Chi tiết báo cáo' : (isEdit ? 'Chỉnh sửa báo cáo' : 'Khởi tạo báo cáo')}
                            </h2>
                            <p className="!text-[11px] sm:!text-sm !text-text-muted !mt-0.5 sm:!mt-1 !font-medium">
                                {isStudent ? `Báo cáo học tập của bạn` : (isEdit ? `Đang chỉnh sửa cho ${editData?.studentName}` : `Tạo báo cáo mới cho học sinh.`)}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="!p-2 sm:!p-3 !rounded-2xl hover:!bg-background !transition-all !text-text-muted group">
                        <Icon icon="material-symbols:close-rounded" className="!text-2xl sm:!text-3xl group-hover:scale-110 !transition-transform" />
                    </button>
                </div>

                {/* Body */}
                <div className={`!flex-1 !overflow-hidden !grid !grid-cols-1 ${!isStudent ? 'lg:!grid-cols-2' : ''}`}>
                    {!isStudent && (
                        <div className="!p-5 sm:!p-8 !space-y-6 !overflow-y-auto !max-h-[60vh] sm:!max-h-[75vh] custom-scrollbar !border-r !border-border !bg-white">
                            <div className="!grid !grid-cols-2 !gap-6">
                                <div className="!space-y-2">
                                    <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Lớp học</label>
                                    <div className="!relative">
                                        <div className="!w-full !px-4 !py-4 !bg-background !border !border-border !rounded-2xl !font-bold !text-text-main">{className || selectedClass}</div>
                                    </div>
                                </div>
                                <div className="!space-y-2">
                                    <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Kỳ báo cáo</label>
                                    <div className="!w-full !px-4 !py-4 !bg-background !border !border-border !rounded-2xl !font-bold !text-text-main">{selectedPeriod}</div>
                                </div>
                            </div>

                            <div className="!space-y-2">
                                <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Học sinh</label>
                                <div className="!w-full !px-4 !py-4 !bg-background !border !border-border !rounded-2xl !font-bold !text-text-main">{editData?.studentName || selectedStudent}</div>
                            </div>

                            <div className="!space-y-2">
                                <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Nhận xét</label>
                                <textarea 
                                    value={evaluation}
                                    onChange={(e) => setEvaluation(e.target.value)}
                                    placeholder="Nhập nội dung đánh giá..."
                                    className="!w-full !px-5 !py-4 !bg-background !border !border-border !rounded-2xl !text-base !font-medium !outline-none !h-40 !resize-none custom-scrollbar"
                                />
                            </div>

                            {/* Info Table */}
                            <div className="!grid !grid-cols-1 !gap-6 !pt-4">
                                <div className="!bg-background !rounded-3xl !border !border-border !overflow-hidden">
                                    <div className="!px-4 !py-3 !bg-slate-100/50 !flex !items-center !gap-2">
                                        <Icon icon="solar:ranking-bold-duotone" className="!text-primary" />
                                        <span className="!text-[10px] !font-black !uppercase">Dữ liệu điểm số</span>
                                    </div>
                                    <div className="!max-h-[150px] !overflow-y-auto custom-scrollbar">
                                        <table className="!w-full !text-xs">
                                            <tbody>
                                                {editData?.gradeHistory?.map((s, idx) => (
                                                    <tr key={idx} className="!border-b !border-border/30">
                                                        <td className="!p-3">{s.assignmentTitle}</td>
                                                        <td className="!p-3 !text-center !font-black !text-primary">{s.grade}</td>
                                                        <td className="!p-3 !text-right !text-text-muted">{s.weight}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preview (Paper) */}
                    <div className={`!flex !p-4 lg:!p-12 !bg-[#F1F5F9] !flex-col !items-center !overflow-y-auto custom-scrollbar ${isStudent ? '!w-full' : ''}`}>
                        <div className="!w-full !max-w-[500px] !bg-white !shadow-2xl !rounded-sm !min-h-[700px] !flex !flex-col !overflow-hidden !border !border-border/50">
                            <div className="!h-2 !bg-primary !w-full" />
                            <div className="!p-10 !flex-1 !flex !flex-col !gap-8">
                                <div className="!flex !justify-between !items-start">
                                    <h3 className="!text-2xl !font-black !uppercase">Học bạ điện tử</h3>
                                    <Icon icon="solar:qr-code-bold-duotone" className="!text-3xl !text-primary/40" />
                                </div>

                                <div className="!grid !grid-cols-2 !gap-6 !p-6 !bg-background/40 !rounded-2xl !border !border-dashed !border-border">
                                    <div>
                                        <p className="!text-[10px] !font-black !text-text-muted !uppercase">Học sinh</p>
                                        <p className="!text-base !font-bold">{editData?.studentName || 'Student Name'}</p>
                                    </div>
                                    <div>
                                        <p className="!text-[10px] !font-black !text-text-muted !uppercase">Lớp / Kỳ</p>
                                        <p className="!text-sm !font-bold">{className || selectedClass}</p>
                                        <p className="!text-xs !text-text-muted">Tháng {month}/{year}</p>
                                    </div>
                                </div>

                                <div className="!grid !grid-cols-2 !gap-4">
                                    <div className="!p-4 !bg-emerald-50 !rounded-2xl !text-center !border !border-emerald-100">
                                        <p className="!text-[10px] !font-black !text-emerald-700 !uppercase">GPA</p>
                                        <p className="!text-3xl !font-black !text-emerald-600">{editData?.gpa || 0}</p>
                                    </div>
                                    <div className="!p-4 !bg-blue-50 !rounded-2xl !text-center !border !border-blue-100">
                                        <p className="!text-[10px] !font-black !text-blue-700 !uppercase">Điểm danh</p>
                                        <p className="!text-3xl !font-black !text-blue-600">{editData?.attendanceRate || 0}%</p>
                                    </div>
                                </div>

                                <div className="!flex-1 !space-y-4">
                                    <p className="!text-xs !font-black !uppercase !border-b !pb-1">Đánh giá chung</p>
                                    <p className="!text-sm !italic !font-serif !whitespace-pre-wrap">{evaluation || "Nội dung đánh giá..."}</p>
                                </div>

                                {/* Mini History in Preview */}
                                <div className="!grid !grid-cols-2 !gap-6 !mb-2">
                                    <div className="!space-y-2">
                                        <p className="!text-[9px] !font-black !uppercase !border-b">Chi tiết điểm</p>
                                        <table className="!w-full !text-[9px]">
                                            <tbody>
                                                {editData?.gradeHistory?.slice(0, 5).map((s, idx) => (
                                                    <tr key={idx} className="!border-b !border-border/20">
                                                        <td className="!py-1">{s.assignmentTitle}</td>
                                                        <td className="!py-1 !text-right !font-black">{s.grade}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="!space-y-2">
                                        <p className="!text-[9px] !font-black !uppercase !border-b">Chuyên cần</p>
                                        <table className="!w-full !text-[9px]">
                                            <tbody>
                                                {editData?.attendanceHistory?.slice(0, 5).map((att, idx) => (
                                                    <tr key={idx} className="!border-b !border-border/20">
                                                        <td className="!py-1">{new Date(att.date).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}</td>
                                                        <td className="!py-1 !text-right">
                                                            <div className={`!w-1.5 !h-1.5 !rounded-full !ml-auto ${att.status === 'Present' ? '!bg-emerald-500' : '!bg-red-500'}`} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="!mt-auto !pt-6 !border-t !flex !justify-between !items-end">
                                    <div className="!text-center">
                                        <p className="!text-[8px] !font-bold !text-text-muted !uppercase">Ngày xuất bản</p>
                                        <p className="!text-[10px] !font-bold">{new Date().toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <Icon icon="material-symbols:signature-rounded" className="!text-4xl !text-primary/10" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="!p-5 sm:!p-8 !border-t !border-border !bg-white !flex !items-center !justify-end !gap-4">
                    <button onClick={onClose} className="!px-8 !py-3 !rounded-2xl !text-sm !font-black !text-text-muted hover:!bg-background !transition-all">
                        Hủy bỏ
                    </button>
                    {!isStudent && (
                        <>
                            <button 
                                onClick={() => handleAction('Draft')}
                                className="!px-8 !py-3 !rounded-2xl !bg-amber-500/10 !text-amber-600 !font-black hover:!bg-amber-500 hover:!text-white !transition-all"
                            >
                                Lưu nháp
                            </button>
                            <button 
                                onClick={() => handleAction('Published')}
                                className="!bg-primary !text-white !px-10 !py-3 !rounded-2xl !font-black !shadow-xl !shadow-primary/20 hover:!bg-primary/90 !transition-all"
                            >
                                Gửi báo cáo
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Confirmation Modal Overlay */}
            {showConfirm && (
                <ReportSendConfirmModal 
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={() => submitData('Published')}
                    className={className}
                    report={{
                        studentName: editData?.studentName || 'Student',
                        classId: selectedClass,
                        periodMonth: month,
                        periodYear: year,
                        content: evaluation,
                        gpa: editData?.gpa || 0,
                        attendanceRate: editData?.attendanceRate || 0,
                        gradeHistory: editData?.gradeHistory || [],
                        attendanceHistory: editData?.attendanceHistory || []
                    }}
                />
            )}
        </div>,
        document.body
    );
};

export default AcademicReportModal;
