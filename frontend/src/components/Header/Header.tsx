import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  User2,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

// ====== Mock data (sau này thay bằng API) ======
type NavItem = {
  label: string;
  href: string;
  badge?: string | React.ReactNode;
  children?: NavItem[];
};
const NAV_ITEMS: NavItem[] = [
  {
    label: "HÀNG MỚI",
    href: "/hang-moi",
    // badge: <span className="ml-1 text-red-500 text-xs font-semibold">New</span>,
  },
  {
    label: "SẢN PHẨM",
    href: "/san-pham",
    children: [
      { label: "Tất cả", href: "/san-pham" },
      { label: "Best Seller", href: "/san-pham?tag=best" },
      { label: "Giảm giá", href: "/san-pham?tag=sale" },
    ],
  },
  {
    label: "ÁO NAM",
    href: "/ao-nam",
    children: [
      { label: "Áo thun", href: "/ao-nam/ao-thun" },
      { label: "Sơ mi", href: "/ao-nam/so-mi" },
      { label: "Áo khoác", href: "/ao-nam/ao-khoac" },
    ],
  },
  {
    label: "QUẦN NAM",
    href: "/quan-nam",
    children: [
      { label: "Jeans", href: "/quan-nam/jeans" },
      { label: "Kaki", href: "/quan-nam/kaki" },
      { label: "Jogger", href: "/quan-nam/jogger" },
    ],
  },
  { label: "PHỤ KIỆN", href: "/phu-kien" },
  {
    label: "OUTLET",
    href: "/outlet",
    // badge: (
    //   <span className="ml-1 text-red-500 text-xs font-semibold">-50%</span>
    // ),
  },
  { label: "DISNEY", href: "/disney" },
  { label: "JEANS", href: "/jeans" },
  { label: "TIN THỜI TRANG", href: "/tin" },
];

export default function Header() {
  const [openMobile, setOpenMobile] = useState(false);
  const [query, setQuery] = useState("");
  // Number in cart (mock)
  const cartCount = 0;

  const primaryNav = useMemo(() => NAV_ITEMS, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full">
      {/* Top black bar */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          {/* Logo */}
          <a href="/" className="shrink-0">
            {/* đặt logo thật vào /public/logo-160store.png */}
            <img
              src="../../../public/logo.png"
              alt="160STORE"
              className="h-7 w-auto object-contain"
            />
          </a>

          {/* Search (desktop) */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="hidden md:block md:flex-1"
          >
            <div className="mx-auto w-full max-w-[520px] lg:max-w-[480px]">
              {/* wrapper chung: rounded + ring + overflow-hidden */}
              <div className="flex items-stretch overflow-hidden rounded-md bg-white ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-white/40">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Bạn đang tìm gì..."
                  className="h-10 flex-1 bg-transparent px-4 text-sm text-black placeholder:text-neutral-500 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Tìm kiếm"
                  className="grid h-10 w-10 place-content-center bg-black hover:bg-black/90"
                >
                  <Search className="h-5 w-5 text-white cursor-pointer" />
                </button>
              </div>
            </div>
          </form>

          {/* Actions */}
          <nav className="ml-auto hidden items-center gap-6 md:flex">
            <Link
              to="/he-thong-cua-hang"
              className="flex items-center gap-2 hover:opacity-90"
            >
              <MapPin className="h-5 w-5" />
              <span className="text-sm">Cửa hàng</span>
            </Link>
            <Link
              to="/dang-nhap"
              className="flex  items-center gap-2 hover:opacity-90"
            >
              <User2 className="h-5 w-5" />
              <span className="text-sm">Đăng nhập</span>
            </Link>

            <a
              href="/gio-hang"
              className="relative flex items-center gap-2 hover:opacity-90"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="text-sm">Giỏ hàng</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-content-center rounded-full bg-white text-xs font-semibold text-black">
                  {cartCount}
                </span>
              )}
            </a>
          </nav>

          {/* Mobile buttons */}
          <div className="ml-auto flex items-center gap-2 md:hidden">
            <button
              className="grid h-9 w-9 place-content-center rounded-md bg-white"
              aria-label="Tìm kiếm"
              onClick={() => {
                // mở overlay tìm kiếm nếu muốn; tạm thời focus input ở nav dưới (simple)
                const el = document.getElementById("m-search");
                el?.focus();
              }}
            >
              <Search className="h-5 w-5 text-black" />
            </button>
            <button
              className="grid h-9 w-9 place-content-center rounded-md bg-white"
              onClick={() => setOpenMobile((v) => !v)}
              aria-label="Menu"
            >
              {openMobile ? (
                <X className="h-5 w-5 text-black" />
              ) : (
                <Menu className="h-5 w-5 text-black" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Primary nav (white bar) */}
      <div className="border-b border-neutral-200 bg-white">
       <div className="mx-auto hidden items-center px-4 md:flex justify-center">
  <ul className="flex items-center gap-2 py-3 text-sm font-bold">
            {primaryNav.map((item) => (
              <li key={item.label} className="shrink-0">
                <a
                  href={item.href}
                  className="group inline-flex items-center gap-1 rounded px-3 py-2 hover:bg-neutral-100"
                >
                  {/* icon kính lúp nhỏ cho "HÀNG MỚI" như ảnh demo */}
                  {item.label === "HÀNG MỚI" && (
                    <span role="img" aria-hidden className="mr-0.5">
                      🔎
                    </span>
                  )}
                  <span className="uppercase tracking-wide">{item.label}</span>
                  {item.children && (
                    <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:rotate-180 transition" />
                  )}
                  {item.badge}
                </a>
                {/* dropdown basic (hover) */}
                {item.children && (
                  <div className="invisible absolute mt-1 w-56 rounded-md border border-neutral-200 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                    <ul className="flex flex-col">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <a
                            href={c.href}
                            className="block rounded px-3 py-2 text-sm hover:bg-neutral-100"
                          >
                            {c.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden">
          {/* search mobile */}
          <div className="px-4 py-2">
            <div className="relative">
              <input
                id="m-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Bạn đang tìm gì..."
                className="w-full rounded-md border border-neutral-300 px-3 py-2 pr-10 text-sm focus:outline-none"
              />
              <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500" />
            </div>
          </div>

          {/* accordion menu */}
          {openMobile && (
            <ul className="space-y-1 border-t border-neutral-200 p-2">
              {primaryNav.map((item) => (
                <MobileItem key={item.label} item={item} />
              ))}
              <li className="mt-2 flex items-center justify-between rounded-md bg-black px-3 py-3 text-white">
                <a href="/gio-hang" className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Giỏ hàng</span>
                </a>
                {cartCount > 0 && (
                  <span className="grid h-5 min-w-5 place-content-center rounded-full bg-white px-1 text-xs font-semibold text-black">
                    {cartCount}
                  </span>
                )}
              </li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}

function MobileItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!item.children?.length;

  return (
    <li className="rounded-md">
      <div className="flex items-center">
        <a
          href={item.href}
          className="flex-1 rounded-md px-3 py-3 text-sm font-semibold hover:bg-neutral-100"
        >
          <span className="uppercase">{item.label}</span>
          {item.badge}
        </a>
        {hasChildren && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="mr-1 rounded p-2 text-neutral-600"
            aria-label="Mở danh mục"
          >
            <ChevronDown
              className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
      {hasChildren && open && (
        <ul className="mb-1 ml-2 space-y-1 rounded-md border-l border-neutral-200 pl-2">
          {item.children!.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                className="block rounded px-3 py-2 text-sm hover:bg-neutral-100"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
