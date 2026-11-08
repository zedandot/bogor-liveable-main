
import Link from "next/link";
import { Suspense } from "react";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

import { BogorMap } from "../../components/map-visual";
import { Icon, PageShell } from "../../components/ui";
import {
  dimensions,
  indicators,
  ranking,
} from "../../data";

// ============================================================
// HELPERS
// ============================================================

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

// ============================================================
// STATIC PARAMS
// Compatible with Next.js 16 Cache Components
// ============================================================

export function generateStaticParams() {
  return ranking.map((region) => ({
    slug: toSlug(region.name),
  }));
}

// ============================================================
// LOADING FALLBACK
// ============================================================

function RegionLoading() {
  return (
    <PageShell className="detail-page">
      <div className="breadcrumb">
        <Link href="/peta">Peta</Link>
        <Icon name="chevron" size={14} />
        <span>Memuat wilayah...</span>
      </div>

      <section className="detail-hero">
        <div>
          <p className="eyebrow">
            Kelurahan · Kota Bogor
          </p>

          <h1>Memuat wilayah...</h1>

          <p>
            Sedang menyiapkan informasi
            kelayakhunian wilayah.
          </p>
        </div>
      </section>
    </PageShell>
  );
}

// ============================================================
// MAIN PAGE
// Suspense boundary prevents instant-shell-url-data error
// ============================================================

export default function RegionPage({
  params,
}: PageProps<"/wilayah/[slug]">) {
  return (
    <Suspense fallback={<RegionLoading />}>
      <RegionContent params={params} />
    </Suspense>
  );
}

// ============================================================
// REGION CONTENT
// URL params accessed inside Suspense
// ============================================================

async function RegionContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const region = ranking.find(
    (item) => toSlug(item.name) === slug
  );

  if (!region) {
    notFound();
  }

  const name = region.name;
  const district = region.district;
  const score = region.score;
  const scoreLabel = region.className;

  return (
    <PageShell className="detail-page">
      {/* ================================================== */}
      {/* BREADCRUMB */}
      {/* ================================================== */}

      <div className="breadcrumb">
        <Link href="/peta">
          Peta
        </Link>

        <Icon name="chevron" size={14} />

        <span>{district}</span>

        <Icon name="chevron" size={14} />

        <b>{name}</b>
      </div>

      {/* ================================================== */}
      {/* HERO SECTION */}
      {/* ================================================== */}

      <section className="detail-hero">
        <div>
          <p className="eyebrow">
            Kelurahan · {district}
          </p>

          <h1>{name}</h1>

          <p>
            Informasi indeks kelayakhunian wilayah
            berdasarkan enam dimensi penilaian
            Kota Bogor.
          </p>

          <div className="detail-actions">
            <Link
              href="/perbandingan"
              className="button"
            >
              <Icon name="compare" />
              Bandingkan wilayah
            </Link>

            <button
              type="button"
              className="quiet-button"
            >
              <Icon name="download" />
              Unduh ringkasan
            </button>
          </div>
        </div>

        <div className="detail-score">
          <span>
            Indeks kelayakhunian
          </span>

          <strong>
            {score.toFixed(2).replace(".", ",")}
          </strong>

          <b>{scoreLabel}</b>

          <small>
            Peringkat #{region.rank} dari data tersedia
          </small>
        </div>

        <div className="detail-map">
          <BogorMap compact />
        </div>
      </section>

      {/* ================================================== */}
      {/* REGION STATISTICS */}
      {/* ================================================== */}

      <section className="detail-stats">
        <div>
          <span>Penduduk</span>
          <b>25.460</b>
          <small>jiwa · 2022</small>
        </div>

        <div>
          <span>Luas wilayah</span>
          <b>1,87</b>
          <small>km²</small>
        </div>

        <div>
          <span>Kepadatan</span>
          <b>9.840</b>
          <small>jiwa/km²</small>
        </div>

        <div>
          <span>Kesesuaian ruang</span>
          <b>84,2%</b>
          <small>permukiman sesuai RTRW</small>
        </div>
      </section>

      {/* ================================================== */}
      {/* DIMENSIONS SECTION */}
      {/* ================================================== */}

      <section className="detail-section">
        <div className="section-heading">
          <p className="eyebrow">
            Enam dimensi
          </p>

          <h2>
            Di mana {name} unggul?
          </h2>
        </div>

        <div className="dimension-detail-grid">
          {dimensions.map((dimension, index) => {
            const radialStyle = {
              "--score": `${
                dimension.value * 360
              }deg`,
              "--accent": dimension.color,
            } as CSSProperties;

            return (
              <article key={dimension.name}>
                <div
                  className="radial"
                  style={radialStyle}
                >
                  <span>
                    {String(
                      dimension.value
                    ).replace(".", ",")}
                  </span>
                </div>

                <div>
                  <h3>
                    {dimension.name}
                  </h3>

                  <p>
                    {dimension.note}
                  </p>

                  <small>
                    {index < 2
                      ? "Di atas rata-rata kota"
                      : "Setara rata-rata kota"}
                  </small>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ================================================== */}
      {/* INDICATORS TABLE */}
      {/* ================================================== */}

      <section className="detail-section indicator-section">
        <div className="section-heading">
          <p className="eyebrow">
            Nilai mentah
          </p>

          <h2>
            Rincian indikator.
          </h2>
        </div>

        <div className="data-table">
          <div className="table-head">
            <span>Indikator</span>
            <span>Nilai</span>
            <span>Sumber</span>
            <span>Tahun</span>
          </div>

          {indicators.map((row, rowIndex) => (
            <div
              className="table-row"
              key={rowIndex}
            >
              {row.map((cell, cellIndex) => (
                <span
                  key={cellIndex}
                  className={
                    cellIndex === 1
                      ? "value-cell"
                      : ""
                  }
                >
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ================================================== */}
      {/* COMPARISON CTA */}
      {/* ================================================== */}

      <section className="detail-cta">
        <div>
          <p className="eyebrow">
            Buat perbandingan
          </p>

          <h2>
            Bagaimana {name} dibanding
            wilayah lain?
          </h2>
        </div>

        <Link
          className="button button-cream"
          href="/perbandingan"
        >
          Pilih wilayah pembanding
          <Icon name="arrow" />
        </Link>
      </section>
    </PageShell>
  );
}
