![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple)
![License](https://img.shields.io/badge/license-MIT-green)

# Genetix DNA Testing Platform - Frontend

> **Software Development Project (SWP391)**  
> FPT University Ho Chi Minh Campus  
> Class: SE1856 - Group 3

Genetix là nền tảng dịch vụ xét nghiệm DNA hiện đại, hỗ trợ khách hàng đăng ký, quản lý, và theo dõi quá trình xét nghiệm DNA phục vụ các mục đích dân sự và hành chính.

Repository này chứa **frontend application** của dự án, được xây dựng với React + Vite.

---

## 🚀 Tính năng nổi bật

- **Đăng ký & Đăng nhập:**  
  Hỗ trợ đăng nhập thông thường và Google OAuth, bảo mật thông tin người dùng với xác minh OTP qua email.

- **Đặt lịch xét nghiệm DNA:**

  - Xét nghiệm dân sự (không pháp lý) cho mục đích cá nhân, gia đình.
  - Xét nghiệm hành chính (hợp lệ cho giấy tờ, nhập cư, tòa án).
  - Theo dõi trạng thái từng đơn hàng: Awaiting Confirmation → Pending Payment → Booking Confirmed → Awaiting Sample → In Progress → Completed hoặc Cancelled.

- **Thanh toán online qua VNPay:**  
  Tích hợp thanh toán qua VNPay.

- **Quản lý kết quả & tải báo cáo:**  
  Xem kết quả online, tải về file PDF, tra cứu lịch sử xét nghiệm.

- **Chuyên mục kiến thức & blog:**  
  Các bài viết về DNA, kinh nghiệm thực tế, pháp luật liên quan.

- **Quản trị hệ thống:**  
  Dashboard quản lý khách hàng, booking, dịch vụ, kho kit, tài khoản, log hệ thống.

---

## 🛠️ Công nghệ sử dụng

### Frameworks & UI Libraries

- React 18.3.1, Vite 6.3.5, Tailwind CSS 4.1.8
- Ant Design 5.25.3, @ant-design/plots
- Redux Toolkit, React Router DOM
- Formik + Yup, Axios

### PDF, Charts, Auth & Others

- jsPDF, pdfmake
- recharts, @ant-design/plots
- Google OAuth (`@react-oauth/google`)

---

## 📦 Backend API

Dự án này sử dụng RESTful API từ Genetix Backend (Spring Boot). Bạn có thể tham khảo thêm hoặc cài đặt backend tại:

[https://github.com/baothanh4/swp391](https://github.com/baothanh4/swp391)

---

## ⚡ Cài đặt & chạy thử nghiệm

1. **Yêu cầu:**

   Node.js >= 18, npm >= 9

2. **Clone dự án:**

   ```bash
   git clone https://github.com/SharonNg1029/SWP391.git
   cd SWP391
   ```

   Hoặc nếu bạn đã có quyền truy cập repository mới:

   ```bash
   git clone https://github.com/SharonNg1029/fptu-fall2025-swp391.git
   cd fptu-fall2025-swp391/"Source Code"/Front_End/SWP391_Topic2
   ```

3. **Cài đặt dependencies:**

   ```bash
   npm install
   ```

   > **Lưu ý:** Nếu gặp lỗi khi cài đặt, thử xóa `node_modules` và `package-lock.json` rồi cài lại:
   >
   > ```bash
   > rm -rf node_modules package-lock.json
   > npm install
   > ```
   >
   > Hoặc trên Windows PowerShell:
   >
   > ```powershell
   > Remove-Item -Recurse -Force node_modules, package-lock.json
   > npm install
   > ```

4. **Cấu hình environment variables:**

   Sao chép file `.env.example` thành `.env`:

   **Trên Linux/MacOS:**

   ```bash
   cp .env.example .env
   ```

   **Trên Windows (PowerShell):**

   ```powershell
   Copy-Item .env.example .env
   ```

   Sau đó mở file `.env` và cập nhật các giá trị sau:

   ```env
   # URL của Backend API (đã bao gồm /api)
   VITE_API_BASE_URL=http://103.90.227.214:8080/api

   # URL gốc của Backend (không có /api) - dùng cho Vite proxy
   VITE_API_PROXY_TARGET=http://103.90.227.214:8080

   # Google OAuth Client ID - lấy từ Google Cloud Console
   # https://console.cloud.google.com/apis/credentials
   VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id-here
   ```

   **Hướng dẫn lấy Google OAuth Client ID:**

   1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
   2. Tạo hoặc chọn một project
   3. Vào **APIs & Services** → **Credentials**
   4. Click **Create Credentials** → **OAuth 2.0 Client ID**
   5. Chọn **Web application**
   6. Thêm **Authorized JavaScript origins**: `http://localhost:5173`
   7. Thêm **Authorized redirect URIs**: `http://localhost:5173`
   8. Copy Client ID và paste vào file `.env`

   > **Quan trọng:** File `.env` chứa thông tin nhạy cảm và đã được thêm vào `.gitignore`. **KHÔNG commit file này lên Git!**

5. **Chạy ứng dụng (Development Mode)**

   ```bash
   npm run dev
   ```

   Ứng dụng sẽ chạy tại: [http://localhost:5173](http://localhost:5173)

   Vite sẽ tự động reload khi bạn thay đổi code (Hot Module Replacement).

6. **Build cho Production:**

   ```bash
   npm run build
   ```

   File build sẽ được tạo trong thư mục `dist/`. Để preview production build:

   ```bash
   npm run preview
   ```

7. **Các lệnh hữu ích khác:**

   ```bash
   # Kiểm tra lỗi ESLint
   npm run lint

   # Format code (nếu có Prettier)
   npm run format

   # Xem phiên bản packages
   npm list --depth=0
   ```

---

## 🧬 Cấu trúc thư mục chính

```
SWP391_Topic2/
├── public/                 # Static assets
│   └── images/            # Logo, icons, banners
│
├── src/
│   ├── app/               # Redux store configuration
│   │   └── store.js       # Root store setup
│   │
│   ├── assets/            # Images, SVGs, fonts
│   │
│   ├── components/        # Reusable React components
│   │   ├── authen-form/   # Login, Register, Logout forms
│   │   ├── authen-template/ # Authentication layout wrapper
│   │   ├── dashboard-*/   # Dashboard components for Admin/Manager/Staff
│   │   ├── footer/        # Footer component
│   │   ├── header/        # Header with navigation
│   │   ├── home-content/  # Home page sections
│   │   ├── hooks/         # Custom React hooks
│   │   ├── routes/        # Route guards (ProtectedRoute)
│   │   └── verify-otp/    # OTP verification components
│   │
│   ├── configs/           # App configuration
│   │   └── axios.js       # Axios instance, interceptors, auth helpers
│   │
│   ├── pages/             # Page components (route endpoints)
│   │   ├── booking/       # DNA test booking page
│   │   ├── dashboard-*/   # Admin/Manager/Staff dashboards
│   │   ├── feedback/      # Customer feedback page
│   │   ├── home-page/     # Homepage with blog, guide, services, pricing
│   │   ├── login/         # Login page
│   │   ├── my-booking/    # Customer booking history
│   │   ├── profile/       # User profile management
│   │   └── register/      # Registration page
│   │
│   ├── redux/             # Redux state management
│   │   ├── features/      # Redux slices (userSlice)
│   │   └── reducers/      # Root reducer
│   │
│   ├── utils/             # Utility functions
│   │
│   ├── App.jsx            # Main App component with routes
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles (Tailwind)
│
├── .env                   # Environment variables (NOT in Git)
├── .env.example           # Environment template
├── .gitignore             # Git ignore rules
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

### Giải thích các thư mục quan trọng:

- **`components/`**: Các component tái sử dụng, không phụ thuộc route
- **`pages/`**: Các component được gắn với routes cụ thể
- **`configs/`**: Cấu hình Axios, API endpoints, auth helpers
- **`redux/`**: Quản lý state toàn cục (user info, authentication)
- **`app/`**: Redux store configuration

---

## 💡 Một số tài khoản mẫu

Để test hệ thống, bạn có thể sử dụng các tài khoản sau:

- **Admin (Quản trị viên):**

  - Username: `ngannguyen`
  - Password: `ngannguyen`
  - Quyền: Quản lý toàn bộ hệ thống, tài khoản, dịch vụ, system logs

- **Manager (Quản lý):**

  - Username: `hogiabao`
  - Password: `bao`
  - Quyền: Quản lý inventory, xem báo cáo, phản hồi khách hàng, theo dõi quy trình testing

- **Staff (Nhân viên):**

  - Username: `nganle`
  - Password: `ngan`
  - Quyền: Xử lý đơn hàng, quản lý kết quả xét nghiệm, báo cáo công việc

- **Customer (Khách hàng):**
  - Username: `xuanloc`
  - Password: `loc`
  - Quyền: Đặt lịch xét nghiệm, xem kết quả, thanh toán, quản lý hồ sơ cá nhân

> **Lưu ý:**
>
> - Bạn có thể đăng ký tài khoản mới (role mặc định: Customer)
> - Hỗ trợ đăng nhập bằng Google OAuth
> - Mật khẩu phải có ít nhất 6 ký tự

---

## 🔧 Troubleshooting (Xử lý lỗi thường gặp)

### 1. Lỗi kết nối API (Network Error)

```
Network error. Please check your connection.
```

**Giải pháp:**

- Kiểm tra Backend API có đang chạy không
- Xác nhận `VITE_API_BASE_URL` trong file `.env` đúng
- Kiểm tra CORS configuration trên Backend
- Thử truy cập trực tiếp: `http://103.90.227.214:8080/api`

### 2. Google Login không hoạt động

```
Google login failed! Please try again.
```

**Giải pháp:**

- Kiểm tra `VITE_GOOGLE_CLIENT_ID` trong file `.env`
- Xác nhận Authorized JavaScript origins trong Google Cloud Console
- Clear browser cache và cookies
- Thử trình duyệt ẩn danh (Incognito)

### 3. Build fails hoặc Module not found

```
Error: Cannot find module 'xxx'
```

**Giải pháp:**

```bash
# Xóa và cài lại dependencies
rm -rf node_modules package-lock.json
npm install

# Hoặc Windows PowerShell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

### 4. Port 5173 đã được sử dụng

```
Port 5173 is in use
```

**Giải pháp:**

- Đổi port trong `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000, // hoặc port khác
  },
});
```

- Hoặc kill process đang dùng port 5173

### 5. Environment variables không load

```
import.meta.env.VITE_XXX is undefined
```

**Giải pháp:**

- Đảm bảo biến bắt đầu với `VITE_`
- Restart dev server sau khi thay đổi `.env`
- Kiểm tra file `.env` có ở đúng thư mục root không

---

## 💬 Liên hệ & đóng góp

- Nếu bạn có ý kiến, góp ý, hoặc phát hiện bug, hãy tạo issue hoặc liên hệ qua [genetixcontactsp@gmail.com](mailto:genetixcontactsp@gmail.com).

---

## 👥 About the Project

Đây là dự án môn **Software Development Project (SWP391)** - Học kỳ Summer 2025  
**Trường:** FPT University Ho Chi Minh Campus  
**Lớp:** SE1856  
**Nhóm:** Group 3

### Project Structure

- **Frontend Repository (this):** React + Vite application
- **Backend Repository:** [https://github.com/baothanh4/swp391](https://github.com/baothanh4/swp391)

---

**© 2025 Genetix DNA Platform - FPT University HCM**
