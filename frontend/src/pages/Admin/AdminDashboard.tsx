// src/pages/Admin/AdminDashboard.tsx
import { useMemo, useState } from "react";
import {
  LayoutGrid,
  ShoppingBag,
  Users2,
  TicketPercent,
  Package,
  MessageSquare,
  Settings,
  BarChart3,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Link } from "react-router-dom";

/* ================= Mock helpers ================= */
type TimeRange = "day" | "week" | "month";
type Point = { label: string; value: number };

function genData(range: TimeRange): Point[] {
  if (range === "day") {
    return Array.from({ length: 24 }, (_, i) => ({
      label: `${String(i).padStart(2, "0")}:00`,
      value: Math.round(Math.random() * 50) + (i < 9 ? 10 : 0),
    }));
  }

  if (range === "week") {
    const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    return days.map((d, i) => ({
      label: d,
      value: Math.round(Math.random() * 300) + (i >= 4 ? 120 : 20),
    }));
  }

  // month
  return Array.from({ length: 30 }, (_, i) => ({
    label: String(i + 1),
    value: Math.round(Math.random() * 400) + (i % 6 === 0 ? 200 : 40),
  }));
}

const statFmt = (n: number) => n.toLocaleString("vi-VN");

/* ================= Page ================= */
export default function AdminDashboard() {
  const [range, setRange] = useState<TimeRange>("day");
  const [openSide, setOpenSide] = useState(false); // mobile sidebar
  const data = useMemo(() => genData(range), [range]);

  const todayOrders = useMemo(
    () => data.reduce((s, p) => s + p.value, 0),
    [data]
  );
  const todayRevenue = todayOrders * 199000;
  const convRate = 2.8;

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
            <h1 className="text-lg font-extrabold tracking-wide">
              Admin Dashboard
            </h1>
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
            "absolute left-0 top-0 h-full w-[82%] max-w-[300px] translate-x-0 rounded-r-2xl border-r border-neutral-200 bg-white p-3 shadow-xl transition-transform",
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
        <section className="lg:col-span-4 space-y-6">
          {/* KPI cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Đơn hôm nay"
              value={statFmt(todayOrders)}
              sub="+12% so với hôm qua"
              icon={<ShoppingBag className="h-5 w-5" />}
            />
            <KpiCard
              title="Doanh thu ước tính"
              value={statFmt(todayRevenue)}
              currency="₫"
              sub="+8% so với hôm qua"
              icon={<BarChart3 className="h-5 w-5" />}
            />
            <KpiCard
              title="Khách mới"
              value={statFmt(Math.round(todayOrders * 0.18))}
              sub="Theo dõi theo kênh"
              icon={<Users2 className="h-5 w-5" />}
            />
            <KpiCard
              title="Tỉ lệ chuyển đổi"
              value={convRate.toFixed(1)}
              suffix="%"
              sub="Kênh organic tăng"
              icon={<LayoutGrid className="h-5 w-5" />}
            />
          </div>

          {/* Quick links */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="mb-3 text-base font-extrabold">Quản lý nhanh</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ManageTile
                to="/admin/orders"
                title="Quản lý Đơn hàng"
                desc="Xem, đổi trạng thái, in hoá đơn"
              >
                <ShoppingBag className="h-5 w-5" />
              </ManageTile>
              <ManageTile
                to="/admin/products"
                title="Quản lý Sản phẩm"
                desc="Tạo mới, chỉnh sửa, tồn kho"
              >
                <Package className="h-5 w-5" />
              </ManageTile>
              <ManageTile
                to="/admin/customers"
                title="Quản lý Khách hàng"
                desc="Thông tin, phân nhóm, ghi chú"
              >
                <Users2 className="h-5 w-5" />
              </ManageTile>
              <ManageTile
                to="/admin/vouchers"
                title="Mã giảm giá"
                desc="Tạo chiến dịch, theo dõi dùng mã"
              >
                <TicketPercent className="h-5 w-5" />
              </ManageTile>
              <ManageTile
                to="/admin/reviews"
                title="Đánh giá"
                desc="Duyệt/ẩn, phản hồi khách hàng"
              >
                <MessageSquare className="h-5 w-5" />
              </ManageTile>
              <ManageTile
                to="/admin/settings"
                title="Cấu hình cửa hàng"
                desc="Thanh toán, vận chuyển, kênh bán"
              >
                <Settings className="h-5 w-5" />
              </ManageTile>
            </div>
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-extrabold">Phân tích đơn hàng</h2>
                <p className="text-sm text-neutral-600">
                  Số lượng đơn theo{" "}
                  {range === "day"
                    ? "giờ (hôm nay)"
                    : range === "week"
                    ? "ngày trong tuần"
                    : "ngày trong tháng"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <RangeBtn
                  active={range === "day"}
                  onClick={() => setRange("day")}
                >
                  Ngày
                </RangeBtn>
                <RangeBtn
                  active={range === "week"}
                  onClick={() => setRange("week")}
                >
                  Tuần
                </RangeBtn>
                <RangeBtn
                  active={range === "month"}
                  onClick={() => setRange("month")}
                >
                  Tháng
                </RangeBtn>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data}
                  margin={{ left: 8, right: 8, top: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="currentColor"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="currentColor"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      borderColor: "rgb(229 231 235)",
                    }}
                    formatter={(val) => [`${val}`, "Đơn"]}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="currentColor"
                    fill="url(#g)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent orders */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <h2 className="mb-3 text-base font-extrabold">Đơn hàng gần đây</h2>
            <ul className="divide-y">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      #ORD{String(1023 + i)} • Áo thun ICONDENIM • 2 sản phẩm
                    </p>
                    <p className="text-xs text-neutral-600">
                      Khách: 09xx xxx 735 • COD
                    </p>
                  </div>
                  <div className="ml-3 flex items-center gap-3">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      Thành công
                    </span>
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================= SideNav ================= */
function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const Item = ({
    icon,
    label,
    to = "#",
    active,
  }: {
    icon: React.ReactNode;
    label: string;
    to?: string;
    active?: boolean;
  }) => (
    <Link
      to={to}
      onClick={onNavigate}
      className={[
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold",
        active
          ? "bg-black text-white"
          : "text-neutral-800 hover:bg-neutral-100",
      ].join(" ")}
    >
      <span className={active ? "text-white" : "text-neutral-700"}>{icon}</span>
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="grid gap-1">
      <Item icon={<LayoutGrid />} label="Tổng quan" active to="/admin" />
      <Item icon={<ShoppingBag />} label="Đơn hàng" to="/admin/orders" />
      <Item icon={<Package />} label="Sản phẩm" to="/admin/products" />
      <Item icon={<Users2 />} label="Khách hàng" to="/admin/customers" />
      <Item icon={<TicketPercent />} label="Mã giảm giá" to="/admin/vouchers" />
      <Item icon={<MessageSquare />} label="Đánh giá" to="/admin/reviews" />
      <Item icon={<Settings />} label="Cấu hình" to="/admin/settings" />
    </nav>
  );
}

/* ================= Small components ================= */
function KpiCard({
  title,
  value,
  sub,
  icon,
  currency,
  suffix,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  currency?: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-600">{title}</p>
        <span className="rounded-lg bg-neutral-100 p-2 text-neutral-700">
          {icon}
        </span>
      </div>
      <div className="mt-2 text-2xl font-extrabold">
        {currency ? <span className="mr-1">{currency}</span> : null}
        {value}
        {suffix ? (
          <span className="ml-1 text-lg font-bold">{suffix}</span>
        ) : null}
      </div>
      {sub && <p className="mt-1 text-xs text-neutral-500">{sub}</p>}
    </div>
  );
}

function ManageTile({
  to,
  title,
  desc,
  children,
}: {
  to: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-3 rounded-lg border border-neutral-200 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
    >
      <span className="rounded-lg bg-neutral-100 p-3 text-neutral-700">
        {children}
      </span>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="truncate text-sm text-neutral-600">{desc}</p>
      </div>
    </Link>
  );
}

function RangeBtn({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-md px-3 py-1.5 text-sm font-semibold transition",
        active
          ? "bg-black text-white"
          : "border border-neutral-200 hover:bg-neutral-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
