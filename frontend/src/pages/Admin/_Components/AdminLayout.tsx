import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import SideNav from "./SideNav";

type Props = {
  /** Tiêu đề to ở phần nội dung bên phải */
  title: string;
  /** Nút/hành động nằm bên phải tiêu đề (VD: “Thêm sản phẩm”) */
  actions?: React.ReactNode;
  /** Nội dung trang */
  children: React.ReactNode;
};

/**
 * AdminLayout
 * - Topbar dính trên cùng
 * - Sidebar trái: ẩn trên mobile, hiện off-canvas khi bấm Menu
 * - Khu vực nội dung bên phải
 */
export default function AdminLayout({ title, actions, children }: Props) {
  const [openSide, setOpenSide] = useState(false); // mobile sidebar

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {/* hamburger (mobile) */}
            <button
              className="mr-1 grid h-9 w-9 place-content-center rounded-md border border-neutral-200 lg:hidden"
              onClick={() => setOpenSide(true)}
              aria-label="Mở menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo / link về tổng quan */}
            <Link
              to="/admin"
              className="text-lg font-extrabold tracking-wide hover:opacity-90"
            >
              Admin Dashboard
            </Link>
          </div>

          <div className="text-sm text-neutral-600">Xin chào, Admin</div>
        </div>
      </header>

      {/* Off-canvas sidebar (mobile) */}
      <div
        className={[
          "fixed inset-0 z-50 lg:hidden",
          openSide ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!openSide}
      >
        {/* overlay */}
        <div
          className={[
            "absolute inset-0 bg-black/40 transition-opacity",
            openSide ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={() => setOpenSide(false)}
        />
        {/* drawer */}
        <aside
          className={[
            "absolute left-0 top-0 h-full w-[82%] max-w-[300px] rounded-r-2xl border-r border-neutral-200 bg-white p-3 shadow-xl transition-transform",
            openSide ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          role="dialog"
          aria-modal="true"
          aria-label="Menu quản trị"
        >
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-extrabold">Menu</p>
            <button
              className="rounded p-2 text-neutral-600 hover:bg-neutral-100"
              onClick={() => setOpenSide(false)}
              aria-label="Đóng menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <SideNav onNavigate={() => setOpenSide(false)} />
        </aside>
      </div>

      {/* Main two-column layout */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-5">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-[64px] hidden self-start lg:col-span-1 lg:block">
          <div className="rounded-xl border border-neutral-200 bg-white p-3">
            <SideNav />
          </div>
        </aside>

        {/* Content */}
        <section className="lg:col-span-4 space-y-4">
          {/* Title + Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-extrabold tracking-wide">{title}</h1>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>

          {/* Card container tuỳ trang tự render */}
          {children}
        </section>
      </div>
    </div>
  );
}
