"use client";

import { useMemo, useState } from "react";
import { AdminHeader, Icon } from "../../components/ui";

const historyData = [
  ["Hari ini, 09.42", "Bantarjati", "Tutupan vegetasi", "24,6%", "26,8%", "[ADMIN]", "Perubahan nilai"],
  ["Hari ini, 09.26", "Pasir Mulya", "Jarak rumah sakit", "4.280 m", "4.114 m", "[ADMIN]", "Perubahan nilai"],
  ["Hari ini, 08.51", "Babakan", "Rasio sekolah", "7,9", "8,1", "[ADMIN]", "Perubahan nilai"],
  ["28 Okt, 16.10", "Tegallega", "Skor sosial", "0,65", "0,67", "[ADMIN]", "Perubahan nilai"],
  ["28 Okt, 15.44", "Katulampa", "Kerapatan jalan", "10,8", "11,2", "[ADMIN]", "Perubahan nilai"],
  ["27 Okt, 11.20", "Periode 2026", "Perhitungan indeks", "Awal", "Selesai", "Sistem", "Perhitungan indeks"],
];

export default function HistoryPage() {
  const [query, setQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("Semua aktivitas");

  const filtered = useMemo(() => {
    return historyData.filter((row) => {
      if (
        activityFilter !== "Semua aktivitas" &&
        row[6] !== activityFilter
      )
        return false;
      if (
        query &&
        !row[1].toLowerCase().includes(query.toLowerCase()) &&
        !row[2].toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [query, activityFilter]);

  const exportCsv = () => {
    const header = "Waktu,Wilayah,Indikator,Sebelum,Sesudah,Pelaku\n";
    const body = filtered
      .map((r) => r.slice(0, 6).map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "riwayat-perubahan-ruang-bogor.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AdminHeader
        title="Riwayat perubahan."
        description="Jejak setiap pembaruan data, pelaku, serta nilai sebelum dan sesudah perubahan."
        action={
          <button
            type="button"
            className="quiet-button"
            onClick={exportCsv}
          >
            <Icon name="download" />
            Unduh CSV riwayat
          </button>
        }
      />
      <div className="data-toolbar">
        <label>
          <Icon name="search" />
          <input
            value={query}
            aria-label="Cari wilayah atau indikator"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari wilayah atau indikator..."
          />
        </label>
        <select
          aria-label="Filter jenis aktivitas"
          value={activityFilter}
          onChange={(e) => setActivityFilter(e.target.value)}
        >
          <option>Semua aktivitas</option>
          <option>Perubahan nilai</option>
          <option>Perhitungan indeks</option>
        </select>
      </div>
      <section className="history-list">
        <div className="history-head">
          <span>Waktu</span>
          <span>Wilayah</span>
          <span>Indikator / aktivitas</span>
          <span>Perubahan</span>
          <span>Pelaku</span>
        </div>
        {filtered.length > 0 ? (
          filtered.map((x, i) => (
            <div key={x[0] + x[1]}>
              <span>{x[0]}</span>
              <strong>{x[1]}</strong>
              <span>{x[2]}</span>
              <span
                className={
                  x[6] === "Perhitungan indeks"
                    ? "system-change"
                    : "change-values"
                }
              >
                <i>{x[3]}</i>
                <Icon name="arrow" size={14} />
                <b>{x[4]}</b>
              </span>
              <span className="actor">
                <i aria-hidden="true">{x[5].charAt(0)}</i>
                {x[5]}
              </span>
            </div>
          ))
        ) : (
          <div className="table-empty-state" role="status">
            <p>Tidak ada catatan riwayat yang cocok dengan filter.</p>
            <button
              type="button"
              className="quiet-button"
              onClick={() => {
                setQuery("");
                setActivityFilter("Semua aktivitas");
              }}
            >
              Tampilkan semua riwayat
            </button>
          </div>
        )}
      </section>
      <div className="audit-note">
        <Icon name="history" />
        <p>
          <b>Catatan audit tidak dapat diubah.</b> Semua aktivitas pengelola
          data disimpan untuk menjaga akuntabilitas data.
        </p>
      </div>
    </>
  );
}
