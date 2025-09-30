import type { MouseEvent } from "react";

type Props = {
  page: number; // trang hiện tại (>=1)
  pageCount: number; // tổng số trang (>=1)
  onPageChange: (p: number) => void;
  windowSize?: number; // số nút trang hiển thị (mặc định 5)
};

export default function Pagination({
  page,
  pageCount,
  onPageChange,
  windowSize = 5,
}: Props) {
  if (pageCount <= 1) return null;

  const current = Math.min(Math.max(1, page), pageCount);
  const half = Math.floor(windowSize / 2);

  let from = Math.max(1, current - half);
  const to = Math.min(pageCount, from + windowSize - 1);
  if (to - from + 1 < windowSize) {
    from = Math.max(1, to - windowSize + 1);
  }

  const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);

  const itemCls =
    "rounded-md border px-3 py-1.5 text-sm transition disabled:opacity-40 hover:bg-neutral-50";

  const onChange = (p: number) => {
    if (p !== current) onPageChange(p);
  };

  const stop = (e: MouseEvent) => e.preventDefault();

  return (
    <nav
      className="mt-6 flex items-center justify-center gap-2"
      aria-label="Pagination"
      onMouseDown={stop}
    >
      <button
        type="button"
        className={itemCls}
        onClick={() => onChange(1)}
        disabled={current === 1}
      >
        « Đầu
      </button>

      <button
        type="button"
        className={itemCls}
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
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
            p === current
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
        onClick={() => onChange(Math.min(pageCount, current + 1))}
        disabled={current === pageCount}
      >
        Sau ›
      </button>

      <button
        type="button"
        className={itemCls}
        onClick={() => onChange(pageCount)}
        disabled={current === pageCount}
      >
        Cuối »
      </button>
    </nav>
  );
}
