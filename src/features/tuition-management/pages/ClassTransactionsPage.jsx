import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { tuitionService } from '../api/tuitionService';
import useAuthStore from '../../../store/authStore';

const ClassTransactionsPage = () => {
    const navigate = useNavigate();
    const { classId } = useParams();
    const { user } = useAuthStore();

    const [activeTab, setActiveTab] = useState('pending');
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [className, setClassName] = useState('');

    // Pagination
    const ITEMS_PER_PAGE = 5;
    const [currentPage, setCurrentPage] = useState(1);

    // Review state
    const [selectedTx, setSelectedTx] = useState(null);
    const [reviewNote, setReviewNote] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);

    const fetchTransactions = async () => {
        if (!user?.token || !classId) return;
        try {
            setIsLoading(true);
            const res = await tuitionService.getClassTransactions(classId, user.token);
            if (res.ok) {
                const data = await res.json();
                setTransactions(data || []);
                // Lấy tên lớp từ response đầu tiên
                if (data && data.length > 0 && data[0].className) {
                    setClassName(data[0].className);
                }
            } else {
                toast.error("Không thể lấy danh sách giao dịch.");
            }
        } catch (error) {
            console.error("Lỗi:", error);
            toast.error("Vui lòng kiểm tra kết nối");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [user?.token, classId]);

    const handleAction = async (isApproved) => {
        if (!selectedTx) return;
        if (!isApproved && !reviewNote.trim()) {
            toast.warning("Vui lòng nhập ghi chú lý do từ chối!");
            return;
        }

        setIsReviewing(true);
        try {
            const payload = {
                isApproved,
                note: reviewNote.trim() || null
            };
            const targetId = selectedTx.transactionId;
            const res = await tuitionService.reviewTransaction(targetId, payload, user.token);
            if (res.ok) {
                toast.success(isApproved ? "Đã duyệt giao dịch thành công!" : "Đã từ chối giao dịch!");
                setSelectedTx(null);
                setReviewNote('');
                fetchTransactions();
            } else {
                toast.error("Xử lý thất bại, vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi.");
        } finally {
            setIsReviewing(false);
        }
    };

    const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const s = tx.status?.toLowerCase();
            let matchesTab = false;
            if (activeTab === 'pending') matchesTab = s === 'pending';
            else if (activeTab === 'completed') matchesTab = (s === 'completed' || s === 'successful');
            else if (activeTab === 'rejected') matchesTab = (s === 'rejected' || s === 'failed');

            const matchesSearch = !searchTerm.trim() ||
                tx.studentName?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [transactions, activeTab, searchTerm]);

    // Reset trang về 1 mỗi khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchTerm]);

    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const pagedTransactions = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'completed' || s === 'successful') return '!text-emerald-500 !bg-emerald-50';
        if (s === 'rejected' || s === 'failed') return '!text-red-500 !bg-red-50';
        if (s === 'pending') return '!text-amber-500 !bg-amber-50';
        return '!text-gray-500 !bg-gray-50';
    };

    const getStatusLabel = (status) => {
        const s = status?.toLowerCase();
        if (s === 'completed' || s === 'successful') return 'Thành công';
        if (s === 'rejected' || s === 'failed') return 'Bị hủy';
        if (s === 'pending') return 'Chờ duyệt';
        return status;
    };

    return (
        <div className="!h-full !min-h-screen sm:!p-4 md:!p-8 !animate-fade-in !flex !flex-col !space-y-4">
            {/* Header */}
            <div className="!flex !items-center !gap-2 !mb-2 !px-2">
                <button
                    onClick={() => navigate(`/tuition/reports/${classId}`)}
                    className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-muted hover:!text-primary !transition-colors"
                >
                    <Icon icon="solar:round-arrow-left-bold" className="!text-xl" />
                    Quay lại chi tiết lớp
                </button>
            </div>

            <div className="!flex !flex-col md:!flex-row !items-start md:!items-center !justify-between !bg-surface !p-6 !rounded-[2.5rem] !border !border-border !shadow-sm !gap-4">
                <div>
                    <h1 className="!text-3xl !font-black !text-text-main !tracking-tight !flex !items-center !gap-3 font-['Outfit']">
                        {className ? `Giao dịch – ${className}` : 'Giao dịch lớp học'}
                        <div className="!w-2 !h-2 !rounded-full !bg-amber-500 !animate-pulse"></div>
                    </h1>
                    <p className="!text-sm !font-bold !text-text-muted !mt-1">Xem và duyệt các giao dịch thanh toán học phí của lớp này.</p>
                </div>

                <div className="!flex !items-center !gap-2 !bg-background !p-1.5 !rounded-2xl !border !border-border">
                    <button
                        onClick={() => { setActiveTab('pending'); setSelectedTx(null); }}
                        className={`!px-5 !py-2.5 !rounded-xl !text-sm !font-black !transition-all !flex !items-center !gap-2 ${activeTab === 'pending' ? '!bg-white !text-amber-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                    >
                        <Icon icon="solar:hourglass-line-bold-duotone" className="!text-lg" />
                        Chờ Duyệt ({transactions.filter(t => t.status?.toLowerCase() === 'pending').length})
                    </button>
                    <button
                        onClick={() => { setActiveTab('completed'); setSelectedTx(null); }}
                        className={`!px-5 !py-2.5 !rounded-xl !text-sm !font-black !transition-all !flex !items-center !gap-2 ${activeTab === 'completed' ? '!bg-white !text-emerald-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                    >
                        <Icon icon="solar:check-circle-bold-duotone" className="!text-lg" />
                        Thành Công
                    </button>
                    <button
                        onClick={() => { setActiveTab('rejected'); setSelectedTx(null); }}
                        className={`!px-5 !py-2.5 !rounded-xl !text-sm !font-black !transition-all !flex !items-center !gap-2 ${activeTab === 'rejected' ? '!bg-white !text-red-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                    >
                        <Icon icon="solar:close-circle-bold-duotone" className="!text-lg" />
                        Bị Hủy
                    </button>
                </div>
            </div>

            {/* Split Screen Container */}
            <div className="!flex-1 !flex !flex-col lg:!flex-row !gap-4 !min-h-[600px]">

                {/* Left Panel: Transaction List */}
                <div className="!w-full lg:!w-1/3 !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !flex !flex-col !overflow-hidden">
                    <div className="!p-5 !border-b !border-border !bg-[#F8FAFC]">
                        <div className="!relative">
                            <Icon icon="solar:magnifer-linear" className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-text-muted" />
                            <input
                                type="text"
                                placeholder="Tìm tên học sinh..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="!w-full !bg-white !border !border-border !rounded-xl !pl-9 !pr-10 !py-2.5 !text-sm !font-medium focus:!outline-none focus:!border-primary"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="!absolute !right-3 !top-1/2 !-translate-y-1/2 !text-text-muted hover:!text-text-main !transition-colors"
                                >
                                    <Icon icon="solar:close-circle-bold" className="!text-lg" />
                                </button>
                            )}
                        </div>
                        {searchTerm && (
                            <p className="!text-[11px] !font-bold !text-text-muted !mt-2">
                                Tìm thấy <span className="!text-primary">{filteredTransactions.length}</span> kết quả cho &quot;{searchTerm}&quot;
                            </p>
                        )}
                    </div>

                    <div className="!flex-1 !overflow-y-auto custom-scrollbar !divide-y !divide-border">
                        {isLoading ? (
                            <div className="!py-20 !text-center !text-text-muted !font-bold">Đang tải danh sách...</div>
                        ) : filteredTransactions.length === 0 ? (
                            <div className="!py-28 !flex !flex-col !items-center !opacity-40">
                                <Icon icon="solar:document-text-bold-duotone" className="!text-6xl !text-text-muted !mb-2" />
                                <p className="!font-bold">Không có giao dịch nào</p>
                            </div>
                        ) : (
                            pagedTransactions.map(tx => {
                                const isSelected = selectedTx && selectedTx.transactionId === tx.transactionId;

                                return (
                                    <div
                                        key={tx.transactionId}
                                        onClick={() => { setSelectedTx(tx); setReviewNote(''); }}
                                        className={`!p-4 !cursor-pointer !transition-all hover:!bg-[#F8FAFC] ${isSelected ? '!bg-blue-50 !border-l-4 !border-l-blue-500' : '!border-l-4 !border-l-transparent'}`}
                                    >
                                        <div className="!flex !justify-between !items-start !mb-2">
                                            <p className={`!text-sm !font-black tracking-tight ${isSelected ? '!text-blue-700' : '!text-text-main'}`}>
                                                {tx.studentName}
                                            </p>
                                            <span className="!text-[10px] !font-bold !text-text-muted">{formatDate(tx.paidDate)}</span>
                                        </div>
                                        <div className="!flex !justify-between !items-end">
                                            <div>
                                                <p className="!text-[10px] !font-bold !text-text-muted !uppercase !truncate !max-w-[120px]">{tx.className}</p>
                                                <div className={`!mt-1 !px-2 !py-0.5 !rounded-lg !text-[10px] !font-black !inline-block ${getStatusStyle(tx.status)}`}>
                                                    {getStatusLabel(tx.status)}
                                                </div>
                                            </div>
                                            <div className="!text-right">
                                                <p className="!text-[10px] !font-bold !text-text-muted">{tx.paymentMethod}</p>
                                                <span className={`!text-sm !font-black ${isSelected ? '!text-blue-600' : '!text-emerald-600'}`}>
                                                    {formatVND(tx.amountPaid)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="!px-4 !py-3 !border-t !border-border !bg-[#F8FAFC] !flex !items-center !justify-between !shrink-0">
                            <p className="!text-[11px] !font-bold !text-text-muted">
                                {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)} / {filteredTransactions.length}
                            </p>
                            <div className="!flex !items-center !gap-1">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="!w-8 !h-8 !rounded-xl !flex !items-center !justify-center !border !border-border hover:!bg-white !transition-all disabled:!opacity-30 disabled:!cursor-not-allowed"
                                >
                                    <Icon icon="solar:alt-arrow-left-bold" className="!text-sm" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`!w-8 !h-8 !rounded-xl !text-xs !font-black !transition-all !border ${
                                            currentPage === page
                                                ? '!bg-primary !text-white !border-primary'
                                                : '!border-border hover:!bg-white !text-text-muted'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="!w-8 !h-8 !rounded-xl !flex !items-center !justify-center !border !border-border hover:!bg-white !transition-all disabled:!opacity-30 disabled:!cursor-not-allowed"
                                >
                                    <Icon icon="solar:alt-arrow-right-bold" className="!text-sm" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Active Review workspace */}
                <div className="!w-full lg:!w-2/3 !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden !flex !flex-col">
                    {!selectedTx ? (
                        <div className="!flex-1 !flex !flex-col !items-center !justify-center !text-text-muted !bg-background/20">
                            <Icon icon="solar:mouse-circle-bold-duotone" className="!text-7xl !opacity-20 !mb-4" />
                            <h3 className="!text-xl !font-black !text-text-main">Chưa chọn Giao dịch</h3>
                            <p className="!text-sm !font-medium">Vui lòng nhấp vào một giao dịch bên trái để bắt đầu kiểm tra.</p>
                        </div>
                    ) : (
                        <div className="!flex-1 !flex !flex-col xl:!flex-row">
                            {/* Receipt Image Side */}
                            <div className="!w-full xl:!w-1/2 !bg-zinc-100 !flex !flex-col !border-b xl:!border-b-0 xl:!border-r !border-border">
                                <div className="!px-4 !py-3 !bg-zinc-200/50 !flex !justify-between !items-center !border-b !border-zinc-300">
                                    <span className="!text-xs !font-black !text-zinc-600 !uppercase !tracking-widest">Ảnh Minh Chứng</span>
                                    <Icon icon="solar:maximize-square-minimalistic-bold-duotone" className="!text-zinc-400 !cursor-pointer hover:!text-zinc-600" title="Phóng to ảnh" />
                                </div>
                                <div className="!flex-1 !overflow-hidden !flex !items-center !justify-center !p-4 !min-h-[400px] !bg-zinc-50">
                                    {selectedTx.proofImageUrl ? (
                                        <img
                                            src={selectedTx.proofImageUrl}
                                            alt="Receipt Proof"
                                            className="!w-full !h-full !object-contain hover:!scale-[1.1] !transition-transform !duration-300 !cursor-zoom-in"
                                        />
                                    ) : (
                                        <div className="!text-center !text-zinc-400">
                                            <Icon icon="solar:image-broken-bold-duotone" className="!text-6xl !mx-auto !mb-2" />
                                            <p className="!text-sm !font-bold">Không có hình ảnh minh chứng</p>
                                            <p className="!text-[10px]">{selectedTx.paymentMethod === 'Cash' ? 'Giao dịch tiền mặt' : 'Không tìm thấy ảnh UNC'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form & Actions Side */}
                            <div className="!w-full xl:!w-1/2 !flex !flex-col !bg-white">
                                <div className="!px-6 !py-4 !border-b !border-border !bg-[#F8FAFC] !flex !justify-between !items-center">
                                    <h2 className="!text-lg !font-black !text-text-main">Chi tiết xác minh</h2>
                                    <div className={`!px-3 !py-1 !rounded-full !text-[11px] !font-black ${getStatusStyle(selectedTx.status)}`}>
                                        {getStatusLabel(selectedTx.status)}
                                    </div>
                                </div>

                                <div className="!flex-1 !p-6 !overflow-y-auto custom-scrollbar !space-y-6">
                                    {/* Student & Class Info */}
                                    <div className="!grid !grid-cols-2 !gap-4">
                                        <div className="!p-3 !bg-background !rounded-xl !border !border-border">
                                            <p className="!text-[10px] !font-bold !text-text-muted !uppercase">Học sinh</p>
                                            <p className="!text-sm !font-black !text-text-main">{selectedTx.studentName}</p>
                                        </div>
                                        <div className="!p-3 !bg-background !rounded-xl !border !border-border">
                                            <p className="!text-[10px] !font-bold !text-text-muted !uppercase">Lớp học</p>
                                            <p className="!text-sm !font-black !text-text-main">{selectedTx.className}</p>
                                        </div>
                                    </div>

                                    {/* Comparison Card */}
                                    <div className="!bg-surface !p-5 !rounded-2xl !border !border-border !space-y-4">
                                        <div className="!flex !justify-between !items-center">
                                            <span className="!text-[11px] !font-black !text-text-muted !uppercase tracking-wider">Hóa đơn chi tiết</span>
                                            <span className="!text-xs !font-bold !text-primary">Tháng {selectedTx.periodMonth}/{selectedTx.periodYear}</span>
                                        </div>

                                        <div className="!space-y-2 !bg-white !p-3 !rounded-xl !border !border-dashed !border-border">
                                            <div className="!flex !justify-between !text-xs !font-medium">
                                                <span className="!text-text-muted">Nội dung:</span>
                                                <span className="!text-text-main !font-bold">{selectedTx.invoiceDescription || 'Học phí'}</span>
                                            </div>
                                            <div className="!flex !justify-between !text-xs !font-medium">
                                                <span className="!text-text-muted">Đơn giá:</span>
                                                <span className="!text-text-main">{formatVND(selectedTx.invoiceUnitPrice)}</span>
                                            </div>
                                            <div className="!flex !justify-between !text-xs !font-medium">
                                                <span className="!text-text-muted">Số buổi:</span>
                                                <span className="!text-text-main">{selectedTx.invoiceSessionCount} buổi</span>
                                            </div>
                                            <div className="!border-t !border-border !my-1"></div>
                                            <div className="!flex !justify-between !text-sm !font-black">
                                                <span className="!text-text-muted">Tổng cần thu:</span>
                                                <span className="!text-text-main">{formatVND(selectedTx.invoiceTotalAmount)}</span>
                                            </div>
                                        </div>

                                        {/* So sánh thực tế */}
                                        <div className={`!flex !justify-between !items-center !p-4 !rounded-xl !border ${selectedTx.amountPaid !== selectedTx.invoiceTotalAmount && selectedTx.invoiceTotalAmount > 0 ? '!bg-amber-50 !border-amber-200' : '!bg-emerald-50 !border-emerald-200'}`}>
                                            <div>
                                                <span className="!text-[10px] !font-black !uppercase !text-text-muted">Số tiền báo nộp</span>
                                                <p className="!text-xs !font-bold !text-text-muted">{selectedTx.paymentMethod}</p>
                                            </div>
                                            <div className="!text-right">
                                                <span className={`!text-2xl !font-black ${selectedTx.amountPaid !== selectedTx.invoiceTotalAmount && selectedTx.invoiceTotalAmount > 0 ? '!text-amber-600' : '!text-emerald-600'}`}>
                                                    {formatVND(selectedTx.amountPaid)}
                                                </span>
                                                {selectedTx.amountPaid !== selectedTx.invoiceTotalAmount && selectedTx.invoiceTotalAmount > 0 &&
                                                    <p className="!text-[10px] !font-bold !text-amber-700 !flex !items-center !justify-end !gap-1">
                                                        <Icon icon="solar:danger-bold" /> Lệch so với hóa đơn
                                                    </p>
                                                }
                                            </div>
                                        </div>

                                        <div className="!flex !justify-between !items-center">
                                            <span className="!text-xs !font-bold !text-text-muted">Ngày thực hiện</span>
                                            <span className="!text-xs !font-black !text-text-main">{formatDate(selectedTx.paidDate)}</span>
                                        </div>
                                    </div>

                                    {activeTab === 'pending' && (
                                        <div className="!space-y-2">
                                            <label className="!text-[11px] !font-black !text-text-muted !uppercase !tracking-wider">
                                                Ghi chú nội bộ (Bắt buộc nếu từ chối)
                                            </label>
                                            <textarea
                                                value={reviewNote}
                                                onChange={(e) => setReviewNote(e.target.value)}
                                                placeholder="Lý do từ chối hoặc ghi chú duyệt..."
                                                className="!w-full !p-4 !bg-[#F8FAFC] !border !border-border !rounded-xl !text-sm !font-medium focus:!border-primary focus:!bg-white focus:!outline-none !resize-none !h-24"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons Fixed Bottom */}
                                {activeTab === 'pending' && (
                                    <div className="!p-6 !border-t !border-border !bg-white !flex !items-center !gap-4">
                                        <button
                                            disabled={isReviewing}
                                            onClick={() => handleAction(false)}
                                            className="!flex-1 !py-4 !rounded-2xl !font-black !bg-red-50 !text-red-600 hover:!bg-red-100 !border !border-red-100 !transition-all disabled:!opacity-50 !flex !items-center !justify-center !gap-2"
                                        >
                                            <Icon icon="solar:close-square-bold-duotone" className="!text-xl" />
                                            Từ Chối
                                        </button>
                                        <button
                                            disabled={isReviewing}
                                            onClick={() => handleAction(true)}
                                            className="!flex-1 !py-4 !rounded-2xl !font-black !bg-emerald-500 !text-white hover:!bg-emerald-600 !transition-all disabled:!opacity-50 !flex !items-center !justify-center !gap-2"
                                        >
                                            <Icon icon="solar:check-square-bold-duotone" className="!text-xl" />
                                            Duyệt
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ClassTransactionsPage;
