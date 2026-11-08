import Link from "next/link";
import { PageShell } from "./components/ui";

export default function NotFound() {
  return (
    <PageShell className="standard-page">
      <div className="route-state-box">
        <p className="eyebrow">Halaman tidak ditemukan (404)</p>
        <h1>Wilayah atau halaman yang Anda cari tidak tersedia.</h1>
        <p>
          Periksa kembali tautan atau pilih salah satu dari 68 kelurahan Kota
          Bogor melalui peta dan tabel peringkat.
        </p>
        <div className="route-state-actions">
          <Link href="/peta" className="button">
            Buka peta 68 kelurahan
          </Link>
          <Link href="/peringkat" className="quiet-button">
            Lihat daftar kelurahan
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

