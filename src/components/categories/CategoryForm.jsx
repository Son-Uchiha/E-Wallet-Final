/**
 * Component CategoryForm - Form dùng để Thêm mới hoặc Chỉnh sửa danh mục.
 * - onSubmit: Hàm callback khi bấm Lưu
 * - initialData: Dữ liệu khởi tạo (nếu đang ở chế độ Sửa)
 * - onCancel: Hàm callback khi bấm Hủy
 */

import { useState } from "react";

const CategoryForm = ({ onSubmit, initialData, onCancel }) => {
  // Khởi tạo state với dữ liệu cũ (nếu đang sửa) hoặc rỗng (nếu thêm mới)
  const [name, setName] = useState(initialData?.name || "");
  const [limit, setLimit] = useState(initialData?.limit?.toString() || "");
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    // Bắt buộc phải nhập tên danh mục
    if (!trimmedName) {
      setError("Tên danh mục không được để trống");
      return;
    }
    // Gọi hàm lưu: nếu limit để trống thì mặc định là 0 (Không giới hạn)
    onSubmit(trimmedName, Number(limit) || 0);

    // Reset form
    setName("");
    setLimit("");
    setError("");
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Nhập Tên */}
        <div className="flex-1">
          <label className="text-text-secondary mb-1.5 ml-1 block text-xs font-bold">Tên danh mục</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(""); // Đang gõ chữ lại thì xóa lỗi
            }}
            placeholder="Ví dụ: Ăn uống, Mua sắm..."
            className={`text-text placeholder:text-text-dim focus:ring-primary/10 focus:border-primary w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold shadow-sm transition-all placeholder:font-normal focus:ring-4 focus:outline-none ${error ? "border-expense ring-expense/10 ring-4" : "border-border/50"}`}
          />
        </div>

        {/* Nhập Hạn mức */}
        <div className="w-full sm:w-40">
          <label className="text-text-secondary mb-1.5 ml-1 block text-xs font-bold">Hạn mức (₫)</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="Không giới hạn"
            min="0"
            className="border-border/50 text-text placeholder:text-text-dim focus:ring-primary/10 focus:border-primary w-full rounded-xl border bg-white px-4 py-3 text-sm font-semibold shadow-sm transition-all placeholder:font-normal focus:ring-4 focus:outline-none"
          />
        </div>
      </div>
      {error && <p className="text-expense px-1 text-sm font-bold">{error}</p>}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="bg-primary hover:bg-primary-deep cursor-pointer rounded-xl px-6 py-3 text-sm font-bold text-white transition-all hover:shadow-[0_8px_20px_rgba(79,70,229,0.25)] active:scale-95"
        >
          {initialData ? "Lưu thay đổi" : "＋ Thêm danh mục"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border-border/50 text-text-secondary hover:bg-surface-alt hover:text-text cursor-pointer rounded-xl border bg-white px-6 py-3 text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default CategoryForm;
