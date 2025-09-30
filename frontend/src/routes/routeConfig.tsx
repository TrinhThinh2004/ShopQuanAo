// src/routes/routeConfig.tsx
import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import Layout from "../components/Layout/Layout";
import { PATHS } from "./paths";

// Public (lazy)
const Home = lazy(() => import("../pages/Home/Home"));
const ProductDetail = lazy(
  () => import("../pages/ProductDetail/ProductDetail")
);
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const StoreLocator = lazy(() => import("../pages/Stores/StoreLocator"));
const Cart = lazy(() => import("../pages/Cart/Cart"));
const Search = lazy(() => import("../pages/Search/Search"));

// Admin (lazy)
const AdminDashboard = lazy(
  () => import("../pages/Admin/AdminDashboard/AdminDashboard")
);
const AdminOrders = lazy(() => import("../pages/Admin/Orders/AdminOrders"));
const AdminProducts = lazy(
  () => import("../pages/Admin/AdminProducts/AdminProducts")
);
const AdminCustomers = lazy(
  () => import("../pages/Admin/AdminCustomers/AdminCustomers")
);

// ❗️Loại bỏ children khỏi Layout props vì children sẽ được wrap ở AppRoutes
type PublicLayoutProps = Omit<React.ComponentProps<typeof Layout>, "children">;

// ✅ Kiểu component an toàn, không dùng `any`, hỗ trợ cả lazy và non-lazy
type PageElement =
  | ComponentType<Record<string, unknown>>
  | LazyExoticComponent<ComponentType<Record<string, unknown>>>;

type LayoutWrapper =
  | { type: "none" }
  | { type: "public"; props?: PublicLayoutProps };

type RouteItem = {
  path: string;
  element: PageElement;
  layout?: LayoutWrapper;
};

export const ROUTES: RouteItem[] = [
  // Public
  { path: PATHS.HOME, element: Home, layout: { type: "public" } },
  {
    path: PATHS.PRODUCT_DETAIL,
    element: ProductDetail,
    layout: { type: "public" },
  },
  { path: PATHS.LOGIN, element: Login, layout: { type: "none" } },
  { path: PATHS.REGISTER, element: Register, layout: { type: "none" } },
  {
    path: PATHS.STORE_LOCATOR,
    element: StoreLocator,
    layout: { type: "public" },
  },
  {
    path: PATHS.CART,
    element: Cart,
    layout: { type: "public", props: { noBanner: true, noFooter: true } },
  },
  {
    path: PATHS.SEARCH,
    element: Search,
    layout: { type: "public", props: { noBanner: true, noFooter: true } },
  },

  // Admin (đã tự bọc AdminLayout bên trong)
  { path: PATHS.ADMIN, element: AdminDashboard, layout: { type: "none" } },
  { path: PATHS.ADMIN_ORDERS, element: AdminOrders, layout: { type: "none" } },
  {
    path: PATHS.ADMIN_PRODUCTS,
    element: AdminProducts,
    layout: { type: "none" },
  },
  {
    path: PATHS.ADMIN_CUSTOMERS,
    element: AdminCustomers,
    layout: { type: "none" },
  },
];
