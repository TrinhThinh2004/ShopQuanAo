// src/pages/Cart/CartPage.tsx
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, CreditCard, Truck, Wallet } from "lucide-react";
import { formatVnd } from "../../utils/format";

/* ========= Types ========= */
type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size?: string;
};

// Dạng lưu trong localStorage (đã từng push từ ProductCard)
type StoredCart = Array<{
  id?: string;
  qty?: number;
  size?: string;
  item?: { id?: string; name?: string; image?: string; price?: number };
  name?: string; // fallback
  image?: string; // fallback
  price?: number; // fallback
}>;

/* ========= Helpers ========= */

function normalizeCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const arr = raw as StoredCart;

  return arr
    .map((rec): CartItem | null => {
      const item = rec.item ?? {};
      const itemRec = item as Record<string, unknown>;

      const id =
        (typeof itemRec.id === "string" && itemRec.id) ||
        (typeof rec.id === "string" && rec.id) ||
        "";
      const name =
        (typeof itemRec.name === "string" && itemRec.name) ||
        (typeof rec.name === "string" && rec.name) ||
        "";
      const image =
        (typeof itemRec.image === "string" && itemRec.image) ||
        (typeof rec.image === "string" && rec.image) ||
        "";
      const price =
        (typeof itemRec.price === "number" && itemRec.price) ||
        (typeof rec.price === "number" && rec.price) ||
        0;
      const qty = typeof rec.qty === "number" ? rec.qty : 1;

      const size =
        typeof rec.size === "string"
          ? rec.size
          : typeof itemRec.size === "string"
          ? (itemRec.size as string)
          : undefined;

      if (!id || !name || !image) return null;

      const normalized: CartItem = { id, name, image, price, qty, size };
      return normalized;
    })
    .filter((x): x is CartItem => x !== null);
}

const SEED: CartItem[] = [
  {
    id: "1",
    name: "Áo Thun Nam ICONDENIM Orgnls",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    price: 299000,
    qty: 1,
    size: "M",
  },
  {
    id: "2",
    name: "Quần Jean Nam ICONDENIM Grey Baggy",
    image:
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop",
    price: 549000,
    qty: 1,
    size: "L",
  },
];

// Tailwind shortcut thay cho "className='input'"
const INPUT_CLS =
  "h-11 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black";

/* ========= Page ========= */
export default function Cart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        const normalized = normalizeCart(parsed);
        return normalized.length ? normalized : SEED;
      }
    } catch (err) {
      console.warn("Không đọc được cart từ localStorage:", err);
    }
    return SEED;
  });

  // form (mock — sau này bind API)
  const [country] = useState(", Vietnam 7000");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("0359744735");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [note, setNote] = useState("");
  const [pay, setPay] = useState<"cod" | "vnpay" | "momo">("cod");
  const [voucher, setVoucher] = useState("");
  const [applied, setApplied] = useState<{ code?: string; amount: number }>({
    amount: 0,
  });

  // sync localStorage (demo)
  useEffect(() => {
    const to = items.map((i) => ({
      id: i.id,
      qty: i.qty,
      item: { id: i.id, name: i.name, image: i.image, price: i.price },
      size: i.size,
    }));
    localStorage.setItem("cart", JSON.stringify(to));
  }, [items]);

  // prices
  const subTotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.qty, 0),
    [items]
  );
  const ship = useMemo(
    () => (subTotal >= 299000 || applied.code === "FREESHIP" ? 0 : 30000),
    [subTotal, applied]
  );
  const discount = applied.amount;
  const grand = Math.max(0, subTotal + ship - discount);

  function changeQty(id: string, delta: number) {
    setItems(
      (prev) =>
        prev
          .map((it) =>
            it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
          )
          .filter(Boolean) as CartItem[]
    );
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function applyVoucher() {
    const code = voucher.trim().toUpperCase();
    if (!code) return setApplied({ amount: 0 });
    if (code === "SEP30") setApplied({ code, amount: 30000 });
    else if (code === "FREESHIP") setApplied({ code, amount: 0 });
    else {
      setApplied({ amount: 0 });
      // demo
      alert("Mã không hợp lệ (demo). Thử SEP30 hoặc FREESHIP");
    }
  }

  function placeOrder() {
    if (!items.length) return;
    if (!name || !phone || !address || !city) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }
    alert(
      `Đặt hàng thành công (demo)!\nTổng thanh toán: ${formatVnd(
        grand
      )}\nHình thức: ${pay.toUpperCase()}`
    );
    localStorage.removeItem("cart");
    setItems([]);
  }

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 pb-28">
      <div className="mx-auto w-full max-w-6xl px-3 py-6 lg:px-0">
        <h1 className="mb-4 text-2xl font-extrabold">Giỏ hàng</h1>

        <div className="grid gap-6 lg:grid-cols-[1fr,0.9fr]">
          {/* LEFT: Shipping form & Payment */}
          <section className="space-y-4">
            <Card title="Thông tin đơn hàng">
              <div className="grid gap-3">
                <input value={country} disabled className={INPUT_CLS} />
                <input
                  placeholder="Họ và tên"
                  className={INPUT_CLS}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  placeholder="Số điện thoại"
                  className={INPUT_CLS}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  placeholder="Địa chỉ"
                  className={INPUT_CLS}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  <select
                    className={INPUT_CLS}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">Tỉnh/Thành phố</option>
                    <option>TP. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                    <option>Kiên Giang</option>
                  </select>
                  <select
                    className={INPUT_CLS}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    <option value="">Quận/Huyện</option>
                    <option>Phú Nhuận</option>
                    <option>Hai Bà Trưng</option>
                    <option>Thanh Khê</option>
                  </select>
                  <select
                    className={INPUT_CLS}
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                  >
                    <option value="">Phường/Xã</option>
                    <option>Phường 1</option>
                    <option>Phường 2</option>
                  </select>
                </div>
                <input
                  placeholder="Ghi chú thêm (VD: giao giờ hành chính)"
                  className={INPUT_CLS}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </Card>

            <Card title="Hình thức thanh toán">
              <div className="space-y-3">
                <PayRow
                  checked={pay === "cod"}
                  onChange={() => setPay("cod")}
                  title="Thanh toán khi giao hàng (COD)"
                  desc={
                    <>
                      <li>Khách hàng được kiểm tra hàng trước khi nhận.</li>
                      <li>Freeship mọi đơn hàng (áp dụng điều kiện).</li>
                    </>
                  }
                  icon={<Truck className="h-5 w-5" />}
                />
                <PayRow
                  checked={pay === "vnpay"}
                  onChange={() => setPay("vnpay")}
                  title="Ví điện tử VNPAY"
                  icon={<CreditCard className="h-5 w-5" />}
                />
                <PayRow
                  checked={pay === "momo"}
                  onChange={() => setPay("momo")}
                  title="Thanh toán MoMo"
                  icon={<Wallet className="h-5 w-5" />}
                />
              </div>
            </Card>
          </section>

          {/* RIGHT: Cart list & summary */}
          <section className="space-y-4">
            <Card>
              {items.length === 0 ? (
                <EmptyCart />
              ) : (
                <ul className="divide-y">
                  {items.map((it) => (
                    <li key={it.id} className="flex items-center gap-3 py-3">
                      <Link
                        to={`/san-pham/${it.id}`}
                        className="block h-20 w-20 shrink-0 overflow-hidden rounded-lg border"
                      >
                        <img
                          src={it.image}
                          alt={it.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/san-pham/${it.id}`}
                          className="line-clamp-2 font-semibold hover:underline"
                        >
                          {it.name}
                        </Link>
                        <div className="mt-1 text-sm text-neutral-600">
                          {it.size ? <>Size: {it.size} • </> : null}
                          Giá: {formatVnd(it.price)}
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <Qty
                            qty={it.qty}
                            onDec={() => changeQty(it.id, -1)}
                            onInc={() => changeQty(it.id, +1)}
                          />
                          <button
                            onClick={() => removeItem(it.id)}
                            className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100"
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="font-semibold">
                        {formatVnd(it.price * it.qty)}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card title="Ưu đãi dành cho bạn">
              <div className="flex gap-2">
                <input
                  placeholder="Nhập mã giảm giá (VD: SEP30, FREESHIP)"
                  className={`${INPUT_CLS} flex-1`}
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                />
                <button
                  onClick={applyVoucher}
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
              {applied.code && (
                <p className="mt-2 text-sm text-emerald-700">
                  Đã áp dụng mã <b>{applied.code}</b>
                </p>
              )}
            </Card>

            <Card title="Tóm tắt đơn hàng">
              <div className="space-y-2 text-sm">
                <Row label="Tạm tính" value={formatVnd(subTotal)} />
                <Row
                  label="Phí vận chuyển"
                  value={ship === 0 ? "Miễn phí" : formatVnd(ship)}
                />
                <Row
                  label="Voucher giảm"
                  value={discount ? `- ${formatVnd(discount)}` : formatVnd(0)}
                />
                <hr className="my-2" />
                <Row big label="Tổng" value={formatVnd(grand)} />
              </div>
            </Card>
          </section>
        </div>
      </div>

      {/* Bottom bar fixed */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 lg:px-0">
          <div className="text-sm text-neutral-600">
            {items.length ? (
              <>
                {items.length} sản phẩm • <b>{formatVnd(grand)}</b>
              </>
            ) : (
              "Giỏ hàng đang trống"
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-neutral-50"
            >
              Tiếp tục mua sắm
            </Link>
            <button
              onClick={placeOrder}
              disabled={!items.length}
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========= Small components ========= */

function Card({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      {title && <div className="border-b px-4 py-3 font-semibold">{title}</div>}
      <div className="space-y-3 p-4">{children}</div>
    </section>
  );
}

function Qty({
  qty,
  onDec,
  onInc,
}: {
  qty: number;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="flex items-center rounded-md border border-neutral-300">
      <button
        className="grid h-8 w-8 place-content-center hover:bg-neutral-50"
        onClick={onDec}
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        value={qty}
        readOnly
        className="h-8 w-12 border-x border-neutral-300 text-center outline-none"
      />
      <button
        className="grid h-8 w-8 place-content-center hover:bg-neutral-50"
        onClick={onInc}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

function PayRow({
  checked,
  onChange,
  title,
  icon,
  desc,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  icon: ReactNode;
  desc?: ReactNode;
}) {
  return (
    <label
      className={`block cursor-pointer rounded-lg border p-3 transition ${
        checked
          ? "border-black ring-1 ring-black/30"
          : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="radio"
          className="accent-black"
          checked={checked}
          onChange={onChange}
        />
        <span className="text-neutral-700">{icon}</span>
        <span className="font-semibold">{title}</span>
      </div>
      {desc && (
        <ul className="mt-2 list-disc pl-7 text-sm text-neutral-600">{desc}</ul>
      )}
    </label>
  );
}

function Row({
  label,
  value,
  big,
}: {
  label: string;
  value: string;
  big?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-neutral-600 ${big ? "text-base font-semibold" : ""}`}
      >
        {label}
      </span>
      <span className={`font-semibold ${big ? "text-base" : ""}`}>{value}</span>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="grid h-24 w-24 place-content-center rounded-full bg-amber-50">
        <span className="text-3xl">👜</span>
      </div>
      <h3 className="text-lg font-semibold">
        Hiện giỏ hàng của bạn không có sản phẩm nào!
      </h3>
      <p className="text-sm text-neutral-600">
        Về trang cửa hàng để chọn mua sản phẩm bạn nhé.
      </p>
      <Link
        to="/"
        className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
      >
        Mua sắm ngay
      </Link>
    </div>
  );
}
