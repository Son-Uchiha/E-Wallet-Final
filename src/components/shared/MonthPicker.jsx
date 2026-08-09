import { useFinance } from "../../hooks/useFinance";

// Mảng chứa tên hiển thị của 12 tháng bằng tiếng Việt
const MONTH_NAMES = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

/**
 * Component MonthPicker - Bộ chọn Thời gian
 * Cho phép người dùng chuyển tới lui giữa các tháng để xem lịch sử giao dịch.
 */
const MonthPicker = () => {
  // Lấy giá trị selectedMonth (VD: "2026-08") và hàm thay đổi nó từ Context
  const { selectedMonth, setSelectedMonth } = useFinance();

  // Tách chuỗi "2026-08" thành mảng [2026, 8] dạng số (Number)
  const [year, month] = selectedMonth.split("-").map(Number);

  /**
   * Chuyển về tháng trước đó
   */
  const goToPrev = () => {
    // Truyền (month - 2) vì đối tượng Date() nhận tháng từ 0-11
    const d = new Date(year, month - 2, 1);
    // Tính toán xong, định dạng lại thành chuỗi "YYYY-MM" và lưu vào Context
    setSelectedMonth(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  /**
   * Chuyển sang tháng tiếp theo
   */
  const goToNext = () => {
    // Truyền month vì nó tương đương với (month + 1) theo hệ 0-11
    const d = new Date(year, month, 1);
    setSelectedMonth(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  return (
    <div className="bg-surface-alt border-border/50 flex items-center gap-1.5 rounded-2xl border p-1 shadow-inner">
      {/* Nút Tháng Trước (Left Arrow) */}
      <button
        onClick={goToPrev}
        className="text-text-secondary hover:text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-all hover:bg-white hover:shadow-sm"
        aria-label="Tháng trước"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Tiêu đề hiển thị Tháng / Năm */}
      <div className="min-w-[130px] px-4 py-1.5 text-center">
        <div className="text-text text-sm font-bold">
          {MONTH_NAMES[month - 1]}, {year}
        </div>
      </div>

      {/* Nút Tháng Sau (Right Arrow) */}
      <button
        onClick={goToNext}
        className="text-text-secondary hover:text-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-all hover:bg-white hover:shadow-sm"
        aria-label="Tháng sau"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default MonthPicker;
