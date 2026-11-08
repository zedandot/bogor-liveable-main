import type { Metadata } from "next";
import { SplashLoader } from "./components/splash-loader";
import "./globals.css";
import "./inner.css";
import "./admin.css";
import "./revision.css";

export const metadata: Metadata = {
  title: "Ruang Bogor: Peta Kelayakhunian 68 Kelurahan Kota Bogor",
  description:
    "Peta dan analisis tingkat kelayakhunian 68 kelurahan dan 6 kecamatan di Kota Bogor berdasarkan 10 indikator spasial dan atribut.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SplashLoader />
        <div className="rb-site-stage">{children}</div>
      </body>
    </html>
  );
}
