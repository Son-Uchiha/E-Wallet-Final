import Header from "./components/layout/Header";

function App() {
  return (
    // Bao phủ toàn màn hình (min-h-screen), đặt màu nền (bg-bg)
    // Tùy chỉnh màu khi bôi đen text (selection:...)
    <div className="bg-bg selection:bg-primary/20 selection:text-primary-deep min-h-screen">
      {/* Thanh điều hướng Header ở trên cùng */}
      <Header />
    </div>
  );
}

export default App;
