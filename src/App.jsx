import Header from "./components/layout/Header"; // Nếu bạn có file Header thì giữ lại
import Dashboard from "./components/layout/Dashboard";
import TransactionForm from "./components/transactions/TransactionForm";
import TransactionList from "./components/transactions/TransactionList";
import CategoryList from "./components/categories/CategoryList";
import SummaryTable from "./components/shared/SummaryTable";

/**
 * Component App - Bộ khung Layout tổng thể của cả trang web.
 */
const App = () => {
  return (
    // Bao phủ toàn màn hình, đặt màu nền theo cấu hình Tailwind
    <div className="min-h-screen bg-bg selection:bg-primary/20 selection:text-primary-deep">
      {/* Thanh điều hướng ở trên cùng */}
      <Header />

      {/* Thân trang (Main Content) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Hệ thống Grid (Lưới): Màn hình to chia 2 cột, màn hình điện thoại gộp 1 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* HÀNG 1 */}
          {/* Trái: Dashboard */}
          <div className="lg:col-span-6 w-full flex flex-col">
            <Dashboard />
          </div>

          {/* Phải: Form Thêm Giao Dịch */}
          <div className="lg:col-span-6 w-full flex flex-col">
            <TransactionForm />
          </div>

          {/* HÀNG 2 */}
          {/* Trái: Danh sách Danh mục */}
          <div className="lg:col-span-6 w-full flex flex-col">
            <CategoryList />
          </div>

          {/* Phải: Lịch sử Giao dịch */}
          <div className="lg:col-span-6 w-full flex flex-col">
            <TransactionList />
          </div>
        </div>

        {/* DƯỚI CÙNG: Bảng Tổng Hợp - Trải dài 100% màn hình */}
        <SummaryTable />
      </main>

      {/* Chân trang (Footer) */}
      <footer className="py-8 mt-4 text-center">
        <p className="text-sm font-medium text-text-dim">
          E-Wallet © {new Date().getFullYear()} — Quản lý chi tiêu cá nhân
        </p>
      </footer>
    </div>
  );
};

export default App;
