import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import AcademicReportModal from '../components/AcademicReportModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { toast } from 'react-toastify';

const MOCK_REPORTS = [
    { id: '1', studentName: 'Nguyễn Văn A', studentId: 'SV001', classId: 'TC101', period: 'Tháng 03/2026', attendance: 95, average: 8.5, status: 'Sent', sentAt: '2026-03-30 08:00' },
    { id: '2', studentName: 'Trần Thị B', studentId: 'SV002', classId: 'TC101', period: 'Tháng 03/2026', attendance: 100, average: 9.2, status: 'Ready', sentAt: null },
    { id: '3', studentName: 'Lê Hoàng C', studentId: 'SV003', classId: 'TC102', period: 'Tháng 03/2026', attendance: 85, average: 6.8, status: 'Draft', sentAt: null },
    { id: '4', studentName: 'Phạm Văn D', studentId: 'SV004', classId: 'TC101', period: 'Tháng 03/2026', attendance: 92, average: 7.5, status: 'Draft', sentAt: null },
    { id: '5', studentName: 'Hoàng Thị E', studentId: 'SV005', classId: 'TC102', period: 'Tháng 03/2026', attendance: 98, average: 8.8, status: 'Ready', sentAt: null },
];

const MOCK_CLASSES = {
    'TC101': 'Toán Nâng Cao - TC101',
    'TC102': 'Lý Thuyết Vật Lý - TC102',
    'TC103': 'Hóa Học Cơ Bản - TC103',
    'TC104': 'Luyện đề IELTS - TC104',
};

const ClassReportsPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [reports, setReports] = useState(MOCK_REPORTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, reportId: null });
    const [selectedReports, setSelectedReports] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');

    const className = MOCK_CLASSES[classId] || 'Lớp học không xác định';

    const classReports = useMemo(() => {
        let filtered = reports.filter(r => r.classId === classId);
        if (filterStatus !== 'All') {
            filtered = filtered.filter(r => r.status === filterStatus);
        }
        return filtered;
    }, [reports, classId, filterStatus]);

    const toggleSelectAll = () => {
        if (selectedReports.length === classReports.length) {
            setSelectedReports([]);
        } else {
            setSelectedReports(classReports.map(r => r.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedReports(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleDeleteClick = (id) => {
        setConfirmModal({ isOpen: true, reportId: id });
    };

    const handleConfirmDelete = () => {
        const id = confirmModal.reportId;
        setReports(prev => prev.filter(r => r.id !== id));
        setConfirmModal({ isOpen: false, reportId: null });
        toast.success('Đã xóa báo cáo thành công.');
    };

    const handleSend = (id) => {
        toast.success('Thông báo đã được gửi đến Phụ huynh và Học sinh!');
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Sent', sentAt: new Date().toLocaleString() } : r));
    };

    const handleEdit = (report) => {
        setEditingReport(report);
        setIsModalOpen(true);
    };

    const handleSaveReport = (data) => {
        if (editingReport) {
            setReports(prev => prev.map(r => r.id === editingReport.id ? { ...r, ...data } : r));
        } else {
            setReports(prev => [{ ...data, id: Date.now().toString(), classId }, ...prev]);
        }
        setIsModalOpen(false);
        setEditingReport(null);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Sent': return '!bg-emerald-100 !text-emerald-700';
            case 'Ready': return '!bg-blue-100 !text-blue-700';
            case 'Draft': return '!bg-amber-100 !text-amber-700';
            default: return '!bg-gray-100 !text-gray-700';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Sent': return 'Đã gửi';
            case 'Ready': return 'Sẵn sàng';
            case 'Draft': return 'Bản nháp';
            default: return status;
        }
    };

    return (
        <div className="!min-h-full  !p-4 sm:!p-6 !animate-fade-in custom-scrollbar">
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center !gap-6 bg-surface !p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="!flex !items-center !gap-4">
                    <div className="!w-16 !h-16 !bg-white !rounded-3xl !border !border-border !shadow-sm !flex !items-center !justify-center">
                        <Icon icon="material-symbols:school-outline-rounded" className="!text-3xl !text-primary" />
                    </div>
                    <div>
                        <h1 className="!text-2xl sm:!text-3xl !font-black !text-text-main !tracking-tight">{className}</h1>
                        <p className="!text-sm !text-text-muted !mt-1">
                            Quản lý {classReports.length} báo cáo học tập của học sinh trong lớp này.
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        setEditingReport(null);
                        setIsModalOpen(true);
                    }}
                    className="!w-full sm:!w-auto !bg-primary !text-white !px-6 !py-3 !rounded-xl !font-bold !flex !items-center !justify-center !gap-2 !shadow-lg !shadow-primary/20 hover:!bg-primary/90 !transition-all"
                >
                    <Icon icon="material-symbols:add-chart-rounded" className="!text-xl" />
                    Tạo báo cáo mới
                </button>
            </div>

            {/* Controls Section */}
            <div className="!bg-white !p-4 !mt-2 !rounded-2xl !border !border-border !shadow-sm !mb-6 !flex !flex-col sm:!flex-row !items-center !justify-between !gap-4">
                <div className="!flex !items-center !gap-2 !w-full sm:!w-auto">
                    <span className="!text-sm !font-bold !text-text-muted !whitespace-nowrap">Lọc theo:</span>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="!flex-1 sm:!w-40 !bg-background !border !border-border !rounded-lg !px-3 !py-2 !text-sm !font-medium focus:!border-primary !outline-none"
                    >
                        <option value="All">Tất cả trạng thái</option>
                        <option value="Draft">Bản nháp</option>
                        <option value="Ready">Sẵn sàng gửi</option>
                        <option value="Sent">Đã gửi</option>
                    </select>
                </div>
                
                {selectedReports.length > 0 && (
                    <div className="!flex !items-center !gap-3 !w-full sm:!w-auto">
                        <span className="!text-xs !font-bold !text-primary">Đã chọn {selectedReports.length} mục</span>
                        <button 
                            onClick={() => toast.info('Đang chuẩn bị gửi báo cáo hàng loạt cho các phụ huynh...')}
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
                <div className="hidden md:block">
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
                                <th className="!p-4 !text-xs !font-black !text-text-muted !uppercase !tracking-widest">Kỳ báo cáo</th>
                                <th className="!p-4 !text-xs !font-black !text-text-muted !uppercase !tracking-widest">Trạng thái</th>
                                <th className="!p-4 !text-xs !font-black !text-text-muted !uppercase !tracking-widest">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="!divide-y !divide-border">
                            {classReports.map(report => (
                                <tr key={report.id} className="hover:!bg-background/20 !transition-colors !group">
                                    <td className="!p-4">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedReports.includes(report.id)}
                                            onChange={() => toggleSelect(report.id)}
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
                                            <div className="!flex !items-center !gap-3 !w-full !max-w-[120px]">
                                                <span className="!text-[10px] !font-bold !text-text-muted !w-8">GPA</span>
                                                <div className="!flex-1 !h-1.5 !bg-background !rounded-full !overflow-hidden">
                                                    <div className="!h-full !bg-primary" style={{ width: `${report.average * 10}%` }}></div>
                                                </div>
                                                <span className="!text-[10px] !font-black !text-primary">{report.average}</span>
                                            </div>
                                            <div className="!flex !items-center !gap-3 !w-full !max-w-[120px]">
                                                <span className="!text-[10px] !font-bold !text-text-muted !w-8">ATT</span>
                                                <div className="!flex-1 !h-1.5 !bg-background !rounded-full !overflow-hidden">
                                                    <div className="!h-full !bg-emerald-500" style={{ width: `${report.attendance}%` }}></div>
                                                </div>
                                                <span className="!text-[10px] !font-black !text-emerald-600">{report.attendance}%</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="!p-4">
                                        <div className="!text-sm !font-bold !text-text-main">{report.period}</div>
                                    </td>
                                    <td className="!p-4">
                                        <div className={`!inline-flex !items-center !gap-1.5 !px-3 !py-1 !rounded-full !text-[11px] !font-bold ${getStatusStyle(report.status)}`}>
                                            <div className="!w-1.5 !h-1.5 !rounded-full !bg-current"></div>
                                            {getStatusLabel(report.status)}
                                        </div>
                                        {report.sentAt && (
                                            <div className="!text-[10px] !text-text-muted !mt-1">{report.sentAt}</div>
                                        )}
                                    </td>
                                    <td className="!p-4">
                                        <div className="!flex !items-center !gap-2">
                                            <button title="Gửi báo cáo" onClick={() => handleSend(report.id)} className="!p-2 !rounded-lg !bg-primary/5 !text-primary hover:!bg-primary hover:!text-white !transition-all">
                                                <Icon icon="material-symbols:send-rounded" />
                                            </button>
                                            <button title="Sửa báo cáo" onClick={() => handleEdit(report)} className="!p-2 !rounded-lg !bg-amber-50 !text-amber-600 hover:!bg-amber-500 hover:!text-white !transition-all">
                                                <Icon icon="material-symbols:edit-document-rounded" />
                                            </button>
                                            <button title="Xuất PDF" onClick={() => toast.info('Tính năng xuất PDF đang được phát triển!')} className="!p-2 !rounded-lg !bg-gray-50 !text-gray-500 hover:!bg-gray-700 hover:!text-white !transition-all">
                                                <Icon icon="material-symbols:picture-as-pdf-rounded" />
                                            </button>
                                            <button title="Xóa báo cáo" onClick={() => handleDeleteClick(report.id)} className="!p-2 !rounded-lg !bg-red-50 !text-red-600 hover:!bg-red-500 hover:!text-white !transition-all">
                                                <Icon icon="material-symbols:delete-rounded" />
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
                    {classReports.map(report => (
                        <div key={report.id} className="!p-4 space-y-3">
                            {/* Row 1: Checkbox + Student + Status */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedReports.includes(report.id)}
                                        onChange={() => toggleSelect(report.id)}
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

                            {/* Row 2: GPA + Attendance bars */}
                            <div className="!bg-background !rounded-xl !p-3 space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-text-muted w-6 shrink-0">GPA</span>
                                    <div className="flex-1 !h-1.5 !bg-border !rounded-full !overflow-hidden">
                                        <div className="!h-full !bg-primary !rounded-full" style={{ width: `${report.average * 10}%` }}></div>
                                    </div>
                                    <span className="text-[11px] font-black text-primary w-8 text-right">{report.average}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-text-muted w-6 shrink-0">ATT</span>
                                    <div className="flex-1 !h-1.5 !bg-border !rounded-full !overflow-hidden">
                                        <div className="!h-full !bg-emerald-500 !rounded-full" style={{ width: `${report.attendance}%` }}></div>
                                    </div>
                                    <span className="text-[11px] font-black text-emerald-600 w-8 text-right">{report.attendance}%</span>
                                </div>
                            </div>

                            {/* Row 3: Period + Actions */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-text-muted !bg-background !px-3 !py-1.5 rounded-lg border border-border">{report.period}</span>
                                <div className="flex items-center gap-1.5">
                                    <button title="Gửi" onClick={() => handleSend(report.id)} className="!p-2 !rounded-lg !bg-primary/5 !text-primary hover:!bg-primary hover:!text-white !transition-all">
                                        <Icon icon="material-symbols:send-rounded" className="text-base" />
                                    </button>
                                    <button title="Sửa" onClick={() => handleEdit(report)} className="!p-2 !rounded-lg !bg-amber-50 !text-amber-600 hover:!bg-amber-500 hover:!text-white !transition-all">
                                        <Icon icon="material-symbols:edit-document-rounded" className="text-base" />
                                    </button>
                                    <button title="PDF" onClick={() => toast.info('Tính năng xuất PDF đang được phát triển!')} className="!p-2 !rounded-lg !bg-gray-50 !text-gray-500 hover:!bg-gray-700 hover:!text-white !transition-all">
                                        <Icon icon="material-symbols:picture-as-pdf-rounded" className="text-base" />
                                    </button>
                                    <button title="Xóa" onClick={() => handleDeleteClick(report.id)} className="!p-2 !rounded-lg !bg-red-50 !text-red-600 hover:!bg-red-500 hover:!text-white !transition-all">
                                        <Icon icon="material-symbols:delete-rounded" className="text-base" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {classReports.length === 0 && (
                    <div className="!p-16 !text-center">
                        <div className="!w-20 !h-20 !bg-background/50 !rounded-full !flex !items-center !justify-center !mx-auto !mb-4">
                            <Icon icon="material-symbols:analytics-rounded" className="!text-4xl !text-text-muted/30" />
                        </div>
                        <h3 className="!text-lg !font-bold !text-text-main">Chưa có báo cáo nào cho lớp này</h3>
                        <p className="!text-sm !text-text-muted !mt-1">Hãy nhấn nút "Tạo báo cáo mới" để bắt đầu.</p>
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
                editData={editingReport}
                onSave={handleSaveReport}
            />

            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, reportId: null })}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa báo cáo"
                message="Bạn có chắc chắn muốn xóa báo cáo này? Thao tác này không thể hoàn tác và dữ liệu sẽ bị mất vĩnh viễn."
                confirmText="Xóa ngay"
                cancelText="Hủy bỏ"
                type="danger"
            />
        </div>
    );
};

export default ClassReportsPage;
