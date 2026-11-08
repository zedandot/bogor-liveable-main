"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminHeader, Icon } from "../components/ui";
import { districts } from "../data";

export default function AdminPage() {
  const [recalculated, setRecalculated] = useState(false);

  return (
    <>
      <AdminHeader
        title="Ringkasan pengelola data."
        description="Pantau status kelengkapan data dan kelola proses perhitungan indeks 68 kelurahan Kota Bogor."
        action={
          <button
            type="button"
            className="button"
            onClick={() => setRecalculated(true)}
          >
            <Icon name="sliders" />
            {recalculated ? "Indeks telah diperbarui" : "Hitung ulang indeks"}
          </button>
        }
      />

      <div className="admin-alert" role="status" aria-live="polite">
        <Icon name="info" />
        <div>
          <b>
            {recalculated
              ? "Perhitungan ulang selesai untuk 68 kelurahan"
              : "Ada perubahan nilai yang siap dihitung ulang"}
          </b>
          <p>
            {recalculated
              ? "Seluruh skor dimensi dan peringkat 68 kelurahan telah disinkronkan."
              : "Tinjau riwayat pembaruan indikator sebelum memublikasikan periode."}
          </p>
        </div>
        <Link className="quiet-button" href="/admin/riwayat">
          Tinjau perubahan
        </Link>
      </div>

      <section className="admin-stats">
        <article>
          <span>Wilayah</span>
          <b>68</b>
          <small>kelurahan · 6 kecamatan</small>
        </article>
        <article>
          <span>Indikator</span>
          <b>10</b>
          <small>dalam 6 dimensi</small>
        </article>
        <article>
          <span>Periode aktif</span>
          <b>2026</b>
          <small>geodatabase utama</small>
        </article>
        <article>
          <span>Status indeks</span>
          <b>{recalculated ? "Sinkron" : "Siap"}</b>
          <small>[ADMIN] · Ruang Bogor</small>
        </article>
      </section>

      <section className="admin-grid">
        <article className="admin-panel activity-panel">
          <header>
            <div>
              <p className="eyebrow">Aktivitas terbaru</p>
              <h2>Perubahan data</h2>
            </div>
            <Link href="/admin/riwayat">Lihat semua</Link>
          </header>
          {[
            ["Bantarjati", "Tutupan vegetasi", "24,6%", "26,8%", "Pembaruan terakhir"],
            ["Pasir Mulya", "Jarak rumah sakit", "4.280 m", "4.114 m", "Pembaruan terakhir"],
            ["Babakan", "Rasio sekolah", "7,9", "8,1", "Pembaruan terakhir"],
            ["Tegallega", "Skor sosial", "0,65", "0,67", "Pembaruan sebelumnya"],
          ].map((x) => (
            <div key={x[0]}>
              <span aria-hidden="true">{x[0].slice(0, 2).toUpperCase()}</span>
              <p>
                <b>{x[0]}</b>
                <small>
                  {x[1]} · {x[4]}
                </small>
              </p>
              <i>
                {x[2]} → <strong>{x[3]}</strong>
              </i>
            </div>
          ))}
        </article>

        <article className="admin-panel completeness">
          <header>
            <div>
              <p className="eyebrow">Kelengkapan data</p>
              <h2>Periode 2026</h2>
            </div>
          </header>
          <div className="completion-ring">
            <strong>100%</strong>
            <span>680 dari 680 nilai</span>
          </div>
          <div className="completion-legend">
            <span>
              <i />
              Lengkap <b>680</b>
            </span>
            <span>
              <i />
              Perlu dilengkapi <b>0</b>
            </span>
          </div>
          <Link className="quiet-button full" href="/admin/data">
            Buka tabel indikator <Icon name="arrow" />
          </Link>
        </article>
      </section>

      <section className="admin-panel district-admin">
        <header>
          <div>
            <p className="eyebrow">Ringkasan wilayah</p>
            <h2>Data per kecamatan</h2>
          </div>
        </header>
        {districts.map((d) => (
          <div key={d.name}>
            <strong>{d.name}</strong>
            <span>{d.villages} kelurahan</span>
            <i>
              <b style={{ width: d.score * 100 + "%" }} />
            </i>
            <span>{d.score.toFixed(2).replace(".", ",")}</span>
            <small>100% lengkap</small>
          </div>
        ))}
      </section>
    </>
  );
}
