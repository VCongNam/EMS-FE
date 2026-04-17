import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import connection from '../services/signalRService';
import { notificationService } from '../features/notifications/api/notificationService'; 
import useAuthStore from '../store/authStore'; 
import { toast } from 'react-toastify';
import { pushService } from '../services/pushService';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isPushSupported, setIsPushSupported] = useState(false);
    const [isPushSubscribed, setIsPushSubscribed] = useState(false);
    
    const { user } = useAuthStore(); 

    // Hàm đăng ký Push Notification
    const subscribeToPush = useCallback(async (token) => {
        if (!pushService.isSupported()) return;

        try {
            // 1. Kiểm tra quyền
            if (Notification.permission !== 'granted') return;

            // 2. Lấy Public Key từ Backend
            const keyResponse = await notificationService.getVapidPublicKey(token);
            if (!keyResponse.ok) return;
            const { publicKey } = await keyResponse.json();

            // 3. Đăng ký với Push Service (Google/Apple...)
            const subscription = await pushService.subscribeUser(publicKey);

            // 4. Lưu subscription vào Backend
            await notificationService.saveSubscription(subscription, token);
            setIsPushSubscribed(true);
            console.log("Web Push đã được kích hoạt.");
        } catch (error) {
            console.error("Lỗi khi khởi tạo Web Push:", error);
        }
    }, []);

    useEffect(() => {
        const token = user?.token;
        if (!token) return; 

        setIsPushSupported(pushService.isSupported());

        const loadInitialBadge = async () => {
            try {
                const response = await notificationService.getUnreadCount(token); 
                if (response.ok) {
                    const data = await response.json();
                    setUnreadCount(data.count);
                }
            } catch (error) {
                console.error("Lỗi khi lấy số thông báo chưa đọc:", error);
            }
        };

        const startSignalR = async () => {
            try {
                if (connection.state === "Disconnected") {
                    await connection.start();
                    console.log("SignalR sẵn sàng!");
                }
            } catch (err) {
                console.error("SignalR Connection Error: ", err);
            }
        };

        // Chạy lần lượt
        loadInitialBadge()
            .then(() => startSignalR())
            .then(() => {
                // Tự động thử đăng ký Push nếu đã có quyền
                if (Notification.permission === 'granted') {
                    subscribeToPush(token);
                }
            });

        connection.on("ReceiveNotification", (data) => {
            setUnreadCount(prev => prev + 1);
            toast.info(`${data.title}: ${data.content}`);
        });

        return () => {
            connection.off("ReceiveNotification");
        };
        
    }, [user?.token, subscribeToPush]); 

    // Hàm yêu cầu quyền từ UI
    const requestPushPermission = async () => {
        const permission = await pushService.requestPermission();
        if (permission === 'granted' && user?.token) {
            await subscribeToPush(user.token);
        }
        return permission;
    };

    return (
        <NotificationContext.Provider value={{ 
            unreadCount, 
            setUnreadCount, 
            isPushSupported, 
            isPushSubscribed,
            requestPushPermission 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);