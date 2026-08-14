# 💰 Ứng Dụng Quản Lý Chi Tiêu (E-Wallet)

Một ứng dụng web giúp người dùng theo dõi và quản lý tài chính cá nhân một cách dễ dàng và hiệu quả. Ứng dụng cung cấp cái nhìn tổng quan về dòng tiền, giúp người dùng ghi chép lại các giao dịch và quản lý danh mục thu chi khoa học.

## ✨ Tính năng chính

- **📊 Bảng Điều Khiển (Dashboard):** Xem nhanh tổng quan về Số dư hiện tại, Tổng thu nhập và Tổng chi tiêu.
- **💸 Quản Lý Giao Dịch:** 
  - Thêm mới các giao dịch thu hoặc chi.
  - Gán giao dịch cho từng danh mục cụ thể.
- **📁 Quản Lý Danh Mục:** Xem và quản lý các danh mục chi tiêu/thu nhập.
- **📝 Lịch Sử Giao Dịch:** Danh sách chi tiết toàn bộ các giao dịch đã thực hiện, giúp dễ dàng rà soát lại biến động số dư.

## 🚀 Công nghệ sử dụng

- **Thư viện chính:** [React.js](https://react.dev/) (v19)
- **Công cụ build:** [Vite](https://vitejs.dev/)
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Quản lý State:** React Context API

## 🛠️ Cài đặt và Chạy cục bộ

Làm theo các bước sau để chạy dự án trên máy của bạn:

1. **Clone dự án (Nếu dùng Git):**
   ```bash
   git clone <repository-url>
   cd E-Wallet-Final
   ```

2. **Cài đặt thư viện:**
   Mở terminal tại thư mục dự án và chạy lệnh:
   ```bash
   npm install
   ```

3. **Khởi chạy Development Server:**
   ```bash
   npm run dev
   ```

4. **Trải nghiệm ứng dụng:**
   Mở trình duyệt và truy cập vào đường dẫn: `http://localhost:5173`

## 📦 Các câu lệnh (Scripts) có sẵn

- `npm run dev`: Khởi chạy môi trường phát triển cục bộ.
- `npm run build`: Đóng gói (build) ứng dụng với cấu hình tối ưu để chuẩn bị đưa lên production.
- `npm run preview`: Xem thử bản build production chạy thực tế ở local.
- `npm run lint`: Chạy ESLint để kiểm tra và phát hiện các lỗi cú pháp/logic trong code.

## 📂 Cấu trúc thư mục cơ bản

```text
src/
├── components/     # Chứa các component giao diện (layout, giao dịch, danh mục, v.v.)
├── context/        # Chứa Context API để quản lý state toàn cục (vd: FinanceContext)
├── hooks/          # Chứa các custom hooks tái sử dụng
├── utils/          # Các hàm hỗ trợ (format tiền tệ, xử lý ngày tháng, ...)
├── App.jsx         # Component gốc định nghĩa cấu trúc layout chính của trang
├── main.jsx        # Điểm khởi chạy của ứng dụng React
└── index.css       # Các cấu hình style toàn cục và Tailwind
```
