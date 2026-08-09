import MonthPicker from "../shared/MonthPicker";

/**
 * Component Header - Thanh điều hướng trên cùng của ứng dụng.
 * Chứa Logo và bộ chọn tháng (MonthPicker).
 */
const Header = () => {
  return (
    // Dùng sticky top-0 để thanh Header luôn bám dính ở trên cùng khi người dùng cuộn trang.
    // Dùng backdrop-blur-xl để làm hiệu ứng kính mờ (kính xuyên thấu) nền đằng sau.
    <header className="border-border/60 sticky top-0 z-40 border-b bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Khối Logo (Bao gồm Icon và Tên ứng dụng) */}
        <div className="flex items-center gap-3">
          {/* Hộp chứa Icon - Có bo góc và đổ bóng (Shadow) */}
          <div className="from-primary to-primary-light shadow-primary/25 flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-text text-xl leading-tight font-extrabold tracking-tight">
              E-Wallet
            </h1>
            <p className="text-text-dim mt-0.5 hidden text-[11.5px] leading-none font-medium sm:block">
              Quản lý chi tiêu cá nhân
            </p>
          </div>
        </div>

        {/* Khối chọn Tháng (Được tách thành 1 component riêng để tái sử dụng hoặc dễ quản lý) */}
        <MonthPicker />
      </div>
    </header>
  );
};

export default Header;
