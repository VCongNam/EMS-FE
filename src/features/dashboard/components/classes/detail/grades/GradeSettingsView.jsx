import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const GradeSettingsView = ({ categories, onUpdateCategories }) => {
    const [localCategories, setLocalCategories] = useState(categories);
    const totalWeight = localCategories.reduce((sum, cat) => sum + cat.weight, 0);

    const handleWeightChange = (id, newValue) => {
        const value = parseInt(newValue) || 0;
        setLocalCategories(prev => prev.map(cat => cat.id === id ? { ...cat, weight: value } : cat));
    };

    const handleSave = () => {
        if (totalWeight !== 100) {
            toast.error('Tổng trọng số phải bằng 100%');
            return;
        }
        onUpdateCategories(localCategories);
    };

    return (
        <div className="!flex-1 !p-6 !bg-surface !overflow-y-auto !animate-fade-in custom-scrollbar">
            <div className="!max-w-2xl !mx-auto !bg-white !rounded-2xl !border !border-border !shadow-sm !overflow-hidden">
                <div className="!p-6 !border-b !border-border !bg-background/30">
                    <h3 className="!text-lg !font-bold !text-text-main !flex !items-center !gap-2">
                        <Icon icon="material-symbols:settings-suggest-rounded" className="!text-primary" />
                        Cấu hình trọng số điểm
                    </h3>
                    <p className="!text-sm !text-text-muted !mt-1">Thiết lập tỷ lệ phần trăm cho từng hạng mục điểm trong lớp học.</p>
                </div>
                
                <div className="!p-6 !space-y-6">
                    <div className="!space-y-4">
                        {localCategories.map(cat => (
                            <div key={cat.id} className="!flex !items-center !gap-6 !p-4 !rounded-xl !bg-background/50 !border !border-border !transition-all hover:!border-primary/30">
                                <div className="!flex-1">
                                    <div className="!font-bold !text-text-main">{cat.name}</div>
                                    <div className="!text-xs !text-text-muted !mt-0.5">Mã hạng mục: {cat.id}</div>
                                </div>
                                <div className="!flex !items-center !gap-2">
                                    <input 
                                        type="number" 
                                        value={cat.weight}
                                        onChange={(e) => handleWeightChange(cat.id, e.target.value)}
                                        className="!w-20 !px-3 !py-2 !bg-white !border !border-border !rounded-lg !text-center !font-bold !text-primary focus:!border-primary focus:!ring-4 focus:!ring-primary/10 transition-all outline-none"
                                    />
                                    <span className="!font-bold !text-text-muted">%</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`!p-4 !rounded-xl !border !flex !items-center !justify-between ${totalWeight === 100 ? '!bg-emerald-50 !border-emerald-200 !text-emerald-700' : '!bg-red-50 !border-red-200 !text-red-700'}`}>
                        <div className="!flex !items-center !gap-2">
                            <Icon icon={totalWeight === 100 ? "material-symbols:check-circle-rounded" : "material-symbols:error-rounded"} className="!text-xl" />
                            <span className="!font-bold">Tổng cộng trọng số:</span>
                        </div>
                        <span className="!text-2xl !font-black">{totalWeight}%</span>
                    </div>

                    {totalWeight !== 100 && (
                        <p className="!text-xs !text-red-500 !text-center !animate-pulse">
                            Vui lòng điều chỉnh các trọng số để tổng bằng chính xác 100%.
                        </p>
                    )}

                    <div className="!pt-6 !flex !gap-3">
                        <button 
                            onClick={handleSave}
                            disabled={totalWeight !== 100}
                            className="!flex-1 !py-3.5 !bg-primary !text-white !rounded-xl !font-bold !shadow-lg !shadow-primary/20 hover:!bg-primary/90 disabled:!opacity-50 disabled:!shadow-none !transition-all !flex !items-center !justify-center !gap-2"
                        >
                            <Icon icon="material-symbols:save-rounded" />
                            Lưu cấu hình
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="!max-w-2xl !mx-auto !mt-6 !bg-amber-50 !border !border-amber-200 !rounded-xl !p-4 !flex !items-start !gap-3">
                <Icon icon="material-symbols:info-rounded" className="!text-amber-500 !text-xl !shrink-0" />
                <p className="!text-sm !text-amber-800 !leading-relaxed">
                    <strong>Lưu ý:</strong> Việc thay đổi trọng số điểm sẽ ảnh hưởng ngay lập tức đến cách tính điểm trung bình (GPA) của tất cả học sinh trong lớp. Hãy cân nhắc kỹ trước khi lưu.
                </p>
            </div>
        </div>
    );
};

export default GradeSettingsView;
