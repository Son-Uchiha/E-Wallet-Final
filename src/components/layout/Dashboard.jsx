import { useState } from "react";
import { useFinance } from "../../hooks/useFinance";

/**
 * Hàm hỗ trợ định dạng số tiền (Ví dụ: 1000000 -> "1.000.000₫")
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
};
/**
 * Component Dashboard - Bảng điều khiển tổng quan
 * Chứa các thẻ thông tin quan trọng: Số dư hiện tại, Tổng Thu/Chi, và Tiến độ Ngân sách tháng
 */
const Dashboard = () => {
  // 1. Lấy các dữ liệu số dư, thu chi, ngân sách từ Custom Hook useFinance
  const { totalIncome, totalExpense, balance, budgetTotal, setBudgetTotal } = useFinance();

  // 2. State cục bộ để quản lý việc bật/tắt ô nhập "Chỉnh sửa ngân sách"
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  // 3. TÍNH TOÁN TIẾN ĐỘ NGÂN SÁCH
  // spentPercent: Tỷ lệ % số tiền đã tiêu so với Ngân sách (Ví dụ: Tiêu 5tr / Ngân sách 10tr = 50%)
  const spentPercent = budgetTotal > 0 ? (totalExpense / budgetTotal) * 100 : 0;
  // isOverBudget: Kiểm tra xem đã tiêu VƯỢT quá ngân sách cho phép chưa
  const isOverBudget = totalExpense > budgetTotal && budgetTotal > 0;

  /**
   * Xử lý lưu ngân sách mới vào hệ thống
   */
  const handleBudgetSave = () => {
    const val = Number(budgetInput);
    if (val > 0) {
      setBudgetTotal(val);
    }
    setIsEditingBudget(false); // Đóng ô input sau khi lưu
  };

  /**
   * Hỗ trợ bấm phím Enter để lưu, hoặc Escape để hủy gõ
   */
  const handleBudgetKeyDown = (e) => {
    if (e.key === "Enter") handleBudgetSave();
    if (e.key === "Escape") setIsEditingBudget(false);
  };
  return (
    <div>
      {" "}
      <div className="flex w-full flex-1 flex-col justify-between">
        {/* 
        1. THẺ SỐ DƯ HIỆN TẠI (HERO BALANCE CARD) 
        - Được thiết kế nổi bật với hiệu ứng gradient và bóng đổ shadow
      */}
        <div className="from-primary via-primary to-primary-deep relative overflow-hidden rounded-4xl bg-linear-to-br p-8 shadow-[0_20px_40px_-15px_rgba(79,70,229,0.4)]">
          {/* Các hình tròn trang trí mờ nền (Glass shapes blur) */}
          <div className="absolute -top-12 -right-12 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-xl" />
          {/* Họa tiết chấm bi chìm (Mesh pattern) */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          ></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <p className="mb-2 text-sm font-medium tracking-wide text-white/80 uppercase">Số dư hiện tại</p>
            <h2 className="text-4xl font-black tracking-tight text-white drop-shadow-sm sm:text-5xl">
              {/* Hiển thị dấu trừ (-) nếu balance bị âm (Tiêu nhiều hơn Thu) */}
              {balance >= 0 ? "" : "-"}
              {formatCurrency(Math.abs(balance))}
            </h2>
          </div>
        </div>
        {/* 
        2. HAI THẺ THU NHẬP / CHI TIÊU (INCOME / EXPENSE ROW) 
      */}
        <div className="mt-6 mb-6 grid grid-cols-2 gap-5">
          {/* Thẻ Tổng Thu Nhập */}
          <div className="card-premium p-5 transition-transform duration-300 hover:-translate-y-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-income-bg flex h-12 w-12 items-center justify-center rounded-2xl">
                <svg
                  className="text-income h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <span className="text-text-secondary text-sm font-semibold tracking-wide uppercase">Thu nhập</span>
            </div>
            <p className="text-text text-2xl font-extrabold">{formatCurrency(totalIncome)}</p>
          </div>
          {/* Thẻ Tổng Chi Tiêu */}
          <div className="card-premium p-5 transition-transform duration-300 hover:-translate-y-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="bg-expense-bg flex h-12 w-12 items-center justify-center rounded-2xl">
                <svg
                  className="text-expense h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              </div>
              <span className="text-text-secondary text-sm font-semibold tracking-wide uppercase">Chi tiêu</span>
            </div>
            <p className="text-text text-2xl font-extrabold">{formatCurrency(totalExpense)}</p>
          </div>
        </div>
        {/* 
        3. KHỐI THEO DÕI NGÂN SÁCH (BUDGET PROGRESS) 
      */}
        <div className="card-premium p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-text text-sm font-bold tracking-wide uppercase">Ngân sách tháng</span>
            {/* Chế độ: Nhập số tiền mới (Input) hay Hiển thị số tiền (Text) */}
            {isEditingBudget ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  onKeyDown={handleBudgetKeyDown}
                  placeholder="Nhập..."
                  className="bg-surface-alt border-border/50 text-text focus:ring-primary/20 focus:border-primary w-32 rounded-xl border px-3 py-1.5 text-sm font-semibold transition-all focus:ring-2 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleBudgetSave}
                  className="bg-primary hover:bg-primary-deep shadow-primary/20 cursor-pointer rounded-xl px-4 py-1.5 text-xs font-bold text-white shadow-md transition-colors"
                >
                  Lưu
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setBudgetInput(String(budgetTotal));
                  setIsEditingBudget(true);
                }}
                className="text-primary hover:text-primary-deep hover:bg-primary-bg flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-bold transition-colors"
                title="Nhấp để sửa ngân sách"
              >
                {formatCurrency(budgetTotal)}
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
          </div>
          {/* Thanh Tiến trình Ngân sách (Progress Bar) */}
          <div className="bg-surface-alt mb-3 h-4 w-full overflow-hidden rounded-full shadow-inner">
            <div
              className={`relative h-full rounded-full transition-all duration-1000 ease-out ${
                isOverBudget
                  ? "from-expense to-expense-light bg-linear-to-r" // Vượt 100%: Đỏ
                  : spentPercent > 80
                    ? "from-warning bg-linear-to-r to-yellow-400" // 80% - 100%: Vàng
                    : "from-primary to-primary-light bg-linear-to-r" // < 80%: Tím (An toàn)
              }`}
              style={{ width: `${Math.min(spentPercent, 100)}%` }}
            >
              {/* Hiệu ứng chớp sáng Shimmer */}
              <div className="absolute inset-0 h-full w-full translate-x-[-100%] -skew-x-12 animate-[shimmer_2s_infinite] bg-white/20"></div>
            </div>
          </div>
          {/* Phụ đề dưới thanh tiến trình */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-text text-sm font-semibold">
              {formatCurrency(totalExpense)} <span className="text-text-dim font-medium">đã tiêu</span>
            </span>

            <span
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold ${isOverBudget ? "text-expense bg-expense-bg border-expense/20" : "text-primary bg-primary-bg border-primary/20"}`}
            >
              {budgetTotal > 0
                ? isOverBudget
                  ? `Vượt ${Math.round(spentPercent - 100)}%`
                  : `Đạt ${Math.round(spentPercent)}%`
                : "Chưa đặt ngân sách"}
            </span>
          </div>
        </div>
        <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%) skewX(-12deg); }
        }
      `}</style>
      </div>
    </div>
  );
};

export default Dashboard;
