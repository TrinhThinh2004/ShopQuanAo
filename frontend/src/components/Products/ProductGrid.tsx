import { useMemo, useState, useEffect } from "react";
import type { Product } from "../../types/product";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import Button from "../Button/Button"; // <— thêm import

type Props = {
  items: Product[];
  pageSize?: number;
  showSeeMore?: boolean; // 👈 bật/tắt nút "Xem thêm"
  seeMoreText?: string; // 👈 tuỳ biến text (mặc định "Xem thêm")
};

export default function ProductGrid({
  items,
  pageSize = 12,
  showSeeMore = false,
  seeMoreText = "Xem thêm",
}: Props) {
  const [page, setPage] = useState(1);

  // Reset về trang 1 khi dữ liệu đổi (tránh lệch trang)
  useEffect(() => setPage(1), [items, pageSize]);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const isLastPage = page >= pageCount;
  return (
    <section className="mx-auto mt-6 w-full max-w-6xl px-1 sm:px-0">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {pageItems.map((p) => (
          <ProductCard key={p.id} item={p} />
        ))}
      </div>

      {/* Nút “Xem thêm” chỉ hiện khi chưa ở trang cuối */}
      {showSeeMore && !isLastPage && (
        <div className="mt-4 flex justify-center">
          <Button onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
            {seeMoreText}
          </Button>
        </div>
      )}
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </section>
  );
}
