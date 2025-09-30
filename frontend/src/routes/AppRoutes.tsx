// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { ROUTES } from "./routeConfig";
import Layout from "../components/Layout/Layout";

function FullPageLoader() {
  return (
    <div className="grid min-h-[40vh] place-content-center text-sm text-neutral-600">
      Đang tải…
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        {ROUTES.map(({ path, element: Comp, layout }, idx) => {
          let wrapped = <Comp />;
          if (layout?.type === "public") {
            wrapped = <Layout {...(layout.props || {})}>{wrapped}</Layout>;
          }
          // if (layout?.type === "admin") wrapped = <AdminLayout>{wrapped}</AdminLayout>;

          return <Route key={idx} path={path} element={wrapped} />;
        })}
        {/* 404 optional
        <Route path="*" element={<NotFound />} />
        */}
      </Routes>
    </Suspense>
  );
}
