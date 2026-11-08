"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AdminHeader, Icon } from "../../../components/ui";
import { indicators } from "../../../data";

export default function EditPage() {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <>
      <AdminHeader
        title="Edit data Bantarjati."
        description="Perbarui nilai mentah indikator untuk periode 2026. Skor dihitung ulang secara terpisah."
      />
      <div className="edit-breadcrumb">
        <Link href="/admin/data">Data indikator</Link>
        <Icon name="chevron" size={14} />
        <span>Bantarjati</span>
      </div>
      {saved && (
        <div className="admin-alert" role="status" aria-live="polite">
          <Icon name="check" />
          <div>
            <b>Perubahan nilai Bantarjati berhasil disimpan</b>
            <p>
              Nilai mentah telah diperbarui. Jalankan perhitungan ulang indeks
              pada halaman Ringkasan untuk menerapkan ke peringkat.
            </p>
          </div>
          <Link className="quiet-button" href="/admin">
            Ke ringkasan admin
          </Link>
        </div>
      )}
      <form className="edit-form" onSubmit={handleSubmit}>
        <section>
          <header>
            <div>
              <p className="eyebrow">Identitas wilayah</p>
              <h2>Bantarjati</h2>
            </div>
            <span>Bogor Utara · Kode 3271051003</span>
          </header>
        </section>
        {[
          "Kesehatan",
          "Pendidikan & sosial",
          "Lingkungan",
          "Transportasi & ekonomi",
          "Di luar indeks",
        ].map((group, gi) => (
          <section key={group}>
            <header>
              <div>
                <p className="eyebrow">Bagian {gi + 1}</p>
                <h2>{group}</h2>
              </div>
            </header>
            <div className="form-grid">
              {indicators.slice(gi * 2, gi * 2 + 2).map((row) => (
                <label key={row[0]}>
                  {row[0]}
                  <div>
                    <input
                      defaultValue={row[1].split(" ")[0].replace("%", "")}
                    />
                    <span>
                      {row[1].includes("%")
                        ? "%"
                        : row[1].split(" ").slice(1).join(" ") || "indeks"}
                    </span>
                  </div>
                  <small>
                    Sumber: {row[2]} · {row[3]}
                  </small>
                </label>
              ))}
            </div>
          </section>
        ))}
        <div className="edit-actions">
          <div>
            <Icon name="info" />
            <p>
              Perubahan disimpan sebagai nilai mentah dan belum mengubah skor
              indeks.
            </p>
          </div>
          <Link href="/admin/data" className="quiet-button">
            Batal
          </Link>
          <button className="button" type="submit">
            Simpan perubahan
          </button>
        </div>
      </form>
    </>
  );
}
