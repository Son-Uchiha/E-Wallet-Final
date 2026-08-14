import { useState } from "react";
import { useFinance } from "../../hooks/useFinance";
import ConfirmModal from "../shared/ConfirmModal";
import CategoryForm from "./CategoryForm";
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
};

const CategoryList = () => {
  const {
    categories,
    categorySpending,
    selectedMonth,
    addCategory,
    updateCategory,
    deleteCategory,
    clearCategoryMonthData,
    filteredTransactions,
  } = useFinance();

  // State quản lý UI
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Handlers
  const handleAdd = (name, limit) => {
    addCategory(name, limit);
    setShowAddForm(false);
  };

  const handleUpdate = (id) => (name, limit) => {
    updateCategory(id, name, limit);
    setEditingId(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    // Kiểm tra xem danh mục này đã chi tiền trong THÁNG NÀY chưa
    const hasTransactionsThisMonth = filteredTransactions.some((t) => t.categoryId === deleteTarget);

    if (hasTransactionsThisMonth) {
      // Có giao dịch: Xóa giao dịch của tháng này
      clearCategoryMonthData(deleteTarget, selectedMonth);
    } else {
      // Không có: Xóa danh mục
      deleteCategory(deleteTarget);
    }

    setDeleteTarget(null);
  };

  // Cấu hình chữ cho Popup Xóa
  const hasTransactionsThisMonthForMessage = deleteTarget
    ? filteredTransactions.some((t) => t.categoryId === deleteTarget)
    : false;
  const [year, month] = selectedMonth.split("-");
  const modalMessage = hasTransactionsThisMonthForMessage
    ? `Hành động này sẽ xóa sạch các giao dịch của danh mục này trong tháng ${month}/${year}. Trạng thái sẽ trở về 0đ. Bạn có tiếp tục không?`
    : "Danh mục này sẽ bị ẩn khỏi tháng hiện tại, nhưng lịch sử chi tiêu ở các tháng trước (nếu có) vẫn được giữ nguyên. Bạn chắc chắn chứ?";
  return (
    <div className="card-premium flex w-full flex-1 flex-col p-6 sm:p-8">
      {/* Tiêu đề & Nút Thêm/Đóng */}
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
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          Danh mục chi tiêu
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl transition-all duration-300 ${showAddForm ? "bg-expense-bg text-expense hover:bg-expense/20" : "bg-primary-bg text-primary hover:bg-primary/20 hover:scale-105"}`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={showAddForm ? "M6 18L18 6M6 6l12 12" : "M12 6v6m0 0v6m0-6h6m-6 0H6"}
            />
          </svg>
        </button>
      </div>
      {showAddForm && (
        <div className="bg-surface-alt border-border/50 animate-in fade-in slide-in-from-top-2 mb-6 rounded-2xl border p-4 sm:p-5">
          <CategoryForm onSubmit={handleAdd} onCancel={() => setShowAddForm(false)} />
        </div>
      )}
      {/* Danh sách */}
      <div className="max-h-[360px] min-h-[200px] flex-1 space-y-4 overflow-y-auto pr-2">
        {categories
          // LỌC: Ẩn các danh mục đã xóa mềm trừ khi nó có giao dịch trong tháng này
          .filter((cat) => !cat.isArchived || filteredTransactions.some((t) => t.categoryId === cat.id))
          .map((cat) => {
            // Tính toán giới hạn
            const spent = categorySpending[cat.id] || 0;
            const isOverLimit = cat.limit > 0 && spent > cat.limit;
            const isNearLimit = cat.limit > 0 && spent > cat.limit * 0.8 && !isOverLimit;
            const spentPercent = cat.limit > 0 ? Math.min((spent / cat.limit) * 100, 100) : 0;
            // Chế độ Edit
            if (editingId === cat.id) {
              return (
                <div
                  key={cat.id}
                  className="bg-primary-bg border-primary/20 animate-in fade-in rounded-2xl border p-4 sm:p-5"
                >
                  <CategoryForm initialData={cat} onSubmit={handleUpdate(cat.id)} onCancel={() => setEditingId(null)} />
                </div>
              );
            }
            // Chế độ Bình thường (View)
            return (
              <div
                key={cat.id}
                className={`group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5 ${isOverLimit ? "bg-expense-bg border-expense/20 hover:shadow-[0_8px_20px_rgba(239,68,68,0.1)]" : isNearLimit ? "bg-warning-bg border-warning/20 hover:shadow-[0_8px_20px_rgba(245,158,11,0.1)]" : "border-border/50 hover:border-border bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.03)]"}`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-text text-base font-bold">{cat.name}</span>
                    {isOverLimit && (
                      <span className="bg-expense rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-white shadow-sm">
                        VƯỢT HẠN MỨC
                      </span>
                    )}
                    {isNearLimit && (
                      <span className="text-warning-700 bg-warning-200 rounded-full px-2.5 py-1 text-[11px] font-extrabold tracking-wide">
                        SẮP ĐẠT HẠN MỨC
                      </span>
                    )}
                  </div>

                  {/* Các nút Sửa/Xóa ẩn đi khi chưa hover chuột vào thẻ */}
                  <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => setEditingId(cat.id)}
                      className="text-text-muted hover:text-primary hover:bg-primary-bg flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteTarget(cat.id)}
                      className="text-text-muted hover:text-expense hover:bg-expense-bg flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {/* Thông tin số tiền */}
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-text-secondary font-medium">
                    Đã chi:{" "}
                    <span className={`font-black ${isOverLimit ? "text-expense" : "text-text"}`}>
                      {formatCurrency(spent)}
                    </span>
                  </span>
                  {cat.limit > 0 && (
                    <span className="text-text-muted font-medium">Hạn mức: {formatCurrency(cat.limit)}</span>
                  )}
                </div>
                {/* Thanh Tiến Trình */}
                {cat.limit > 0 && (
                  <div
                    className={`h-2.5 w-full overflow-hidden rounded-full shadow-inner ${isOverLimit ? "bg-white/50" : "bg-surface-alt"}`}
                  >
                    <div
                      className={`relative h-full rounded-full transition-all duration-700 ease-out ${isOverLimit ? "bg-expense" : isNearLimit ? "bg-warning" : "bg-primary"}`}
                      style={{ width: `${spentPercent}%` }}
                    >
                      {(isNearLimit || isOverLimit) && (
                        <div className="absolute top-0 right-0 bottom-0 w-4 rounded-full bg-white/40 blur-[2px]"></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={hasTransactionsThisMonthForMessage ? "Làm mới danh mục (Tháng này)" : "Ẩn/Xóa danh mục"}
        message={modalMessage}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default CategoryList;
