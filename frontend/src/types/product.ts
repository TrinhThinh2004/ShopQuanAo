export type Product = {
  id: string;
  name: string;
  image: string;
  price: number; // đơn vị VND
  isNew?: boolean;
  voucherText?: string; // ví dụ: "Voucher 30K"
  category?: string; // <-- thêm (optional để không vỡ các chỗ cũ)
  tags?: string[]; // <-- tùy, nếu bạn lọc theo tag
};
