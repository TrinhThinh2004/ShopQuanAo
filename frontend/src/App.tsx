// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScrollToTop from "./routes/ScrollToTop";

import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import StoreLocator from "./pages/Stores/StoreLocator";
import Cart from "./pages/Cart/Cart";
import Search from "./pages/Search/Search";
import AdminDashboard from "./pages/Admin/AdminDashboard";
function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/san-pham/:id"
          element={
            <Layout>
              <ProductDetail />
            </Layout>
          }
        />
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />} />
        <Route
          path="/he-thong-cua-hang"
          element={
            <Layout>
              <StoreLocator />
            </Layout>
          }
        />
        <Route
          path="/gio-hang"
          element={
            <Layout noBanner noFooter>
              <Cart />
            </Layout>
          }
        />
        <Route
          path="/tim-kiem"
          element={
            <Layout noBanner noFooter>
              <Search />
            </Layout>
          }
        />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
