import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Button from '../../../../../../../components/ui/Button';
import useAuthStore from '../../../../../../../store/authStore';
import { progressReportService } from '../../../../../api/progressReportService';
import { classService } from '../../../../../api/classService';
import studentClassService from '../../../../../api/studentClassService';
import AcademicReportModal from '../../../../../../academic-analytics/components/AcademicReportModal';
import ConfirmModal from '../../../../../../../components/ui/ConfirmModal';
import ReportSendConfirmModal from './ReportSendConfirmModal';

const ClassReportsTab = () => {
    const { classId } = useParams();
    const { user } = useAuthStore();
    const token = user?.token;
    const isStudent = user?.role === 'student';

    const [isLoading, setIsLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [className, setClassName] = useState('Đang tải...');
    
    // Period selection
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReport, setEditingReport] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, report: null, type: 'delete' });

    // Fetch periods (last 6 to next 6 months)
    const periods = React.useMemo(() => {
        const result = [];
        const now = new Date();
        for (let i = -6; i <= 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
            result.push({
                month: d.getMonth() + 1,
                year: d.getFullYear(),
                label: `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`
            });
        }
        return result;
    }, []);

    const fetchData = async () => {
        if (!classId || !token) return;
        setIsLoading(true);
        try {
            const [reportsRes, classRes] = await Promise.all([
                progressReportService.getClassDetail(classId, selectedMonth, selectedYear, token),
                isStudent 
                    ? studentClassService.getClassDetail(classId, token) 
                    : classService.getClassById(classId, token)
            ]);

            if (reportsRes.ok) {
                const data = await reportsRes.json();
                let fetchedReports = Array.isArray(data) ? data : (data.reports || []);
                
                // If student, filter by studentId and only Published status
                if (isStudent) {
                    // Get effective student ID (from state or token fallback)
                    let effectiveStudentId = user?.studentId;
                    if (!effectiveStudentId && token) {
                        try {
                            const decoded = jwtDecode(token);
                            effectiveStudentId = decoded["StudentId"] || decoded["studentId"] || decoded["student_id"];
                        } catch (e) {
                            console.error("Error decoding token for studentId", e);
                        }
                    }

                    fetchedReports = fetchedReports.filter(r => 
                        r.studentId === effectiveStudentId && r.status === 'Published'
                    );
                }
                
                setReports(fetchedReports);
            }

            if (classRes.ok) {
                const classData = await classRes.json();
                setClassName(classData.data?.className || classData.className || 'Lớp học');
            }
        } catch (error) {
            console.error('Error fetching reports data:', error);
            toast.error('Lỗi khi tải dữ liệu báo cáo');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [classId, selectedMonth, selectedYear]);

    const handleOpenModal = (reportData) => {
        setEditingReport(reportData);
        setIsModalOpen(true);
    };

    const handleConfirmAction = async () => {
        const id = confirmModal.report?.reportId || confirmModal.reportId;
        if (confirmModal.type === 'delete') {
            try {
                const res = await progressReportService.deleteReport(id, token);
                if (res.ok) {
                    toast.success('Đã xóa báo cáo thành công.');
                    fetchData();
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
                    fetchData();
                } else {
                    toast.error('Gửi báo cáo thất bại.');
                }
            } catch (err) {
                toast.error('Có lỗi xảy ra khi gửi báo cáo.');
            }
        }
        setConfirmModal({ isOpen: false, report: null, type: 'delete' });
    };

    const handleSaveReport = async (data) => {
        try {
            const res = await progressReportService.upsertReport({
                ...data,
                classId: classId
            }, token);

            if (res.ok) {
                const result = await res.json().catch(() => ({}));
                const finalReportId = data.reportId || result.reportId;
                
                fetchData();
                setIsModalOpen(false);
                setEditingReport(null);

                if (data.status === 'Sent') {
                    setConfirmModal({
                        isOpen: true,
                        report: { ...data, reportId: finalReportId },
                        type: 'send'
                    });
                } else {
                    toast.success(data.reportId ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
                }
            } else {
                toast.error('Lỗi khi lưu báo cáo.');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra khi kết nối server.');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Published':
            case 'Sent': return '!bg-emerald-100 !text-emerald-700';
            case 'Draft': return '!bg-amber-100 !text-amber-700';
            case 'Ready': return '!bg-blue-100 !text-blue-700';
            default: return '!bg-gray-100 !text-gray-700';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Published':
            case 'Sent': return 'Đã gửi';
            case 'Draft': return 'Bản nháp';
            case 'Ready': return 'Sẵn sàng';
            default: return status;
        }
    };

    const sentCount = reports.filter(s => s.status === 'Sent' || s.status === 'Published').length;
    const progressRate = reports.length > 0 ? Math.round((sentCount / reports.length) * 100) : 0;

    return (
        <div className="animate-fade-in-up space-y-6">
            {/* Header / Stats */}
            <div className="bg-surface rounded-2xl border border-border !p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between !gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                        <Icon icon="solar:chart-2-bold-duotone" className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="font-bold text-text-main text-[17px]">Tiến độ - {className}</h2>
                        <span className="text-xs font-semibold !px-2 !py-0.5 bg-primary/10 text-primary rounded-md border border-primary/20">
                            {isStudent 
                                ? `Báo cáo học tập cá nhân`
                                : `Hoàn thành ${sentCount}/${reports.length} học sinh (${progressRate}%)`
                            }
                        </span>
                    </div>
                </div>
                
                <div className="relative w-full md:w-56 mt-3 md:mt-0">
                    <select 
                        value={`${selectedMonth}-${selectedYear}`}
                        onChange={(e) => {
                            const [m, y] = e.target.value.split('-').map(Number);
                            setSelectedMonth(m);
                            setSelectedYear(y);
                        }}
                        className="w-full !pl-4 !pr-10 !py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-bold text-text-main cursor-pointer appearance-none"
                    >
                        {periods.map(p => (
                            <option key={`${p.month}-${p.year}`} value={`${p.month}-${p.year}`}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                    <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-base pointer-events-none" />
                </div>
            </div>

            {/* List */}
            <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="!px-6 !py-4 border-b border-border bg-background/50 flex flex-wraps items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Icon icon="solar:clipboard-list-bold-duotone" className="text-xl text-primary" />
                        <h3 className="text-base font-bold text-text-main">Danh sách báo cáo lớp</h3>
                    </div>
                </div>

                {isLoading ? (
                    <div className="!py-20 flex flex-col items-center justify-center">
                        <Icon icon="line-md:loading-loop" className="text-4xl text-primary !mb-3" />
                        <p className="text-text-muted font-medium text-sm">Đang tải dữ liệu...</p>
                    </div>
                ) : reports.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-background/80 border-b border-border">
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Học sinh</th>
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center">GPA & Attendance</th>
                                    {!isStudent && <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center">Trạng thái</th>}
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-right min-w-[180px]">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {reports.map(report => (
                                    <tr key={report.studentId} className="hover:bg-primary/5 transition-colors group">
                                        <td className="!p-4 text-text-main">
                                            <div className="flex items-center !gap-3 w-max">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                                    {(report.studentName || 'S').charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm">{report.studentName}</span>
                                                    <span className="text-[11px] text-text-muted font-mono">{report.studentId}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="!p-4">
                                            <div className="flex flex-col items-center gap-1.5 min-w-[150px]">
                                                <div className="flex items-center gap-3 w-full max-w-[140px]">
                                                    <span className="text-[10px] font-bold text-text-muted w-8">GPA</span>
                                                    <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden border border-border/50">
                                                        <div className="h-full bg-primary" style={{ width: `${(report.gpa || 0) * 10}%` }}></div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-primary w-6 text-right">{report.gpa || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-3 w-full max-w-[140px]">
                                                    <span className="text-[10px] font-bold text-text-muted w-8">ATT</span>
                                                    <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden border border-border/50">
                                                        <div className="h-full bg-emerald-500" style={{ width: `${report.attendanceRate || 0}%` }}></div>
                                                    </div>
                                                    <span className="text-[10px] font-black text-emerald-600 w-6 text-right">{report.attendanceRate || 0}%</span>
                                                </div>
                                            </div>
                                        </td>
                                        {!isStudent && (
                                            <td className="!p-4 text-center">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(report.status)}`}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                                                    {getStatusLabel(report.status)}
                                                </div>
                                            </td>
                                        )}
                                        <td className="!p-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                {isStudent ? (
                                                    <button 
                                                        title="Xem chi tiết" 
                                                        onClick={() => handleOpenModal(report)} 
                                                        className="!p-2.5 !rounded-xl !bg-primary/10 !text-primary hover:!bg-primary hover:!text-white transition-all shadow-sm border border-primary/20"
                                                    >
                                                        <Icon icon="solar:eye-bold-duotone" className="text-xl" />
                                                    </button>
                                                ) : (
                                                    <>
                                                        {report.status === 'Ready' ? (
                                                            <button 
                                                                title="Tạo báo cáo" 
                                                                onClick={() => handleOpenModal(report)} 
                                                                className="!p-2.5 !rounded-xl !bg-primary/10 !text-primary hover:!bg-primary hover:!text-white transition-all shadow-sm"
                                                            >
                                                                <Icon icon="material-symbols:add-chart-rounded" className="text-xl" />
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <button 
                                                                    title="Gửi báo cáo" 
                                                                    onClick={() => setConfirmModal({ isOpen: true, report: report, type: 'send' })} 
                                                                    className="!p-2.5 !rounded-xl !bg-emerald-50 !text-emerald-600 hover:!bg-emerald-600 hover:!text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm border border-emerald-100"
                                                                    disabled={report.status !== 'Draft'}
                                                                >
                                                                    <Icon icon="material-symbols:send-rounded" className="text-xl" />
                                                                </button>
                                                                <button 
                                                                    title="Sửa báo cáo" 
                                                                    onClick={() => handleOpenModal(report)} 
                                                                    className="!p-2.5 !rounded-xl !bg-amber-50 !text-amber-600 hover:!bg-amber-600 hover:!text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm border border-amber-100"
                                                                    disabled={report.status === 'Published' || report.status === 'Sent'}
                                                                >
                                                                    <Icon icon="material-symbols:edit-document-rounded" className="text-xl" />
                                                                </button>
                                                            </>
                                                        )}
                                                        {report.status !== 'Published' && report.status !== 'Sent' && (
                                                            <button 
                                                                title="Xóa báo cáo" 
                                                                onClick={() => setConfirmModal({ isOpen: true, reportId: report.reportId, type: 'delete' })} 
                                                                className="!p-2.5 !rounded-xl !bg-red-50 !text-red-600 hover:!bg-red-500 hover:!text-white transition-all shadow-sm border border-red-100"
                                                            >
                                                                <Icon icon="material-symbols:delete-rounded" className="text-xl" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="!py-20 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center !mb-3 border border-border">
                            <Icon icon="solar:box-linear" className="text-3xl text-text-muted" />
                        </div>
                        <h3 className="text-base font-bold text-text-main !mb-1">Không có học sinh</h3>
                        <p className="text-text-muted text-sm font-medium">Chưa có dữ liệu báo cáo cho kỳ này.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <AcademicReportModal 
                    isOpen={isModalOpen} 
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingReport(null);
                    }} 
                    defaultClass={classId}
                    month={selectedMonth}
                    year={selectedYear}
                    editData={editingReport}
                    onSave={handleSaveReport}
                    className={className}
                />
            )}

            <ConfirmModal 
                isOpen={confirmModal.isOpen && confirmModal.type === 'delete'}
                onClose={() => setConfirmModal({ isOpen: false, report: null, type: 'delete' })}
                onConfirm={handleConfirmAction}
                title="Xác nhận xóa báo cáo"
                message="Bạn có chắc chắn muốn xóa báo cáo này? Thao tác này không thể hoàn tác và dữ liệu sẽ bị mất vĩnh viễn."
                confirmText="Xóa ngay"
                cancelText="Quay lại"
                type="danger"
            />

            <ReportSendConfirmModal
                isOpen={confirmModal.isOpen && confirmModal.type === 'send'}
                onClose={() => setConfirmModal({ isOpen: false, report: null, type: 'delete' })}
                onConfirm={handleConfirmAction}
                report={confirmModal.report}
                className={className}
            />
        </div>
    );
};

export default ClassReportsTab;
