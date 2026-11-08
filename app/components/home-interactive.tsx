"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { citySummary } from "../data";
import { kelurahanData } from "../kelurahan-data";
import { scoreToClass, scoreToColor, toSlug } from "../lib/livability";
import { BogorMap, type MapDimensionKey } from "./map-visual";
import { Icon } from "./ui";

const previewDimensions: { key: MapDimensionKey; label: string }[] = [
  { key: "livable", label: "Indeks Total" },
  { key: "kesehatan", label: "Kesehatan" },
  { key: "lingkungan", label: "Lingkungan" },
  { key: "transportasi", label: "Transportasi" },
  { key: "pendidikan", label: "Pendidikan" },
];

const quickPicks = ["pabaton", "babakan", "batutulis", "paledang", "bantarjati"];

export function HeroInteractivePreview() {
  const [selectedSlug, setSelectedSlug] = useState("pabaton");
  const [dimension, setDimension] = useState<MapDimensionKey>("livable");

  const activeKel = useMemo(
    () =>
      kelurahanData.find((k) => toSlug(k.kelurahan) === selectedSlug) ??
      kelurahanData[0],
    [selectedSlug]
  );

  const displayedScore = useMemo(() => {
    switch (dimension) {
      case "kesehatan":
        return activeKel.skor_kesehatan;
      case "pendidikan":
        return activeKel.skor_pendidikan;
      case "lingkungan":
        return activeKel.skor_lingkungan;
      case "transportasi":
        return activeKel.skor_transportasi;
      case "ekonomi":
        return activeKel.skor_ekonomi;
      case "sosial":
        return activeKel.skor_sosial;
      default:
        return activeKel.skor_livable;
    }
  }, [activeKel, dimension]);

  return (
    <div className="hero-app-preview">
      <div className="preview-bar">
        <span>
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          ruang<b>bogor</b>
          <em className="preview-live-badge">
            <span className="live-dot" aria-hidden="true" />
            Pratinjau 68 Kelurahan
          </em>
        </span>
        <nav aria-label="Pilih dimensi pratinjau" className="preview-dim-pills">
          {previewDimensions.map((d) => (
            <button
              key={d.key}
              type="button"
              className={dimension === d.key ? "active" : ""}
              onClick={() => setDimension(d.key)}
            >
              {d.label}
            </button>
          ))}
        </nav>
        <div className="preview-quick-chips" role="group" aria-label="Contoh kelurahan">
          {quickPicks.map((slug) => {
            const item = kelurahanData.find((k) => toSlug(k.kelurahan) === slug);
            if (!item) return null;
            return (
              <button
                key={slug}
                type="button"
                className={selectedSlug === slug ? "active" : ""}
                onClick={() => setSelectedSlug(slug)}
              >
                #{item.peringkat} {item.kelurahan}
              </button>
            );
          })}
        </div>
      </div>

      <div className="preview-body">
        <div className="preview-map">
          <BogorMap
            compact
            selectedSlug={selectedSlug}
            onSelect={setSelectedSlug}
            dimension={dimension}
          />
          <span className="preview-map-hint">
            Klik poligon kelurahan pada peta untuk memilih wilayah
          </span>
        </div>

        <div className="preview-summary" key={activeKel.kode}>
          <div className="preview-summary-head">
            <div>
              <p className="eyebrow">
                Peringkat #{activeKel.peringkat} dari 68
              </p>
              <h2>{activeKel.kelurahan}</h2>
              <span>Kecamatan {activeKel.kecamatan}</span>
            </div>
            <span
              className="preview-class-chip"
              style={{
                background: `${scoreToColor(displayedScore)}22`,
                color: "#173b38",
                borderColor: `${scoreToColor(displayedScore)}66`,
              }}
            >
              {scoreToClass(displayedScore)}
            </span>
          </div>

          <div className="preview-score-row">
            <strong>{displayedScore.toFixed(2).replace(".", ",")}</strong>
            <small>
              {previewDimensions.find((d) => d.key === dimension)?.label}
              <br />
              {activeKel.penduduk.toLocaleString("id-ID")} jiwa ·{" "}
              {activeKel.luas_km2.toFixed(2).replace(".", ",")} km²
            </small>
          </div>

          <ul className="preview-dim-bars">
            {[
              { label: "Kesehatan", val: activeKel.skor_kesehatan, color: "#0e5b53" },
              { label: "Pendidikan", val: activeKel.skor_pendidikan, color: "#2e7468" },
              { label: "Transportasi", val: activeKel.skor_transportasi, color: "#6ca77e" },
              { label: "Sosial", val: activeKel.skor_sosial, color: "#b86b3d" },
            ].map((bar) => (
              <li key={bar.label}>
                <span>{bar.label}</span>
                <i className="preview-bar-track">
                  <u
                    style={{
                      width: `${Math.max(bar.val * 100, 6)}%`,
                      background: bar.color,
                    }}
                  />
                </i>
                <b>{bar.val.toFixed(2).replace(".", ",")}</b>
              </li>
            ))}
          </ul>

          <div className="preview-summary-links">
            <Link href={`/wilayah/${toSlug(activeKel.kelurahan)}`}>
              Profil {activeKel.kelurahan} <Icon name="arrow" size={13} />
            </Link>
            <Link href="/peta">
              Buka peta penuh <Icon name="map" size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnimatedStatStrip() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = [
    {
      value: String(citySummary.totalKelurahan),
      unit: "",
      label: "Kelurahan terpetakan (RBI BIG)",
    },
    {
      value: String(citySummary.totalKecamatan),
      unit: "",
      label: "Kecamatan di Kota Bogor",
    },
    {
      value: String(citySummary.totalSchools),
      unit: "unit",
      label: "Sekolah SD, SMP & SMA/SMK",
    },
    {
      value: citySummary.totalAreaKm2,
      unit: "km²",
      label: "Total luas wilayah terukur",
    },
    {
      value: `${citySummary.avgFaskesPct}%`,
      unit: "",
      label: "Rata-rata cakupan layanan faskes",
    },
  ];

  return (
    <section
      ref={ref}
      aria-label="Ringkasan data Kota Bogor"
      className={`city-strip ${visible ? "is-visible" : ""}`}
    >
      <p>
        <span className="strip-icon-badge" aria-hidden="true">
          <Icon name="map" size={20} />
        </span>
        <span>
          <strong>Geodatabase Kota Bogor</strong>
          <small>Sumber: BIG, OSM, SIMDATA &amp; Kemendikbud</small>
        </span>
      </p>
      {stats.map((s, idx) => (
        <div
          key={s.label}
          style={{ transitionDelay: `${idx * 65}ms` }}
          className="strip-stat-item"
        >
          <b>
            {s.value}
            {s.unit && <small> {s.unit}</small>}
          </b>
          <span>{s.label}</span>
        </div>
      ))}
    </section>
  );
}

export function InteractiveDistrictRibbon({
  districts,
}: {
  districts: {
    name: string;
    villages: number;
    population: string;
    score: number;
    className: string;
  }[];
}) {
  const [activeDistrict, setActiveDistrict] = useState(
    districts[0]?.name ?? "Bogor Tengah"
  );

  const activeInfo = useMemo(() => {
    const d = districts.find((x) => x.name === activeDistrict) ?? districts[0];
    const inDistrict = kelurahanData
      .filter((k) => k.kecamatan === d.name)
      .sort((a, b) => b.skor_livable - a.skor_livable);
    const topKel = inDistrict[0];
    const avgKes =
      inDistrict.reduce((s, k) => s + k.skor_kesehatan, 0) /
      Math.max(inDistrict.length, 1);
    const avgTr =
      inDistrict.reduce((s, k) => s + k.skor_transportasi, 0) /
      Math.max(inDistrict.length, 1);
    const avgLing =
      inDistrict.reduce((s, k) => s + k.skor_lingkungan, 0) /
      Math.max(inDistrict.length, 1);
    return {
      ...d,
      topKel,
      avgKes,
      avgTr,
      avgLing,
    };
  }, [activeDistrict, districts]);

  return (
    <section className="district-ribbon reveal-on-scroll">
      <div className="district-ribbon-copy">
        <div className="section-heading">
          <p className="eyebrow">Agregat 6 kecamatan</p>
          <h2>Perbandingan skor antarkecamatan.</h2>
        </div>
        <p className="district-lead">
          Pilih batang kecamatan untuk melihat rata-rata indeks tertimbang
          penduduk, jumlah kelurahan, dan kelurahan tertinggi di dalamnya.
        </p>

        <div className="district-spotlight-card" key={activeInfo.name}>
          <div className="district-spotlight-head">
            <div>
              <span>Kecamatan terpilih</span>
              <h3>{activeInfo.name}</h3>
            </div>
            <strong>{activeInfo.score.toFixed(2).replace(".", ",")}</strong>
          </div>
          <div className="district-spotlight-meta">
            <div>
              <small>Kelurahan</small>
              <b>{activeInfo.villages} wilayah</b>
            </div>
            <div>
              <small>Populasi</small>
              <b>{activeInfo.population} jiwa</b>
            </div>
            <div>
              <small>Tertinggi</small>
              <b>
                {activeInfo.topKel ? activeInfo.topKel.kelurahan : "-"} (
                {activeInfo.topKel
                  ? activeInfo.topKel.skor_livable.toFixed(2).replace(".", ",")
                  : "-"}
                )
              </b>
            </div>
          </div>
          <div className="district-mini-pills">
            <span>
              Kesehatan <b>{activeInfo.avgKes.toFixed(2).replace(".", ",")}</b>
            </span>
            <span>
              Transportasi <b>{activeInfo.avgTr.toFixed(2).replace(".", ",")}</b>
            </span>
            <span>
              Lingkungan <b>{activeInfo.avgLing.toFixed(2).replace(".", ",")}</b>
            </span>
          </div>
        </div>
      </div>

      <div
        className="district-bars"
        role="group"
        aria-label="Grafik perbandingan 6 kecamatan"
      >
        {districts.map((d, i) => {
          const isActive = d.name === activeDistrict;
          return (
            <button
              type="button"
              key={d.name}
              aria-pressed={isActive}
              className={`district-bar-col ${isActive ? "is-active" : ""}`}
              onClick={() => setActiveDistrict(d.name)}
              style={{ animationDelay: `${i * 75}ms` }}
            >
              <span className="district-bar-name">{d.name}</span>
              <div className="district-bar-track">
                <i
                  style={{
                    height: `${Math.max(d.score * 100, 18)}%`,
                  }}
                />
              </div>
              <b>{d.score.toFixed(2).replace(".", ",")}</b>
              <small>{d.villages} kel</small>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function ScrollRevealEffects() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const supportsNativeViewTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports("(animation-timeline: view()) and (animation-range: entry)");

    if (!supportsNativeViewTimeline) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).dataset.revealed = "true";
            }
          }
        },
        { threshold: 0.14 }
      );

      document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, []);

  return null;
}
