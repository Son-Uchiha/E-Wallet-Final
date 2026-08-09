import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";

/**
 * Custom Hook useFinance
 * Giúp các Component con truy xuất dữ liệu từ FinanceContext một cách an toàn.
 */
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance phải được dùng bên trong FinanceProvider");
  }
  return context;
};
