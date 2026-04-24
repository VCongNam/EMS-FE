import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import StudentPaymentTable from '../components/StudentPaymentTable';

import ConfirmModal from '../../../components/ui/ConfirmModal';
import PromptModal from '../../../components/ui/PromptModal';
import TuitionFeeModal from '../components/TuitionFeeModal';
import PreviewInvoiceModal from '../components/PreviewInvoiceModal';
import FinalBillModal from '../components/FinalBillModal';
import { tuitionService } from '../api/tuitionService';
import useAuthStore from '../../../store/authStore';

const ClassFinancialDetailPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Lấy tháng/năm hiện tại
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

    const [classInfo, setClassInfo] = useState({ name: 'Đang tải...', students: 0, billingMethod: 'Prepaid' });
    const [allClasses, setAllClasses] = useState([]);
    const [studentsData, setStudentsData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [invoiceStats, setInvoiceStats] = useState({ expectedRevenue: 0, actualRevenue: 0, debtAmount: 0 });

    // Preview & Confirm Flow States
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState([]);
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Final Bill (Tất toán lẻ) States
    const [targetStudentId, setTargetStudentId] = useState(null);
    const [isLoadingFinalPreview, setIsLoadingFinalPreview] = useState(false);
    const [isFinalModalOpen, setIsFinalModalOpen] = useState(false);
    const [finalPreviewData, setFinalPreviewData] = useState(null);
    const [finalDueDate, setFinalDueDate] = useState('');
    const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const rowsPerPage = 10;

    const [feeModal, setFeeModal] = useState({ isOpen: false, editData: null });

    const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, title: '', message: '' });
    const [promptModal, setPromptModal] = useState({ isOpen: false, action: null, title: '', message: '', defaultValue: '' });

    const handleExtendClick = (student) => {
        setPromptModal({
            isOpen: true,
            title: 'Gia hạn hạn nộp',
            message: `Nhập số ngày muốn gia hạn cho ${student.studentName || student.name}:`,
            defaultValue: '7',
            action: async (days) => {
                setPromptModal({ isOpen: false });
                if (days && !isNaN(days) && parseInt(days) > 0) {
                    try {
                        const res = await tuitionService.extendInvoiceDueDate(student.invoiceId, parseInt(days), user.token);
                        if (res.ok) {
                            toast.success("Gia hạn thành công!");
                            fetchData();
                        } else {
                            toast.error("Gia hạn thất bại.");
                        }
                    } catch (error) {
                        toast.error("Lỗi khi gia hạn.");
                    }
                }
            }
        });
    };

    const fetchData = async () => {
        if (!user?.token || !classId) return;
        try {
            setIsLoading(true);
            
            // Hàm xử lý an toàn, nếu API lỗi mạng nó sẽ trả về response giả lập
            const safeFetch = p => p.catch(error => ({ ok: false }));

            const [resDetail, resSummaries, configRes, summaryRes] = await Promise.all([
                safeFetch(tuitionService.getClassInvoicesReport(classId, selectedMonth, selectedYear, currentPage, rowsPerPage, user.token)),
                safeFetch(tuitionService.getClassFinancialSummaries(user.token)),
                safeFetch(tuitionService.getTuitionFeeConfig(classId, user.token)),
                safeFetch(tuitionService.getClassInvoiceSummary(classId, selectedMonth, selectedYear, user.token))
            ]);

            // Process Invoice Summary
            try {
                if (summaryRes && summaryRes.ok) {
                    const summaryData = await summaryRes.json();
                    setInvoiceStats({
                        expectedRevenue: Number(summaryData?.expectedRevenue) || 0,
                        actualRevenue: Number(summaryData?.actualRevenue) || 0,
                        debtAmount: Number(summaryData?.debtAmount) || 0
                    });
                } else {
                    setInvoiceStats({ expectedRevenue: 0, actualRevenue: 0, debtAmount: 0 });
                }
            } catch (err) {
                 console.error("Lỗi parse JSON API Tóm tắt:", err);
                 setInvoiceStats({ expectedRevenue: 0, actualRevenue: 0, debtAmount: 0 });
            }

            // Process Config first
            let classConfig = {};
            if (configRes && configRes.ok) {
                try {
                    classConfig = await configRes.json();
                } catch(e) {}
            }

            // Process Summaries for real student count
            let realStudentCount = 0;
            if (resSummaries && resSummaries.ok) {
                try {
                    const summariesData = await resSummaries.json();
                    setAllClasses(summariesData || []);
                    const currentClassSummary = summariesData.find(c => c.classId === classId || c.id === classId);
                    if (currentClassSummary) {
                        realStudentCount = currentClassSummary.studentCount || currentClassSummary.studentsCount || 0;
                    }
                } catch(e) {}
            }

            // Process Invoices / Financial Details
            if (resDetail && resDetail.ok) {
                try {
                    const data = await resDetail.json();
                    let invoiceList = [];
                    let count = 0;

                    if (data.items) {
                        invoiceList = data.items;
                        count = data.totalCount || data.total || data.items.length;
                    } else {
                        invoiceList = Array.isArray(data) ? data : (data.students || []);
                        count = invoiceList.length;
                    }

                    setStudentsData(invoiceList);
                    setTotalStudents(count);
                    
                    setClassInfo(prev => ({
                        ...prev,
                        name: classConfig.className || `Lớp ${classId}`,
                        students: count || prev.students,
                        billingMethod: classConfig.billingMethod || 'Prepaid',
                        tuitionFee: classConfig.tuitionFee,
                        paymentDeadlineDays: classConfig.paymentDeadlineDays,
                        startDate: classConfig.startDate,
                        endDate: classConfig.endDate
                    }));
                } catch(e) {}
            } else {
                // Render with at least config info even if detail fails
                setClassInfo({
                    classId: classId,
                    name: classConfig.className || `Lớp ${classId}`,
                    students: realStudentCount,
                    billingMethod: classConfig.billingMethod || 'Prepaid',
                    tuitionFee: classConfig.tuitionFee,
                    paymentDeadlineDays: classConfig.paymentDeadlineDays || 5,
                    startDate: classConfig.startDate,
                    endDate: classConfig.endDate
                });
                setStudentsData([]);
                toast.error("Hệ thống chưa có bảng chi tiết cho lớp này hoặc cấu trúc API lỗi!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi tải dữ liệu. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedMonth, selectedYear, classId, user?.token, currentPage]);

    // Reset pagination when period changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedMonth, selectedYear]);

    const extractApiError = (errorData, defaultMessage) => {
        if (errorData?.errors && typeof errorData.errors === 'object') {
            const firstErrorField = Object.keys(errorData.errors)[0];
            if (firstErrorField && errorData.errors[firstErrorField].length > 0) {
                return errorData.errors[firstErrorField][0];
            }
        }
        return errorData?.title || errorData?.message || defaultMessage;
    };

    const handleSaveFeeConfig = async (data) => {
        try {
            const payload = {
                tuitionFee: data.tuitionFee,
                billingMethod: data.billingMethod,
                paymentDeadlineDays: data.paymentDeadlineDays
            };
            
            const response = await tuitionService.updateTuitionFee(classId, payload, user.token);
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw errorData || new Error("Failed to update");
            }
            
            toast.success('Cập nhật luật học phí thành công!');
            setFeeModal({ isOpen: false, editData: null });
            fetchData(); // Reload class info
        } catch (error) {
            const errorMessage = extractApiError(error, 'Lỗi khi cập nhật học phí');
            toast.error(errorMessage);
        }
    };

    const handlePreviewClick = async () => {
        setIsLoadingPreview(true);
        try {
            const res = await tuitionService.previewInvoices(classId, selectedMonth, selectedYear, user.token);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                toast.error(errorData?.message || `Không thể tải dữ liệu nháp của tháng ${selectedMonth}/${selectedYear}`);
                setIsLoadingPreview(false);
                return;
            }
            const data = await res.json();
            setPreviewData(data);

            // Tính toán ngày dueDate mặc định = CurrentDate + 5 ngày
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 5);
            setDueDate(defaultDate.toISOString().split('T')[0]); // YYYY-MM-DD for date input

            setIsPreviewModalOpen(true);
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi lấy dữ liệu phát hành!');
        } finally {
            setIsLoadingPreview(false);
        }
    };

    const handleConfirmPublish = async () => {
        if (!dueDate) {
            toast.error('Vui lòng chọn ngày hạn nộp tiền.');
            return;
        }

        setIsSubmitting(true);
        try {
            // Cấu trúc payload theo yêu cầu
            const payload = {
                periodMonth: Number(selectedMonth),
                periodYear: Number(selectedYear),
                dueDate: new Date(`${dueDate}T23:59:59Z`).toISOString(),
                invoices: previewData.map(item => ({
                    studentId: item.studentId,
                    attendedSessions: item.attendedSessions
                }))
            };

            const res = await tuitionService.confirmInvoices(classId, payload, user.token);
            if (res.ok) {
                toast.success('Đã phát hành thành công!');
                setIsPreviewModalOpen(false);
                fetchData(); // Load lại 3 thẻ thống kê và bảng chi tiết
            } else {
                const errorData = await res.json().catch(() => ({}));
                toast.error(errorData?.message || 'Xác nhận phát hành thất bại.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra trong quá trình phát hành.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- TẤT TOÁN LẺ (FINAL BILL) ---
    const handleFinalBillPreview = async (student) => {
        setTargetStudentId(student.studentId || student.id);
        setIsLoadingFinalPreview(true);
        try {
            const res = await tuitionService.previewFinalInvoice(
                classId, 
                student.studentId || student.id, 
                selectedMonth, 
                selectedYear, 
                user.token
            );
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                toast.error(errorData?.message || "Học sinh này đã được chốt hóa đơn hoặc dữ liệu không hợp lệ.");
                return;
            }

            const data = await res.json();
            setFinalPreviewData(data);
            
            const defaultDate = new Date();
            defaultDate.setDate(defaultDate.getDate() + 5);
            setFinalDueDate(defaultDate.toISOString().split('T')[0]);
            
            setIsFinalModalOpen(true);
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra khi xem trước tất toán.");
        } finally {
            setIsLoadingFinalPreview(false);
        }
    };

    const handleFinalBillConfirm = async () => {
        if (!finalDueDate || !finalPreviewData) return;
        
        setIsFinalSubmitting(true);
        try {
            const payload = {
                periodMonth: selectedMonth,
                periodYear: selectedYear,
                dueDate: new Date(`${finalDueDate}T23:59:59Z`).toISOString(),
                attendedSessions: finalPreviewData.attendedSessions
            };

            const res = await tuitionService.confirmFinalInvoice(
                classId, 
                finalPreviewData.studentId, 
                payload, 
                user.token
            );

            if (res.ok) {
                toast.success(`Đã tất toán thành công cho học sinh ${finalPreviewData.studentName}`);
                setIsFinalModalOpen(false);
                fetchData(); // Cập nhật lại danh sách và thống kê
            } else {
                const errorData = await res.json().catch(() => ({}));
                toast.error(errorData?.message || "Tất toán thất bại.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi xác nhận tất toán.");
        } finally {
            setIsFinalSubmitting(false);
        }
    };


    const handleReconcileAbsences = async () => {
        setConfirmModal({
            isOpen: true,
            title: 'Chốt sổ vắng phép',
            message: `Hệ thống sẽ tính toán các buổi vắng phép của tháng ${selectedMonth === 1 ? 12 : selectedMonth - 1} để hoàn vào ví học phí tháng ${selectedMonth}. Bạn chắc chắn muốn thực hiện?`,
            action: async () => {
                setConfirmModal({ isOpen: false });
                setIsLoading(true);
                try {
                    const res = await tuitionService.reconcilePrepaidClass(classId, selectedMonth, selectedYear, user.token);
                    if (res.ok) {
                        toast.success("Chốt sổ vắng phép thành công!");
                        fetchData();
                    } else {
                        toast.error("Chốt sổ thất bại.");
                    }
                } catch (error) {
                    toast.error("Lỗi kết nối server.");
                } finally {
                    setIsLoading(false);
                }
            }
        });
    };

    const handleBulkExtend = () => {
        setPromptModal({
            isOpen: true,
            title: 'Gia hạn hạn nộp',
            message: `Nhập số ngày muốn gia hạn cho tất cả hóa đơn chưa đóng trong tháng ${selectedMonth}/${selectedYear}:`,
            defaultValue: '7',
            confirmText: 'Gia hạn',
            action: async (days) => {
                setPromptModal({ isOpen: false });
                if (days && !isNaN(days) && parseInt(days) > 0) {
                    try {
                        const payload = {
                            periodMonth: selectedMonth,
                            periodYear: selectedYear,
                            additionalDays: parseInt(days)
                        };
                        const res = await tuitionService.extendClassDueDate(classId, payload, user.token);
                        if (res.ok) {
                            toast.success("Gia hạn hạn nộp thành công!");
                            fetchData();
                        } else {
                            const err = await res.json().catch(() => ({}));
                            toast.error(err?.title || err?.message || "Gia hạn thất bại.");
                        }
                    } catch (error) {
                        toast.error("Lỗi khi gia hạn.");
                    }
                }
            }
        });
    };

    // Tính toán range tháng/năm dựa vào startDate và endDate của lớp
    const availablePeriods = useMemo(() => {
        const periods = [];
        if (classInfo.startDate && classInfo.endDate) {
            const start = new Date(classInfo.startDate);
            const end = new Date(classInfo.endDate);
            if (!isNaN(start) && !isNaN(end)) {
                let current = new Date(start.getFullYear(), start.getMonth(), 1);
                const last = new Date(end.getFullYear(), end.getMonth(), 1);
                
                while (current <= last) {
                    periods.push({
                        month: current.getMonth() + 1,
                        year: current.getFullYear()
                    });
                    current.setMonth(current.getMonth() + 1);
                }
            }
        }
        
        // Nếu không có startDate/endDate hoặc mảng trống thì để dự phòng 6 tháng trước và sau
        if (periods.length === 0) {
            for (let i = -6; i <= 6; i++) {
                const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
                periods.push({ month: d.getMonth() + 1, year: d.getFullYear() });
            }
        }
        return periods;
    }, [classInfo.startDate, classInfo.endDate, currentDate]);

    // Format tiền tệ
    const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

    // Đảm bảo selectedMonth và selectedYear luôn hợp lệ
    useEffect(() => {
        if (availablePeriods.length > 0) {
            const isValid = availablePeriods.some(p => p.month === selectedMonth && p.year === selectedYear);
            if (!isValid) {
                setSelectedMonth(availablePeriods[0].month);
                setSelectedYear(availablePeriods[0].year);
            }
        }
    }, [availablePeriods, selectedMonth, selectedYear]);

    return (
        <div className="!min-h-full sm:!p-8 !space-y-8 !animate-fade-in custom-scrollbar">
            {/* Breadcrumbs & Navigation */}
            <div className="!flex !items-center !justify-between !gap-2">
                <button 
                    onClick={() => navigate('/tuition')}
                    className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-muted hover:!text-primary !transition-colors"
                >
                    <Icon icon="solar:round-arrow-left-bold" className="!text-xl" />
                    Quay lại bảng điều khiển
                </button>
            </div>

            {/* Header section with Class Info & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center !gap-6 bg-surface !p-8 rounded-[2.5rem] border border-border shadow-sm">
                <div className="!flex !items-center !gap-6">
                    <div className="!w-20 !h-20 !bg-white !rounded-3xl !border !border-border !shadow-sm !flex !items-center !justify-center !text-primary">
                        <Icon icon="solar:square-academic-cap-bold-duotone" className="!text-4xl" />
                    </div>
                    <div>
                        <div className="!flex !items-center !gap-2 !mb-1">
                            <h1 className="!text-2xl sm:!text-3xl !font-black !text-text-main !tracking-tight">{classInfo.name}</h1>
                        </div>
                        <div className="!flex !flex-wrap !items-center !gap-4 !mt-2">
                             <div className="!flex !items-center !gap-1.5 !text-sm !font-bold !text-text-muted">
                                <Icon icon="solar:users-group-rounded-bold" className="!text-primary" />
                                {classInfo.students} học sinh
                            </div>
                            <div className="!w-1 !h-1 !rounded-full !bg-border" />
                            <div className="!flex !items-center !gap-1.5 !text-sm !font-bold !text-text-muted">
                                <Icon icon="solar:wallet-money-bold" className="!text-primary" />
                                Hình thức: Trả sau
                            </div>
                            <div className="!w-1 !h-1 !rounded-full !bg-border" />
                            <div className="!flex !items-center !gap-1.5 !text-sm !font-bold !text-text-muted">
                                <Icon icon="solar:tag-price-bold" className="!text-primary" />
                                Đơn giá: {classInfo.tuitionFee || classInfo.pricePerSession ? formatVND(classInfo.tuitionFee || classInfo.pricePerSession) : '--'}
                            </div>
                            <div className="!w-1 !h-1 !rounded-full !bg-border" />
                            <div className="!flex !items-center !gap-1.5 !text-sm !font-bold !text-text-muted">
                                <Icon icon="solar:alarm-bold" className="!text-primary" />
                                Hạn nộp: {classInfo.paymentDeadlineDays || 5} ngày
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="!flex !items-center !gap-3">
                    <button
                        onClick={() => setFeeModal({ isOpen: true, editData: classInfo })}
                        className="!bg-background !text-text-muted !p-3.5 !rounded-2xl !flex !items-center !justify-center !border !border-border hover:!text-primary hover:!bg-primary/10 !transition-all"
                        title="Cấu hình học phí"
                    >
                        <Icon icon="solar:settings-bold-duotone" className="!text-xl" />
                    </button>
                </div>
            </div>

            {/* Actions & Filters Row */}
            <div className="!flex !flex-col sm:!flex-row sm:!items-center !justify-between !gap-4 !bg-transparent">
                <div className="!relative !flex !items-center !gap-2 !bg-white !pl-4 !pr-2 !py-2 !rounded-2xl !border !border-border !shadow-sm !cursor-pointer">
                    <Icon icon="solar:calendar-bold-duotone" className="!text-primary !text-lg" />
                    <span className="!text-sm !font-bold !text-text-muted">Kỳ thu:</span>
                    <select 
                        value={`${selectedMonth}-${selectedYear}`}
                        onChange={e => {
                            const [m, y] = e.target.value.split('-').map(Number);
                            setSelectedMonth(m);
                            setSelectedYear(y);
                        }}
                        className="!bg-transparent !border-none !text-sm !font-black !text-text-main focus:!outline-none !appearance-none !pr-6 !py-1 !cursor-pointer"
                    >
                        {availablePeriods.map(p => (
                            <option key={`${p.month}-${p.year}`} value={`${p.month}-${p.year}`}>
                                Tháng {p.month}/{p.year}
                            </option>
                        ))}
                    </select>
                    <Icon icon="material-symbols:keyboard-arrow-down-rounded" className="!absolute !right-3 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl !pointer-events-none" />
                </div>

                <div className="!flex !items-center !gap-3 !flex-wrap">
                    {/* Xem giao dịch */}
                    <button
                        onClick={() => navigate(`/tuition/reports/${classId}/transactions`)}
                        className="!flex !items-center !gap-2.5 !px-4 !py-3 !rounded-2xl !shadow-sm !border !transition-all !group !bg-blue-50 !border-blue-200 !text-blue-800 hover:!bg-blue-100"
                    >
                        <div className="!w-8 !h-8 !rounded-full !bg-blue-100 !border !border-blue-300 !flex !items-center !justify-center">
                            <Icon icon="solar:history-bold-duotone" className="!text-blue-600 !text-lg" />
                        </div>
                        <div className="!text-left">
                            <p className="!text-[10px] !font-black !uppercase !tracking-wider !text-blue-600">Giao dịch</p>
                            <p className="!text-sm !font-black !text-blue-900 !leading-tight">Xem lịch sử giao dịch</p>
                        </div>
                        <Icon icon="solar:alt-arrow-right-bold" className="!text-blue-500 !text-base !ml-1 group-hover:!translate-x-1 !transition-transform" />
                    </button>

                    <div className="!flex !items-center !gap-2 !px-5 !py-3 !rounded-2xl !bg-amber-50 !text-amber-700 !border !border-amber-200 !font-black !text-[10px] !max-w-[200px] !leading-tight">
                        <Icon icon="solar:info-circle-bold-duotone" className="!text-lg !shrink-0" />
                        <span>Kiểm tra điểm danh trước khi phát hành</span>
                    </div>

                    <button
                        onClick={handlePreviewClick}
                        disabled={isLoadingPreview}
                        className="!bg-primary !text-white !px-5 !py-3 !rounded-2xl !flex !items-center !justify-center !gap-2 !font-black !shadow-lg !shadow-primary/20 hover:!scale-[1.02] active:!scale-[0.98] !transition-all disabled:!opacity-50 disabled:!cursor-not-allowed"
                    >
                        {isLoadingPreview ? (
                            <Icon icon="solar:spinner-bold-duotone" className="!text-lg !animate-spin" />
                        ) : (
                            <Icon icon="solar:document-add-bold-duotone" className="!text-lg" />
                        )}
                        <span className="!text-sm">Phát hành phiếu thu tháng {selectedMonth}</span>
                    </button>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-6">
                <div className="!p-8 !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <div className="!flex !items-center !justify-between !mb-4">
                        <div className="!w-12 !h-12 !rounded-2xl !bg-blue-50 !flex !items-center !justify-center !text-blue-500">
                            <Icon icon="solar:bill-list-bold-duotone" className="!text-2xl" />
                        </div>
                        <span className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Dự kiến thu</span>
                    </div>
                    {isLoading ? <div className="!h-8 !w-32 !bg-border !animate-pulse !rounded-md"></div> : <h3 className="!text-2xl !font-black !text-text-main !tracking-tight">{formatVND(invoiceStats.expectedRevenue)}</h3>}
                    <p className="!text-xs !font-bold !text-text-muted !mt-2">
                        Dựa trên Số buổi Thực tế học sinh đi học
                    </p>
                </div>

                <div className="!p-8 !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <div className="!flex !items-center !justify-between !mb-4">
                        <div className="!w-12 !h-12 !rounded-2xl !bg-emerald-50 !flex !items-center !justify-center !text-emerald-500">
                            <Icon icon="solar:check-read-bold-duotone" className="!text-2xl" />
                        </div>
                        <span className="!text-[10px] !font-black !text-emerald-600 !uppercase !tracking-widest">Thực thu</span>
                    </div>
                    {isLoading ? <div className="!h-8 !w-32 !bg-border !animate-pulse !rounded-md"></div> : <h3 className="!text-2xl !font-black !text-emerald-600 !tracking-tight">{formatVND(invoiceStats.actualRevenue)}</h3>}
                    <div className="!mt-2 !flex !items-center !gap-2">
                        <div className="!flex-1 !h-1.5 !bg-emerald-50 !rounded-full !overflow-hidden">
                            <div className="!h-full !bg-emerald-500" style={{ width: `${invoiceStats.expectedRevenue ? Math.round((invoiceStats.actualRevenue/invoiceStats.expectedRevenue)*100) : 0}%` }}></div>
                        </div>
                        <span className="!text-[10px] !font-black !text-emerald-600">{invoiceStats.expectedRevenue ? Math.round((invoiceStats.actualRevenue/invoiceStats.expectedRevenue)*100) : 0}%</span>
                    </div>
                </div>

                <div className="!p-8 !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <div className="!flex !items-center !justify-between !mb-4">
                        <div className="!w-12 !h-12 !rounded-2xl !bg-red-50 !flex !items-center !justify-center !text-red-500">
                            <Icon icon="solar:danger-bold-duotone" className="!text-2xl" />
                        </div>
                        <span className="!text-[10px] !font-black !text-red-600 !uppercase !tracking-widest">Công nợ</span>
                    </div>
                    {isLoading ? <div className="!h-8 !w-32 !bg-border !animate-pulse !rounded-md"></div> : <h3 className="!text-2xl !font-black !text-red-600 !tracking-tight">{formatVND(invoiceStats.debtAmount)}</h3>}
                    <p className="!text-xs !font-bold !text-text-muted !mt-2">Học phí chưa thanh toán</p>
                </div>
            </div>

            {/* Detailed Student Table */}
            <div className="!space-y-6">
                <div>
                    <h2 className="!text-2xl !font-black !text-text-main !tracking-tight">Danh sách chi tiết</h2>
                    <p className="!text-sm !font-medium !text-text-muted !mt-1">Theo dõi trạng thái thanh toán của từng học sinh trong lớp.</p>
                </div>

                {isLoading ? (
                    <div className="!py-20 !text-center !text-text-muted">Đang phân tích bảng biểu học sinh...</div>
                ) : (
                    <div className="!mt-8">
                        <StudentPaymentTable 
                            students={studentsData} 
                            onExtendClick={handleExtendClick}
                            onFinalBillClick={handleFinalBillPreview}
                            isLoadingFinal={isLoadingFinalPreview}
                            targetStudentId={targetStudentId}
                            currentPage={currentPage}
                            totalPages={Math.ceil(totalStudents / rowsPerPage)}
                            onPageChange={setCurrentPage}
                            onRemindClick={(student) => {
                                toast.success(`Đã gửi thông báo nhắc nợ tới phụ huynh học sinh ${student.studentName || student.name}`);
                            }}
                        />
                    </div>
                )}
            </div>



            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                onConfirm={() => confirmModal.action && confirmModal.action()}
                title={confirmModal.title}
                message={confirmModal.message}
                type="warning"
                confirmText="Xác nhận"
            />
            
            <PromptModal
                isOpen={promptModal.isOpen}
                onClose={() => setPromptModal({ isOpen: false })}
                onConfirm={(val) => promptModal.action && promptModal.action(val)}
                title={promptModal.title}
                message={promptModal.message}
                defaultValue={promptModal.defaultValue}
                confirmText={promptModal.confirmText || 'Xác nhận'}
            />
            
            <TuitionFeeModal
                isOpen={feeModal.isOpen}
                onClose={() => setFeeModal({ isOpen: false, editData: null })}
                onSave={handleSaveFeeConfig}
                editData={feeModal.editData}
                classes={allClasses.length > 0 ? allClasses : [classInfo]}
            />

            <PreviewInvoiceModal 
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                previewData={previewData}
                dueDate={dueDate}
                setDueDate={setDueDate}
                isSubmitting={isSubmitting}
                onConfirm={handleConfirmPublish}
                month={selectedMonth}
                year={selectedYear}
            />

            <FinalBillModal 
                isOpen={isFinalModalOpen}
                onClose={() => setIsFinalModalOpen(false)}
                previewData={finalPreviewData}
                dueDate={finalDueDate}
                setDueDate={setFinalDueDate}
                isSubmitting={isFinalSubmitting}
                onConfirm={handleFinalBillConfirm}
                month={selectedMonth}
            />
        </div>
    );
};

export default ClassFinancialDetailPage;
