import Dashboard from "./components/layout/Dashboard";
import Header from "./components/layout/Header";
import TransactionForm from "./components/transactions/TransactionForm";

function App() {
  return (
    // Bao phủ toàn màn hình (min-h-screen), đặt màu nền (bg-bg)
    // Tùy chỉnh màu khi bôi đen text (selection:...)
    <div className="bg-bg selection:bg-primary/20 selection:text-primary-deep min-h-screen">
      {/* Thanh điều hướng Header ở trên cùng */}
      <Header />

      {/* Thân trang (Main Content) */}
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Hệ thống Grid (Lưới) chia cột - Trên PC chia 12 cột, trên Mobile là 1 cột */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* --- HÀNG 1 --- */}
          {/* Trái: Dashboard Tổng quan (Chiếm 6/12 cột = 50% chiều rộng) */}
          <div className="flex w-full flex-col lg:col-span-6">
            <Dashboard />
          </div>

          {/* Phải: Form Thêm Giao Dịch (Chiếm 6/12 cột = 50% chiều rộng) */}
          <div className="flex w-full flex-col lg:col-span-6">
            <TransactionForm />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
