# 📘 TÀI LIỆU HƯỚNG DẪN CƠ BẢN: REACT CONTEXT API + CUSTOM HOOKS

Đây là công thức chuẩn (Boilerplate) gồm 5 bước để cài đặt Context API cho **MỌI DỰ ÁN REACT**. Cấu trúc này tuân thủ Clean Code, giúp tách biệt Logic và UI, dễ dàng bảo trì và mở rộng.

> **Ví dụ minh họa:** Xây dựng tính năng quản lý Chế độ Sáng/Tối (Theme - Dark/Light Mode).
> *Bạn có thể thay đổi chữ `Theme` thành `Cart` (Giỏ hàng), `User` (Đăng nhập), `Language` (Ngôn ngữ)... để áp dụng cho các bài toán khác.*

---

## BƯỚC 1: TẠO CONTEXT (Cái Kho)
**Mục đích:** Mở một không gian trống ở cấp độ toàn cục để chứa dữ liệu.
**Vị trí file:** `src/context/ThemeContext.js`

```javascript
import { createContext } from "react";

// Thay "ThemeContext" bằng tên kho bạn muốn (VD: UserContext, CartContext)
export const ThemeContext = createContext();
```

---

## BƯỚC 2: TẠO PROVIDER (Người Thủ Kho)
**Mục đích:** Khai báo toàn bộ Logic, State và bọc ứng dụng để phát dữ liệu đi (Provide).
**Vị trí file:** `src/context/ThemeProvider.jsx`

```jsx
import { useState } from "react";
import { ThemeContext } from "./ThemeContext"; // Import từ Bước 1

export const ThemeProvider = ({ children }) => {
  // 1. Khai báo State và Logic xử lý tại đây
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 2. Đóng gói toàn bộ state và hàm vào 1 object `value`
  const value = { theme, toggleTheme };

  // 3. Bọc `children` (các component con) bằng Provider
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

---

## BƯỚC 3: BỌC XUNG QUANH ỨNG DỤNG CHÍNH
**Mục đích:** Đảm bảo mọi component trong dự án đều nằm trong tầm bao phủ của Provider và có thể truy xuất dữ liệu.
**Vị trí file:** `src/main.jsx` (hoặc `src/index.js`, `src/App.jsx`)

```jsx
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeProvider"; // Import từ Bước 2

createRoot(document.getElementById("root")).render(
  // Bọc lớp vỏ Provider ra ngoài cùng
  <ThemeProvider> 
    <App />
  </ThemeProvider>
);
```

---

## BƯỚC 4: TẠO CUSTOM HOOK (Ống Hút Dữ Liệu)
**Mục đích:** Thay vì dùng cú pháp dài dòng `useContext(Context)` ở khắp mọi nơi, ta tạo một Hook riêng để gọi code ngắn gọn hơn và tích hợp cơ chế báo lỗi thông minh.
**Vị trí file:** `src/hooks/useTheme.js`

```javascript
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Import từ Bước 1

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  // Rào chắn báo lỗi: Cảnh báo nếu Dev quên bọc Provider ở Bước 3
  if (!context) {
    throw new Error("useTheme phải được sử dụng bên trong ThemeProvider");
  }
  
  return context; // Trả về biến { theme, toggleTheme }
};
```

---

## BƯỚC 5: SỬ DỤNG Ở BẤT KỲ COMPONENT NÀO (DÙNG TAILWIND CSS)
**Mục đích:** Rút dữ liệu ra sử dụng trực tiếp mà không cần truyền qua Props (Tránh Props Drilling).
**Vị trí file:** Bất kỳ file UI nào, VD: `src/components/Header.jsx`

```jsx
import { useTheme } from "../hooks/useTheme"; // Import Custom Hook từ Bước 4

const Header = () => {
  // Bóc tách dữ liệu cần dùng trực tiếp từ Hook
  const { theme, toggleTheme } = useTheme();

  return (
    <div 
      // Dùng Toán tử 3 ngôi để thay đổi class Tailwind dựa vào State 'theme'
      className={`p-10 text-center transition-colors duration-500 ${
        theme === "dark" 
          ? "bg-slate-900 text-white" 
          : "bg-white text-slate-900"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">
        Chế độ hiện tại: <span className="uppercase text-blue-500">{theme}</span>
      </h2>
      
      <button 
        onClick={toggleTheme}
        className="px-6 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600 active:scale-95 transition-all"
      >
        Đổi giao diện
      </button>
    </div>
  );
};

export default Header;
```

---
*Tài liệu Boilerplate - Được lưu để phục vụ các dự án sau này.*
