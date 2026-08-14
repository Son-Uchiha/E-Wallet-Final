# 💰 E-Wallet - Quản lý Tài chính Cá nhân (ReactJS)

E-Wallet là một ứng dụng Web (Single Page Application) giúp người dùng theo dõi và quản lý thu chi cá nhân một cách trực quan, khoa học. Dự án được xây dựng với kiến trúc Clean Architecture kết hợp sức mạnh của React Hook và Tailwind CSS.

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
  - **Thuật toán Smart Delete (Xóa mềm):** Bảo vệ tính toàn vẹn dữ liệu. Nếu danh mục đã có giao dịch trong quá khứ, hệ thống sẽ ẩn đi thay vì xóa vĩnh viễn, tránh làm hỏng báo cáo thống kê.

- **💾 Lưu trữ Cục bộ (Local Storage):**
  - Mọi dữ liệu được tự động lưu vào trình duyệt. Người dùng không lo mất dữ liệu khi F5 (Tải lại trang).
  - Tích hợp sẵn Seed Data (Dữ liệu mẫu) cho lần chạy đầu tiên.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS (Tùy biến Design System với các token màu sắc HSL)
- **State Management:** React Context API + Custom Hooks (`useFinance`)
- **Lưu trữ:** Web `localStorage` API

---

## 📂 Cấu trúc thư mục (Folder Structure)

Kiến trúc thư mục được chia nhỏ theo từng Component đảm bảo tính tái sử dụng và dễ bảo trì:

```text
src/
├── components/          # Chứa tất cả các khối giao diện (UI)
│   ├── categories/      # Component liên quan đến Danh mục (List, Form)
│   ├── layout/          # Component bố cục (Dashboard, Header)
│   ├── shared/          # Component dùng chung (Modal, Bảng báo cáo)
│   └── transactions/    # Component liên quan đến Giao dịch (List, Form)
├── context/             # Nơi định nghĩa Context và State toàn cục
│   ├── FinanceContext.js
│   └── FinanceProvider.jsx
├── hooks/               # Custom Hooks
│   └── useFinance.js    # Hook siêu nạp kết nối UI với Kho dữ liệu
├── utils/               # Các hàm tiện ích (Helper)
│   └── storage.js       # Xử lý đọc/ghi LocalStorage
├── App.jsx              # Khối lắp ghép giao diện Root
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
- Hệ thống UI Components được thiết kế không phụ thuộc (Decoupled) vào Logic nhờ việc tách lớp Data Layer (Context) hoàn toàn độc lập.

---

_Phát triển bởi Son-Uchiha - 2026_
