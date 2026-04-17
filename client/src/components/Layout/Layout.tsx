import type { ReactNode } from "react";
import Navbar from "../Navbar/Navbar";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-container">{children}</main>
    </div>
  );
}