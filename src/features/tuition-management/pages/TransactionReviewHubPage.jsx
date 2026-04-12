import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { tuitionService } from '../api/tuitionService';
import useAuthStore from '../../../store/authStore';

const TransactionReviewHubPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    
    const [activeTab, setActiveTab] = useState('pending');
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Popup Review State
    const [selectedTx, setSelectedTx] = useState(null);
    const [reviewNote, setReviewNote] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);

    const fetchTransactions = async () => {
        if (!user?.token) return;
        try {
            setIsLoading(true);
            const res = await tuitionService.getPendingTransactions(user.token);
            if (res.ok) {
                const data = await res.json();
                setTransactions(data || []);
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
    }, [user?.token, activeTab]);

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
                note: reviewNote
            };
            const res = await tuitionService.reviewTransaction(selectedTx.id || selectedTx.transactionId, payload, user.token);
            if (res.ok) {
                toast.success(isApproved ? "Đã duyệt giao dịch thành công!" : "Đã từ chối giao dịch!");
                setSelectedTx(null);
                setReviewNote('');
                fetchTransactions(); // Reload list
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
        return d.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
    };

    const displayedTxs = transactions.filter(tx => 
        activeTab === 'pending' ? (tx.status === 'Pending' || tx.status === 0 || !tx.status) : (tx.status !== 'Pending' && tx.status !== 0 && tx.status)
    );

    return (
        <div className="!h-full !min-h-screen sm:!p-4 md:!p-8 !animate-fade-in !flex !flex-col !space-y-4">
            {/* Header */}
            <div className="!flex !items-center !gap-2 !mb-2 !px-2">
                <button 
                    onClick={() => navigate('/tuition')}
                    className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-muted hover:!text-primary !transition-colors"
                >
                    <Icon icon="solar:round-arrow-left-bold" className="!text-xl" />
                    Quay lại Dashboard
                </button>
            </div>

            <div className="!flex !items-center !justify-between !bg-surface !p-6 !rounded-[2.5rem] !border !border-border !shadow-sm">
                <div>
                    <h1 className="!text-3xl !font-black !text-text-main !tracking-tight !flex !items-center !gap-3 font-['Outfit']">
                        Trạm Duyệt Thanh Toán Siêu Tốc
                        <div className="!w-2 !h-2 !rounded-full !bg-amber-500 !animate-pulse"></div>
                    </h1>
                    <p className="!text-sm !font-medium !text-text-muted !mt-1">
                        Split-screen tối ưu giúp kế toán tra soát và duyệt hàng chục biên lai trong vài phút.
                    </p>
                </div>
                <div className="!flex !items-center !gap-2 !bg-background !p-1.5 !rounded-2xl !border !border-border">
                    <button 
                        onClick={() => { setActiveTab('pending'); setSelectedTx(null); }}
                        className={`!px-5 !py-2.5 !rounded-xl !text-sm !font-black !transition-all !flex !items-center !gap-2 ${activeTab === 'pending' ? '!bg-white !text-amber-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                    >
                        <Icon icon="solar:hourglass-line-bold-duotone" className="!text-lg" />
                        Chờ Duyệt ({transactions.filter(t => t.status === 'Pending' || !t.status || t.status === 0).length})
                    </button>
                    <button 
                        onClick={() => { setActiveTab('history'); setSelectedTx(null); }}
                        className={`!px-5 !py-2.5 !rounded-xl !text-sm !font-black !transition-all !flex !items-center !gap-2 ${activeTab === 'history' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                    >
                        <Icon icon="solar:history-line-bold-duotone" className="!text-lg" />
                        Lịch sử
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
                            <input type="text" placeholder="Tìm tên học sinh..." className="!w-full !bg-white !border !border-border !rounded-xl !pl-9 !pr-4 !py-2.5 !text-sm !font-medium focus:!outline-none focus:!border-primary" />
                        </div>
                    </div>

                    <div className="!flex-1 !overflow-y-auto custom-scrollbar !divide-y !divide-border">
                        {isLoading ? (
                            <div className="!py-20 !text-center !text-text-muted !font-bold">Đang tải danh sách...</div>
                        ) : displayedTxs.length === 0 ? (
                            <div className="!py-28 !flex !flex-col !items-center !opacity-40">
                                <Icon icon="solar:check-circle-bold-duotone" className="!text-6xl !text-emerald-500 !mb-2" />
                                <p className="!font-bold">Đã xử lý hết yêu cầu</p>
                            </div>
                        ) : (
                            displayedTxs.map(tx => {
                                const txId = tx.transactionId || tx.id;
                                const isSelected = selectedTx && (selectedTx.transactionId || selectedTx.id) === txId;

                                return (
                                <div 
                                    key={txId} 
                                    onClick={() => { setSelectedTx(tx); setReviewNote(''); }}
                                    className={`!p-4 !cursor-pointer !transition-all hover:!bg-[#F8FAFC] ${isSelected ? '!bg-blue-50 !border-l-4 !border-l-blue-500' : '!border-l-4 !border-l-transparent'}`}
                                >
                                    <div className="!flex !justify-between !items-start !mb-2">
                                        <p className={`!text-sm !font-black tracking-tight ${isSelected ? '!text-blue-700' : '!text-text-main'}`}>
                                            {tx.studentName || tx.student?.name || 'N/A'}
                                        </p>
                                        <span className="!text-[10px] !font-bold !text-text-muted">{formatDate(tx.paidDate || tx.createdAt || tx.date)}</span>
                                    </div>
                                    <div className="!flex !justify-between !items-end">
                                        <div>
                                            <p className="!text-[10px] !font-bold !text-text-muted !uppercase">{tx.className || tx.classId || 'Học phí'}</p>
                                            <p className="!text-xs !font-medium !text-text-muted !truncate !max-w-[150px] !mt-0.5">{tx.note || tx.description || 'Không ghi chú'}</p>
                                        </div>
                                        <span className={`!text-sm !font-black ${isSelected ? '!text-blue-600' : '!text-emerald-600'}`}>
                                            {formatVND(tx.amountPaid || tx.amount || tx.paidAmount)}
                                        </span>
                                    </div>
                                </div>
                                );
                            })
                        )}
                    </div>
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
                                    <span className="!text-xs !font-black !text-zinc-600 !uppercase !tracking-widest">Ảnh Minh Chứng (Proof)</span>
                                    <Icon icon="solar:maximize-square-minimalistic-bold-duotone" className="!text-zinc-400 !cursor-pointer hover:!text-zinc-600" title="Phóng to ảnh" />
                                </div>
                                <div className="!flex-1 !overflow-hidden !flex !items-center !justify-center !p-4 !min-h-[300px]">
                                     {selectedTx.proofImageURL || selectedTx.imageUrl || selectedTx.receiptUrl ? (
                                        <img 
                                            src={selectedTx.proofImageURL || selectedTx.imageUrl || selectedTx.receiptUrl} 
                                            alt="Receipt" 
                                            className="!w-full !h-full !object-contain hover:!scale-[1.15] !transition-transform !duration-300 !cursor-zoom-in"
                                        />
                                    ) : (
                                        <div className="!text-center !text-zinc-400">
                                            <Icon icon="solar:image-broken-bold-duotone" className="!text-6xl !mx-auto !mb-2" />
                                            <p className="!text-sm !font-bold">Không có hình ảnh</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Form & Actions Side */}
                            <div className="!w-full xl:!w-1/2 !flex !flex-col !bg-white">
                                <div className="!px-6 !py-4 !border-b !border-border !bg-[#F8FAFC]">
                                    <h2 className="!text-lg !font-black !text-text-main">Đối chiếu & Xử lý</h2>
                                </div>
                                
                                <div className="!flex-1 !p-6 !overflow-y-auto custom-scrollbar !space-y-6">
                                    {/* Comparison Card */}
                                    <div className="!bg-surface !p-5 !rounded-2xl !border !border-border !space-y-4">
                                        <div className="!flex !justify-between !items-center">
                                            <span className="!text-xs !font-bold !text-text-muted">Học sinh nộp</span>
                                            <span className="!text-sm !font-black !text-text-main">{selectedTx.studentName || selectedTx.student?.name}</span>
                                        </div>
                                        <div className="!border-t !border-border !my-2"></div>
                                        <div className="!flex !justify-between !items-center">
                                            <span className="!text-[11px] !font-black !text-text-muted !uppercase">Yêu cầu thanh toán</span>
                                            <span className="!text-base !font-black !text-text-main">{selectedTx.expectedAmount || selectedTx.dueAmount ? formatVND(selectedTx.expectedAmount || selectedTx.dueAmount) : 'Chưa thu thập'}</span>
                                        </div>

                                        {/* So sánh */}
                                        {(() => {
                                            const expected = selectedTx.expectedAmount || selectedTx.dueAmount || 0;
                                            const paid = selectedTx.amountPaid || selectedTx.amount || selectedTx.paidAmount || 0;
                                            const isMismatch = expected > 0 && expected !== paid;

                                            return (
                                                <div className={`!flex !justify-between !items-center !p-3 !rounded-xl !border ${isMismatch ? '!bg-red-50 !border-red-200' : '!bg-emerald-50 !border-emerald-200'}`}>
                                                    <span className={`!text-[11px] !font-black !uppercase ${isMismatch ? '!text-red-700' : '!text-emerald-700'}`}>
                                                        Thực tế báo nộp
                                                    </span>
                                                    <span className={`!text-2xl !font-black ${isMismatch ? '!text-red-600' : '!text-emerald-600'}`}>
                                                        {formatVND(paid)}
                                                        {isMismatch && <Icon icon="solar:danger-triangle-bold" className="!inline-block !ml-2 !text-lg !text-red-500" title="Số tiền lệch báo động" />}
                                                    </span>
                                                </div>
                                            )
                                        })()}

                                        <div className="!flex !justify-between !items-center">
                                            <span className="!text-xs !font-bold !text-text-muted">Nội dung CK</span>
                                            <span className="!text-xs !font-medium !text-text-main !text-right !max-w-[200px]">{selectedTx.note || selectedTx.description || 'N/A'}</span>
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
                                                placeholder="VD: Thiếu 20k, Ảnh mờ..."
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
                                            className="!flex-1 !py-4 !rounded-2xl !font-black !bg-emerald-500 !text-white hover:!bg-emerald-600 !hover:shadow-lg !hover:shadow-emerald-500/20 !transition-all disabled:!opacity-50 !flex !items-center !justify-center !gap-2"
                                        >
                                            <Icon icon="solar:check-square-bold-duotone" className="!text-xl" />
                                            Duyệt Khớp Bill
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

export default TransactionReviewHubPage;
