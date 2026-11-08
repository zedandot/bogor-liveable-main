import type { Metadata } from "next";
import "./globals.css";
import "./inner.css";
import "./admin.css";
import "./revision.css";

export const metadata: Metadata = {
  title: "Ruang Bogor — Peta Kelayakhunian Kota",
  description: "Jelajahi dan analisis tingkat kelayakhunian 68 kelurahan di Kota Bogor.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
