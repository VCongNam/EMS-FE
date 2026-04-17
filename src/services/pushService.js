/**
 * Chuyển đổi VAPID public key từ chuỗi Base64 sang Uint8Array
 * @param {string} base64String 
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const pushService = {
    /**
     * Kiểm tra trình duyệt có hỗ trợ Push Notification không
     */
    isSupported: () => {
        return 'serviceWorker' in navigator && 'PushManager' in window;
    },

    /**
     * Lấy quyền thông báo từ người dùng
     */
    requestPermission: async () => {
        if (!('Notification' in window)) {
            console.error("Trình duyệt không hỗ trợ thông báo.");
            return 'denied';
        }
        const permission = await Notification.requestPermission();
        return permission;
    },

    /**
     * Đăng ký mã thiết bị (Subscription)
     * @param {string} vapidPublicKey Khóa Public lấy từ Backend
     */
    subscribeUser: async (vapidPublicKey) => {
        try {
            const registration = await navigator.serviceWorker.ready;
            
            // Kiểm tra xem đã có subscription chưa
            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) {
                return existingSubscription;
            }

            // Nếu chưa có thì tạo mới
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
            });

            console.log("Device subscribed successfully:", subscription);
            return subscription;
        } catch (error) {
            console.error("Failed to subscribe user for push notifications:", error);
            throw error;
        }
    },

    /**
     * Hủy đăng ký
     */
    unsubscribeUser: async () => {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
            await subscription.unsubscribe();
            return subscription;
        }
        return null;
    }
};
