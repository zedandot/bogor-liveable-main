"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon, PageIntro, PageShell } from "../components/ui";
import { districts, ranking } from "../data";
import { classes, classify, fmt, slugify } from "../lib/livability";

const PAGE_SIZE = 12;

export default function RankingPage() {
  const [query, setQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("Semua kecamatan");
  const [classFilter, setClassFilter] = useState("Semua klasifikasi");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return ranking.filter((r) => {
      if (query && !r.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (districtFilter !== "Semua kecamatan" && r.district !== districtFilter) return false;
      if (classFilter !== "Semua klasifikasi" && r.className !== classFilter) return false;
      return true;
    });
  }, [query, districtFilter, classFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const top = ranking[0];
  const median = ranking[Math.floor(ranking.length / 2)];
  const counts = classes.map(
    (c) => ranking.filter((r) => classify(r.skor_livable).label === c.label).length
  );

  const reset = () => {
    setQuery("");
    setDistrictFilter("Semua kecamatan");
    setClassFilter("Semua klasifikasi");
    setPage(1);
  };

  return (
    <PageShell className="standard-page">
      <PageIntro
        eyebrow="Peringkat wilayah"
        title="Lihat siapa unggul, pahami alasannya."
        description="Urutan 68 kelurahan berdasarkan indeks kelayakhunian. Gunakan filter untuk menemukan wilayah yang ingin Anda kaji."
        action={
          <a className="button" href="/data/kelurahan.geojson" download>
            <Icon name="download" />
            Ekspor GeoJSON
          </a>
        }
      />

      <section className="ranking-summary">
        <article>
          <span>Skor tertinggi</span>
          <b>{fmt(top.skor_livable)}</b>
          <p>
            {top.name} · {top.district}
          </p>
        </article>
        <article>
          <span>Median kota</span>
          <b>{fmt(median.skor_livable)}</b>
          <p>{median.className}</p>
        </article>
        <article>
          <span>Rentang skor</span>
          <b>{fmt(top.skor_livable - ranking[ranking.length - 1].skor_livable)}</b>
          <p>0,00 hingga {fmt(top.skor_livable)}</p>
        </article>
        <div className="class-distribution">
          <span>Klasifikasi 68 kelurahan</span>
          <div>
            {counts.map((n, i) => (
              <i
                key={classes[i].label}
                style={{
                  width: `${Math.max(3, Math.round((n / ranking.length) * 100))}%`,
                  background: classes[i].color,
                }}
              />
            ))}
          </div>
          <small>
            {counts[0]} sangat layak · {counts[1]} layak · {counts[2]} cukup · {counts[3]} tidak layak · {counts[4]} sangat tidak layak
          </small>
        </div>
      </section>

      <section className="ranking-table-wrap">
        <div className="table-controls">
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
          <select
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
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
          <select
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setPage(1);
            }}
          >
            <option>Semua klasifikasi</option>
            {classes.map((c) => (
              <option key={c.label} value={c.label}>
                {c.label}
              </option>
            ))}
          </select>
          <button type="button" className="reset-button" onClick={reset}>
            Reset
          </button>
        </div>

        <div className="ranking-table">
          <div className="table-head">
            <span>Peringkat</span>
            <span>Kelurahan</span>
            <span>Kecamatan</span>
            <span>Skor</span>
            <span>Klasifikasi</span>
            <span>Penduduk</span>
          </div>
          {pageRows.map((r) => (
            <Link
              href={`/wilayah/${slugify(r.name)}`}
              className="table-row"
              key={r.kode}
            >
              <span className={r.rank <= 3 ? "medal" : ""}>
                #{String(r.rank).padStart(2, "0")}
              </span>
              <strong>{r.name}</strong>
              <span>{r.district}</span>
              <b>{fmt(r.skor_livable)}</b>
              <span>
                <i
                  className="status-dot"
                  style={{ background: classify(r.skor_livable).color }}
                />
                {r.className}
              </span>
              <span>{r.penduduk.toLocaleString("id-ID")} jiwa</span>
            </Link>
          ))}
        </div>

        <div className="pagination">
          <span>
            Menampilkan{" "}
            {filtered.length === 0
              ? 0
              : (currentPage - 1) * PAGE_SIZE + 1}
            –{Math.min(currentPage * PAGE_SIZE, filtered.length)} dari{" "}
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
      </section>
    </PageShell>
  );
}
