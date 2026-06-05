import { precacheAndRoute } from 'workbox-precaching';

// Dòng này rất quan trọng: VitePWA sẽ "tiêm" danh sách file cần cache vào đây
precacheAndRoute(self.__WB_MANIFEST || []);

// Lắng nghe sự kiện Push từ Server
self.addEventListener('push', (event) => {
    let data = { 
        title: 'Hệ thống EMS', 
        content: 'Bạn có một thông báo mới chưa xem.' 
    };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data = { 
                title: 'Hệ thống EMS', 
                content: event.data.text() 
            };
        }
    }

    const options = {
        body: data.content || data.body,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/'
        },
        // Thêm nút hành động nhanh
        actions: [
            { action: 'open', title: 'Xem chi tiết' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Xử lý khi người dùng nhấn vào thông báo
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Mở URL được truyền từ backend
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            const url = event.notification.data.url;
            
            // Nếu đã có tab đang mở trang này thì focus vào, nếu không thì mở tab mới
            for (const client of clientList) {
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
