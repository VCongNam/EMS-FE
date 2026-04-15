import React, { createContext, useContext, useEffect, useState } from 'react';
import connection from '../services/signalRService';
import { notificationService } from '../features/notifications/api/notificationService'; 
import useAuthStore from '../store/authStore'; 
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    
    // 1. Lấy thông tin user (chứa token) từ Zustand
    const { user } = useAuthStore(); 

    useEffect(() => {
        const token = user?.token;
        
        // Nếu không có token (chưa đăng nhập), thì không làm gì cả
        if (!token) return; 

        // 2. Lấy số lượng Badge
        const loadInitialBadge = async () => {
            try {
                // Truyền thẳng cái token lấy từ store vào đây
                const response = await notificationService.getUnreadCount(token); 
                if (response.ok) {
                    const data = await response.json();
                    setUnreadCount(data.count);
                    console.log("Dữ liệu Badge cũ đã load xong:", data.count);
                }
            } catch (error) {
                console.error("Lỗi khi lấy số thông báo chưa đọc:", error);
            }
        };

        // 3. Khởi tạo SignalR
        const startSignalR = async () => {
            try {
                if (connection.state === "Disconnected") {
                    await connection.start();
                    console.log("SignalR đã sẵn sàng nhận tin mới!");
                }
            } catch (err) {
                console.error("SignalR Connection Error: ", err);
            }
        };

        // 4. Chạy theo thứ tự: API Load -> SignalR Start
        loadInitialBadge().then(() => {
            startSignalR();
        });

        // 5. Đăng ký lắng nghe
        connection.on("ReceiveNotification", (data) => {
            setUnreadCount(prev => prev + 1);
            toast.info(`${data.title}: ${data.content}`);
        });

        // Cleanup
        return () => {
            connection.off("ReceiveNotification");
        };
        
    // Chú ý: Đưa user?.token vào array dependency để nó tự động chạy khi bạn đổi tài khoản
    }, [user?.token]); 

    return (
        <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);