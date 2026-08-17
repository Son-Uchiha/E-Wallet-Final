import { useMemo } from "react";
import { useFinance } from "../../hooks/useFinance";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
};

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

const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  return `${MONTH_NAMES[month - 1]}/${year}`;
};

/**
 * Component SummaryTable - Bảng Báo Cáo Tổng Hợp
 */
const SummaryTable = () => {
  const { categories, selectedMonth, getMonthSpending, getMonthIncome } = useFinance();

  // Tính toán Tháng Trước (Tháng so sánh)
  const compareMonth = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const d = new Date(year, month - 2, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, [selectedMonth]);

  // Lấy dữ liệu chi tiêu / thu nhập của 2 tháng
  const currentData = useMemo(() => getMonthSpending(selectedMonth), [getMonthSpending, selectedMonth]);
  const prevData = useMemo(() => getMonthSpending(compareMonth), [getMonthSpending, compareMonth]);

  const currentIncome = useMemo(() => getMonthIncome(selectedMonth), [getMonthIncome, selectedMonth]);
  const prevIncome = useMemo(() => getMonthIncome(compareMonth), [getMonthIncome, compareMonth]);

  /**
   * Component phụ: Huy Hiệu Biến Động (Tăng/Giảm)
   */
  const DiffBadge = ({ current, previous, incomeMode = false }) => {
    const diff = current - previous;
    if (diff === 0) return <span className="text-text-dim font-medium">—</span>;

    const isPositive = diff > 0;

    // Thu nhập: Tăng = Tốt (Xanh), Giảm = Xấu (Đỏ)
    // Chi tiêu: Tăng = Xấu (Đỏ), Giảm = Tốt (Xanh)
    const colorClass = incomeMode
      ? isPositive
        ? "text-income bg-income-bg"
        : "text-expense bg-expense-bg"
      : isPositive
        ? "text-expense bg-expense-bg"
        : "text-income bg-income-bg";

    return (
      <span className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full ${colorClass}`}>
        {isPositive ? (
          <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
          </svg>
        ) : (
          <svg className="w-3 h-3 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        )}
        {formatCurrency(Math.abs(diff))}
      </span>
    );
  };

  return (
    <div className="card-premium p-6 sm:p-8 mt-8">
      {/* Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary-bg flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-text tracking-tight">Báo cáo Tổng hợp</h2>
          <p className="text-sm font-medium text-text-secondary mt-1">
            So sánh chi tiêu giữa <span className="font-bold text-text">{formatMonthLabel(selectedMonth)}</span> và{" "}
            <span className="font-bold text-text">{formatMonthLabel(compareMonth)}</span>
          </p>
        </div>
      </div>

      {/* Bảng Dữ liệu */}
      <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-alt text-text-secondary uppercase text-[11px] font-extrabold tracking-wider">
            <tr>
              <th className="py-4 px-5 rounded-tl-2xl">Danh mục</th>
              <th className="py-4 px-5 text-right">{formatMonthLabel(compareMonth)}</th>
              <th className="py-4 px-5 text-right text-primary">{formatMonthLabel(selectedMonth)}</th>
              <th className="py-4 px-5 text-right rounded-tr-2xl">Biến động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/50">
            {/* Dòng Tổng Thu Nhập */}
            {(currentIncome > 0 || prevIncome > 0) && (
              <tr className="bg-income-bg/30 hover:bg-income-bg/60 transition-colors">
                <td className="py-4 px-5 font-bold text-income flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-income"></div>
                  Tổng Thu Nhập
                </td>
                <td className="py-4 px-5 text-right font-medium text-text-muted tabular-nums">
                  {formatCurrency(prevIncome)}
                </td>
                <td className="py-4 px-5 text-right font-bold text-income tabular-nums">
                  {formatCurrency(currentIncome)}
                </td>
                <td className="py-4 px-5 text-right">
                  <DiffBadge current={currentIncome} previous={prevIncome} incomeMode />
                </td>
              </tr>
            )}

            {/* Các dòng Danh mục Chi tiêu */}
            {categories.map((cat) => {
              const cur = currentData.spending[cat.id] || 0;
              const prev = prevData.spending[cat.id] || 0;

              if (cur === 0 && prev === 0) return null;

              return (
                <tr key={cat.id} className="bg-white hover:bg-surface-alt/50 transition-colors group">
                  <td className="py-4 px-5 font-bold text-text">{cat.name}</td>
                  <td className="py-4 px-5 text-right font-medium text-text-muted tabular-nums group-hover:text-text-secondary transition-colors">
                    {formatCurrency(prev)}
                  </td>
                  <td className="py-4 px-5 text-right font-black text-text tabular-nums">{formatCurrency(cur)}</td>
                  <td className="py-4 px-5 text-right">
                    <DiffBadge current={cur} previous={prev} />
                  </td>
                </tr>
              );
            })}

            {/* Dòng Cuối: Tổng Chi Tiêu */}
            <tr className="bg-surface-alt border-t-2 border-border/80">
              <td className="py-5 px-5 font-black text-text uppercase tracking-wide rounded-bl-2xl">Tổng Chi Tiêu</td>
              <td className="py-5 px-5 text-right font-bold text-text-muted tabular-nums">
                {formatCurrency(prevData.total)}
              </td>
              <td className="py-5 px-5 text-right font-black text-expense tabular-nums text-base">
                {formatCurrency(currentData.total)}
              </td>
              <td className="py-5 px-5 text-right rounded-br-2xl">
                <DiffBadge current={currentData.total} previous={prevData.total} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;
