# Genetix DNA Testing Platform

Genetix là nền tảng dịch vụ xét nghiệm DNA hiện đại, hỗ trợ khách hàng đăng ký, quản lý, và theo dõi quá trình xét nghiệm DNA phục vụ các mục đích dân sự, hành chính và pháp lý.

---

## 🚀 Tính năng nổi bật

- **Đăng ký & Đăng nhập:**  
  Hỗ trợ đăng nhập thông thường và Google OAuth, bảo mật thông tin người dùng với xác minh OTP qua email.

- **Đặt lịch xét nghiệm DNA:**  
  - Xét nghiệm dân sự (không pháp lý) cho mục đích cá nhân, gia đình.
  - Xét nghiệm hành chính, pháp lý (hợp lệ cho giấy tờ, nhập cư, tòa án).
  - Theo dõi trạng thái từng đơn hàng: Đang chờ thanh toán → Đã thanh toán → Chờ lấy mẫu → Đang xét nghiệm → Hoàn thành.

- **Thanh toán QR đa nền tảng:**  
  Tích hợp QR code thanh toán qua Momo, VNPay, banking app.

- **Quản lý kết quả & tải báo cáo:**  
  Xem kết quả online, tải về file PDF, tra cứu lịch sử xét nghiệm.

- **Chuyên mục kiến thức & blog:**  
  Đọc, bình luận, gửi bài viết về DNA, kinh nghiệm thực tế, pháp luật liên quan.

- **Quản trị hệ thống:**  
  Dashboard quản lý khách hàng, booking, dịch vụ, kho kit, tài khoản, log hệ thống.

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** ReactJS, Redux Toolkit, Ant Design, Tailwind CSS, React Router, React Toastify, React Hot Toast, Lucide React, React Icons.
- **Backend:** (API endpoint mẫu, chưa kèm source backend)
- **Authentication:** Google OAuth, xác thực JWT, xác minh OTP qua email.
- **Quản lý state:** Redux + Redux Persist.
- **Build Tool:** Vite.

---

## ⚡ Cài đặt & chạy thử nghiệm

1. **Yêu cầu:**  
   Node.js >= 18, npm >= 9

2. **Clone dự án:**
   ```bash
   git clone https://github.com/SharonNg1029/SWP391.git
   cd SWP391
   ```

3. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

4. **Cấu hình endpoint API:**  
   Sửa `src/configs/axios.js` nếu muốn trỏ sang backend khác.

5. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```
   Truy cập: [http://localhost:5173](http://localhost:5173)

---

## 🧬 Cấu trúc thư mục chính

```
src/
  ├── components/         # Các component giao diện (LoginForm, Header, Footer, ...)
  ├── pages/              # Các trang (HomePage, Dashboard, Services, ...)
  ├── redux/              # State management với Redux Toolkit
  ├── configs/            # File cấu hình Axios, Auth helper
  ├── assets/             # Hình ảnh, SVG
  ├── app/                # Store Redux
  └── index.css           # CSS gốc (có Tailwind)
```

---

## 💡 Một số tài khoản mẫu

- **Admin:**  
  - user: `admin` / pass: `admin123`

- **Khách hàng:**  
  - user: `customer01` / pass: `customer123`

> Bạn có thể đăng ký tài khoản mới hoặc thử đăng nhập Google.

---

## 📷 Screenshot

![image1](https://user-images.githubusercontent.com/your_screenshot.png)

---

## 💬 Liên hệ & đóng góp

- Nếu bạn có ý kiến, góp ý, hoặc phát hiện bug, hãy tạo issue hoặc liên hệ qua [genetixcontactsp@gmail.com](mailto:genetixcontactsp@gmail.com).

---

**© 2025 Genetix DNA Platform**
