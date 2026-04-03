import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import StudentPaymentTable from '../components/StudentPaymentTable';
import TransactionHistoryModal from '../components/TransactionHistoryModal';

const MOCK_CLASSES = {
    'TC101': { name: 'Toán Nâng Cao - TC101', students: 32, fee: 1500000 },
    'TC102': { name: 'Lý Thuyết Vật Lý - TC102', students: 25, fee: 1200000 },
    'TC103': { name: 'Hóa Học Cơ Bản - TC103', students: 18, fee: 8500000 },
    'TC104': { name: 'Luyện đề IELTS - TC104', students: 12, fee: 2500000 },
};

const ClassFinancialDetailPage = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const classInfo = MOCK_CLASSES[classId] || { name: 'Lớp học không xác định', students: 0, fee: 0 };

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    // Derived stats
    const stats = {
        expected: classInfo.students * classInfo.fee,
        collected: Math.round(classInfo.students * classInfo.fee * 0.85),
        debt: Math.round(classInfo.students * classInfo.fee * 0.15)
    };

    const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setIsHistoryModalOpen(true);
    };

    return (
        <div className="!min-h-full sm:!p-8 !space-y-8 !animate-fade-in custom-scrollbar">
            {/* Breadcrumbs & Navigation */}
            <div className="!flex !items-center !gap-2">
                <button 
                    onClick={() => navigate('/tuition/reports')}
                    className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-muted hover:!text-primary !transition-colors"
                >
                    <Icon icon="solar:round-arrow-left-bold" className="!text-xl" />
                    Quay lại danh sách báo cáo
                </button>
            </div>

            {/* Header section with Class Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center !gap-6 bg-surface !p-8 rounded-[2.5rem] border border-border shadow-sm">
                <div className="!flex !items-center !gap-6">
                    <div className="!w-20 !h-20 !bg-white !rounded-3xl !border !border-border !shadow-sm !flex !items-center !justify-center !text-primary">
                        <Icon icon="solar:square-academic-cap-bold-duotone" className="!text-4xl" />
                    </div>
                    <div>
                        <h1 className="!text-2xl sm:!text-3xl !font-black !text-text-main !tracking-tight">{classInfo.name}</h1>
                        <div className="!flex !flex-wrap !items-center !gap-4 !mt-2">
                             <div className="!flex !items-center !gap-1.5 !text-sm !font-bold !text-text-muted">
                                <Icon icon="solar:users-group-rounded-bold" className="!text-primary" />
                                {classInfo.students} học sinh
                            </div>
                            <div className="!w-1 !h-1 !rounded-full !bg-border" />
                            <div className="!flex !items-center !gap-1.5 !text-sm !font-bold !text-text-muted">
                                <Icon icon="solar:wallet-money-bold" className="!text-primary" />
                                Học phí gốc: {formatVND(classInfo.fee)}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="!flex !items-center !gap-3 !w-full sm:!w-auto">
                    <button 
                        onClick={() => navigate('/tuition')}
                        className="!w-full sm:!w-auto !bg-background !text-text-main !px-6 !py-3.5 !rounded-2xl !font-black !flex !items-center !justify-center !gap-2 !border !border-border hover:!bg-white !transition-all"
                    >
                        <Icon icon="solar:settings-bold-duotone" className="!text-xl" />
                        Cấu hình học phí
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
                    <h3 className="!text-2xl !font-black !text-text-main !tracking-tight">{formatVND(stats.expected)}</h3>
                    <p className="!text-xs !font-bold !text-text-muted !mt-2">Tổng doanh thu lý thuyết</p>
                </div>

                <div className="!p-8 !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <div className="!flex !items-center !justify-between !mb-4">
                        <div className="!w-12 !h-12 !rounded-2xl !bg-emerald-50 !flex !items-center !justify-center !text-emerald-500">
                            <Icon icon="solar:check-read-bold-duotone" className="!text-2xl" />
                        </div>
                        <span className="!text-[10px] !font-black !text-emerald-600 !uppercase !tracking-widest">Thực thu</span>
                    </div>
                    <h3 className="!text-2xl !font-black !text-emerald-600 !tracking-tight">{formatVND(stats.collected)}</h3>
                    <div className="!mt-2 !flex !items-center !gap-2">
                        <div className="!flex-1 !h-1.5 !bg-emerald-50 !rounded-full !overflow-hidden">
                            <div className="!h-full !bg-emerald-500" style={{ width: '85%' }}></div>
                        </div>
                        <span className="!text-[10px] !font-black !text-emerald-600">85%</span>
                    </div>
                </div>

                <div className="!p-8 !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <div className="!flex !items-center !justify-between !mb-4">
                        <div className="!w-12 !h-12 !rounded-2xl !bg-red-50 !flex !items-center !justify-center !text-red-500">
                            <Icon icon="solar:danger-bold-duotone" className="!text-2xl" />
                        </div>
                        <span className="!text-[10px] !font-black !text-red-600 !uppercase !tracking-widest">Công nợ</span>
                    </div>
                    <h3 className="!text-2xl !font-black !text-red-600 !tracking-tight">{formatVND(stats.debt)}</h3>
                    <p className="!text-xs !font-bold !text-text-muted !mt-2">Học phí chưa thanh toán</p>
                </div>
            </div>

            {/* Detailed Student Table */}
            <div className="!space-y-6">
                <div>
                    <h2 className="!text-2xl !font-black !text-text-main !tracking-tight">Danh sách chi tiết</h2>
                    <p className="!text-sm !font-medium !text-text-muted !mt-1">Theo dõi trạng thái thanh toán của từng học sinh trong lớp.</p>
                </div>

                <StudentPaymentTable onStudentClick={handleStudentClick} />
            </div>

            {/* History Modal */}
            <TransactionHistoryModal 
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                student={selectedStudent}
            />
        </div>
    );
};

export default ClassFinancialDetailPage;
