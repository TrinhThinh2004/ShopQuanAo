import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import SideNav from "./SideNav";

type Props = {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

export default function AdminLayout({ title, actions, children }: Props) {
  const [isNavOpen, setNavOpen] = useState(true);

  return (
    <div className="flex h-screen w-full flex-col bg-neutral-50">
      <header className="z-10 flex h-[60px] flex-shrink-0 items-center justify-between gap-4 border-b bg-white/90 px-6 backdrop-blur">
        <div className="flex items-center gap-4">
          
          <Link
            to="/admin"
            className="text-lg font-extrabold tracking-wide hover:opacity-90"
          >
            Admin Dashboard
          </Link>
          <button
            className="hidden h-9 w-9 place-content-center rounded-md border border-neutral-200 lg:grid"
            onClick={() => setNavOpen(!isNavOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
        </div>
        <div className="text-sm text-neutral-600">Xin chào, Admin</div>
      </header>

      <div className="flex flex-grow overflow-hidden">
        <aside
          className={`flex-shrink-0 border-r bg-white transition-[width] duration-300 ease-in-out ${
            isNavOpen ? "w-[280px]" : "w-0"
          } overflow-y-auto`}
        >
          <div className="p-4">
            <SideNav />
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg font-extrabold tracking-wide">{title}</h1>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

