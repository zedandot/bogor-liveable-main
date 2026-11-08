import { PageShell } from "./components/ui";

export default function Loading() {
  return (
    <PageShell className="standard-page">
      <div className="route-state-box" role="status" aria-live="polite">
        <p className="eyebrow">Memuat halaman</p>
        <h1>Menyiapkan data Kota Bogor...</h1>
        <p>Mohon tunggu sebentar sementara atribut geospasial dimuat.</p>
      </div>
    </PageShell>
  );
}

