import "./globals.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Home | IBEX Web Dashboard',
  description: 'Home | IBEX Web Dashboard',
};

export default function RootLayout(
  { children }: {children: ReactNode}
) {
  return (
    <html lang="en">
      <body className="dark">
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
