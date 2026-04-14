import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { tuitionService } from '../api/tuitionService';
import useAuthStore from '../../../store/authStore';

const ClassFinancialReportsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSummaries = async () => {
            if (!user?.token) return;
            try {
                setIsLoading(true);
                const res = await tuitionService.getClassFinancialSummaries(user.token);
                if (res.ok) {
                    const data = await res.json();
                    setClasses(data || []);
                } else {
                    toast.error("Không thể tải danh sách báo cáo các lớp");
                }
            } catch (error) {
                console.error("Lỗi:", error);
                toast.error("Vui lòng kiểm tra lại kết nối");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummaries();
    }, [user?.token]);

    const filteredClasses = useMemo(() => {
        return classes.filter(cls => 
            (cls.className || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
            (cls.classId || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [classes, searchQuery]);

    // Compute Summary Stats
    const totalClasses = classes.length;
    const avgCollectionRate = useMemo(() => {
        if (totalClasses === 0) return 0;
        const sumRate = classes.reduce((sum, cls) => sum + (cls.collectionRate || 0), 0);
        return (sumRate / totalClasses).toFixed(1);
    }, [classes, totalClasses]);

    return (
        <div className="!min-h-full sm:!p-8 !animate-fade-in custom-scrollbar">
            <div className="!flex !items-center !gap-2 !mb-4">
                <button 
                    onClick={() => navigate('/tuition')}
                    className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-muted hover:!text-primary !transition-colors"
                >
                    <Icon icon="solar:round-arrow-left-bold" className="!text-xl" />
                    Quay lại
                </button>
            </div>
            {/* Header Section with Premium Styling */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center !gap-6 bg-surface !p-8 rounded-[2.5rem] border border-border shadow-sm">
                <div>
                    <h1 className="!text-3xl sm:!text-4xl !font-black !text-text-main !tracking-tight !flex !items-center !gap-3 font-['Outfit']">
                        Báo cáo Tài chính Lớp học
                        <div className="!w-2.5 !h-2.5 !rounded-full !bg-primary !animate-pulse"></div>
                    </h1>
                    <p className="!text-sm !font-medium !text-text-muted !mt-2 !ml-1">
                        Hãy chọn một lớp học để xem chi tiết tình trạng đóng học phí và công nợ.
                    </p>
                </div>
                
                <div className="!flex !items-center !gap-3 !w-full sm:!w-auto">
                    <div className="!relative !flex-1 sm:!w-72">
                        <Icon icon="solar:magnifer-linear" className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl" />
                        <input 
                            type="text" 
                            placeholder="Tìm tên lớp hoặc mã lớp..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="!w-full !pl-12 !pr-4 !py-4 !bg-white !border !border-border !rounded-2xl !text-sm !font-medium focus:!outline-none focus:!border-primary !transition-all !shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6 !mt-8 !mb-10">
                <div className="!p-6 !bg-white !rounded-3xl !border !border-border !shadow-sm">
                    <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-2">Tổng số lớp</p>
                    <div className="!flex !items-center !gap-2">
                        <Icon icon="solar:folder-2-bold-duotone" className="!text-xl !text-primary" />
                        <h3 className="!text-2xl !font-black !text-text-main">
                            {isLoading ? '...' : `${totalClasses} Lớp`}
                        </h3>
                    </div>
                </div>
                <div className="!p-6 !bg-white !rounded-3xl !border !border-border !shadow-sm">
                    <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-2">Tỷ lệ thu hồi TB</p>
                    <div className="!flex !items-center !gap-2">
                        <Icon icon="solar:graph-bold-duotone" className="!text-xl !text-emerald-500" />
                        <h3 className="!text-2xl !font-black !text-emerald-600">
                            {isLoading ? '...' : `${avgCollectionRate}%`}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Class Cards Grid */}
            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 !gap-8">
                {isLoading ? (
                    <div className="!col-span-full !py-20 !text-center text-text-muted !font-medium">Đang tải danh sách lớp học...</div>
                ) : filteredClasses.map((cls) => (
                    <div 
                        key={cls.classId || cls.id}
                        onClick={() => navigate(`/tuition/reports/${cls.classId || cls.id}`)}
                        className="!bg-white !rounded-[2.5rem] !border !border-border !shadow-sm hover:!shadow-xl hover:!-translate-y-2 !transition-all !cursor-pointer !group"
                    >
                        <div className="!p-8 !space-y-6">
                            <div className="!flex !items-center !justify-between">
                                <div className="!w-14 !h-14 !bg-primary/10 !rounded-2xl !flex !items-center !justify-center !text-primary !group-hover:!bg-primary !group-hover:!text-white !transition-all">
                                    <Icon icon="solar:wallet-money-bold-duotone" className="!text-2xl" />
                                </div>
                                <div className="!px-3 !py-1 !bg-background !border !border-border !rounded-lg !text-[10px] !font-black !text-text-muted !uppercase">
                                    {cls.classId || cls.id || 'N/A'}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="!text-lg !font-black !text-text-main !line-clamp-1">{cls.className || cls.name}</h3>
                                <p className="!text-sm !font-bold !text-text-muted !mt-1">{cls.studentCount || cls.studentsCount || 0} học sinh</p>
                            </div>

                            <div className="!space-y-4">
                                <div className="!space-y-2">
                                    <div className="!flex !justify-between !items-center">
                                        <span className="!text-[10px] !font-black !text-text-muted !uppercase">Tỷ lệ đóng học phí</span>
                                        <span className="!text-[10px] !font-black !text-primary">{Math.round(cls.collectionRate || 0)}%</span>
                                    </div>
                                    <div className="!h-1.5 !bg-background !rounded-full !overflow-hidden">
                                        <div className="!h-full !bg-primary" style={{ width: `${Math.round(cls.collectionRate || 0)}%` }}></div>
                                    </div>
                                </div>

                                <div className="!pt-4 !border-t !border-border !flex !flex-col !gap-2">
                                    <div className="!flex !justify-between !items-center">
                                        <span className="!text-[10px] !font-black !text-text-muted !uppercase">Thực thu</span>
                                        <span className="!text-sm !font-black !text-text-main">{(cls.actualRevenue || cls.collectedAmount || 0).toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="!flex !justify-between !items-center">
                                        <span className="!text-[10px] !font-black !text-text-muted !uppercase">Còn nợ</span>
                                        <span className={`!text-sm !font-black ${(cls.debtAmount || cls.debt || 0) > 0 ? '!text-red-500' : '!text-emerald-600'}`}>
                                            {(cls.debtAmount || cls.debt || 0).toLocaleString('vi-VN')} ₫
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {!isLoading && filteredClasses.length === 0 && (
                    <div className="!col-span-full !py-28 !flex !flex-col !items-center !justify-center !text-center !bg-white !rounded-[40px] !border !border-border !shadow-sm">
                        <Icon icon="solar:folder-error-bold-duotone" className="!text-6xl !text-text-muted !mb-4" />
                        <h3 className="!text-xl !font-black !text-text-main !mb-2">Không tìm thấy kết quả</h3>
                        <p className="!text-sm !font-medium !text-text-muted !max-w-xs">Thử thay đổi từ khóa tìm kiếm hoặc hiện chưa có dữ liệu tài chính nào.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassFinancialReportsPage;
