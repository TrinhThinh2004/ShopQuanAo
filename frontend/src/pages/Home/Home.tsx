import Hero from "../../components/Hero/Hero";
import ProductGrid from "../../components/Products/ProductGrid";
import type { Product } from "../../types/product";

// MOCK: tạo tầm 40 sản phẩm cho có phân trang
const baseImgs = [
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1503342452485-86ff0a0d98ab?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=1200&auto=format&fit=crop",
];

const MOCK_PRODUCTS: Product[] = Array.from({ length: 40 }, (_, i) => {
  const idx = i % baseImgs.length;
  return {
    id: String(i + 1),
    name: [
      "Áo Polo Nam ICONDENIM Braided Stripes",
      "Áo Polo Nam ICONDENIM Heroic",
      "Quần Jean Nam ICONDENIM Grey Baggy",
      "Mũ ICONDENIM Conqueror Bear",
      "Quần Short Nam RUNPOW Flash Move",
    ][idx],
    image: baseImgs[idx],
    price: [399000, 359000, 549000, 249000, 299000][idx],
    isNew: i % 3 === 0,
    voucherText: i % 2 === 0 ? "Voucher 30K" : undefined,
  };
});

export default function Home() {
  return (
    <div className="space-y-6 bg-gradient-to-b from-amber-50 to-amber-100  pb-10 pt-4">
      {/* Hero “HÀNG MỚI” */}
      <Hero />

      {/* Lưới sản phẩm + phân trang */}
      <ProductGrid
        items={MOCK_PRODUCTS}
        pageSize={12}
        showSeeMore // 👈 bật nút "Xem thêm"
        seeMoreText="Xem thêm"
      />
    </div>
  );
}
