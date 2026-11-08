"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PageShell } from "./components/ui";

export default function Error({
  error,
  reset,
  retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  retry?: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageShell className="standard-page">
      <div className="route-state-box" role="alert">
        <p className="eyebrow">Kendala pemuatan</p>
        <h1>Halaman tidak dapat ditampilkan saat ini.</h1>
        <p>
          Terjadi kendala saat memproses permintaan. Silakan coba muat ulang
          halaman atau kembali ke beranda.
        </p>
        <div className="route-state-actions">
          <button
            type="button"
            className="button"
            onClick={() => (retry ?? reset)?.()}
          >
            Coba lagi
          </button>
          <Link href="/" className="quiet-button">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
