# 💰 E-Wallet - Ứng dụng Quản lý Tài chính Cá nhân (React 19)

E-Wallet là một ứng dụng Web (Single Page Application) giúp người dùng theo dõi và quản lý thu chi cá nhân một cách trực quan, khoa học. Dự án được xây dựng với kiến trúc Clean Architecture kết hợp sức mạnh của **React 19** và **Tailwind CSS 4**.

---

## ✨ Tính năng nổi bật (Features)

- **📊 Bảng Điều Khiển (Dashboard):** 
  - Hiển thị số dư hiện tại, tổng thu/chi trong tháng.
  - Thanh tiến trình (Progress bar) theo dõi ngân sách thông minh (Đổi màu cảnh báo khi sắp vượt hoặc đã vượt hạn mức).
  
- **💸 Quản lý Giao dịch (Transactions):**
  - Ghi chép thu/chi theo thời gian thực.
  - Phân loại giao dịch theo danh mục (Ăn uống, Lương, Giải trí...).
  - Tự động chuẩn hóa dữ liệu ngày tháng.

- **📁 Quản lý Danh mục (Categories):**
  - Thêm, sửa hạn mức chi tiêu cho từng danh mục.
  - Theo dõi thanh tiến trình chi tiêu (Tiêu hết bao nhiêu % hạn mức).
  - **Thuật toán Smart Delete (Xóa mềm):** Bảo vệ tính toàn vẹn dữ liệu. Nếu danh mục đã có giao dịch trong quá khứ, hệ thống sẽ ẩn đi thay vì xóa vĩnh viễn, tránh làm hỏng báo cáo thống kê.

- **📈 Báo cáo Tổng hợp (Summary Report):**
  - So sánh chi tiết biến động thu/chi giữa tháng hiện tại và tháng trước.
  - Tự động tính toán số tiền chênh lệch và hiển thị huy hiệu (Badge) tăng/giảm trực quan.

- **💾 Lưu trữ Cục bộ (Local Storage):**
  - Mọi dữ liệu được tự động lưu vào trình duyệt. Người dùng không lo mất dữ liệu khi F5 (Tải lại trang).
  - Tích hợp sẵn Seed Data (Dữ liệu mẫu) cho lần chạy đầu tiên.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Framework & Build Tool:** React 19, Vite 8
- **Styling:** Tailwind CSS 4 (Tùy biến Design System với các token màu sắc HSL)
- **State Management:** React Context API + Custom Hooks (`useFinance`)
- **Lưu trữ:** Web `localStorage` API

---

## 📂 Cấu trúc thư mục (Folder Structure)

Kiến trúc thư mục được chia nhỏ theo từng Component đảm bảo tính tái sử dụng và dễ bảo trì:

```text
src/
├── components/          # Chứa tất cả các khối giao diện (UI)
│   ├── categories/      # CategoryList, CategoryForm
│   ├── layout/          # Dashboard, Header
│   ├── shared/          # ConfirmModal, SummaryTable
│   └── transactions/    # TransactionList, TransactionForm
├── context/             # Định nghĩa Context và State toàn cục
│   ├── FinanceContext.js
│   └── FinanceProvider.jsx
├── hooks/               # Custom Hooks
│   └── useFinance.js    # Hook siêu nạp kết nối UI với Kho dữ liệu
├── utils/               # Các hàm tiện ích (Helper)
│   └── storage.js       # Xử lý đọc/ghi LocalStorage
├── App.jsx              # Khối lắp ghép giao diện Root
├── index.css            # File CSS chứa cấu hình Tailwind 4
└── main.jsx             # Điểm khởi chạy của ứng dụng
```

---

## 🚀 Hướng dẫn cài đặt và chạy thử (Installation & Usage)

Để chạy dự án này trên máy tính của bạn, hãy làm theo các bước sau:

**Bước 1: Clone dự án về máy**
```bash
git clone <đường-dẫn-repo-của-bạn>
cd E-Wallet-Final
```

**Bước 2: Cài đặt thư viện**
```bash
npm install
```

**Bước 3: Chạy môi trường phát triển (Dev Server)**
```bash
npm run dev
```

Sau khi chạy lệnh trên, hãy mở trình duyệt và truy cập vào đường link `http://localhost:5173` để trải nghiệm ứng dụng.

---

## 💡 Ghi chú dành cho nhà phát triển (Developer Notes)
- Ứng dụng tận dụng triệt để `useMemo` và `useCallback` để tối ưu hóa hiệu năng, hạn chế re-render những phép tính tổng thu chi phức tạp khi không cần thiết.
- Hệ thống UI Components được thiết kế không phụ thuộc (Decoupled) vào Logic nhờ việc tách lớp Data Layer (Context) hoàn toàn độc lập thông qua mô hình Clean Architecture.

---
*Phát triển bởi Son-Uchiha - 2026*
