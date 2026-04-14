import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import AcademicReportModal from '../components/AcademicReportModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { toast } from 'react-toastify';
import { progressReportService } from '../../dashboard/api/progressReportService';
import useAuthStore from '../../../store/authStore';

// Mock constants removed

const ClassReportsPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuthStore();
    const token = user?.token;

    const [month, setMonth] = useState(parseInt(searchParams.get('month')) || new Date().getMonth() + 1);
    const [year, setYear] = useState(parseInt(searchParams.get('year')) || new Date().getFullYear());
    const [filterStatus, setFilterStatus] = useState('All');
    
    const [reports, setReports] = useState([]);
    const [classInfo, setClassInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, reportId: null, type: 'delete' });
    const [selectedReports, setSelectedReports] = useState([]);

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const res = await progressReportService.getClassDetail(classId, month, year, token);
            if (res.ok) {
                const data = await res.json();
                // If the response is the array directly (as seen in screenshot)
                if (Array.isArray(data)) {
                    setReports(data);
                    // If classInfo is needed, we might need another API or get it from the first report if available
                    if (data.length > 0) {
                        setClassInfo({
                            className: data[0].className,
                            room: data[0].room // Assuming room might be there or null
                        });
                    }
                } else {
                    setReports(data.reports || []);
                    setClassInfo(data.classInfo || null);
                }
            }
        } catch (error) {
            console.error('Error fetching class reports:', error);
            toast.error('Lỗi khi tải danh sách báo cáo.');
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchReports();
        // Update URL query params without refreshing
        setSearchParams({ month, year });
    }, [classId, month, year, filterStatus, token]);

    const className = classInfo?.className || 'Đang tải...';
    const classRoom = classInfo?.room || '';

    const classReports = reports;

    const toggleSelectAll = () => {
        if (selectedReports.length === classReports.length) {
            setSelectedReports([]);
        } else {
            setSelectedReports(classReports.map(r => r.reportId));
        }
    };

    const toggleSelect = (id) => {
        setSelectedReports(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleConfirmAction = async () => {
        const id = confirmModal.reportId;
        if (confirmModal.type === 'delete') {
            try {
                const res = await progressReportService.deleteReport(id, token);
                if (res.ok) {
                    toast.success('Đã xóa báo cáo thành công.');
                    fetchReports();
                } else {
                    toast.error('Không thể xóa báo cáo.');
                }
            } catch (err) {
                toast.error('Có lỗi xảy ra khi xóa báo cáo.');
            }
        } else if (confirmModal.type === 'send') {
            try {
                const res = await progressReportService.sendReport(id, token);
                if (res.ok) {
                    toast.success('Báo cáo đã được gửi đến Phụ huynh!');
                    fetchReports();
                } else {
                    toast.error('Gửi báo cáo thất bại.');
                }
            } catch (err) {
                toast.error('Có lỗi xảy ra khi gửi báo cáo.');
            }
        } else if (confirmModal.type === 'batch-send') {
            let successCount = 0;
            let failCount = 0;
            
            for (const reportId of selectedReports) {
                try {
                    const res = await progressReportService.sendReport(reportId, token);
                    if (res.ok) successCount++;
                    else failCount++;
                } catch (e) {
                    failCount++;
                }
            }
            
            if (successCount > 0) toast.success(`Đã gửi thành công ${successCount} báo cáo!`);
            if (failCount > 0) toast.error(`Gửi thất bại ${failCount} báo cáo.`);
            
            setSelectedReports([]);
            fetchReports();
        }
        setConfirmModal({ isOpen: false, reportId: null, type: 'delete' });
    };

    const handleSendClick = (report) => {
        setConfirmModal({ 
            isOpen: true, 
            reportId: report.reportId, 
            studentName: report.studentName,
            type: 'send' 
        });
    };

    const handleBatchSend = () => {
        if (selectedReports.length === 0) return;
        setConfirmModal({
            isOpen: true,
            reportId: null,
            type: 'batch-send'
        });
    };

    const handleEdit = (report) => {
        setEditingReport(report);
        setIsModalOpen(true);
    };

    const handleSaveReport = async (data) => {
        try {
            // If it's a "Send" action from the modal, we still save as "Draft" first 
            // to ensure content is stored before confirmation.
            const payload = {
                ...data,
                status: 'Draft' // Always save as Draft first if coming from Modal Send
            };

            const res = await progressReportService.upsertReport({
                ...payload,
                classId: classId
            }, token);

            if (res.ok) {
                const result = await res.json().catch(() => ({}));
                const finalReportId = data.reportId || result.reportId;
                
                fetchReports();
                setIsModalOpen(false);
                setEditingReport(null);

                if (data.status === 'Sent') {
                    // Open the confirm modal for this student
                    setConfirmModal({
                        isOpen: true,
                        reportId: finalReportId,
                        studentName: data.studentName,
                        type: 'send'
                    });
                } else {
                    toast.success(data.reportId ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
                }
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.message || 'Lỗi khi lưu báo cáo.');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi kết nối server.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Published':
            case 'Sent': return '!bg-emerald-100 !text-emerald-700';
            case 'Ready': return '!bg-blue-100 !text-blue-700';
            case 'Draft': return '!bg-amber-100 !text-amber-700';
            default: return '!bg-gray-100 !text-gray-700';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Published':
            case 'Sent': return 'Đã gửi';
            case 'Ready': return 'Sẵn sàng';
            case 'Draft': return 'Bản nháp';
            default: return status;
        }
    };

    const handleDeleteClick = (reportId) => {
        setConfirmModal({
            isOpen: true,
            reportId: reportId,
            type: 'delete'
        });
    };

    return (
        <div className="!min-h-full !p-4 sm:!p-6 !animate-fade-in custom-scrollbar">
            {/* Breadcrumbs & Navigation */}
            <div className="!flex !items-center !gap-2 !mb-6">
                <button 
                    onClick={() => navigate('/reports')}
                    className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-muted hover:!text-primary !transition-colors"
                >
                    <Icon icon="material-symbols:arrow-back-ios-new-rounded" />
                    Quay lại danh sách lớp
                </button>
            </div>

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center !gap-6 bg-surface !p-6 rounded-[2rem] border border-border shadow-sm mb-6">
                <div className="!flex !items-center !gap-4">
                    <div className="!w-16 !h-16 !bg-white !rounded-3xl !border !border-border !shadow-sm !flex !items-center !justify-center">
                        <Icon icon="material-symbols:school-outline-rounded" className="!text-3xl !text-primary" />
                    </div>
                    <div>
                        <h1 className="!text-2xl sm:!text-3xl !font-black !text-text-main !tracking-tight">
                            {className} - {classId} | Báo cáo Tháng {month.toString().padStart(2, '0')}/{year}
                        </h1>
                        <p className="!text-sm !text-text-muted !mt-1">
                            Tổng hợp tiến độ: {classReports.length} học sinh
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="!bg-white !p-4 !rounded-2xl !border !border-border !shadow-sm !mb-6 !flex !flex-wrap !items-center !justify-between !gap-4">
                <div className="!flex !items-center !gap-4 !w-full sm:!w-auto">
                    {/* Combined Period Picker */}
                    <div className="!relative !w-full sm:!w-48">
                        <select 
                            value={`${month}-${year}`}
                            onChange={(e) => {
                                const [m, y] = e.target.value.split('-').map(Number);
                                setMonth(m);
                                setYear(y);
                            }}
                            className="!w-full !px-4 !py-2.5 !bg-background !border !border-border !rounded-xl !text-sm !font-black focus:!outline-none focus:!border-primary !transition-all !shadow-sm cursor-pointer !appearance-none"
                        >
                            {Array.from({ length: 13 }, (_, i) => {
                                const d = new Date(new Date().getFullYear(), new Date().getMonth() - 6 + i, 1);
                                const m = d.getMonth() + 1;
                                const y = d.getFullYear();
                                return (
                                    <option key={`${m}-${y}`} value={`${m}-${y}`}>
                                        Tháng {m}/{y}
                                    </option>
                                );
                            })}
                        </select>
                        <Icon icon="material-symbols:keyboard-arrow-down-rounded" className="!absolute !right-3 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl !pointer-events-none" />
                    </div>

                    <div className="!h-6 !w-[1px] !bg-border hidden sm:block"></div>

                    <div className="!flex !items-center !gap-2">
                        <span className="!text-xs !font-bold !text-text-muted !uppercase">Trạng thái:</span>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="!bg-background !border !border-border !rounded-lg !px-3 !py-2 !text-sm !font-medium focus:!border-primary !outline-none"
                        >
                            <option value="All">Tất cả</option>
                            <option value="Draft">Bản nháp</option>
                            <option value="Ready">Sẵn sàng</option>
                            <option value="Sent">Đã gửi</option>
                        </select>
                    </div>
                </div>
                
                {selectedReports.length > 0 && (
                    <div className="!flex !items-center !gap-3 !w-full sm:!w-auto">
                        <span className="!text-xs !font-bold !text-primary">Đã chọn {selectedReports.length} mục</span>
                        <button 
                            onClick={handleBatchSend}
                            className="!flex-1 sm:!flex-none !bg-primary/10 !text-primary !px-4 !py-2 !rounded-lg !text-sm !font-bold hover:!bg-primary/20 !transition-all !flex !items-center !justify-center !gap-2"
                        >
                            <Icon icon="material-symbols:send-rounded" />
                            Gửi hàng loạt
                        </button>
                    </div>
                )}
            </div>

            {/* Main Content - Responsive */}
            <div className="!bg-white !rounded-3xl !border !border-border !shadow-sm !overflow-hidden">

                {/* ── Desktop Table (md+) ─────────────────────────── */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="!w-full !text-left !border-collapse">
                        <thead>
                            <tr className="!bg-background/50 !border-b !border-border">
                                <th className="!p-4 !w-12">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedReports.length === classReports.length && classReports.length > 0}
                                        onChange={toggleSelectAll}
                                        className="!w-5 !h-5 accent-primary"
                                    />
                                </th>
                                <th className="!p-4 !text-xs !font-black !text-text-muted !uppercase !tracking-widest">Học sinh</th>
                                <th className="!p-4 !text-xs !font-black !text-text-muted !uppercase !tracking-widest !text-center">GPA & Attendance</th>
                                <th className="!p-4 !text-xs !font-black !text-text-muted !uppercase !tracking-widest text-center">Trạng thái</th>
                                <th className="!p-4 !text-xs !font-black !text-text-muted !uppercase !tracking-widest">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="!divide-y !divide-border">
                            {classReports.filter(r => filterStatus === 'All' || r.status === filterStatus).map(report => (
                                <tr key={report.reportId} className="hover:!bg-background/20 !transition-colors !group">
                                    <td className="!p-4">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedReports.includes(report.reportId)}
                                            onChange={() => toggleSelect(report.reportId)}
                                            className="!w-5 !h-5 accent-primary"
                                        />
                                    </td>
                                    <td className="!p-4">
                                        <div className="!flex !items-center !gap-3">
                                            <div className="!w-10 !h-10 !bg-primary/5 !rounded-full !flex !items-center !justify-center !border !border-primary/10">
                                                <Icon icon="material-symbols:person-rounded" className="!text-primary !text-xl" />
                                            </div>
                                            <div>
                                                <div className="!font-bold !text-text-main">{report.studentName}</div>
                                                <div className="!text-xs !text-text-muted">{report.studentId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="!p-4">
                                        <div className="!flex !flex-col !items-center !gap-1">
                                            <div className="!flex !items-center !gap-3 !w-full !max-w-[140px]">
                                                <span className="!text-[10px] !font-bold !text-text-muted !w-8">GPA</span>
                                                <div className="!flex-1 !h-1.5 !bg-background !rounded-full !overflow-hidden">
                                                    <div className="!h-full !bg-primary" style={{ width: `${(report.gpa || 0) * 10}%` }}></div>
                                                </div>
                                                <span className="!text-[10px] !font-black !text-primary">{report.gpa || 0}</span>
                                            </div>
                                            <div className="!flex !items-center !gap-3 !w-full !max-w-[140px]">
                                                <span className="!text-[10px] !font-bold !text-text-muted !w-8">ATT</span>
                                                <div className="!flex-1 !h-1.5 !bg-background !rounded-full !overflow-hidden">
                                                    <div className="!h-full !bg-emerald-500" style={{ width: `${report.attendanceRate || 0}%` }}></div>
                                                </div>
                                                <span className="!text-[10px] !font-black !text-emerald-600">{report.attendanceRate || 0}%</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="!p-4 text-center">
                                        <div className={`!inline-flex !items-center !gap-1.5 !px-3 !py-1 !rounded-full !text-[11px] !font-bold ${getStatusStyle(report.status)}`}>
                                            <div className="!w-1.5 !h-1.5 !rounded-full !bg-current"></div>
                                            {getStatusLabel(report.status)}
                                        </div>
                                        {report.updatedAt && (report.status === 'Published' || report.status === 'Sent') && (
                                            <div className="!text-[10px] !text-text-muted !mt-1">
                                                {new Date(report.updatedAt).toLocaleString('vi-VN')}
                                            </div>
                                        )}
                                    </td>
                                    <td className="!p-4">
                                        <div className="!flex !items-center !gap-2">
                                            {report.status === 'Ready' ? (
                                                <button 
                                                    title="Tạo báo cáo" 
                                                    onClick={() => handleEdit(report)} 
                                                    className="!p-2 !rounded-lg !bg-primary/10 !text-primary hover:!bg-primary hover:!text-white !transition-all"
                                                >
                                                    <Icon icon="material-symbols:add-chart-rounded" className="text-xl" />
                                                </button>
                                            ) : (
                                                <>
                                                    <button 
                                                        title="Gửi báo cáo" 
                                                        onClick={() => handleSendClick(report)} 
                                                        className="!p-2 !rounded-lg !bg-emerald-50 !text-emerald-600 hover:!bg-emerald-600 hover:!text-white !transition-all disabled:!opacity-30 disabled:!cursor-not-allowed"
                                                        disabled={report.status !== 'Draft'}
                                                    >
                                                        <Icon icon="material-symbols:send-rounded" className="text-xl" />
                                                    </button>
                                                    <button 
                                                        title="Sửa báo cáo" 
                                                        onClick={() => handleEdit(report)} 
                                                        className="!p-2 !rounded-lg !bg-amber-50 !text-amber-600 hover:!bg-amber-600 hover:!text-white !transition-all disabled:!opacity-30 disabled:!cursor-not-allowed"
                                                        disabled={report.status === 'Published' || report.status === 'Sent'}
                                                    >
                                                        <Icon icon="material-symbols:edit-document-rounded" className="text-xl" />
                                                    </button>
                                                </>
                                            )}
                                            <button title="Xuất PDF" onClick={() => toast.info('Tính năng xuất PDF đang được phát triển!')} className="!p-2 !rounded-lg !bg-gray-50 !text-gray-500 hover:!bg-gray-700 hover:!text-white !transition-all">
                                                <Icon icon="material-symbols:picture-as-pdf-rounded" className="text-xl" />
                                            </button>
                                            <button title="Xóa báo cáo" onClick={() => handleDeleteClick(report.reportId)} className="!p-2 !rounded-lg !bg-red-50 !text-red-600 hover:!bg-red-500 hover:!text-white !transition-all">
                                                <Icon icon="material-symbols:delete-rounded" className="text-xl" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Mobile Card List (below md) ─────────────────── */}
                <div className="md:hidden divide-y divide-border">
                    {classReports.filter(r => filterStatus === 'All' || r.status === filterStatus).map(report => (
                        <div key={report.reportId} className="!p-4 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedReports.includes(report.reportId)}
                                        onChange={() => toggleSelect(report.reportId)}
                                        className="!w-5 !h-5 accent-primary shrink-0"
                                    />
                                    <div className="!w-9 !h-9 !bg-primary/5 !rounded-full !flex !items-center !justify-center !border !border-primary/10 shrink-0">
                                        <Icon icon="material-symbols:person-rounded" className="!text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main text-sm">{report.studentName}</p>
                                        <p className="text-xs text-text-muted">{report.studentId}</p>
                                    </div>
                                </div>
                                <div className={`!inline-flex !items-center !gap-1.5 !px-2.5 !py-1 !rounded-full !text-[11px] !font-bold shrink-0 ${getStatusStyle(report.status)}`}>
                                    <div className="!w-1.5 !h-1.5 !rounded-full !bg-current"></div>
                                    {getStatusLabel(report.status)}
                                </div>
                            </div>

                            <div className="!bg-background/50 !rounded-xl !p-3 space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-text-muted w-6 shrink-0">GPA</span>
                                    <div className="flex-1 !h-1.5 !bg-border !rounded-full !overflow-hidden">
                                        <div className="!h-full !bg-primary !rounded-full" style={{ width: `${(report.gpa || 0) * 10}%` }}></div>
                                    </div>
                                    <span className="text-[11px] font-black text-primary w-8 text-right">{report.gpa || 0}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-text-muted w-6 shrink-0">ATT</span>
                                    <div className="flex-1 !h-1.5 !bg-border !rounded-full !overflow-hidden">
                                        <div className="!h-full !bg-emerald-500 !rounded-full" style={{ width: `${report.attendanceRate || 0}%` }}></div>
                                    </div>
                                    <span className="text-[11px] font-black text-emerald-600 w-8 text-right">{report.attendanceRate || 0}%</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                    {report.status === 'Ready' ? (
                                        <button 
                                            title="Tạo" 
                                            onClick={() => handleEdit(report)} 
                                            className="!p-2 !rounded-lg !bg-primary/10 !text-primary hover:!bg-primary hover:!text-white !transition-all"
                                        >
                                            <Icon icon="material-symbols:add-chart-rounded" className="text-base" />
                                        </button>
                                    ) : (
                                        <>
                                            <button 
                                                title="Gửi" 
                                                onClick={() => handleSendClick(report)} 
                                                className="!p-2 !rounded-lg !bg-emerald-50 !text-emerald-600 hover:!bg-emerald-600 hover:!text-white !transition-all disabled:!opacity-30 disabled:!cursor-not-allowed"
                                                disabled={report.status !== 'Draft'}
                                            >
                                                <Icon icon="material-symbols:send-rounded" className="text-base" />
                                            </button>
                                            <button 
                                                title="Sửa" 
                                                onClick={() => handleEdit(report)} 
                                                className="!p-2 !rounded-lg !bg-amber-50 !text-amber-600 hover:!bg-amber-600 hover:!text-white !transition-all disabled:!opacity-30 disabled:!cursor-not-allowed"
                                                disabled={report.status === 'Published' || report.status === 'Sent'}
                                            >
                                                <Icon icon="material-symbols:edit-document-rounded" className="text-base" />
                                            </button>
                                        </>
                                    )}
                                    <button title="PDF" onClick={() => toast.info('Tính năng xuất PDF đang được phát triển!')} className="!p-2 !rounded-lg !bg-gray-50 !text-gray-500 hover:!bg-gray-700 hover:!text-white !transition-all">
                                        <Icon icon="material-symbols:picture-as-pdf-rounded" className="text-base" />
                                    </button>
                                    <button title="Xóa" onClick={() => handleDeleteClick(report.reportId)} className="!p-2 !rounded-lg !bg-red-50 !text-red-600 hover:!bg-red-500 hover:!text-white !transition-all">
                                        <Icon icon="material-symbols:delete-rounded" className="text-base" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {isLoading && (
                    <div className="!py-20 !flex !flex-col !items-center !justify-center">
                        <Icon icon="line-md:loading-loop" className="!text-4xl !text-primary !mb-2" />
                        <p className="!text-text-muted !font-medium">Đang tải danh sách báo cáo...</p>
                    </div>
                )}

                {!isLoading && classReports.length === 0 && (
                    <div className="!p-16 !text-center">
                        <div className="!w-20 !h-20 !bg-background/50 !rounded-full !flex !items-center !justify-center !mx-auto !mb-4">
                            <Icon icon="material-symbols:analytics-rounded" className="!text-4xl !text-text-muted/30" />
                        </div>
                        <h3 className="!text-lg !font-bold !text-text-main">Chưa có báo cáo nào cho kỳ học này</h3>
                        <p className="!text-sm !text-text-muted !mt-1">Thay đổi kỳ báo cáo để tra cứu dữ liệu.</p>
                    </div>
                )}
            </div>

            <AcademicReportModal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingReport(null);
                }} 
                defaultClass={classId}
                month={month}
                year={year}
                editData={editingReport}
                onSave={handleSaveReport}
            />

            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, reportId: null, type: 'delete' })}
                onConfirm={handleConfirmAction}
                title={confirmModal.type === 'send' 
                    ? "Xác nhận gửi báo cáo" 
                    : confirmModal.type === 'batch-send'
                        ? "Xác nhận gửi hàng loạt"
                        : "Xác nhận xóa báo cáo"}
                message={confirmModal.type === 'send' 
                    ? `Bạn có chắc chắn muốn gửi báo cáo học tập Tháng ${month}/${year} của học sinh ${confirmModal.studentName} cho phụ huynh không? Báo cáo sau khi gửi sẽ không thể chỉnh sửa.`
                    : confirmModal.type === 'batch-send'
                        ? `Bạn có chắc chắn muốn gửi ${selectedReports.length} báo cáo đã chọn cho phụ huynh không?`
                        : "Bạn có chắc chắn muốn xóa báo cáo này? Thao tác này không thể hoàn tác và dữ liệu sẽ bị mất vĩnh viễn."}
                confirmText={confirmModal.type === 'send' || confirmModal.type === 'batch-send' ? "Xác nhận Gửi" : "Xóa ngay"}
                cancelText="Quay lại"
                type={confirmModal.type === 'send' || confirmModal.type === 'batch-send' ? "primary" : "danger"}
            />
        </div>
    );
};

export default ClassReportsPage;
