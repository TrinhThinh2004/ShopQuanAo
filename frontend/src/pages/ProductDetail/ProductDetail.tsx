import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { Product } from "../../types/product";
import { formatVnd } from "../../utils/format";
import SizeGuideModal from "../../components/Modals/SizeGuideModal";

/** ------------------ MOCK DATA ------------------ */
const MOCK: Record<
  string,
  Product & {
    images: string[];

    sizes: string[];
    description: string;
    sku: string;
    category: string;
  }
> = {
  "1": {
    product_id: 1,
    name: "Áo Thun Nam ICONDENIM Orgnls",
    image_url:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342452485-86ff0a0d98ab?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    price: 299_000,
    isNew: true,
    voucherText: "Voucher 30K",
    description:
      "COTTON 220GSM – MỀM MẠI & THOÁNG KHÍ. In graphic ORGNLS tinh thần streetwear. Form regular gọn gàng dễ mặc.",
    sku: "ATID0640-01",
    category: "Áo Thun",
    stock_quantity: 100,
    created_at: "2025-10-13T00:00:00Z",
    updated_at: "2025-10-13T00:00:00Z",
  },
};
type Review = {
  id: string;
  user: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string; // ISO
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    user: "Nguyễn Minh",
    rating: 5,
    comment: "Áo đẹp, chất dày vừa, form chuẩn. Sẽ ủng hộ tiếp!",
    createdAt: "2025-08-02T12:30:00Z",
  },
  {
    id: "r2",
    user: "Trần Bảo",
    rating: 4,
    comment: "Màu đẹp, mặc thoải mái. Góp ý: giao nhanh hơn chút là perfect.",
    createdAt: "2025-08-01T09:05:00Z",
  },
  {
    id: "r3",
    user: "Lê Hồng",
    rating: 5,
    comment: "Đúng mô tả, form regular dễ phối đồ.",
    createdAt: "2025-07-29T15:10:00Z",
  },
];

function avgRating(list: Review[]): number {
  if (!list.length) return 0;
  const sum = list.reduce((s, r) => s + r.rating, 0);
  return Math.round((sum / list.length) * 10) / 10; // 1 chữ số thập phân
}

function countByStar(list: Review[]): Record<1 | 2 | 3 | 4 | 5, number> {
  return {
    5: list.filter((r) => r.rating === 5).length as number,
    4: list.filter((r) => r.rating === 4).length as number,
    3: list.filter((r) => r.rating === 3).length as number,
    2: list.filter((r) => r.rating === 2).length as number,
    1: list.filter((r) => r.rating === 1).length as number,
  };
}

function formatDateVN(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** ------------------------------------------------ */

function addToCartLS(item: Product, qty: number, size?: string) {
  const raw = localStorage.getItem("cart");
  const cart: Array<{
    product_id: number;
    qty: number;
    item: Product;
    size?: string;
  }> = raw ? JSON.parse(raw) : [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const keyMatch = (c: any) => c.product_id === item.product_id && c.size === size;
  const idx = cart.findIndex(keyMatch);
  if (idx >= 0) cart[idx].qty += qty;
  else cart.push({ product_id: item.product_id, qty, item, size });
  localStorage.setItem("cart", JSON.stringify(cart));
  // eslint-disable-next-line no-alert
  alert("Đã thêm vào giỏ!");
}

export default function ProductDetail() {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { id = "1" } = useParams(); // demo: default 1
  const data = useMemo(() => MOCK[id] ?? Object.values(MOCK)[0], [id]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [size, setSize] = useState<string | undefined>(data.sizes[0]);
  const [qty, setQty] = useState(1);
  const mainImg = data.images[activeIdx] ?? data.image_url;

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="mx-auto w-full max-w-6xl px-3 py-6 lg:px-0">
        <div className="grid gap-5 md:grid-cols-2">
          {/* LEFT: GALLERY */}
          <section className="rounded-xl border border-neutral-200 bg-white p-3">
            {/* Ảnh lớn: fit toàn bộ ảnh trong khung, không crop */}
            <div className="overflow-hidden rounded-lg bg-white">
              <div className="h-[360px] md:h-[480px] grid place-items-center ">
                <img
                  src={mainImg}
                  alt={data.name}
                  className="max-h-full max-w-full object-contain rounded"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Thumbnails */}
            <ul className="mt-3 grid grid-cols-5 gap-2">
              {data.images.map((src, i) => (
                <li key={i}>
                  <button
                    onClick={() => setActiveIdx(i)}
                    className={[
                      "block overflow-hidden rounded-md border",
                      i === activeIdx
                        ? "border-black"
                        : "border-neutral-200 hover:border-neutral-300",
                    ].join(" ")}
                  >
                    <div className="h-16 w-full grid place-items-center bg-white">
                      <img
                        src={src}
                        alt={`thumb-${i}`}
                        className="max-h-full max-w-full object-contain rounded"
                        loading="lazy"
                      />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* RIGHT: INFO */}
          <section className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
            <h1 className="text-xl font-semibold">{data.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <Link
                to={`/danh-muc/${encodeURIComponent(data.category)}`}
                className="text-xs text-neutral-500 hover:underline"
              >
                Loại: {data.category}
              </Link>
              <span className="text-xs text-neutral-400">|</span>
              <span className="text-xs text-neutral-500">MSP: {data.sku}</span>
              {data.isNew && (
                <span className="ml-2 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Còn Hàng
                </span>
              )}
            </div>

            <div className="mt-3 text-2xl font-bold text-black">
              {formatVnd(Number(data.price))}
            </div>

            {/* Promo box */}
            <div className="mt-3 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-amber-600" />
                KHUYẾN MÃI - ƯU ĐÃI
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                <li>Nhập mã SEP9 GIẢM 9K đơn từ 0đ</li>
                <li>Nhập mã SEP30 GIẢM 30K đơn từ 299K</li>
                <li>Nhập mã SEP50 GIẢM 50K đơn từ 599K</li>
                <li>Nhập mã SEP100 GIẢM 100K đơn từ 999K</li>
                <li>FREESHIP đơn từ 399K</li>
              </ul>
            </div>

            {/* Mã áp dụng */}
            <div className="mt-3 flex flex-wrap gap-2">
              {["SEP9", "SEP30", "SEP50", "SEP100"].map((m) => (
                <span
                  key={m}
                  className="inline-block rounded bg-black px-3 py-1 text-xs font-bold text-white"
                >
                  {m}
                </span>
              ))}
            </div>

            {/* Size */}
            <div className="mt-4">
              <div className="text-sm font-medium">
                Kích thước:{" "}
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="ml-2 text-xs text-sky-600 hover:underline cursor-pointer"
                >
                  Hướng dẫn chọn size
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {data.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={[
                      "min-w-10 rounded border px-3 py-1.5 text-sm cursor-pointer",
                      size === s
                        ? "border-black bg-black text-white"
                        : "border-neutral-300 bg-white hover:border-neutral-500",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + CTA */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-md border border-neutral-300">
                <button
                  className="grid h-9 w-9 place-content-center hover:bg-neutral-50"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="h-9 w-14 border-x border-neutral-300 text-center outline-none"
                />
                <button
                  className="grid h-9 w-9 place-content-center hover:bg-neutral-50"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2 font-semibold text-white transition hover:bg-sky-600 cursor-pointer"
                onClick={() => addToCartLS(data, qty, size)}
              >
                <ShoppingCart className="h-4 w-4 " />
                THÊM VÀO GIỎ
              </button>

              <button
                className="rounded-md border border-black px-4 py-2 font-semibold hover:bg-black hover:text-white cursor-pointer"
                onClick={() => addToCartLS(data, qty, size)}
              >
                MUA NGAY
              </button>
            </div>

            {/* Store ship info */}
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm text-neutral-600">
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4" /> Miễn phí vận chuyển đơn từ 299K
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Bảo hành trong vòng 30 ngày
              </span>
            </div>
          </section>
        </div>

        {/* ----------------- TABS ----------------- */}
        <Tabs className="mt-6">
          <Tab title="MÔ TẢ">
            <div className="rounded-xl border border-neutral-200 bg-white p-5">
              <h3 className="text-lg font-semibold">160STORE – {data.name}</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
                <li>Chất liệu: Thun Cotton 220GSM</li>
                <li>Form: Regular</li>
              </ul>
              <hr className="my-4" />
              <div className="space-y-3 text-sm leading-7">
                <p>► COTTON 220GSM – MỀM MẠI & THOÁNG KHÍ</p>
                <p>
                  Chất liệu dày vừa, mềm mịn, co giãn tốt, thoải mái cả ngày.
                </p>
                <p>► HÌNH IN ORGNLS – TINH THẦN STREETWEAR</p>
                <p>{data.description}</p>
              </div>
            </div>
          </Tab>

          <Tab title="CHÍNH SÁCH GIAO HÀNG">
            <ImgPanel
              src="https://file.hstatic.net/1000253775/file/cs_giaohanh.jpg"
              alt="Chính sách giao hàng"
            />
          </Tab>

          <Tab title="CHÍNH SÁCH ĐỔI HÀNG">
            <ImgPanel
              src="https://file.hstatic.net/1000253775/file/doitra_1.jpg"
              alt="Chính sách đổi hàng"
            />
            <ImgPanel
              src="https://file.hstatic.net/1000253775/file/doitra_2.jpg"
              alt="Chính sách đổi hàng"
            />
          </Tab>
        </Tabs>

        {/* ----------------- REVIEWS ----------------- */}
        {/* ----------------- REVIEWS ----------------- */}
        <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
          <div className="grid gap-6 md:grid-cols-[260px,1fr]">
            {/* left filter & tổng quan */}
            <div>
              <h3 className="text-2xl font-extrabold leading-tight">
                ĐÁNH GIÁ SẢN PHẨM
              </h3>

              {/* Tổng quan */}
              <div className="mt-4 flex items-center gap-3">
                <div className="text-[44px] font-extrabold leading-none">
                  {avgRating(REVIEWS)}
                </div>
                <div className="mt-0.5">
                  <StarRow
                    stars={Math.round(avgRating(REVIEWS)) as 1 | 2 | 3 | 4 | 5}
                  />
                  <div className="text-sm font-semibold text-neutral-700">
                    {REVIEWS.length} đánh giá
                  </div>
                </div>
              </div>

              {/* Phân bố sao */}
              <ul className="mt-4 space-y-2 text-sm">
                {([5, 4, 3, 2, 1] as const).map((s) => {
                  const distribution = countByStar(REVIEWS);
                  const count = distribution[s];
                  const percent = REVIEWS.length
                    ? Math.round((count / REVIEWS.length) * 100)
                    : 0;
                  return (
                    <li key={s} className="flex items-center gap-2">
                      <div className="w-8 text-right">{s}★</div>
                      <div className="relative h-2 flex-1 rounded bg-neutral-200">
                        <div
                          className="absolute left-0 top-0 h-2 rounded bg-yellow-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="w-10 text-right tabular-nums">
                        {count}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* right list: bình luận */}
            <div>
              {REVIEWS.length === 0 ? (
                <div className="py-10 text-center text-sm text-neutral-600">
                  Sản phẩm chưa có đánh giá
                </div>
              ) : (
                <ul className="space-y-4">
                  {REVIEWS.map((r) => (
                    <li
                      key={r.id}
                      className="rounded-lg border border-neutral-200 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{r.user}</div>
                        <div className="text-xs text-neutral-500">
                          {formatDateVN(r.createdAt)}
                        </div>
                      </div>
                      <div className="mt-1">
                        <StarRow stars={r.rating} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-neutral-800">
                        {r.comment}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </div>
      <SizeGuideModal
        open={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        title={`Bảng size ${data.name}`}
        // dữ liệu mẫu – sau này đổi thành link từ API
        src="https://cdn.hstatic.net/products/1000253775/polo-regular_e5cb6669ccc243d09ba2d0ae4fdb6143_master.png"
      />
    </div>
  );
}

/* ---------------- helpers ---------------- */

import type { ReactNode, ReactElement } from "react";

type TabProps = { title: string; children: ReactNode };

function Tabs({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  // ép kiểu rõ ràng cho phần tử Tab
  const items = (
    Array.isArray(children) ? children : [children]
  ) as ReactElement<TabProps>[];
  const [idx, setIdx] = useState(0);

  return (
    <div className={className}>
      <div className="flex gap-2">
        {items.map((c, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={[
              "rounded-t-lg border px-3 py-2 text-sm font-semibold",
              i === idx
                ? "border-neutral-200 border-b-white bg-white"
                : "border-transparent bg-neutral-100 hover:bg-neutral-200",
            ].join(" ")}
          >
            {c.props.title}
          </button>
        ))}
      </div>
      <div className="rounded-b-xl border border-neutral-200 bg-white p-0">
        {items[idx]}
      </div>
    </div>
  );
}

function Tab({ children }: TabProps) {
  return <div className="p-5">{children}</div>;
}

function ImgPanel({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="p-5">
      <img
        src={src}
        alt={alt}
        className="mx-auto w-full max-w-4xl rounded-lg border"
      />
    </div>
  );
}
function StarRow({ stars }: { stars: number }) {
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < stars ? "text-yellow-400 fill-yellow-400" : "text-neutral-300"
          }`}
        />
      ))}
    </div>
  );
}
