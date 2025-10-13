
import { useEffect, useState } from "react";
import Hero from "../../components/Hero/Hero";
import ProductGrid from "../../components/Products/ProductGrid";
import type { Product } from "../../types/product";
import { fetchProducts } from "../../api/products";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        const transformedProducts = data.map((product, index) => ({
          ...product,
          isNew: index % 3 === 0,
          voucherText: index % 2 === 0 ? "Voucher 30K" : undefined,
        }));
        setProducts(transformedProducts);
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4">
        <Hero />
        <div className="mx-auto mt-6 w-full max-w-6xl px-1 sm:px-0">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4">
        <Hero />
        <div className="mx-auto mt-6 w-full max-w-6xl px-1 sm:px-0">
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-b from-amber-50 to-amber-100 pb-10 pt-4">
      {/* Hero "HÀNG MỚI" */}
      <Hero />

      {/* Lưới sản phẩm + phân trang */}
      <ProductGrid
        items={products}
        pageSize={12}
        showSeeMore 
        seeMoreText="Xem thêm"
      />
    </div>
  );
}

