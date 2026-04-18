import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNotifications } from '../../../contexts/NotificationContext';
import { toast } from 'react-toastify';

const PushPermissionModal = () => {
    const { isPushSupported, isPushSubscribed, requestPushPermission } = useNotifications();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Chỉ hiện nếu:
        // 1. Trình duyệt hỗ trợ Push
        // 2. Quyền chưa được quyết định (default)
        // 3. User chưa ấn "Để sau" trong phiên đăng nhập này
        const checkVisibility = () => {
            if (!isPushSupported) return;
            
            // Notification is a browser API. Make sure we check safely.
            if ('Notification' in window && Notification.permission === 'default' && !isPushSubscribed) {
                const dismissed = sessionStorage.getItem('pushPromptDismissed');
                if (!dismissed) {
                    // Delay 1.5s sau khi load Dashboard sẽ hiện modal để đỡ đường đột
                    const timer = setTimeout(() => setIsVisible(true), 1500);
                    return () => clearTimeout(timer);
                }
            }
        };
        checkVisibility();
    }, [isPushSupported, isPushSubscribed]);

    if (!isVisible) return null;

    const handleEnable = async () => {
        setIsVisible(false); // Ẩn modal ngay lập tức để cảm giác phản hồi nhanh
        try {
            const perm = await requestPushPermission();
            if (perm === 'granted') {
                toast.success('Đã bật thông báo thành công!');
            } else if (perm === 'denied') {
                toast.error('Bạn đã từ chối nhận thông báo. Có thể bật lại ở biểu tượng ổ khóa trình duyệt.');
            }
        } catch (error) {
            console.error("Lỗi xin quyền:", error);
        }
    };

    const handleDismiss = () => {
        sessionStorage.setItem('pushPromptDismissed', 'true');
        setIsVisible(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center !p-4 sm:!p-6 animate-fade-in">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 !bg-secondary/60 backdrop-blur-md"
                onClick={handleDismiss}
            />
            
            {/* Modal Content */}
            <div className="relative w-full max-w-[360px] !bg-white rounded-[2rem] shadow-2xl overflow-hidden transform transition-all animate-slide-up hover:shadow-primary/10">
                {/* Header Decoration */}
                <div className="h-28 !bg-gradient-to-br from-primary/10 via-primary/5 to-transparent flex items-center justify-center relative overflow-hidden">
                    {/* Decorative blobs */}
                    <div className="absolute top-0 right-0 w-32 h-32 !bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 !bg-primary/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative w-16 h-16 !bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mt-8 animate-bounce-slow">
                        <Icon icon="solar:bell-bing-bold-duotone" className="text-4xl" />
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 pt-10 text-center">
                    <h3 className="text-2xl font-black text-text-main mb-3 font-['Outfit'] tracking-tight">
                        Cập nhật tức thời!
                    </h3>
                    <p className="text-sm font-medium text-text-muted mb-8 leading-relaxed !px-2">
                        Bật thông báo ngay để không bỏ lỡ bài tập mới, phản hồi từ giáo viên và các cập nhật quan trọng.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={handleEnable}
                            className="w-full !py-4 !px-6 !bg-primary text-white text-sm font-black rounded-2xl hover:!bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            <Icon icon="solar:notification-lines-remove-bold-duotone" className="text-lg group-hover:hidden" />
                            <Icon icon="solar:bell-bing-bold-duotone" className="text-lg hidden group-hover:block" />
                            Cho phép thông báo
                        </button>
                        
                        <button
                            onClick={handleDismiss}
                            className="w-full !py-3.5 !px-6 !bg-transparent text-text-muted text-sm font-bold rounded-2xl hover:!bg-surface transition-all active:scale-95"
                        >
                            Để sau báo nhé
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PushPermissionModal;
