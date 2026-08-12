import { useState } from "react";
import { useFinance } from "../../hooks/useFinance";

const TransactionForm = () => {
  // 1. Lấy dữ liệu danh sách danh mục và hàm thêm giao dịch từ Context
  const { categories, addTransaction } = useFinance();

  // 2. Khởi tạo state cho dữ liệu form
  const [formData, setFormData] = useState({
    amount: "", // Số tiền
    type: "expense", // Loại giao dịch: "expense" (Chi tiêu) hoặc "income" (Thu nhập)
    categoryId: "", // ID của danh mục được chọn
    note: "", // Ghi chú thêm
    // Mặc định lấy ngày giờ hiện tại, format "YYYY-MM-DDThh:mm" để dùng cho thẻ <input type="datetime-local">
    date: new Date().toISOString().slice(0, 16),
  });

  // State lưu trữ lỗi validate cho từng field tương ứng (vd: { amount: "Lỗi...", categoryId: "Lỗi..." })
  const [errors, setErrors] = useState({});

  /**
   * 3. Hàm kiểm tra dữ liệu đầu vào (Validation) trước khi lưu
   * @returns {boolean} true nếu hợp lệ, false nếu có lỗi
   */
  const validate = () => {
    const newErrors = {};
    const amount = Number(formData.amount);
    // Kiểm tra số tiền: Không được để trống và phải lớn hơn 0
    if (!formData.amount || amount <= 0) {
      newErrors.amount = "Số tiền phải lớn hơn 0";
    }
    // Kiểm tra danh mục: Phải chọn một danh mục cụ thể
    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }
    // Kiểm tra ngày tháng
    if (!formData.date) {
      newErrors.date = "Vui lòng chọn ngày";
    }
    setErrors(newErrors);

    // Nếu object newErrors không có key nào nghĩa là không có lỗi (trả về true)
    return Object.keys(newErrors).length === 0;
  };

  /**
   * 4. Xử lý sự kiện khi bấm nút "Thêm giao dịch"
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Chặn load lại trang

    // Chạy hàm validate, nếu lỗi thì ngắt hàm (return)
    if (!validate()) return;

    // Gửi dữ liệu hợp lệ xuống Context để lưu vào LocalStorage
    addTransaction({
      ...formData,
      amount: Math.abs(Number(formData.amount)), // Đảm bảo số tiền luôn dương
      date: new Date(formData.date).toISOString(), // Chuẩn hóa định dạng ISO 8601
    });
    // Sau khi thêm thành công -> Reset toàn bộ form về trạng thái ban đầu
    setFormData({
      amount: "",
      type: "expense",
      categoryId: "",
      note: "",
      date: new Date().toISOString().slice(0, 16),
    });
    setErrors({});
  };

  /**
   * 5. Hàm helper dùng chung cho các input để cập nhật giá trị vào biến formData
   * @param {string} field Tên trường cần cập nhật (vd: "amount", "categoryId")
   * @param {any} value Giá trị mới
   */
  const handleChange = (field, value) => {
    // Cập nhật State Form Data (Bảo toàn các giá trị cũ bằng spread operator: ...prev)
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Nếu trường đang nhập đang có báo lỗi đỏ, thì tự động xóa lỗi đó đi để báo cho người dùng biết
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };
  return (
    <div className="card-premium flex w-full flex-1 flex-col justify-center p-6 sm:p-8">
      {/* Tiêu đề Form */}
      <h2 className="text-text mb-6 flex items-center gap-3 text-xl font-extrabold tracking-tight">
        <div className="bg-primary-bg flex h-10 w-10 items-center justify-center rounded-xl">
          <svg className="text-primary h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        Thêm giao dịch
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Hàng 1: Nút chuyển đổi (Toggle) giữa CHI TIÊU và THU NHẬP */}
        <div className="bg-surface-alt border-border/50 grid grid-cols-2 gap-2 rounded-[1rem] border p-1.5">
          <button
            type="button"
            onClick={() => handleChange("type", "expense")}
            // CSS động: Thẻ được active sẽ sáng lên và nổi lên như có bóng (shadow)
            className={`cursor-pointer rounded-xl py-3 text-sm font-bold transition-all duration-300 ${formData.type === "expense" ? "text-expense bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]" : "text-text-muted hover:text-text hover:bg-white/50"}`}
          >
            ↓ Chi tiêu
          </button>
          <button
            type="button"
            onClick={() => handleChange("type", "income")}
            className={`cursor-pointer rounded-xl py-3 text-sm font-bold transition-all duration-300 ${formData.type === "income" ? "text-income bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]" : "text-text-muted hover:text-text hover:bg-white/50"}`}
          >
            ↑ Thu nhập
          </button>
        </div>
        {/* Hàng 2: Số tiền & Chọn danh mục */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Ô nhập Số Tiền */}
          <div>
            <label className="text-text-secondary mb-2 block text-sm font-bold">Số tiền (₫)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="Nhập số tiền..."
              min="0"
              className={`bg-surface-alt text-text placeholder:text-text-dim focus:ring-primary/10 focus:border-primary w-full rounded-2xl border px-4 py-3.5 font-bold transition-all placeholder:font-normal focus:bg-white focus:ring-4 focus:outline-none ${
                // Báo lỗi viền đỏ nếu có error.amount
                errors.amount ? "border-expense ring-expense/10 bg-white ring-4" : "border-border/50"
              }`}
            />
            {errors.amount && <p className="text-expense mt-1.5 text-xs font-semibold">{errors.amount}</p>}
          </div>
          {/* Ô Dropdown Danh mục */}
          <div>
            <label className="text-text-secondary mb-2 block text-sm font-bold">Danh mục</label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleChange("categoryId", e.target.value)}
              className={`bg-surface-alt text-text focus:ring-primary/10 focus:border-primary w-full cursor-pointer appearance-none rounded-2xl border px-4 py-3.5 font-semibold transition-all focus:bg-white focus:ring-4 focus:outline-none ${errors.categoryId ? "border-expense ring-expense/10 bg-white ring-4" : "border-border/50"} ${!formData.categoryId ? "text-text-dim font-normal" : ""}`}
            >
              <option value="">Chọn danh mục...</option>
              {categories
                // Form giao dịch chỉ cho phép chọn những danh mục Đang Mở (Không bị Archived)
                .filter((cat) => !cat.isArchived)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            {errors.categoryId && <p className="text-expense mt-1.5 text-xs font-semibold">{errors.categoryId}</p>}
          </div>
        </div>
        {/* Hàng 3: Ghi chú & Ngày tháng */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="text-text-secondary mb-2 block text-sm font-bold">Ghi chú</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => handleChange("note", e.target.value)}
              placeholder="Mô tả..."
              className="bg-surface-alt border-border/50 text-text focus:ring-primary/10 focus:border-primary w-full rounded-2xl border px-4 py-3.5 transition-all focus:bg-white focus:ring-4 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-text-secondary mb-2 block text-sm font-bold">Thời gian</label>
            <input
              type="datetime-local" // Trình duyệt hỗ trợ chọn ngày giờ tự động
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className={`bg-surface-alt text-text focus:ring-primary/10 focus:border-primary w-full rounded-2xl border px-4 py-3.5 font-semibold transition-all focus:bg-white focus:ring-4 focus:outline-none ${errors.date ? "border-expense ring-expense/10 bg-white ring-4" : "border-border/50"}`}
            />
            {errors.date && <p className="text-expense mt-1.5 text-xs font-semibold">{errors.date}</p>}
          </div>
        </div>
        {/* Nút Submit lưu dữ liệu */}
        <button
          type="submit"
          className="bg-primary hover:bg-primary-deep mt-2 w-full cursor-pointer rounded-2xl py-4 text-base font-extrabold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(79,70,229,0.3)] active:translate-y-0 active:scale-[0.98]"
        >
          ＋ Thêm giao dịch
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
