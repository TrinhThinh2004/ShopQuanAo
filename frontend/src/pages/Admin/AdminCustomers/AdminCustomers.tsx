// src/pages/Admin/AdminCustomers.tsx
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  UserPlus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Tags,
} from "lucide-react";
import { formatVnd } from "../../../utils/format";
import AdminLayout from "../_Components/AdminLayout";

/* ================= Types ================= */
type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number; // VND
  active: boolean; // true=đang hoạt động, false=đã chặn
  createdAt: string; // ISO
};

type EditPayload = Omit<
  Customer,
  "id" | "createdAt" | "totalOrders" | "totalSpent"
> & {
  id?: string;
};

/* ================= Seed & Storage ================= */
const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: "C0001",
    name: "Nguyễn Văn A",
    phone: "0901 234 567",
    email: "a.nguyen@example.com",
    totalOrders: 12,
    totalSpent: 3890000,
    active: true,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "C0002",
    name: "Trần Thị B",
    phone: "0902 345 678",
    email: "b.tran@example.com",
    totalOrders: 5,
    totalSpent: 1590000,
    active: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "C0003",
    name: "Lê Minh C",
    phone: "0903 456 789",
    email: "c.le@example.com",
    totalOrders: 1,
    totalSpent: 299000,
    active: false,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "C0004",
    name: "Phạm Thu D",
    phone: "0904 567 890",
    email: "d.pham@example.com",
    totalOrders: 8,
    totalSpent: 2450000,
    active: true,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "C0005",
    name: "Đỗ Quang E",
    phone: "0905 678 901",
    email: "e.do@example.com",
    totalOrders: 3,
    totalSpent: 799000,
    active: true,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "C0006",
    name: "Võ Hải F",
    phone: "0906 789 012",
    email: "f.vo@example.com",
    totalOrders: 21,
    totalSpent: 6890000,
    active: true,
    createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
  },
  {
    id: "C0007",
    name: "Bùi Lan G",
    phone: "0907 890 123",
    email: "g.bui@example.com",
    totalOrders: 0,
    totalSpent: 0,
    active: false,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: "C0008",
    name: "Huỳnh Đức H",
    phone: "0908 901 234",
    email: "h.huynh@example.com",
    totalOrders: 11,
    totalSpent: 3150000,
    active: true,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "C0009",
    name: "Tạ Mỹ I",
    phone: "0909 012 345",
    email: "i.ta@example.com",
    totalOrders: 4,
    totalSpent: 1190000,
    active: true,
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: "C0010",
    name: "Trương Gia K",
    phone: "0910 123 456",
    email: "k.truong@example.com",
    totalOrders: 6,
    totalSpent: 1750000,
    active: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
];

const LS_KEY = "admin_customers";

function loadCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter((x): x is Customer => {
          const r = x as Record<string, unknown>;
          return (
            typeof r.id === "string" &&
            typeof r.name === "string" &&
            typeof r.phone === "string" &&
            typeof r.email === "string" &&
            typeof r.totalOrders === "number" &&
            typeof r.totalSpent === "number" &&
            typeof r.active === "boolean" &&
            typeof r.createdAt === "string"
          );
        });
      }
    }
  } catch (err) {
    console.warn("[admin_customers] Lỗi đọc localStorage:", err);
  }
  // seed mặc định
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(SAMPLE_CUSTOMERS));
  } catch (err) {
    console.warn("[admin_customers] Lỗi ghi localStorage:", err);
  }
  return SAMPLE_CUSTOMERS;
}

function saveCustomers(items: Customer[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn("[admin_customers] Lỗi ghi localStorage:", err);
  }
}

/* ================= Page ================= */
const PAGE_SIZE = 10;

export default function AdminCustomers() {
  const [items, setItems] = useState<Customer[]>(() => loadCustomers());
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "blocked">("all");
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  // đồng bộ LS
  useEffect(() => saveCustomers(items), [items]);

  // filter/search
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return items.filter((c) => {
      const okText =
        !text ||
        c.name.toLowerCase().includes(text) ||
        c.email.toLowerCase().includes(text) ||
        c.phone.replace(/\s/g, "").includes(text.replace(/\s/g, ""));
      const okStatus =
        status === "all" || (status === "active" ? c.active : !c.active);
      return okText && okStatus;
    });
  }, [items, q, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  // khi thay filter => về trang 1
  useEffect(() => {
    setPage(1);
  }, [q, status]);

  const allCheckedOnPage =
    paged.length > 0 && paged.every((c) => checked[c.id]);
  const someCheckedOnPage = paged.some((c) => checked[c.id]);

  function toggleAllOnPage(e: ChangeEvent<HTMLInputElement>) {
    const on = e.target.checked;
    setChecked((prev) => {
      const next = { ...prev };
      paged.forEach((c) => {
        next[c.id] = on;
      });
      return next;
    });
  }

  function toggleOne(id: string, on: boolean) {
    setChecked((prev) => ({ ...prev, [id]: on }));
  }

  function delSelected() {
    const ids = Object.keys(checked).filter((k) => checked[k]);
    if (!ids.length) return;
    if (!confirm(`Xoá ${ids.length} khách hàng đã chọn?`)) return;
    setItems((prev) => prev.filter((c) => !ids.includes(c.id)));
    setChecked({});
  }

  function setActiveSelected(active: boolean) {
    const ids = Object.keys(checked).filter((k) => checked[k]);
    if (!ids.length) return;
    setItems((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, active } : c))
    );
    setChecked({});
  }

  function removeOne(id: string) {
    if (!confirm("Xoá khách hàng này?")) return;
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  function toggleActive(id: string) {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  }

  function onSubmitForm(payload: EditPayload) {
    // Create
    if (!payload.id) {
      const id = `C${String(Date.now()).slice(-8)}`;
      const newItem: Customer = {
        id,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        active: payload.active,
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev]);
      return;
    }
    // Update
    setItems((prev) =>
      prev.map((c) =>
        c.id === payload.id
          ? {
              ...c,
              name: payload.name,
              phone: payload.phone,
              email: payload.email,
              active: payload.active,
            }
          : c
      )
    );
  }

  return (
    <AdminLayout
      title="Quản lý khách hàng"
      actions={
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90"
        >
          <UserPlus className="h-4 w-4" />
          Thêm khách hàng
        </button>
      }
    >
      <div className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* Filters */}
          <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm theo tên, email hoặc SĐT…"
                className="h-10 w-full rounded-md border border-neutral-300 pl-10 pr-3 text-sm outline-none focus:border-black"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            </div>

            <div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang hoạt động</option>
                <option value="blocked">Đã chặn</option>
              </select>
            </div>

            {/* Bulk actions */}
            <div className="flex flex-wrap items-center gap-2 lg:col-span-2">
              <button
                onClick={() => setActiveSelected(true)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
                title="Mở chặn các KH đã chọn"
              >
                Mở chặn
              </button>
              <button
                onClick={() => setActiveSelected(false)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
                title="Chặn các KH đã chọn"
              >
                Chặn
              </button>
              <button
                onClick={delSelected}
                className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                title="Xoá các KH đã chọn"
              >
                <Trash2 className="h-4 w-4" />
                Xoá
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-[920px] w-full table-fixed">
                <thead className="bg-neutral-50 text-left text-sm font-semibold text-neutral-700">
                  <tr>
                    <th className="w-10 px-3 py-3">
                      <input
                        type="checkbox"
                        className="accent-black"
                        checked={allCheckedOnPage}
                        ref={(el) => {
                          if (el)
                            el.indeterminate =
                              !allCheckedOnPage && someCheckedOnPage;
                        }}
                        onChange={toggleAllOnPage}
                      />
                    </th>
                    <th className="px-3 py-3">Khách hàng</th>
                    <th className="w-[170px] px-3 py-3">Email</th>
                    <th className="w-[130px] px-3 py-3">Điện thoại</th>
                    <th className="w-[110px] px-3 py-3">Đơn hàng</th>
                    <th className="w-[140px] px-3 py-3">Tổng chi</th>
                    <th className="w-[120px] px-3 py-3">Trạng thái</th>
                    <th className="w-[140px] px-3 py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {paged.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50/50">
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          className="accent-black"
                          checked={!!checked[c.id]}
                          onChange={(e) => toggleOne(c.id, e.target.checked)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-semibold">{c.name}</div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
                          <Tags className="h-3.5 w-3.5" />
                          <span>
                            {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 truncate">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-neutral-500" />
                          <span className="truncate">{c.email}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-neutral-500" />
                          <span>{c.phone}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">{c.totalOrders}</td>
                      <td className="px-3 py-2 font-semibold">
                        {formatVnd(c.totalSpent)}
                      </td>
                      <td className="px-3 py-2">
                        {c.active ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                            Đang hoạt động
                          </span>
                        ) : (
                          <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-700">
                            Đã chặn
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditing(c);
                              setShowForm(true);
                            }}
                            className="rounded-md border px-2 py-1.5 text-xs hover:bg-neutral-50"
                            title="Sửa"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleActive(c.id)}
                            className="rounded-md border px-2 py-1.5 text-xs hover:bg-neutral-50"
                            title={
                              c.active
                                ? "Chặn khách hàng"
                                : "Mở chặn khách hàng"
                            }
                          >
                            {c.active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => removeOne(c.id)}
                            className="rounded-md border px-2 py-1.5 text-xs text-red-600 hover:bg-red-50"
                            title="Xoá"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paged.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-3 py-10 text-center text-sm text-neutral-600"
                      >
                        Không có khách hàng phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer: paging info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t px-3 py-3 text-sm">
              <div>
                Hiển thị <b>{paged.length}</b> / <b>{filtered.length}</b> khách
                hàng
              </div>
              <PaginationSimple
                page={page}
                pageCount={pageCount}
                onChange={(p) => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setPage(p);
                }}
              />
            </div>
          </div>
        </div>

        {/* Modal form */}
        {showForm && (
          <CustomerFormModal
            initial={editing ?? undefined}
            onClose={() => setShowForm(false)}
            onSubmit={(payload) => {
              onSubmitForm(payload);
              setShowForm(false);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}

/* ================= Small components ================= */
function PaginationSimple({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;

  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  const from = Math.max(1, page - half);
  const to = Math.min(pageCount, from + windowSize - 1);
  const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const itemCls =
    "rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-40";

  return (
    <nav
      className="flex items-center justify-center gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        className={itemCls}
        onClick={() => onChange(1)}
        disabled={page === 1}
      >
        « Đầu
      </button>
      <button
        type="button"
        className={itemCls}
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        ‹ Trước
      </button>

      {from > 1 && <span className="px-1 text-neutral-500">…</span>}

      {pages.map((p) => (
        <button
          type="button"
          key={p}
          onClick={() => onChange(p)}
          className={
            p === page
              ? `${itemCls} border-black bg-black text-white hover:bg-black`
              : itemCls
          }
        >
          {p}
        </button>
      ))}

      {to < pageCount && <span className="px-1 text-neutral-500">…</span>}

      <button
        type="button"
        className={itemCls}
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
      >
        Sau ›
      </button>
      <button
        type="button"
        className={itemCls}
        onClick={() => onChange(pageCount)}
        disabled={page === pageCount}
      >
        Cuối »
      </button>
    </nav>
  );
}

function CustomerFormModal({
  initial,
  onClose,
  onSubmit,
}: {
  initial?: Customer;
  onClose: () => void;
  onSubmit: (payload: EditPayload) => void;
}) {
  // Khởi tạo form: lấy các trường editable, giữ id nếu edit
  const [form, setForm] = useState<EditPayload>(() => {
    if (initial) {
      const { id, name, phone, email, active } = initial;
      return { id, name, phone, email, active };
    }
    return {
      name: "",
      phone: "",
      email: "",
      active: true,
    };
  });

  function handleChange<K extends keyof EditPayload>(
    key: K,
    val: EditPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function submit() {
    // validate tối thiểu
    if (!form.name.trim()) return alert("Vui lòng nhập tên khách hàng");
    if (!form.phone.trim()) return alert("Vui lòng nhập số điện thoại");
    if (!form.email.trim()) return alert("Vui lòng nhập email");
    onSubmit(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items=end justify-center bg-black/30 p-0 sm:items-center sm:p-6">
      <div className="w-full max-w-xl overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
        <div className="border-b px-4 py-3">
          <h3 className="text-base font-extrabold">
            {form.id ? "Cập nhật khách hàng" : "Thêm khách hàng"}
          </h3>
        </div>

        <div className="space-y-3 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-600">
                Họ tên
              </label>
              <input
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-neutral-600">
                Số điện thoại
              </label>
              <input
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-neutral-600">
              Email
            </label>
            <input
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm outline-none focus:border-black"
              placeholder="name@example.com"
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-black"
              checked={form.active}
              onChange={(e) => handleChange("active", e.target.checked)}
            />
            Đang hoạt động
          </label>

          <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm">
            <div className="font-semibold">Xem trước</div>
            <div className="mt-1 text-neutral-700">
              {form.name} • {form.email} • {form.phone} •{" "}
              {form.active ? "Đang hoạt động" : "Đã chặn"}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
          <button
            onClick={onClose}
            className="rounded-md border px-3 py-2 text-sm hover:bg-neutral-50"
          >
            Huỷ
          </button>
          <button
            onClick={submit}
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-black/90"
          >
            {form.id ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}
