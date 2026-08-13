import { useState } from "react";
import { useFinance } from "../../hooks/useFinance";
import ConfirmModal from "../shared/ConfirmModal";
/**
 * Hàm hỗ trợ định dạng số tiền (Ví dụ: 1000000 -> "1.000.000₫")
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
};

/**
 * Hàm hỗ trợ định dạng ngày tháng (Ví dụ: "2026-08-16T15:00:00Z" -> "16/08/2026 22:00")
 */
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TransactionList = () => {
  // 1. Lấy danh sách giao dịch đã lọc theo tháng hiện tại từ Context
  const { filteredTransactions, categories, deleteTransaction } = useFinance();

  // 2. State lưu trữ ID của giao dịch đang chuẩn bị bị xóa (để kích hoạt Modal)
  const [deleteTarget, setDeleteTarget] = useState(null);

  /**
   * Truy xuất tên danh mục từ ID.
   * Nếu danh mục đã bị xóa cứng (không tìm thấy), sẽ hiển thị "Không rõ".
   */
  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "Không rõ";
  };

  /**
   * Xử lý xóa khi người dùng bấm "Xác nhận" trên Modal
   */
  const handleDelete = () => {
    if (deleteTarget) {
      deleteTransaction(deleteTarget);
      setDeleteTarget(null); // Đóng modal
    }
  };
  // MÀN HÌNH TRỐNG: Hiển thị giao diện này nếu tháng chưa có giao dịch nào
  if (filteredTransactions.length === 0) {
    return (
      <div className="card-premium flex min-h-[300px] flex-col items-center justify-center p-10 text-center">
        <div className="bg-surface-alt mb-4 flex h-16 w-16 items-center justify-center rounded-[2rem]">
          <svg
            className="text-text-dim h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p className="text-text-secondary text-base font-bold">Chưa có giao dịch nào</p>
        <p className="text-text-dim mt-1 text-sm">Hãy thêm giao dịch đầu tiên của tháng</p>
      </div>
    );
  }
  return (
    <div className="card-premium flex w-full flex-1 flex-col p-6 sm:p-8">
      {/* Tiêu đề & Tổng số lượng giao dịch */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-text flex items-center gap-3 text-xl font-extrabold tracking-tight">
          <div className="bg-primary-bg flex h-10 w-10 items-center justify-center rounded-xl">
            <svg
              className="text-primary h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          Lịch sử giao dịch
        </h2>
        <span className="text-text-secondary bg-surface-alt rounded-xl px-3 py-1.5 text-sm font-bold">
          {filteredTransactions.length}
        </span>
      </div>
      {/* Danh sách giao dịch (Có scrollbar) */}
      <div className="max-h-[360px] min-h-[200px] flex-1 space-y-2 overflow-y-auto pr-2">
        {filteredTransactions.map((tx) => (
          <div
            key={tx.id}
            className="hover:border-border group flex items-center gap-4 rounded-[1.25rem] border border-transparent bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* Cột 1: Icon Mũi tên */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] ${tx.type === "income" ? "bg-income-bg" : "bg-expense-bg"}`}
            >
              {tx.type === "income" ? (
                <svg
                  className="text-income h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              ) : (
                <svg
                  className="text-expense h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              )}
            </div>
            {/* Cột 2: Chi tiết */}
            <div className="min-w-0 flex-1">
              <p className="text-text truncate text-base font-bold">{getCategoryName(tx.categoryId)}</p>
              {tx.note && <p className="text-text-muted mt-0.5 truncate text-sm font-medium">{tx.note}</p>}
              <p className="text-text-dim mt-1 text-xs font-semibold">{formatDate(tx.date)}</p>
            </div>
            {/* Cột 3: Số tiền */}
            <p className={`shrink-0 text-lg font-black ${tx.type === "income" ? "text-income" : "text-expense"}`}>
              {tx.type === "income" ? "+" : "-"}
              {formatCurrency(tx.amount)}
            </p>
            {/* Cột 4: Nút Xóa (Ẩn, chỉ hiện khi hover chuột vào) */}
            <button
              onClick={() => setDeleteTarget(tx.id)}
              className="text-text-dim hover:bg-expense-bg hover:text-expense ml-1 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl opacity-0 transition-all group-hover:opacity-100"
              aria-label="Xóa giao dịch"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      {/* Modal Cảnh báo Xóa */}
      <ConfirmModal
        isOpen={!!deleteTarget} // Chuyển giá trị truthy/falsy thành boolean (nếu có id -> true, null -> false)
        title="Xóa giao dịch"
        message="Giao dịch này sẽ bị xóa vĩnh viễn và số liệu sẽ được cập nhật lại ngay lập tức."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default TransactionList;
