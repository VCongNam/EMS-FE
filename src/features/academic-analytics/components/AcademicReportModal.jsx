import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const AcademicReportModal = ({ isOpen, onClose, onSave, defaultClass, editData, month, year }) => {
    const [evaluation, setEvaluation] = useState('');
    const [selectedClass, setSelectedClass] = useState(defaultClass || 'TC101');
    const [selectedPeriod, setSelectedPeriod] = useState(`Tháng ${month?.toString().padStart(2, '0')}/${year}`);
    const [selectedStudent, setSelectedStudent] = useState('');

    const isEdit = !!editData;

    // Effect to pre-fill data when editing
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
        // Validation: Content must be at least 10 characters
        if (!evaluation || evaluation.trim().length < 10) {
            toast.warning('Nội dung nhận xét phải ít nhất 10 ký tự.');
            return;
        }

        const reportTitle = `Báo cáo học tập Tháng ${month?.toString().padStart(2, '0')}/${year}`;

        onSave({
            reportId: isEdit ? editData.reportId : null,
            title: reportTitle,
            studentId: isEdit ? editData.studentId : selectedStudent,
            studentName: isEdit ? editData.studentName : (selectedStudent === 'SV001' ? 'Nguyễn Văn A' : 'Trần Thị B'),
            classId: selectedClass,
            periodMonth: month,
            periodYear: year,
            content: evaluation,
            status: status || (isEdit ? editData.status : 'Draft'),
            gpa: Number(isEdit || editData ? editData.gpa : 0),
            attendanceRate: Number(isEdit || editData ? editData.attendanceRate : 0)
        });
    };

    return (
        <div className="!fixed !inset-0 !z-[100] !flex !items-center !justify-center !p-4">
            {/* Backdrop */}
            <div className="!absolute !inset-0 !bg-black/60 !backdrop-blur-sm" onClick={onClose}></div>
            
            {/* Modal Content */}
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
                                {isEdit ? 'Chỉnh sửa báo cáo' : 'Khởi tạo báo cáo'}
                            </h2>
                            <p className="!text-[11px] sm:!text-sm !text-text-muted !mt-0.5 sm:!mt-1 !font-medium">
                                {isEdit ? `Đang chỉnh sửa cho ${editData.studentName}` : `Tạo báo cáo mới cho học sinh.`}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="!p-2 sm:!p-3 !rounded-2xl hover:!bg-background !transition-all !text-text-muted group">
                        <Icon icon="material-symbols:close-rounded" className="!text-2xl sm:!text-3xl group-hover:scale-110 !transition-transform" />
                    </button>
                </div>

                {/* Main Body - 2 Columns */}
                <div className="!flex-1 !overflow-hidden !grid !grid-cols-1 lg:!grid-cols-2">
                    
                    {/* Left Column: Form Inputs */}
                    <div className="!p-5 sm:!p-8 !space-y-6 sm:!space-y-8 !overflow-y-auto !max-h-[60vh] sm:!max-h-[75vh] custom-scrollbar !border-r !border-border !bg-white">
                        {/* Mode Toggle Removed */}

                        <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-6">
                            <div className="!space-y-2">
                                <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest !ml-1">Lớp học</label>
                                <div className="!relative">
                                    <select 
                                        value={selectedClass}
                                        disabled={true}
                                        className="!w-full !px-4 !py-4 !bg-background !border !border-border !rounded-2xl !font-bold !text-text-main !outline-none !appearance-none disabled:!opacity-60"
                                    >
                                        <option value={selectedClass}>{selectedClass}</option>
                                    </select>
                                    <Icon icon="material-symbols:lock-outline-rounded" className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl" />
                                </div>
                            </div>
                            <div className="!space-y-2">
                                <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest !ml-1">Kỳ báo cáo</label>
                                <div className="!relative">
                                    <select 
                                        value={selectedPeriod}
                                        disabled={true}
                                        className="!w-full !px-4 !py-4 !bg-background !border !border-border !rounded-2xl !font-bold !text-text-main !outline-none !appearance-none disabled:!opacity-60"
                                    >
                                        <option value={selectedPeriod}>{selectedPeriod}</option>
                                    </select>
                                    <Icon icon="material-symbols:lock-outline-rounded" className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="!space-y-4">
                            <div className="!space-y-2">
                                <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest !ml-1">Học sinh</label>
                                <div className="!relative">
                                    <select 
                                        value={selectedStudent}
                                        disabled={true}
                                        className="!w-full !px-4 !py-4 !bg-background !border !border-border !rounded-2xl !font-bold !text-text-main !outline-none disabled:!opacity-60 !appearance-none"
                                    >
                                        <option value={selectedStudent}>{isEdit || editData?.studentName ? (editData.studentName) : selectedStudent}</option>
                                    </select>
                                    <Icon icon="material-symbols:lock-outline-rounded" className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl" />
                                </div>
                            </div>
                            <div className="!p-5 !bg-emerald-50 !border !border-emerald-100 !rounded-2xl !flex !items-start !gap-4">
                                <div className="!w-10 !h-10 !bg-emerald-500/10 !text-emerald-600 !rounded-xl !flex !items-center !justify-center !shrink-0">
                                    <Icon icon="material-symbols:check-circle-rounded" className="!text-2xl" />
                                </div>
                                <div className="!text-sm !text-emerald-800 !font-medium !mt-1">
                                    Dữ liệu chuyên cần <span className="!font-black">{isEdit || editData ? editData.attendanceRate : '0'}%</span> và Điểm GPA <span className="!font-black">{isEdit || editData ? editData.gpa : '0'}</span> đã được hệ thống tổng hợp sẵn.
                                </div>
                            </div>
                        </div>

                        <div className="!space-y-2">
                            <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest !ml-1">
                                Nhận xét & Đánh giá cá nhân
                            </label>
                            <textarea 
                                value={evaluation}
                                onChange={(e) => setEvaluation(e.target.value)}
                                placeholder="Nhập nội dung đánh giá dành cho học sinh... (Nội dung sẽ hiển thị ngay ở phần xem trước bên phải)"
                                className="!w-full !px-5 !py-4 !bg-background !border !border-border !rounded-2xl !text-base !font-medium !focus:border-primary !outline-none !h-48 !resize-none custom-scrollbar shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Right Column: Live Preview - Hidden on Mobile */}
                    <div className="!hidden lg:!flex !p-8 lg:!p-12 !bg-[#F1F5F9] !flex-col !items-center !overflow-y-auto custom-scrollbar">
                        
                        
                        {/* The "Paper" */}
                        <div className="!w-full !max-w-[500px] !bg-white !shadow-2xl !rounded-sm !min-h-[700px] !flex !flex-col !overflow-hidden !border !border-border/50">
                            {/* Decorative Top Bar */}
                            <div className="!h-2 !bg-primary !w-full" />
                            
                            <div className="!p-10 !flex-1 !flex !flex-col">
                                {/* Report Header */}
                                <div className="!flex !justify-between !items-start !mb-10">
                                    <div className="!space-y-1">
                                        <h3 className="!text-2xl !font-black !text-text-main !tracking-tighter !uppercase">Học bạ điện tử</h3>
                                        <p className="!text-xs !font-bold !text-primary !uppercase !tracking-widest">Hệ thống EMS Analytics</p>
                                    </div>
                                    <div className="!w-12 !h-12 !bg-background !border !border-border !rounded-xl !flex !items-center !justify-center !text-primary/40">
                                        <Icon icon="solar:qr-code-bold-duotone" className="!text-3xl" />
                                    </div>
                                </div>

                                {/* Student Meta */}
                                <div className="!grid !grid-cols-2 !gap-8 !mb-10 !p-6 !bg-background/40 !rounded-2xl !border !border-dashed !border-border">
                                    <div>
                                        <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Học sinh</p>
                                        <p className="!text-base !font-bold !text-text-main !mt-1">
                                            {isEdit ? editData.studentName : (selectedStudent === 'SV001' ? 'Nguyễn Văn A' : 'Trần Thị B')}
                                        </p>
                                        <p className="!text-xs !text-text-muted !font-medium">ID: {isEdit ? editData.studentId : selectedStudent}</p>
                                    </div>
                                    <div>
                                        <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Lớp học / Kỳ học</p>
                                        <p className="!text-base !font-bold !text-text-main !mt-1">{selectedClass}</p>
                                        <p className="!text-xs !text-text-muted !font-medium">Tháng {month?.toString().padStart(2, '0')}/{year}</p>
                                    </div>
                                </div>

                                {/* Grades Grid */}
                                <div className="!grid !grid-cols-2 !gap-4 !mb-10">
                                    <div className="!p-4 !bg-emerald-50 !rounded-2xl !border !border-emerald-100 !text-center">
                                        <p className="!text-[10px] !font-black !text-emerald-700 !uppercase !tracking-widest">Điểm TB (GPA)</p>
                                        <p className="!text-3xl !font-black !text-emerald-600 !mt-1">{isEdit ? editData.gpa : '0'}</p>
                                    </div>
                                    <div className="!p-4 !bg-blue-50 !rounded-2xl !border !border-blue-100 !text-center">
                                        <p className="!text-[10px] !font-black !text-blue-700 !uppercase !tracking-widest">Chuyên cần</p>
                                        <p className="!text-3xl !font-black !text-blue-600 !mt-1">{isEdit ? editData.attendanceRate : '0'}%</p>
                                    </div>
                                </div>

                                {/* Evaluation Section */}
                                <div className="!flex-1 !space-y-4">
                                    <div className="!flex !items-center !gap-3 !border-b !border-border !pb-2">
                                        <Icon icon="material-symbols:quickreply-outline-rounded" className="!text-primary" />
                                        <p className="!text-xs !font-black !text-text-main !uppercase !tracking-widest">Đánh giá chung</p>
                                    </div>
                                    <div className="!text-sm !text-text-main !leading-relaxed !whitespace-pre-wrap !italic !min-h-[100px] !font-serif">
                                        {evaluation || <span className="!text-text-muted/40">Nội dung đánh giá sẽ xuất hiện tại đây khi bạn nhập liệu...</span>}
                                    </div>
                                </div>

                                {/* Signatures Area */}
                                <div className="!mt-10 !pt-6 !border-t !border-border !flex !justify-between !items-end">
                                    <div className="!text-center">
                                        <p className="!text-[9px] !font-bold !text-text-muted !uppercase">Ngày xuất bản</p>
                                        <p className="!text-[11px] !font-bold !text-text-main !mt-1">{new Date().toLocaleDateString('vi-VN')}</p>
                                    </div>
                                    <div className="!text-center">
                                        <p className="!text-[9px] !font-bold !text-text-muted !uppercase">Xác nhận giáo viên</p>
                                        <div className="!h-10 !w-24 !my-2 !flex !items-center !justify-center">
                                            <Icon icon="material-symbols:signature-rounded" className="!text-4xl !text-primary/20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="!p-5 sm:!p-8 !border-t !border-border !bg-white !flex !items-center !justify-end !gap-3 sm:!gap-4">
                    <button 
                        onClick={onClose}
                        className="!px-6 sm:!px-8 !py-3 sm:!py-4 !rounded-2xl !text-sm !font-black !text-text-muted hover:!bg-background !transition-all"
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        onClick={() => handleAction('Draft')}
                        className="!px-6 sm:!px-8 !py-3 sm:!py-4 !rounded-2xl !bg-amber-500/10 !text-amber-600 !font-black hover:!bg-amber-500 hover:!text-white !transition-all !flex !items-center !gap-2"
                    >
                        <Icon icon="material-symbols:draft-orders-outline-rounded" className="!text-xl" />
                        Lưu nháp
                    </button>
                    <button 
                        onClick={() => handleAction('Sent')}
                        className="!bg-primary !text-white !px-6 sm:!px-10 !py-3 sm:!py-4 !rounded-2xl !font-black !shadow-xl !shadow-primary/20 hover:!bg-primary/90 !transition-all !flex !items-center !gap-2 sm:!gap-3 hover:scale-[1.02] active:scale-95"
                    >
                        <Icon icon="material-symbols:send-rounded" className="!text-xl" />
                        Gửi báo cáo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AcademicReportModal;
