import type { ReactNode } from "react";
import { NavBar } from "./NavBar";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
