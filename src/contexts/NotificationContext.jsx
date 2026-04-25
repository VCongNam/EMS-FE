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
            console.log("1. [DEBUG-PUSH] Bắt đầu luồng Subscribe...");
            
            if (Notification.permission !== 'granted') {
                console.log("2. [DEBUG-PUSH] Quyền Notification chưa được cấp.");
                return;
            }

            console.log("3. [DEBUG-PUSH] Đang lấy Public Key từ Backend...");
            const keyResponse = await notificationService.getVapidPublicKey(token);
            
            if (!keyResponse.ok) {
                console.log("4. [DEBUG-PUSH] API lấy key thất bại:", keyResponse.status);
                return;
            }
            
            const data = await keyResponse.json();
            // console.log("5. [DEBUG-PUSH] Dữ liệu Key từ BE:", data);
            const publicKey = data.publicKey;

            if (!publicKey) {
                console.error("6. [DEBUG-PUSH] Không tìm thấy trường publicKey trong JSON!");
                return;
            }

            console.log("7. [DEBUG-PUSH] Đang gọi Push Service (Chờ Service Worker ready)...");
            const subscription = await pushService.subscribeUser(publicKey);
            // console.log("8. [DEBUG-PUSH] Đăng ký Push Service thành công:", subscription);

            console.log("9. [DEBUG-PUSH] Đang lưu subscription vào Backend...");
            const saveRes = await notificationService.saveSubscription(subscription, token);
            // console.log("10. [DEBUG-PUSH] Kết quả lưu Backend:", saveRes.status);
            
            if (saveRes.ok) {
                setIsPushSubscribed(true);
                console.log("11. [DEBUG-PUSH] Web Push hoàn tất!");
            } else {
                console.error("11. [DEBUG-PUSH] Backend từ chối lưu subscription.");
            }
        } catch (error) {
            console.error("Lỗi [DEBUG-PUSH]:", error);
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