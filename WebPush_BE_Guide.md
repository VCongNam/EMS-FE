# Tài liệu Tích hợp Web Push Notification (Dành cho Backend)

Hệ thống EMS sử dụng chuẩn **Web Push API (W3C)**. Điều này cho phép gửi thông báo đến trình duyệt (Chrome, Safari, Edge...) ngay cả khi người dùng đã đóng web.

---

## 1. Công nghệ khuyến nghị
- **Ngôn ngữ:** .NET / C#
- **Thư viện:** [WebPush-Net](https://github.com/ivvany/WebPush-Net) (NuGet package: `WebPush`)
- **Giao thức:** VAPID (Voluntary Application Server Identification)

---

## 2. Bước 1: Khởi tạo VAPID Keys
Server cần một cặp khóa Public/Private để định danh với các Push Service (Google, Apple...).

**Cách tạo:**
Bạn có thể dùng tool online hoặc chạy lệnh trong thư viện `WebPush` để tạo.
- **Vapid Public Key:** Gửi cho Frontend (FE).
- **Vapid Private Key:** Giữ bí mật ở Server (file `.env` hoặc `appsettings.json`).
- **Subject:** Một chuỗi `mailto:your-email@example.com`.

---

## 3. Bước 2: Cấu trúc cơ sở dữ liệu
Một người dùng có thể đăng ký nhận thông báo trên nhiều thiết bị (Laptop, Điện thoại). Do đó, cần lưu trữ danh sách các Subscription.

**Bảng `PushSubscriptions`:**
| Trường | Kiểu dữ liệu | Mô tả |
|--------|--------------|-----------|
| Id | Guid / Int | Primary Key |
| UserId | Guid / Int | Foreign Key (liên kết với bảng User) |
| Endpoint | String (Long Text) | Unique (URL riêng của thiết bị) |
| P256dh | String | Key mã hóa của trình duyệt |
| Auth | String | Token xác thực của trình duyệt |
| CreatedAt | DateTime | Thời gian đăng ký |

---

## 4. Bước 3: Danh sách API Endpoints cần thiết

FE đã cài đặt sẵn code để gọi các endpoint sau:

### 4.1. Lấy Public Key
- **Method:** `GET`
- **Endpoint:** `/api/Push/vapid-public-key`
- **Response:** `{ "publicKey": "..." }`

### 4.2. Đăng ký thiết bị (Subscribe)
- **Method:** `POST`
- **Endpoint:** `/api/Push/subscribe`
- **Body (Subscription Object):**
```json
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  }
}
```
- **Logic:** Server nhận object này, lưu vào bảng `PushSubscriptions`. Nếu `endpoint` đã tồn tại cho User này thì cập nhật `keys`.

### 4.3. Hủy đăng ký (Unsubscribe)
- **Method:** `POST`
- **Endpoint:** `/api/Push/unsubscribe`
- **Body:** `{ "endpoint": "..." }`
- **Logic:** Xóa record có endpoint tương ứng cho user hiện tại.

---

## 5. Bước 4: Logic gửi thông báo (Example C#)

Khi có một sự kiện, Server sẽ lấy danh sách thiết bị của User đó và gửi Push qua thư viện `WebPush`.

```csharp
var vapidDetails = new VapidDetails("mailto:admin@ems.local", "PUBLIC_KEY", "PRIVATE_KEY");
var webPushClient = new WebPushClient();

// Lấy danh sách sub của User từ DB
var subs = await _context.PushSubscriptions.Where(s => s.UserId == userId).ToListAsync();

foreach (var sub in subs)
{
    var pushSub = new PushSubscription(sub.Endpoint, sub.P256dh, sub.Auth);
    
    // Payload là JSON (FE đã viết sw.js để hiểu các field này)
    var payload = JsonConvert.SerializeObject(new {
        title = "Thông báo bài tập",
        content = "Bạn có bài tập mới: Lab 4",
        url = "/student/assignments" // Link khi click vào thông báo
    });

    try {
        await webPushClient.SendNotificationAsync(pushSub, payload, vapidDetails);
    } catch (WebPushException ex) {
        if (ex.StatusCode == (HttpStatusCode)410 || ex.StatusCode == (HttpStatusCode)404) {
            // Subscription hết hạn hoặc bị user chặn -> Xóa khỏi DB
            _context.PushSubscriptions.Remove(sub);
        }
    }
}
await _context.SaveChangesAsync();
```

---

## 6. Lưu ý quan trọng
1. **HTTPS:** Web Push chỉ hoạt động trên HTTPS.
2. **Expired Subscriptions:** Backend **bắt buộc** xóa record nếu gặp lỗi 410 Gone để tránh lỗi khi gửi các đợt sau.
3. **Payload:** File `sw.js` ở FE đang chờ nhận các field: `title`, `content`, và `url`. Hãy gửi đúng tên field.
