import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import StudentPaymentTable from '../components/StudentPaymentTable';

import ConfirmModal from '../../../components/ui/ConfirmModal';
import PromptModal from '../../../components/ui/PromptModal';
import TuitionFeeModal from '../components/TuitionFeeModal';
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
    const [isGenerating, setIsGenerating] = useState(false);
    const [invoiceStats, setInvoiceStats] = useState({ expectedRevenue: 0, actualRevenue: 0, debtAmount: 0 });

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
                safeFetch(tuitionService.getClassInvoicesReport(classId, selectedMonth, selectedYear, user.token)),
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
                    const invoiceList = Array.isArray(data) ? data : (data.students || []);
                    realStudentCount = invoiceList.length || realStudentCount;
                    
                    setClassInfo({
                        classId: classId,
                        name: classConfig.className || `Lớp ${classId}`,
                        students: realStudentCount,
                        billingMethod: classConfig.billingMethod || 'Prepaid',
                        tuitionFee: classConfig.tuitionFee,
                        paymentDeadlineDays: classConfig.paymentDeadlineDays
                    });
                    setStudentsData(invoiceList);
                } catch(e) {}
            } else {
                // Render with at least config info even if detail fails
                setClassInfo({
                    classId: classId,
                    name: classConfig.className || `Lớp ${classId}`,
                    students: realStudentCount,
                    billingMethod: classConfig.billingMethod || 'Prepaid',
                    tuitionFee: classConfig.tuitionFee,
                    paymentDeadlineDays: classConfig.paymentDeadlineDays || 5
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
    }, [classId, selectedMonth, selectedYear, user?.token]);

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

    const handleGenerateInvoice = () => {
        const next7Days = new Date();
        next7Days.setDate(next7Days.getDate() + 7);
        const dd = String(next7Days.getDate()).padStart(2, '0');
        const mm = String(next7Days.getMonth() + 1).padStart(2, '0');
        const yyyy = next7Days.getFullYear();
        const defaultDueDate = `${dd}-${mm}-${yyyy}`;

        setPromptModal({
            isOpen: true,
            title: 'Phát hành hóa đơn',
            message: `Nhập ngày hạn nộp cho các hóa đơn tháng ${selectedMonth}/${selectedYear} (Định dạng: DD-MM-YYYY):`,
            defaultValue: defaultDueDate,
            confirmText: 'Phát hành',
            action: async (dueDate) => {
                setPromptModal({ isOpen: false });
                if (!dueDate) return;

                // Validate DD-MM-YYYY format
                const regex = /^\d{2}-\d{2}-\d{4}$/;
                if (!regex.test(dueDate.trim())) {
                    toast.error('Định dạng ngày không hợp lệ. Vui lòng nhập theo định dạng DD-MM-YYYY (ví dụ: 22-04-2026).');
                    return;
                }

                const [day, month, year] = dueDate.trim().split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);

                // Verify date is mathematically valid
                if (
                    dateObj.getFullYear() !== year ||
                    dateObj.getMonth() + 1 !== month ||
                    dateObj.getDate() !== day
                ) {
                    toast.error('Ngày không hợp lệ. Vui lòng kiểm tra lại (ví dụ: ngày 30-02 không tồn tại).');
                    return;
                }

                setIsGenerating(true);
                try {
                    const payload = {
                        periodMonth: selectedMonth,
                        periodYear: selectedYear,
                        dueDate: dateObj.toISOString()
                    };
                    const res = await tuitionService.generateInvoices(classId, payload, user.token);
                    if (res.ok) {
                        toast.success("Phát hành hóa đơn thành công!");
                        fetchData();
                    } else {
                        const err = await res.json().catch(() => ({}));
                        toast.error(err?.title || err?.message || "Phát hành thất bại.");
                    }
                } catch (error) {
                    toast.error("Lỗi khi phát hành hóa đơn.");
                } finally {
                    setIsGenerating(false);
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

    const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

    // Tạo range tháng và năm cho dropdown
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = [currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1];

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
                                Hình thức: {classInfo.billingMethod === 'Prepaid' ? 'Trả trước' : 'Trả sau'}
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
                <div className="!flex !items-center !gap-2 !bg-white !px-4 !py-3 !rounded-2xl !border !border-border !shadow-sm">
                    <Icon icon="solar:calendar-bold-duotone" className="!text-primary !text-lg" />
                    <span className="!text-sm !font-bold !text-text-muted">Kỳ thu:</span>
                    <select 
                        value={selectedMonth} 
                        onChange={e => setSelectedMonth(Number(e.target.value))}
                        className="!bg-transparent !border-none !text-sm !font-black !text-text-main focus:!outline-none"
                    >
                        {months.map(m => <option key={m} value={m}>Tháng {m}</option>)}
                    </select>
                    <span className="!text-text-muted font-black">/</span>
                    <select 
                        value={selectedYear} 
                        onChange={e => setSelectedYear(Number(e.target.value))}
                        className="!bg-transparent !border-none !text-sm !font-black !text-text-main focus:!outline-none"
                    >
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                <div className="!flex !items-center !gap-3 !flex-wrap">
                    {/* Xem giao dịch - same style as dashboard */}
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

                    <button
                        onClick={handleBulkExtend}
                        className="!bg-background !text-text-main !px-5 !py-3 !rounded-2xl !flex !items-center !justify-center !gap-2 !font-black !border !border-border hover:!bg-amber-50 hover:!text-amber-700 hover:!border-amber-200 !transition-all"
                    >
                        <Icon icon="solar:clock-circle-bold-duotone" className="!text-lg" />
                        <span className="!text-sm">Gia hạn hạn nộp</span>
                    </button>

                    <button
                        onClick={handleGenerateInvoice}
                        disabled={isGenerating}
                        className="!bg-primary !text-white !px-5 !py-3 !rounded-2xl !flex !items-center !justify-center !gap-2 !font-black !shadow-lg !shadow-primary/20 hover:!scale-[1.02] active:!scale-[0.98] !transition-all disabled:!opacity-50 disabled:!cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <Icon icon="solar:spinner-bold-duotone" className="!text-lg !animate-spin" />
                        ) : (
                            <Icon icon="solar:document-add-bold-duotone" className="!text-lg" />
                        )}
                        <span className="!text-sm">Phát hành hóa đơn</span>
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
                    <p className="!text-xs !font-bold !text-text-muted !mt-2">Tổng doanh thu lý thuyết kỳ này</p>
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
                    <StudentPaymentTable 
                        students={studentsData} 
                        onExtendClick={handleExtendClick}
                    />
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
        </div>
    );
};

export default ClassFinancialDetailPage;
