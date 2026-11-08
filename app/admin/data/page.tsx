"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminHeader, Icon } from "../../components/ui";
import { districts, ranking } from "../../data";
import { fmt } from "../../lib/livability";

const PAGE_SIZE = 10;

export default function DataPage() {
  const [query, setQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("Semua kecamatan");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ranking.filter((r) => {
      if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedDistrict !== "Semua kecamatan" && r.district !== selectedDistrict) return false;
      return true;
    });
  }, [query, selectedDistrict]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <>
      <AdminHeader
        title="Data indikator."
        description="Tinjau dan perbarui nilai mentah untuk setiap kelurahan pada periode aktif (68 kelurahan Kota Bogor)."
        action={
          <a className="button" href="/data/kelurahan.geojson" download>
            <Icon name="download" />
            Ekspor Data GeoJSON
          </a>
        }
      />
      <div className="data-toolbar">
        <label>
          <Icon name="search" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Cari kelurahan..."
          />
        </label>
        <select>
          <option>Periode 2026</option>
          <option>Periode 2023</option>
        </select>
        <select
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setPage(1);
          }}
        >
          <option>Semua kecamatan</option>
          {districts.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
        <select>
          <option>Semua indikator</option>
          <option>Kesehatan</option>
          <option>Pendidikan</option>
          <option>Lingkungan</option>
          <option>Transportasi</option>
          <option>Ekonomi</option>
        </select>
      </div>

      <div className="admin-data-table">
        <div className="table-head">
          <span>Kelurahan</span>
          <span>Kecamatan</span>
          <span>Cakupan faskes</span>
          <span>Jarak RS</span>
          <span>Vegetasi</span>
          <span>Status</span>
          <span />
        </div>
        {rows.map((r) => (
          <div className="table-row" key={r.kode}>
            <strong>{r.name}</strong>
            <span>{r.district}</span>
            <span>{fmt(r.cakupan_faskes_pct, 1)}%</span>
            <span>{Math.round(r.jarak_rs_m).toLocaleString("id-ID")} m</span>
            <span>{fmt(r.vegetasi_pct, 1)}%</span>
            <span className="complete-status">
              <i />
              Lengkap
            </span>
            <Link href={`/wilayah/${r.name.toLowerCase()}`}>
              <Icon name="arrow" size={15} />
              Detail
            </Link>
          </div>
        ))}
      </div>

      <div className="pagination admin-pagination">
        <span>
          Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}–
          {Math.min(currentPage * PAGE_SIZE, filtered.length)} dari{" "}
          {filtered.length} kelurahan
        </span>
        <div>
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={n === currentPage ? "active" : ""}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
