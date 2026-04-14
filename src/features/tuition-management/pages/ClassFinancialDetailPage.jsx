import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import StudentPaymentTable from '../components/StudentPaymentTable';
import TransactionHistoryModal from '../components/TransactionHistoryModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import PromptModal from '../../../components/ui/PromptModal';
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
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

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
            const [resDetail, resSummaries] = await Promise.all([
                tuitionService.getClassFinancialDetail(classId, selectedMonth, selectedYear, user.token),
                tuitionService.getClassFinancialSummaries(user.token) // Gọi thêm để lấy sĩ số gốc
            ]);

            if (resDetail.ok) {
                const data = await resDetail.json();
                
                // Lấy sĩ số thực từ summary
                let realStudentCount = data.students?.length || 0;
                if (resSummaries.ok) {
                    const summariesData = await resSummaries.json();
                    setAllClasses(summariesData || []);
                    const currentClassSummary = summariesData.find(c => c.classId === classId || c.id === classId);
                    if (currentClassSummary) {
                        realStudentCount = currentClassSummary.studentCount || currentClassSummary.studentsCount || realStudentCount;
                    }
                }

                setClassInfo({
                    name: data.className || `Lớp ${classId}`,
                    students: realStudentCount,
                    billingMethod: data.billingMethod || 'Prepaid'
                });
                setStudentsData(data.students || []);
            } else {
                toast.error("Không thể tải chi tiết lớp học");
            }
        } catch (error) {
            console.error(error);
            toast.error("Vui lòng kiểm tra lại kết nối");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [classId, selectedMonth, selectedYear, user?.token]);

    const handleGenerateInvoice = () => {
        setConfirmModal({
            isOpen: true,
            title: 'Xác nhận phát hành',
            message: `Bạn có chắc chắn muốn phát hành hóa đơn tháng ${selectedMonth}/${selectedYear} cho lớp này?`,
            action: async () => {
                setConfirmModal({ isOpen: false });
                setIsGenerating(true);
                try {
                    const res = await tuitionService.reconcilePrepaidClass(classId, selectedMonth, selectedYear, user.token);
                    if (res.ok) {
                        toast.success("Phát hành hóa đơn thành công!");
                        fetchData();
                    } else {
                        const err = await res.json();
                        toast.error(err?.title || "Phát hành thất bại. Lớp đã được chốt sổ tháng này hoặc thiếu dữ liệu điểm danh.");
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
            title: 'Gia hạn hàng loạt',
            message: 'Nhập số ngày muốn gia hạn hàng loạt cho các hóa đơn chưa đóng trong lớp này:',
            defaultValue: '7',
            action: async (days) => {
                setPromptModal({ isOpen: false });
                if (days && !isNaN(days) && parseInt(days) > 0) {
                    try {
                        const res = await tuitionService.extendClassDueDates(classId, selectedMonth, selectedYear, parseInt(days), user.token);
                        if (res.ok) {
                            toast.success("Gia hạn hàng loạt thành công!");
                            fetchData();
                        } else {
                            toast.error("Gia hạn thất bại.");
                        }
                    } catch (error) {
                        toast.error("Lỗi khi gia hạn hàng loạt.");
                    }
                }
            }
        });
    };

    // Derived stats
    const stats = useMemo(() => {
        let expected = 0;
        let collected = 0;
        let debt = 0;
        studentsData.forEach(s => {
            const exp = s.expectedAmount || s.due || 0;
            const pd = s.paidAmount || s.paid || 0;
            const bal = s.remainingAmount || Math.max(0, exp - pd - (s.creditBalance || 0));
            expected += exp;
            collected += pd;
            debt += bal;
        });
        return { expected, collected, debt };
    }, [studentsData]);

    const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setIsHistoryModalOpen(true);
    };

    // Tạo range tháng và năm cho dropdown
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = [currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1];

    return (
        <div className="!min-h-full sm:!p-8 !space-y-8 !animate-fade-in custom-scrollbar">
            {/* Breadcrumbs & Navigation */}
            <div className="!flex !items-center !justify-between !gap-2">
                <button 
                    onClick={() => navigate('/tuition/reports')}
                    className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-muted hover:!text-primary !transition-colors"
                >
                    <Icon icon="solar:round-arrow-left-bold" className="!text-xl" />
                    Quay lại danh sách báo cáo
                </button>

                {/* Date Picker */}
                <div className="!flex !items-center !gap-2 !bg-white !px-3 !py-1.5 !rounded-lg !border !border-border !shadow-sm">
                    <Icon icon="solar:calendar-bold-duotone" className="!text-primary" />
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
                            {allClasses.length > 0 && (
                                <div className="!relative !flex !items-center !group">
                                    <Icon icon="solar:alt-arrow-down-bold-duotone" className="!text-text-muted !text-xl !cursor-pointer hover:!text-primary" />
                                    <select 
                                        value={classId}
                                        onChange={(e) => navigate(`/tuition/reports/${e.target.value}`)}
                                        className="!absolute !inset-0 !opacity-0 !w-full !h-full !cursor-pointer"
                                    >
                                        {allClasses.map(c => (
                                            <option key={c.classId || c.id} value={c.classId || c.id}>{c.className || c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
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
                        </div>
                    </div>
                </div>
                
                <div className="!flex !flex-col sm:!flex-row !items-center !gap-3 !w-full sm:!w-auto">
                    <button 
                        onClick={handleBulkExtend}
                        className="!w-full sm:!w-auto !bg-background !text-text-main !px-6 !py-3.5 !rounded-2xl !font-black !flex !items-center !justify-center !gap-2 !border !border-border hover:!bg-white !transition-all"
                    >
                        <Icon icon="solar:calendar-date-bold-duotone" className="!text-xl" />
                        Gia hạn loạt
                    </button>
                    <button 
                        onClick={handleGenerateInvoice}
                        disabled={isGenerating || isLoading}
                        className="!w-full sm:!w-auto !bg-primary !text-white !px-6 !py-3.5 !rounded-2xl !font-black !flex !items-center !justify-center !gap-2 hover:!bg-primary-hover hover:!shadow-lg !transition-all disabled:!opacity-50"
                    >
                        <Icon icon={isGenerating ? "line-md:loading-loop" : "solar:rocket-bold-duotone"} className="!text-xl" />
                        {isGenerating ? "Đang xử lý..." : "Chốt sổ & Đòi nợ"}
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
                    {isLoading ? <div className="!h-8 !w-32 !bg-border !animate-pulse !rounded-md"></div> : <h3 className="!text-2xl !font-black !text-text-main !tracking-tight">{formatVND(stats.expected)}</h3>}
                    <p className="!text-xs !font-bold !text-text-muted !mt-2">Tổng doanh thu lý thuyết kỳ này</p>
                </div>

                <div className="!p-8 !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <div className="!flex !items-center !justify-between !mb-4">
                        <div className="!w-12 !h-12 !rounded-2xl !bg-emerald-50 !flex !items-center !justify-center !text-emerald-500">
                            <Icon icon="solar:check-read-bold-duotone" className="!text-2xl" />
                        </div>
                        <span className="!text-[10px] !font-black !text-emerald-600 !uppercase !tracking-widest">Thực thu</span>
                    </div>
                    {isLoading ? <div className="!h-8 !w-32 !bg-border !animate-pulse !rounded-md"></div> : <h3 className="!text-2xl !font-black !text-emerald-600 !tracking-tight">{formatVND(stats.collected)}</h3>}
                    <div className="!mt-2 !flex !items-center !gap-2">
                        <div className="!flex-1 !h-1.5 !bg-emerald-50 !rounded-full !overflow-hidden">
                            <div className="!h-full !bg-emerald-500" style={{ width: `${stats.expected ? Math.round((stats.collected/stats.expected)*100) : 0}%` }}></div>
                        </div>
                        <span className="!text-[10px] !font-black !text-emerald-600">{stats.expected ? Math.round((stats.collected/stats.expected)*100) : 0}%</span>
                    </div>
                </div>

                <div className="!p-8 !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <div className="!flex !items-center !justify-between !mb-4">
                        <div className="!w-12 !h-12 !rounded-2xl !bg-red-50 !flex !items-center !justify-center !text-red-500">
                            <Icon icon="solar:danger-bold-duotone" className="!text-2xl" />
                        </div>
                        <span className="!text-[10px] !font-black !text-red-600 !uppercase !tracking-widest">Công nợ</span>
                    </div>
                    {isLoading ? <div className="!h-8 !w-32 !bg-border !animate-pulse !rounded-md"></div> : <h3 className="!text-2xl !font-black !text-red-600 !tracking-tight">{formatVND(stats.debt)}</h3>}
                    <p className="!text-xs !font-bold !text-text-muted !mt-2">Học phí chưa thanh toán</p>
                </div>
            </div>

            {/* Detailed Student Table */}
            <div className="!space-y-6">
                <div className="!flex !items-center !justify-between">
                    <div>
                        <h2 className="!text-2xl !font-black !text-text-main !tracking-tight">Danh sách chi tiết</h2>
                        <p className="!text-sm !font-medium !text-text-muted !mt-1">Theo dõi trạng thái thanh toán của từng học sinh trong lớp.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="!py-20 !text-center !text-text-muted">Đang phân tích bảng biểu học sinh...</div>
                ) : (
                    <StudentPaymentTable 
                        students={studentsData} 
                        onHistoryClick={handleStudentClick} 
                        onExtendClick={handleExtendClick}
                    />
                )}
            </div>

            <TransactionHistoryModal 
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                student={selectedStudent}
            />

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
                confirmText="Gia hạn"
            />
        </div>
    );
};

export default ClassFinancialDetailPage;
