import axios from "axios";
import type { Product } from "../types/product";
const API_URL = import.meta.env.VITE_API_URL;


// Lấy tất cả sản phẩm
export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await axios.get(`${API_URL}/api/v1/products/get-all`);
    console.log("API products:", res.data.data);
    return Array.isArray(res.data.data) ? res.data.data : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
