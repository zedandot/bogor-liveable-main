"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AdminHeader, Icon } from "../../components/ui";
import { dimensions } from "../../data";

export default function PeriodPage() {
  const [year, setYear] = useState("2027");
  const [periodName, setPeriodName] = useState("Pembaruan data 2027");
  const [notes, setNotes] = useState(
    "Pemutakhiran tahunan indikator kelayakhunian Kota Bogor."
  );
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSavedMessage(
      `Periode "${periodName}" (${year}) berhasil disiapkan untuk 68 kelurahan.`
    );
  };

  const handleReset = () => {
    setYear("2027");
    setPeriodName("Pembaruan data 2027");
    setNotes("Pemutakhiran tahunan indikator kelayakhunian Kota Bogor.");
    setSavedMessage(null);
  };

  return (
    <>
      <AdminHeader
        title="Tambah periode data."
        description="Siapkan periode baru sebelum mengisi nilai indikator untuk seluruh kelurahan."
      />
      {savedMessage && (
        <div className="admin-alert" role="status" aria-live="polite">
          <Icon name="check" />
          <div>
            <b>Periode berhasil dibuat</b>
            <p>{savedMessage}</p>
          </div>
          <Link className="quiet-button" href="/admin/data">
            Buka tabel indikator
          </Link>
        </div>
      )}
      <div className="period-layout">
        <form className="period-form" onSubmit={handleSubmit}>
          <section>
            <p className="eyebrow">Informasi periode</p>
            <h2>Identitas data</h2>
            <div className="form-grid">
              <label>
                Tahun data
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </label>
              <label>
                Nama periode
                <input
                  value={periodName}
                  onChange={(e) => setPeriodName(e.target.value)}
                  required
                />
              </label>
              <label className="wide">
                Catatan periode
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
            </div>
          </section>
          <section>
            <p className="eyebrow">Cakupan indikator</p>
            <h2>Pilih data yang diperbarui</h2>
            <div className="period-checks">
              {dimensions.map((d) => (
                <label key={d.name}>
                  <input type="checkbox" defaultChecked />
                  <span>
                    <i style={{ background: d.color }} />
                    {d.name}
                  </span>
                  <small>Siapkan nilai untuk 68 kelurahan</small>
                </label>
              ))}
            </div>
          </section>
          <div className="edit-actions">
            <button
              className="quiet-button"
              type="button"
              onClick={handleReset}
            >
              Atur ulang
            </button>
            <button className="button" type="submit">
              Buat periode <Icon name="arrow" />
            </button>
          </div>
        </form>
        <aside className="period-help">
          <Icon name="info" size={24} />
          <h3>Sebelum membuat periode</h3>
          <p>
            Pastikan data tersedia untuk seluruh 68 kelurahan. Nilai yang belum
            lengkap tidak dapat digunakan untuk menghitung ulang indeks.
          </p>
          <div>
            <b>Alur berikutnya</b>
            <span>1 · Buat periode</span>
            <span>2 · Isi nilai indikator</span>
            <span>3 · Validasi kelengkapan</span>
            <span>4 · Hitung ulang indeks</span>
          </div>
        </aside>
      </div>
    </>
  );
}
