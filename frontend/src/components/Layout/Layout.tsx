// src/components/Layout/Layout.tsx
import type { ReactNode } from "react";
import Header from "../Header/Header";
import Banner from "../Banner/Banner";
import Footer from "../Footer/Footer";
import ContactFloating from "../../components/FloatingContact/FloatingContact";

type Props = {
  children: ReactNode;
  noBanner?: boolean;
  noFooter?: boolean;
};

export default function Layout({
  children,
  noBanner = false,
  noFooter = false,
}: Props) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Header />
      <div className="h-[64px] md:h-[96px]" aria-hidden />

      {!noBanner && (
        <div className="bg-amber-50">
          <div className="mx-auto w-full max-w-7xl px-4 py-4">
            <Banner />
          </div>
        </div>
      )}

      <main className={noBanner ? "bg-white" : "bg-amber-50"}>
        <div className="mx-auto w-full max-w-7xl px-4 py-10 flex-1">
          {children}
        </div>
      </main>

      {/* Liên hệ nổi – bám mép phải, giữa màn hình */}

      {!noFooter && <Footer />}

      <ContactFloating />
    </div>
  );
}
