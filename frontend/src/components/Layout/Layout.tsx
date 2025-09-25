import type { PropsWithChildren } from "react";
import Header from "../Header/Header";
import Hero from "../Hero/Hero"; 
import Footer from "../Footer/Footer";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-amber-50 pb-12">
        <div className="container mx-auto py-4">
          <Header />
        </div>
        <div className="container mx-auto">
          <Hero />
        </div>
      </div>

      <main className="container mx-auto flex-1 py-10">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
