import { useCallback, useEffect, useMemo, useState } from "react";
import { FinanceContext } from "./FinanceContext";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "../utils/storage";

// ==========================================
// CÁC HÀM TIỆN ÍCH PHỤ TRỢ (HELPER FUNCTIONS)
// ==========================================

// Tạo ID ngẫu nhiên không trùng lặp cho giao dịch / danh mục mới
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};

// Lấy chuỗi "YYYY-MM" từ một đối tượng Date
const getMonthKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Lấy chuỗi tháng ngay trước đó (VD: "2026-08" -> "2026-07")
const getPreviousMonth = (monthKey) => {
  const [year, month] = monthKey.split("-").map(Number);
  const d = new Date(year, month - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Hàm hỗ trợ lấy tháng hiện tại theo dạng "YYYY-MM" (VD: "2026-08")
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

// ==========================================
// DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
// ==========================================
const createSeedData = () => {
  const currentMonth = getCurrentMonth();
  const prevMonth = getPreviousMonth(currentMonth);
  const [curYear, curMon] = currentMonth.split("-").map(Number);
  const [prevYear, prevMon] = prevMonth.split("-").map(Number);

  const categories = [
    { id: "cat_1", name: "Ăn uống", limit: 3000000 },
    { id: "cat_2", name: "Di chuyển", limit: 1500000 },
    { id: "cat_3", name: "Mua sắm", limit: 2000000 },
    { id: "cat_4", name: "Giải trí", limit: 1000000 },
    { id: "cat_5", name: "Hóa đơn", limit: 2000000 },
    { id: "cat_6", name: "Lương", limit: 0 },
  ];
  const transactions = [
    // Lịch sử tháng hiện tại
    {
      id: generateId(),
      amount: 15000000,
      type: "income",
      categoryId: "cat_6",
      note: "Lương tháng " + curMon,
      date: new Date(curYear, curMon - 1, 5, 9, 0).toISOString(),
    },
    {
      id: generateId(),
      amount: 850000,
      type: "expense",
      categoryId: "cat_1",
      note: "Đi ăn nhà hàng",
      date: new Date(curYear, curMon - 1, 7, 12, 30).toISOString(),
    },
    {
      id: generateId(),
      amount: 200000,
      type: "expense",
      categoryId: "cat_2",
      note: "Grab đi làm",
      date: new Date(curYear, curMon - 1, 8, 8, 15).toISOString(),
    },
    {
      id: generateId(),
      amount: 1500000,
      type: "expense",
      categoryId: "cat_3",
      note: "Mua quần áo",
      date: new Date(curYear, curMon - 1, 10, 15, 0).toISOString(),
    },

    // Lịch sử tháng trước
    {
      id: generateId(),
      amount: 15000000,
      type: "income",
      categoryId: "cat_6",
      note: "Lương tháng " + prevMon,
      date: new Date(prevYear, prevMon - 1, 5, 9, 0).toISOString(),
    },
    {
      id: generateId(),
      amount: 1200000,
      type: "expense",
      categoryId: "cat_1",
      note: "Ăn uống cả tháng",
      date: new Date(prevYear, prevMon - 1, 10, 12, 0).toISOString(),
    },
  ];
  return { categories, transactions, budget: 8000000 };
};

// ==========================================
// PROVIDER CHÍNH (FINANCE PROVIDER)
// ==========================================
export const FinanceProvider = ({ children }) => {
  // 1. Khởi tạo dữ liệu từ LocalStorage (chỉ chạy 1 lần khi load trang)
  const [initialData] = useState(() => {
    let cats = loadFromStorage(STORAGE_KEYS.CATEGORIES, null);
    let trans = loadFromStorage(STORAGE_KEYS.TRANSACTIONS, null);
    let bdg = loadFromStorage(STORAGE_KEYS.BUDGET, null);
    // Nếu chưa từng có dữ liệu -> Nạp dữ liệu mẫu
    if (!cats || cats.length === 0) {
      const seed = createSeedData();
      cats = seed.categories;
      trans = seed.transactions;
      bdg = seed.budget;
    }
    return {
      categories: cats,
      transactions: trans || [],
      budget: bdg || 8000000,
    };
  });

  // KHỞI TẠO STATE TOÀN CỤC
  const [categories, setCategories] = useState(initialData.categories);
  const [transactions, setTransactions] = useState(initialData.transactions);
  const [budgetTotal, setBudgetTotalState] = useState(initialData.budget);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth);

  // Tự động lưu xuống LocalStorage mỗi khi State thay đổi
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CATEGORIES, categories);
  }, [categories]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
  }, [transactions]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.BUDGET, budgetTotal);
  }, [budgetTotal]);

  // CÁC HÀM TÍNH TOÁN DỮ LIỆU (COMPUTED VALUES) - DÙNG USEMEMO ĐỂ TỐI ƯU HIỆU NĂNG

  // Lọc ra các giao dịch chỉ thuộc về tháng đang được chọn
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => getMonthKey(t.date) === selectedMonth)
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sắp xếp mới nhất lên đầu
  }, [transactions, selectedMonth]);

  // Tổng thu nhập của tháng được chọn
  const totalIncome = useMemo(() => {
    return filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  // Tổng chi tiêu của tháng được chọn
  const totalExpense = useMemo(() => {
    return filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

  // Số dư = Tổng Thu - Tổng Chi
  const balance = useMemo(() => {
    return totalIncome - totalExpense;
  }, [totalIncome, totalExpense]);

  // Nhóm tổng tiền chi tiêu theo từng danh mục (để vẽ thanh Progress Bar)
  const categorySpending = useMemo(() => {
    const map = {};
    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
      });
    return map;
  }, [filteredTransactions]);

  // Lấy ra danh sách các tháng có phát sinh giao dịch (để đưa vào dropdown chọn tháng)
  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map((t) => getMonthKey(t.date)));
    months.add(getCurrentMonth()); // Luôn hiển thị tháng hiện tại dù chưa có giao dịch
    return Array.from(months).sort().reverse();
  }, [transactions]);

  // ==========================================
  // CÁC HÀM XỬ LÝ SỰ KIỆN (ACTIONS)
  // ==========================================

  // Thêm một giao dịch mới
  const addTransaction = useCallback((data) => {
    const newTransaction = {
      id: generateId(),
      amount: Math.abs(Number(data.amount)),
      type: data.type,
      categoryId: data.categoryId,
      note: data.note || "",
      date: data.date || new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }, []);

  // Xóa một giao dịch
  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Thêm một danh mục mới
  const addCategory = useCallback((name, limit) => {
    const newCategory = {
      id: generateId(),
      name: name.trim(),
      limit: Math.abs(Number(limit)) || 0,
    };
    setCategories((prev) => [...prev, newCategory]);
  }, []);

  // Cập nhật thông tin danh mục (đổi tên, đổi hạn mức)
  const updateCategory = useCallback((id, name, limit) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: name.trim(), limit: Math.abs(Number(limit)) || 0 } : c)),
    );
  }, []);

  /**
   * SMART DELETE LOGIC (Xóa thông minh)
   * Thay vì xóa vĩnh viễn (Cascade delete) làm mất dữ liệu thống kê của các tháng trước,
   * hệ thống sẽ kiểm tra xem danh mục này ĐÃ TỪNG CÓ giao dịch nào chưa.
   * Nếu có -> Chuyển sang trạng thái "isArchived = true" (Soft delete) để ẩn đi ở hiện tại nhưng giữ lại lịch sử cũ.
   * Nếu chưa -> Xóa vĩnh viễn khỏi Database.
   */
  const deleteCategory = useCallback(
    (id) => {
      const hasHistory = transactions.some((t) => t.categoryId === id);

      setCategories((prev) => {
        if (!hasHistory) {
          // Xóa vĩnh viễn vì chưa từng phát sinh giao dịch
          return prev.filter((c) => c.id !== id);
        }
        // Xóa mềm (Archived) để bảo lưu dữ liệu báo cáo tháng cũ
        return prev.map((c) => (c.id === id ? { ...c, isArchived: true } : c));
      });
      return { success: true };
    },
    [transactions],
  );

  // Xóa sạch mọi giao dịch của một danh mục TRONG MỘT THÁNG CỤ THỂ
  const clearCategoryMonthData = useCallback((categoryId, monthKey) => {
    setTransactions((prev) => prev.filter((t) => !(t.categoryId === categoryId && getMonthKey(t.date) === monthKey)));
  }, []);

  // Cập nhật tổng ngân sách của tháng
  const setBudgetTotal = useCallback((amount) => {
    setBudgetTotalState(Math.abs(Number(amount)) || 0);
  }, []);

  // Lấy chi tiết chi tiêu của một tháng bất kỳ (dùng cho bảng thống kê SummaryTable)
  const getMonthSpending = useCallback(
    (monthKey) => {
      const monthTx = transactions.filter((t) => getMonthKey(t.date) === monthKey && t.type === "expense");
      const map = {};
      let total = 0;
      monthTx.forEach((t) => {
        map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
        total += t.amount;
      });
      return { spending: map, total };
    },
    [transactions],
  );

  // Lấy tổng thu nhập của một tháng bất kỳ (dùng cho bảng thống kê SummaryTable)
  const getMonthIncome = useCallback(
    (monthKey) => {
      return transactions
        .filter((t) => getMonthKey(t.date) === monthKey && t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
    },
    [transactions],
  );

  // Đóng gói tất cả state và actions vào biến value để truyền xuống các Component con
  const value = useMemo(
    () => ({
      categories,
      transactions,
      filteredTransactions,
      selectedMonth,
      budgetTotal,
      totalIncome,
      totalExpense,
      balance,
      categorySpending,
      availableMonths,
      addTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      clearCategoryMonthData,
      setSelectedMonth,
      setBudgetTotal,
      getMonthSpending,
      getMonthIncome,
    }),
    [
      categories,
      transactions,
      filteredTransactions,
      selectedMonth,
      budgetTotal,
      totalIncome,
      totalExpense,
      balance,
      categorySpending,
      availableMonths,
      addTransaction,
      deleteTransaction,
      addCategory,
      updateCategory,
      deleteCategory,
      clearCategoryMonthData,
      getMonthSpending,
      getMonthIncome,
      setSelectedMonth,
      setBudgetTotal,
    ],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};
