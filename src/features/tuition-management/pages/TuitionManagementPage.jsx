import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import TuitionFeeModal from '../components/TuitionFeeModal';
import TuitionDeadlineModal from '../components/TuitionDeadlineModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_CLASSES = [
    { id: 'TC101', name: 'TC101 - Toán Nâng Cao' },
    { id: 'TC102', name: 'TC102 - Vật Lý Cơ Bản' },
    { id: 'TC103', name: 'TC103 - Hóa Học Hữu Cơ' },
];

const MOCK_FEES = [
    { id: 'f1', classId: 'TC101', className: 'TC101 - Toán Nâng Cao', amount: 1500000, feeType: 'monthly', notes: 'Đã bao gồm tài liệu học tập' },
    { id: 'f2', classId: 'TC102', className: 'TC102 - Vật Lý Cơ Bản', amount: 1200000, feeType: 'monthly', notes: '' },
    { id: 'f3', classId: 'TC103', className: 'TC103 - Hóa Học Hữu Cơ', amount: 8500000, feeType: 'per_course', notes: 'Thanh toán một lần đầu khóa' },
];

const MOCK_DEADLINES = [
    { id: 'd1', classId: 'TC101', className: 'TC101 - Toán Nâng Cao', period: 'Tháng 04/2026', deadline: '2026-04-10', gracePeriod: 3, latePolicyEnabled: true },
    { id: 'd2', classId: 'TC102', className: 'TC102 - Vật Lý Cơ Bản', period: 'Tháng 04/2026', deadline: '2026-04-15', gracePeriod: 5, latePolicyEnabled: false },
    { id: 'd3', classId: 'TC103', className: 'TC103 - Hóa Học Hữu Cơ', period: 'Tháng 04/2026', deadline: '2026-04-05', gracePeriod: 0, latePolicyEnabled: true },
];

const FEE_TYPE_LABEL = {
    monthly: 'Hàng tháng',
    per_course: 'Theo khóa',
    per_session: 'Theo buổi',
    quarterly: 'Hàng quý',
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const formatVND = (amount) =>
    amount?.toLocaleString('vi-VN') + ' ₫';

const isDeadlineSoon = (dateStr) => {
    const diff = new Date(dateStr) - new Date();
    return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
};

const isDeadlineOverdue = (dateStr) => new Date(dateStr) < new Date();

// ─── Main Page ────────────────────────────────────────────────────────────────
const TuitionManagementPage = () => {
    const navigate = useNavigate();
    const [fees, setFees] = useState(MOCK_FEES);
    const [deadlines, setDeadlines] = useState(MOCK_DEADLINES);

    // Fee modal state
    const [feeModal, setFeeModal] = useState({ isOpen: false, editData: null });
    // Deadline modal state
    const [deadlineModal, setDeadlineModal] = useState({ isOpen: false, editData: null });
    // Confirm delete modal
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null, id: null });

    // ── Fee handlers ───────────────────────────────────────────────────────────
    const handleSaveFee = (data) => {
        if (data.id) {
            setFees(prev => prev.map(f => f.id === data.id ? { ...f, ...data } : f));
            toast.success('Cập nhật học phí thành công!');
        } else {
            const cls = MOCK_CLASSES.find(c => c.id === data.classId);
            setFees(prev => [...prev, { ...data, id: `f${Date.now()}`, className: cls?.name || data.classId }]);
            toast.success('Đã thiết lập học phí cho lớp học!');
        }
        setFeeModal({ isOpen: false, editData: null });
    };

    // ── Deadline handlers ──────────────────────────────────────────────────────
    const handleSaveDeadline = (data) => {
        if (data.id) {
            setDeadlines(prev => prev.map(d => d.id === data.id ? { ...d, ...data } : d));
            toast.success('Cập nhật hạn nộp học phí thành công!');
        } else {
            const cls = MOCK_CLASSES.find(c => c.id === data.classId);
            setDeadlines(prev => [...prev, { ...data, id: `d${Date.now()}`, className: cls?.name || data.classId }]);
            toast.success('Đã thiết lập hạn nộp học phí!');
        }
        setDeadlineModal({ isOpen: false, editData: null });
    };

    // ── Delete handler ─────────────────────────────────────────────────────────
    const handleConfirmDelete = () => {
        if (confirmModal.type === 'fee') {
            setFees(prev => prev.filter(f => f.id !== confirmModal.id));
            toast.success('Đã xóa mức học phí!');
        } else if (confirmModal.type === 'deadline') {
            setDeadlines(prev => prev.filter(d => d.id !== confirmModal.id));
            toast.success('Đã xóa hạn nộp học phí!');
        }
        setConfirmModal({ isOpen: false, type: null, id: null });
    };

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* ── Settings Header ─────────────────────────────────────────────── */}
            <div className="!bg-white rounded-[2.5rem] border border-dashed border-border !p-6 sm:!p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl !bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <Icon icon="solar:wallet-money-bold-duotone" className="text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-text-main tracking-tight !mb-1">Quản lý Học phí</h1>
                        <p className="text-sm text-text-muted font-medium">Thiết lập và theo dõi học phí & hạn nộp cho các lớp học</p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <button
                        onClick={() => setDeadlineModal({ isOpen: true, editData: null })}
                        className="flex items-center justify-center gap-2 !px-5 !py-3 rounded-2xl border border-orange-200 text-orange-500 font-black text-sm hover:!bg-orange-50 transition-all"
                    >
                        <Icon icon="solar:calendar-add-bold-duotone" className="text-xl" />
                        Thiết lập Hạn Nộp
                    </button>
                    <button
                        onClick={() => setFeeModal({ isOpen: true, editData: null })}
                        className="flex items-center justify-center gap-2 !px-5 !py-3 rounded-2xl !bg-primary text-white font-black text-sm hover:!bg-primary/90 transition-all shadow-lg shadow-primary/20"
                    >
                        <Icon icon="solar:wallet-money-bold-duotone" className="text-xl" />
                        Thiết lập Học phí
                    </button>
                </div>
            </div>

            {/* ── Dashboard Quick Actions ── */}
            <div className="!grid !grid-cols-1 !mt-2 md:!grid-cols-2 !gap-6">
                <div
                    onClick={() => navigate('/tuition/revenue')}
                    className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm hover:!shadow-xl hover:!-translate-y-1 !transition-all !cursor-pointer !group !relative !overflow-hidden"
                >
                    <div className="!absolute !right-[-20px] !top-[-20px] !w-40 !h-40 !bg-primary/5 !rounded-full !blur-3xl !group-hover:!bg-primary/10 !transition-all" />
                    <div className="!flex !items-center !gap-6 !relative !z-10">
                        <div className="!w-16 !h-16 !bg-primary/10 !rounded-3xl !flex !items-center !justify-center !text-primary !group-hover:!bg-primary !group-hover:!text-white !transition-all">
                            <Icon icon="solar:chart-broken" className="!text-3xl" />
                        </div>
                        <div>
                            <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Tổng kết Doanh thu</h2>
                            <p className="!text-sm !font-medium !text-text-muted !mt-1">Xem biểu đồ xu hướng và phân tích tài chính hệ thống</p>
                        </div>
                    </div>
                </div>

                <div
                    onClick={() => navigate('/tuition/reports')}
                    className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm hover:!shadow-xl hover:!-translate-y-1 !transition-all !cursor-pointer !group !relative !overflow-hidden"
                >
                    <div className="!absolute !right-[-20px] !top-[-20px] !w-40 !h-40 !bg-amber-500/5 !rounded-full !blur-3xl !group-hover:!bg-amber-500/10 !transition-all" />
                    <div className="!flex !items-center !gap-6 !relative !z-10">
                        <div className="!w-16 !h-16 !bg-amber-500/10 !rounded-3xl !flex !items-center !justify-center !text-amber-500 !group-hover:!bg-amber-500 !group-hover:!text-white !transition-all">
                            <Icon icon="solar:bill-list-bold-duotone" className="!text-3xl" />
                        </div>
                        <div>
                            <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Báo cáo Tài chính Lớp</h2>
                            <p className="!text-sm !font-medium !text-text-muted !mt-1">Chi tiết đóng học phí và công nợ của từng lớp học</p>
                        </div>
                    </div>
                </div>
            </div>



            {/* ── Section 1: Current Fees Table ──────────────────────────────── */}
            <div className="!bg-white !mt-2 rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="!px-6 !py-5 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl !bg-primary/10 text-primary flex items-center justify-center">
                        <Icon icon="solar:wallet-money-bold-duotone" className="text-xl" />
                    </div>
                    <div>
                        <h2 className="text-base font-black text-text-main">Mức Học Phí Hiện Tại</h2>
                        <p className="text-xs text-text-muted font-medium">{fees.length} lớp đã được cấu hình</p>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="!bg-[#F8FAFC] border-b border-border">
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Lớp học</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Số tiền</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest hidden sm:table-cell">Chu kỳ</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest hidden md:table-cell">Ghi chú</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {fees.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="!py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-40">
                                            <Icon icon="solar:wallet-money-bold-duotone" className="text-6xl" />
                                            <p className="font-bold">Chưa có mức học phí nào được thiết lập</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : fees.map(fee => (
                                <tr key={fee.id} className="group hover:!bg-[#F8FAFC] transition-all">
                                    <td className="!px-6 !py-4">
                                        <p className="font-bold text-text-main text-sm">{fee.className}</p>
                                    </td>
                                    <td className="!px-6 !py-4">
                                        <span className="font-black text-primary text-base">{formatVND(fee.amount)}</span>
                                    </td>
                                    <td className="!px-6 !py-4 hidden sm:table-cell">
                                        <span className="!px-3 !py-1 rounded-full text-xs font-black !bg-primary/10 text-primary">
                                            {FEE_TYPE_LABEL[fee.feeType] || fee.feeType}
                                        </span>
                                    </td>
                                    <td className="!px-6 !py-4 hidden md:table-cell">
                                        <span className="text-sm text-text-muted font-medium italic">{fee.notes || '—'}</span>
                                    </td>
                                    <td className="!px-6 !py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setFeeModal({ isOpen: true, editData: fee })}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl !bg-background text-text-muted hover:text-orange-500 hover:!bg-orange-50 transition-all border border-border hover:border-orange-200"
                                                title="Chỉnh sửa"
                                            >
                                                <Icon icon="solar:pen-bold-duotone" className="text-base" />
                                            </button>
                                            <button
                                                onClick={() => setConfirmModal({ isOpen: true, type: 'fee', id: fee.id })}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl !bg-background text-text-muted hover:text-red-500 hover:!bg-red-50 transition-all border border-border hover:border-red-200"
                                                title="Xóa"
                                            >
                                                <Icon icon="solar:trash-bin-2-bold-duotone" className="text-base" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Section 2: Deadlines List ──────────────────────────────────── */}
            <div className="!bg-white !mt-2 rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="!px-6 !py-5 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl !bg-orange-500/10 text-orange-500 flex items-center justify-center">
                        <Icon icon="solar:calendar-date-bold-duotone" className="text-xl" />
                    </div>
                    <div>
                        <h2 className="text-base font-black text-text-main">Hạn Nộp Học Phí Sắp Tới</h2>
                        <p className="text-xs text-text-muted font-medium">{deadlines.length} kỳ thu đã được lên lịch</p>
                    </div>
                </div>

                <div className="divide-y divide-border">
                    {deadlines.length === 0 ? (
                        <div className="!py-16 text-center">
                            <div className="flex flex-col items-center gap-3 opacity-40">
                                <Icon icon="solar:calendar-date-bold-duotone" className="text-6xl" />
                                <p className="font-bold">Chưa có hạn nộp nào được thiết lập</p>
                            </div>
                        </div>
                    ) : deadlines.map(dl => {
                        const overdue = isDeadlineOverdue(dl.deadline);
                        const soon = isDeadlineSoon(dl.deadline);
                        return (
                            <div key={dl.id} className="!px-6 !py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:!bg-[#F8FAFC] transition-all group">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${overdue ? '!bg-red-100 text-red-500' : soon ? '!bg-amber-100 text-amber-500' : '!bg-orange-100 text-orange-500'}`}>
                                        <Icon icon="solar:calendar-date-bold-duotone" className="text-xl" />
                                    </div>
                                    <div className="space-y-1 min-w-0">
                                        <p className="font-bold text-text-main text-sm truncate">{dl.className}</p>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-xs font-bold text-text-muted !px-2 !py-0.5 !bg-background rounded-lg border border-border">{dl.period}</span>
                                            <span className={`text-xs font-black ${overdue ? 'text-red-500' : soon ? 'text-amber-500' : 'text-text-muted'}`}>
                                                Hạn: {new Date(dl.deadline).toLocaleDateString('vi-VN')}
                                                {overdue && ' • Đã quá hạn'}
                                                {soon && ' • Sắp đến hạn'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 sm:shrink-0">
                                    <span className="text-xs font-bold text-text-muted !px-2 !py-1 !bg-background rounded-lg border border-border whitespace-nowrap">
                                        Gia hạn: {dl.gracePeriod} ngày
                                    </span>
                                    <span className={`flex items-center gap-1.5 text-xs font-black !px-3 !py-1.5 rounded-full ${dl.latePolicyEnabled ? '!bg-orange-100 text-orange-600' : '!bg-border/50 text-text-muted'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${dl.latePolicyEnabled ? '!bg-orange-500' : '!bg-text-muted'}`} />
                                        {dl.latePolicyEnabled ? 'Phạt muộn' : 'Không phạt'}
                                    </span>
                                    <div className="flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setDeadlineModal({ isOpen: true, editData: dl })}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl !bg-background text-text-muted hover:text-orange-500 hover:!bg-orange-50 transition-all border border-border hover:border-orange-200"
                                            title="Chỉnh sửa"
                                        >
                                            <Icon icon="solar:pen-bold-duotone" className="text-base" />
                                        </button>
                                        <button
                                            onClick={() => setConfirmModal({ isOpen: true, type: 'deadline', id: dl.id })}
                                            className="w-9 h-9 flex items-center justify-center rounded-xl !bg-background text-text-muted hover:text-red-500 hover:!bg-red-50 transition-all border border-border hover:border-red-200"
                                            title="Xóa"
                                        >
                                            <Icon icon="solar:trash-bin-2-bold-duotone" className="text-base" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Modals ─────────────────────────────────────────────────────── */}
            <TuitionFeeModal
                isOpen={feeModal.isOpen}
                onClose={() => setFeeModal({ isOpen: false, editData: null })}
                onSave={handleSaveFee}
                editData={feeModal.editData}
                classes={MOCK_CLASSES}
            />

            <TuitionDeadlineModal
                isOpen={deadlineModal.isOpen}
                onClose={() => setDeadlineModal({ isOpen: false, editData: null })}
                onSave={handleSaveDeadline}
                editData={deadlineModal.editData}
                classes={MOCK_CLASSES}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, type: null, id: null })}
                onConfirm={handleConfirmDelete}
                title={confirmModal.type === 'fee' ? 'Xác nhận xóa học phí' : 'Xác nhận xóa hạn nộp'}
                message={confirmModal.type === 'fee'
                    ? 'Bạn có chắc chắn muốn xóa mức học phí này không? Hành động này không thể hoàn tác.'
                    : 'Bạn có chắc chắn muốn xóa hạn nộp học phí này không? Hành động này không thể hoàn tác.'}
                confirmText="Xóa"
                cancelText="Hủy bỏ"
                type="danger"
            />
        </div>
    );
};

export default TuitionManagementPage;
