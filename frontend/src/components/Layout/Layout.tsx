import type { PropsWithChildren } from "react";
import Header from "../Header/Header";
import Hero from "../Hero/Hero"; 
import Footer from "../Footer/Footer";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="">
        <Header />
      </div>
      <div className="container mx-auto">
        <Hero />
        </div>

      <main className="container mx-auto flex-1 py-10">
        {children}
      </main>

      <Footer />
    </>
  );
};

export default Layout;
