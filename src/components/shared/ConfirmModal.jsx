/**
 * Component ConfirmModal - Hộp thoại xác nhận thao tác (Xóa, Làm mới...)
 * Giao diện hiển thị dưới dạng Popup nằm đè lên trên nội dung hiện tại (overlay).
 */
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  // Nếu isOpen = false, component sẽ không render gì cả ra màn hình
  if (!isOpen) return null;

  return (
    // fixed inset-0 z-50: Cố định Modal lấp đầy màn hình và luôn nằm trên cùng
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Lớp Nền Mờ (Backdrop) */}
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/40 backdrop-blur-sm duration-200"
        onClick={onCancel}
      />
      {/* Khối Nội Dung Modal (White Box) */}
      <div className="shadow-premium border-border/50 animate-in zoom-in-95 relative w-full max-w-sm rounded-3xl border bg-white p-8 duration-200">
        {/* Icon Cảnh báo (Màu đỏ) */}
        <div className="bg-expense-bg mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
          <svg className="text-expense h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        {/* Tiêu đề & Nội dung */}
        <h3 className="text-text mb-2 text-center text-xl font-extrabold tracking-tight">{title || "Xác nhận"}</h3>
        <p className="text-text-secondary mb-8 px-2 text-center text-sm leading-relaxed font-medium">
          {message || "Bạn có chắc chắn muốn thực hiện thao tác này?"}
        </p>
        {/* Nhóm Nút Bấm */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            onClick={onCancel}
            className="bg-surface-alt text-text-secondary hover:bg-surface-hover hover:text-text flex-1 cursor-pointer rounded-xl px-4 py-3.5 text-sm font-bold transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="bg-expense hover:bg-expense-deep flex-1 cursor-pointer rounded-xl px-4 py-3.5 text-sm font-bold text-white transition-all hover:shadow-[0_8px_20px_rgba(239,68,68,0.3)] active:scale-95"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
