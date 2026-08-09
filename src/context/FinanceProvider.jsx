import { useMemo, useState } from "react";
import { FinanceContext } from "./FinanceContext";

// Hàm hỗ trợ lấy tháng hiện tại theo dạng "YYYY-MM" (VD: "2026-08")
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

// ==========================================
// PROVIDER CHÍNH (FINANCE PROVIDER)
// ==========================================
export const FinanceProvider = ({ children }) => {
  // KHỞI TẠO STATE TOÀN CỤC
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  // Đóng gói tất cả state và actions vào biến value để truyền xuống các Component con
  const value = useMemo(
    () => ({
      selectedMonth,
      setSelectedMonth,
    }),
    [selectedMonth],
  );

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};
