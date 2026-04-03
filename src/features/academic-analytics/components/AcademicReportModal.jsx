import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const AcademicReportModal = ({ isOpen, onClose, onSave, defaultClass, editData }) => {
    const [mode, setMode] = useState('individual'); // 'individual' or 'batch'
    const [batchMode, setBatchMode] = useState('empty'); // 'empty' or 'template'
    const [evaluation, setEvaluation] = useState('');
    const [selectedClass, setSelectedClass] = useState(defaultClass || 'TC101');
    const [selectedPeriod, setSelectedPeriod] = useState('Tháng 03/2026');
    const [selectedStudent, setSelectedStudent] = useState('SV001');

    const isEdit = !!editData;

    // Effect to pre-fill data when editing
    useEffect(() => {
        if (editData && isOpen) {
            setMode('individual');
            setSelectedClass(editData.classId || defaultClass || 'TC101');
            setSelectedPeriod(editData.period || 'Tháng 03/2026');
            setSelectedStudent(editData.studentId || 'SV001');
            setEvaluation(editData.evaluation || ''); // Assuming evaluation exists in real data
        } else if (!isEdit && isOpen) {
            // Reset for creation
            setEvaluation('');
            setMode('individual');
        }
    }, [editData, isOpen, defaultClass]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (mode === 'individual') {
            onSave({
                ...(editData || {}),
                studentName: isEdit ? editData.studentName : (selectedStudent === 'SV001' ? 'Nguyễn Văn A' : 'Trần Thị B'),
                studentId: isEdit ? editData.studentId : selectedStudent,
                classId: selectedClass,
                period: selectedPeriod,
                evaluation: evaluation,
                status: isEdit ? editData.status : 'Draft',
            });
            toast.success(isEdit ? 'Thông tin báo cáo đã được cập nhật.' : 'Bản nháp báo cáo của học sinh đã được lưu thành công.');
        } else {
            if (batchMode === 'empty') {
                toast.success(`Đã khởi tạo các bản nháp trống cho cả lớp ${selectedClass}!`);
            } else {
                toast.info(`Đã khởi tạo danh sách báo cáo dùng mẫu cho cả lớp ${selectedClass}!`);
            }
            onClose();
        }
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
                                {isEdit ? `Đang chỉnh sửa cho ${editData.studentName}` : 'Tạo báo cáo cá nhân hoặc đồng loạt cho cả lớp.'}
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
                        {/* Mode Toggle - Hidden in Edit mode */}
                        {!isEdit && (
                            <div className="!bg-background !p-1.5 !rounded-2xl !flex !items-center !gap-1 border !border-border shadow-inner">
                                <button 
                                    onClick={() => setMode('individual')}
                                    className={`!flex-1 !py-3.5 !rounded-xl !text-sm !font-black !transition-all !flex !items-center !justify-center !gap-2 ${mode === 'individual' ? '!bg-white !text-primary !shadow-lg' : '!text-text-muted hover:!text-text-main'}`}
                                >
                                    <Icon icon="material-symbols:person-rounded" />
                                    Cá nhân một học sinh
                                </button>
                                <button 
                                    onClick={() => setMode('batch')}
                                    className={`!flex-1 !py-3.5 !rounded-xl !text-sm !font-black !transition-all !flex !items-center !justify-center !gap-2 ${mode === 'batch' ? '!bg-white !text-primary !shadow-lg' : '!text-text-muted hover:!text-text-main'}`}
                                >
                                    <Icon icon="material-symbols:group-rounded" />
                                    Tạo hàng loạt cho lớp
                                </button>
                            </div>
                        )}

                        <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-6">
                            <div className="!space-y-2">
                                <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest !ml-1">Lớp học</label>
                                <div className="!relative">
                                    <select 
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                        disabled={isEdit}
                                        className="!w-full !px-4 !py-4 !bg-background !border !border-border !rounded-2xl !font-bold !text-text-main !focus:border-primary !outline-none disabled:!opacity-60 !appearance-none"
                                    >
                                        <option value="TC101">TC101 - Toán Nâng Cao</option>
                                        <option value="TC102">TC102 - Vật Lý Basic</option>
                                    </select>
                                    <Icon icon="material-symbols:keyboard-arrow-down-rounded" className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl" />
                                </div>
                            </div>
                            <div className="!space-y-2">
                                <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest !ml-1">Kỳ báo cáo</label>
                                <div className="!relative">
                                    <select 
                                        value={selectedPeriod}
                                        onChange={(e) => setSelectedPeriod(e.target.value)}
                                        className="!w-full !px-4 !py-4 !bg-background !border !border-border !rounded-2xl !font-bold !text-text-main !focus:border-primary !outline-none !appearance-none"
                                    >
                                        <option value="Tháng 03/2026">Tháng 03/2026</option>
                                        <option value="Tháng 04/2026">Tháng 04/2026</option>
                                        <option value="Tháng 05/2026">Tháng 05/2026</option>
                                        <option value="Full Course 2026">Trọn bộ khóa học 2026</option>
                                    </select>
                                    <Icon icon="material-symbols:keyboard-arrow-down-rounded" className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl" />
                                </div>
                            </div>
                        </div>

                        {mode === 'batch' ? (
                            <div className="!space-y-4 !p-6 !bg-primary/5 !rounded-[2rem] !border !border-primary/10">
                                <label className="!text-sm !font-black !text-primary !block !mb-3">Lựa chọn chế độ tạo hàng loạt:</label>
                                <div className="!flex !flex-col !gap-3">
                                    <label className={`!flex !items-center !gap-4 !p-5 !rounded-2xl !border !cursor-pointer !transition-all ${batchMode === 'empty' ? '!bg-white !border-primary !shadow-md' : '!bg-transparent !border-border hover:!border-primary/30'}`}>
                                        <input 
                                            type="radio" 
                                            name="batchMode" 
                                            checked={batchMode === 'empty'} 
                                            onChange={() => setBatchMode('empty')}
                                            className="!w-5 !h-5 !accent-primary"
                                        />
                                        <div>
                                            <div className="!font-bold !text-text-main !text-base">Khởi tạo bản nháp trống</div>
                                            <div className="!text-xs !text-text-muted">Tự động lấy thông tin điểm và chuyên cần, để trống nhận xét.</div>
                                        </div>
                                    </label>
                                    <label className={`!flex !items-center !gap-4 !p-5 !rounded-2xl !border !cursor-pointer !transition-all ${batchMode === 'template' ? '!bg-white !border-primary !shadow-md' : '!bg-transparent !border-border hover:!border-primary/30'}`}>
                                        <input 
                                            type="radio" 
                                            name="batchMode" 
                                            checked={batchMode === 'template'} 
                                            onChange={() => setBatchMode('template')}
                                            className="!w-5 !h-5 !accent-primary"
                                        />
                                        <div>
                                            <div className="!font-bold !text-text-main !text-base">Sử dụng nhận xét mẫu</div>
                                            <div className="!text-xs !text-text-muted">Áp dụng một nội dung mẫu chung cho toàn bộ danh sách lớp.</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <div className="!space-y-4">
                                <div className="!space-y-2">
                                    <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest !ml-1">Chọn học sinh</label>
                                    <div className="!relative">
                                        <select 
                                            value={selectedStudent}
                                            onChange={(e) => setSelectedStudent(e.target.value)}
                                            disabled={isEdit}
                                            className="!w-full !px-4 !py-4 !bg-background !border !border-border !rounded-2xl !font-bold !text-text-main !focus:border-primary !outline-none disabled:!opacity-60 !appearance-none"
                                        >
                                            <option value="SV001">Nguyễn Văn A (SV001)</option>
                                            <option value="SV002">Trần Thị B (SV002)</option>
                                            <option value="SV003">Lê Hoàng C (SV003)</option>
                                        </select>
                                        <Icon icon="material-symbols:person-search-rounded" className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl" />
                                    </div>
                                </div>
                                <div className="!p-5 !bg-emerald-50 !border !border-emerald-100 !rounded-2xl !flex !items-start !gap-4">
                                    <div className="!w-10 !h-10 !bg-emerald-500/10 !text-emerald-600 !rounded-xl !flex !items-center !justify-center !shrink-0">
                                        <Icon icon="material-symbols:check-circle-rounded" className="!text-2xl" />
                                    </div>
                                    <div className="!text-sm !text-emerald-800 !font-medium !mt-1">
                                        Dữ liệu chuyên cần <span className="!font-black">{isEdit ? editData.attendance : '95'}%</span> và Điểm GPA <span className="!font-black">{isEdit ? editData.average : '8.5'}</span> đã được hệ thống tổng hợp sẵn.
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="!space-y-2">
                            <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-widest !ml-1">
                                {mode === 'batch' && batchMode === 'template' ? 'Nội dung nhận xét mẫu' : 'Nhận xét & Đánh giá cá nhân'}
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
                                        <p className="!text-xs !text-text-muted !font-medium">{selectedPeriod}</p>
                                    </div>
                                </div>

                                {/* Grades Grid */}
                                <div className="!grid !grid-cols-2 !gap-4 !mb-10">
                                    <div className="!p-4 !bg-emerald-50 !rounded-2xl !border !border-emerald-100 !text-center">
                                        <p className="!text-[10px] !font-black !text-emerald-700 !uppercase !tracking-widest">Điểm TB (GPA)</p>
                                        <p className="!text-3xl !font-black !text-emerald-600 !mt-1">{isEdit ? editData.average : '8.5'}</p>
                                    </div>
                                    <div className="!p-4 !bg-blue-50 !rounded-2xl !border !border-blue-100 !text-center">
                                        <p className="!text-[10px] !font-black !text-blue-700 !uppercase !tracking-widest">Chuyên cần</p>
                                        <p className="!text-3xl !font-black !text-blue-600 !mt-1">{isEdit ? editData.attendance : '95'}%</p>
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
                        onClick={handleSave}
                        className="!bg-primary !text-white !px-6 sm:!px-10 !py-3 sm:!py-4 !rounded-2xl !font-black !shadow-xl !shadow-primary/20 hover:!bg-primary/90 !transition-all !flex !items-center !gap-2 sm:!gap-3 hover:scale-[1.02] active:scale-95"
                    >
                        {mode === 'batch' ? (
                            <>
                                <Icon icon="material-symbols:dynamic-form-rounded" className="!text-xl" />
                                Bắt đầu tạo hàng loạt
                            </>
                        ) : (
                            <>
                                <Icon icon={isEdit ? "material-symbols:save-rounded" : "material-symbols:save-rounded"} className="!text-xl" />
                                {isEdit ? 'Cập nhật thay đổi' : 'Lưu kết quả & Gửi'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AcademicReportModal;
