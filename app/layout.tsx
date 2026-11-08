import type { Metadata } from "next";
import { SplashLoader } from "./components/splash-loader";
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
    <html
      lang="id"
      className="h-full antialiased"
      data-splash="active"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <SplashLoader />
        <div className="rb-site-stage">{children}</div>
      </body>
    </html>
  );
}
