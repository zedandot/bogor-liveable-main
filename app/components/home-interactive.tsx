"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
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
          <i />
          <i />
          <i />
          ruang<b>bogor</b>
          <em className="preview-live-badge">
            <span className="live-dot" />
            68 Kelurahan Interaktif
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
        <div className="preview-quick-chips">
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
            Klik poligon kelurahan pada peta untuk inspeksi langsung
          </span>
        </div>

        <div className="preview-summary" key={activeKel.kode}>
          <div className="preview-summary-head">
            <div>
              <p className="eyebrow">
                Peringkat #{activeKel.peringkat} dari 68
              </p>
              <h3>{activeKel.kelurahan}</h3>
              <span>Kecamatan {activeKel.kecamatan}</span>
            </div>
            <span
              className="preview-class-chip"
              style={{
                background: `${scoreToColor(displayedScore)}22`,
                color: scoreToColor(displayedScore),
                borderColor: `${scoreToColor(displayedScore)}55`,
              }}
            >
              {scoreToClass(displayedScore)}
            </span>
          </div>

          <div className="preview-score-row">
            <strong>{displayedScore.toFixed(2).replace(".", ",")}</strong>
            <small>
              {
                previewDimensions.find((d) => d.key === dimension)?.label
              }
              <br />
              {activeKel.penduduk.toLocaleString("id-ID")} jiwa ·{" "}
              {activeKel.luas_km2.toFixed(2).replace(".", ",")} km²
            </small>
          </div>

          <ul className="preview-dim-bars">
            {[
              { label: "Kesehatan", val: activeKel.skor_kesehatan, color: "#2e7468" },
              { label: "Pendidikan", val: activeKel.skor_pendidikan, color: "#4e8b74" },
              { label: "Transportasi", val: activeKel.skor_transportasi, color: "#689970" },
              { label: "Sosial", val: activeKel.skor_sosial, color: "#7ea36b" },
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
              Profil kelurahan <Icon name="arrow" size={13} />
            </Link>
            <Link href="/peta">
              Buka WebGIS penuh <Icon name="map" size={13} />
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
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const stats = [
    { value: "68", unit: "", label: "Kelurahan dianalisis penuh" },
    { value: "6", unit: "", label: "Kecamatan terintegrasi" },
    { value: "676", unit: "titik", label: "Faskes & sekolah terpetakan" },
    { value: "111,37", unit: "km²", label: "Luas wilayah Kota Bogor" },
    { value: "84,9%", unit: "", label: "Jangkauan faskes primer" },
  ];

  return (
    <section
      ref={ref}
      className={`city-strip ${visible ? "is-visible" : ""}`}
    >
      <p>
        <span className="strip-icon-badge">
          <Icon name="rain" size={20} />
        </span>
        <span>
          <strong>Atlas Spasial Kota Bogor</strong>
          <small>Data Geospasial Terverifikasi · EPSG:4326</small>
        </span>
      </p>
      {stats.map((s, idx) => (
        <div
          key={s.label}
          style={{ transitionDelay: `${idx * 75}ms` }}
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
  const [activeDistrict, setActiveDistrict] = useState(districts[0]?.name ?? "Bogor Tengah");

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
          <p className="eyebrow">Agregat kecamatan</p>
          <h2>Enam wajah Kota Bogor.</h2>
        </div>
        <p className="district-lead">
          Pilih batang kecamatan untuk melihat karakter kelayakhunian, jumlah
          kelurahan, dan kelurahan unggulan di dalamnya.
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

      <div className="district-bars" role="group" aria-label="Grafik skor 6 kecamatan">
        {districts.map((d, i) => {
          const isActive = d.name === activeDistrict;
          return (
            <button
              type="button"
              key={d.name}
              className={`district-bar-col ${isActive ? "is-active" : ""}`}
              onClick={() => setActiveDistrict(d.name)}
              onMouseEnter={() => setActiveDistrict(d.name)}
              style={{ animationDelay: `${i * 90}ms` }}
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

    // Fallback for browsers that do not support CSS scroll-driven view() + animation-range: entry
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
