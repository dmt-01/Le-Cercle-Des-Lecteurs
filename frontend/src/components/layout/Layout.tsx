import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="layout flex flex-col min-h-screen">
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
