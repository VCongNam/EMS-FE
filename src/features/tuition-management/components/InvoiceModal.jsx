import React from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../components/common/Modal';

const InvoiceModal = ({ isOpen, onClose, data }) => {
    if (!data) return null;

    const printInvoice = () => {
        window.print();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Hóa đơn Điện tử" maxWidth="lg">
            <div className="!p-8 !space-y-8 !bg-white !relative !overflow-hidden">
                {/* Watermark */}
                <div className="!absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !opacity-[0.03] !pointer-events-none !rotate-12">
                    <Icon icon="material-symbols:school" className="!text-[400px]" />
                </div>

                {/* Invoice Header */}
                <div className="!flex !justify-between !items-start !border-b-2 !border-primary/10 !pb-6 !relative !z-10">
                    <div className="!flex !items-center !gap-4">
                        <div className="!w-16 !h-16 !bg-primary !rounded-2xl !flex !items-center !justify-center !shadow-lg !shadow-primary/20">
                            <Icon icon="material-symbols:school" className="!text-3xl !text-white" />
                        </div>
                        <div>
                            <h2 className="!text-2xl !font-black !text-text-main !tracking-tighter">EMS Education</h2>
                            <p className="!text-xs !font-bold !text-text-muted">Hệ thống Quản lý Giáo dục Thông minh</p>
                            <p className="!text-[10px] !text-text-muted !mt-1">MST: 0101234567 | Hotline: 1900 1234</p>
                        </div>
                    </div>
                    <div className="!text-right">
                        <div className="!px-4 !py-1 !bg-emerald-50 !text-emerald-600 !border !border-emerald-100 !rounded-full !text-[10px] !font-black !uppercase !tracking-widest !inline-block !mb-2">
                            Đã thanh toán
                        </div>
                        <p className="!text-xs !font-bold !text-text-main">Mẫu số: 01GTKT0/001</p>
                        <p className="!text-xs !text-text-muted">Ký hiệu: EMS/26E</p>
                    </div>
                </div>

                {/* Invoice Title */}
                <div className="!text-center !space-y-1 !relative !z-10">
                    <h1 className="!text-2xl !font-black !text-text-main !uppercase !tracking-[0.2em]">Hóa đơn học phí</h1>
                    <p className="!text-sm !font-bold !text-text-muted">Số: INV-{data.id || data.code}</p>
                    <p className="!text-xs !text-text-muted italic">Ngày {new Date().toLocaleDateString('vi-VN')}</p>
                </div>

                {/* Customer Info */}
                <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-8 !p-6 !bg-background !rounded-3xl !border !border-border !border-dashed !relative !z-10">
                    <div className="!space-y-3">
                        <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Đơn vị thanh toán</p>
                        <div>
                            <h4 className="!text-sm !font-black !text-text-main">Học sinh: Nam Vũ Văn</h4>
                            <p className="!text-xs !font-medium !text-text-muted !mt-1">Mã HS: SV2026-0001</p>
                            <p className="!text-xs !font-medium !text-text-muted">Lớp: Toán Cao Cấp - T2.01</p>
                        </div>
                    </div>
                    <div className="!space-y-3 md:!text-right">
                        <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Thông tin giao dịch</p>
                        <div>
                            <h4 className="!text-sm !font-black !text-text-main">PT: {data.method || 'Chuyển khoản'}</h4>
                            <p className="!text-xs !font-medium !text-text-muted !mt-1">Mã GD: #TXN-{data.id || '999'}</p>
                            <p className="!text-xs !font-medium !text-text-muted">Nội dung: {data.title || 'Nộp học phí'}</p>
                        </div>
                    </div>
                </div>

                {/* Invoice Table */}
                <div className="!relative !z-10">
                    <table className="!w-full">
                        <thead>
                            <tr className="!border-b-2 !border-primary/10">
                                <th className="!text-left !py-4 !text-xs !font-black !text-text-muted !uppercase !tracking-widest">Nội dung</th>
                                <th className="!text-right !py-4 !text-xs !font-black !text-text-muted !uppercase !tracking-widest">Số tiền (VNĐ)</th>
                            </tr>
                        </thead>
                        <tbody className="!divide-y !divide-border">
                            <tr>
                                <td className="!py-6">
                                    <h5 className="!text-sm !font-black !text-text-main">{data.title || 'Học phí khóa học'}</h5>
                                    <p className="!text-xs !text-text-muted !mt-1">Thời gian áp dụng: Học kỳ 1 (2026-2027)</p>
                                </td>
                                <td className="!text-right !py-6 !font-black !text-text-main">
                                    {(data.amount || 0).toLocaleString('vi-VN')} ₫
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total */}
                <div className="!flex !justify-end !relative !z-10">
                    <div className="!w-full md:!w-72 !space-y-3">
                        <div className="!flex !justify-between !text-xs !font-bold !text-text-muted">
                            <span>Sơ kế</span>
                            <span>{(data.amount || 0).toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="!flex !justify-between !text-xs !font-bold !text-text-muted">
                            <span>Thuế VAT (0%)</span>
                            <span>0 ₫</span>
                        </div>
                        <div className="!h-px !bg-border !dashed !border-t !border-dashed" />
                        <div className="!flex !justify-between !items-center">
                            <span className="!text-sm !font-black !text-text-main">Tổng cộng</span>
                            <span className="!text-2xl !font-black !text-primary">{(data.amount || 0).toLocaleString('vi-VN')} ₫</span>
                        </div>
                    </div>
                </div>

                {/* Footer & Stamps */}
                <div className="!flex !justify-between !items-end !pt-8 !relative !z-10">
                    <div className="!text-xs !text-text-muted !italic !max-w-[200px]">
                        * Ghi chú: Hóa đơn điện tử có giá trị pháp lý tương đương hóa đơn giấy.
                    </div>
                    <div className="!text-center !space-y-8">
                        <div className="!relative">
                            {/* Signature Stamp placeholder */}
                            <div className="!absolute !inset-0 !flex !items-center !justify-center !opacity-10 !scale-150">
                                <Icon icon="solar:verified-check-bold" className="!text-primary !text-6xl" />
                            </div>
                            <p className="!text-xs !font-black !text-text-main !uppercase !tracking-widest">Người thu tiền</p>
                            <p className="!text-[10px] !text-text-muted !mt-1">(Ký ghi rõ họ tên)</p>
                        </div>
                        <div className="!pt-6">
                            <Icon icon="fluent:signature-20-filled" className="!text-4xl !text-primary/40" />
                            <p className="!text-sm !font-black !text-primary/60 !mt-2 !font-['Outfit']">EMS Education Manager</p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="!flex !items-center !gap-3 !pt-6 !border-t !border-border !relative !z-10 no-print">
                    <button 
                        onClick={printInvoice}
                        className="!flex-1 !px-6 !py-3 !bg-background !text-text-main !border !border-border !rounded-xl !text-sm !font-black hover:!bg-border !transition-all !flex !items-center !justify-center !gap-2"
                    >
                        <Icon icon="solar:printer-bold-duotone" className="!text-lg" />
                        In hóa đơn
                    </button>
                    <button 
                        className="!flex-1 !px-6 !py-3 !bg-primary !text-white !rounded-xl !text-sm !font-black !shadow-lg !shadow-primary/20 hover:!bg-primary/90 !transition-all !flex !items-center !justify-center !gap-2"
                    >
                        <Icon icon="solar:download-square-bold-duotone" className="!text-lg" />
                        Tải PDF
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default InvoiceModal;
