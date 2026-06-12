import "./seller.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false }, // keep /seller out of search engines
};

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
