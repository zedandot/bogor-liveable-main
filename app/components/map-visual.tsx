"use client";

import { useState } from "react";
import { bogorSvgPaths } from "../lib/bogor-svg-paths";
import { kelurahanData } from "../kelurahan-data";
import { classes, scoreToColor } from "../lib/livability";
import { Icon } from "./ui";

const kelurahanBySlug = new Map(
  kelurahanData.map((k) => [
    k.kelurahan.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    k,
  ])
);

export type MapDimensionKey =
  | "livable"
  | "kesehatan"
  | "pendidikan"
  | "lingkungan"
  | "transportasi"
  | "ekonomi"
  | "sosial";

function getDimensionScore(
  slug: string,
  dimension: MapDimensionKey,
  customScores?: Record<string, number>
): number {
  if (customScores && slug in customScores) {
    return customScores[slug];
  }
  const k = kelurahanBySlug.get(slug);
  if (!k) return 0.5;
  switch (dimension) {
    case "kesehatan":
      return k.skor_kesehatan;
    case "pendidikan":
      return k.skor_pendidikan;
    case "lingkungan":
      return k.skor_lingkungan;
    case "transportasi":
      return k.skor_transportasi;
    case "ekonomi":
      return k.skor_ekonomi;
    case "sosial":
      return k.skor_sosial;
    default:
      return k.skor_livable;
  }
}

export function BogorMap({
  compact = false,
  selected = true,
  selectedSlug = "pabaton",
  onSelect,
  dimension = "livable",
  customScores,
}: {
  compact?: boolean;
  selected?: boolean;
  selectedSlug?: string;
  onSelect?: (slug: string) => void;
  dimension?: MapDimensionKey;
  customScores?: Record<string, number>;
}) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const activeSlug = hoveredSlug ?? (selected ? selectedSlug : null);
  const activeItem = activeSlug
    ? bogorSvgPaths.find((p) => p.slug === activeSlug)
    : null;
  const activeScore = activeSlug
    ? getDimensionScore(activeSlug, dimension, customScores)
    : null;

  return (
    <div className={`map-canvas ${compact ? "map-compact" : ""}`}>
      <div className="map-paper" />
      <svg
        className="bogor-shape"
        viewBox="0 0 260 260"
        role="img"
        aria-label="Peta choropleth interaktif 68 kelurahan Kota Bogor"
      >
        <defs>
          <filter id="bogor-drop-shadow" x="-12%" y="-12%" width="124%" height="124%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0e3b34" floodOpacity=".18" />
          </filter>
          <radialGradient id="beacon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffefa" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0e5b53" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Subtle topographic compass rings */}
        <g className="map-topo-rings" aria-hidden="true">
          <circle cx="136" cy="128" r="56" />
          <circle cx="136" cy="128" r="92" />
          <circle cx="136" cy="128" r="122" />
          <line x1="136" y1="6" x2="136" y2="254" />
          <line x1="12" y1="128" x2="248" y2="128" />
        </g>

        {/* Real 68 kelurahan polygons */}
        <g filter="url(#bogor-drop-shadow)">
          {bogorSvgPaths.map((item, idx) => {
            const score = getDimensionScore(item.slug, dimension, customScores);
            const fill = scoreToColor(score);
            const isSelected = selected && item.slug === selectedSlug;
            const isHovered = item.slug === hoveredSlug;
            return (
              <path
                key={item.kode}
                d={item.d}
                fill={fill}
                stroke={isSelected || isHovered ? "#0b3f39" : "#f6f5ed"}
                strokeWidth={isSelected || isHovered ? 2.1 : 0.85}
                style={{
                  animationDelay: `${Math.min(idx * 12, 480)}ms`,
                }}
                className={`bogor-kel-path ${
                  isSelected ? "map-selected" : ""
                } ${isHovered ? "map-hovered" : ""}`}
                onMouseEnter={() => setHoveredSlug(item.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                onClick={() => onSelect?.(item.slug)}
              />
            );
          })}
        </g>

        {/* Animated Ciliwung-Cisadane arterial corridors */}
        <g className="map-roads" pointerEvents="none">
          <path d="M58 76 Q112 104 148 124 T204 221" />
          <path d="M112 31 Q136 86 134 132 T130 188" />
          <path d="M88 100 Q133 118 178 153" />
        </g>

        {/* Active kelurahan beacon */}
        {activeItem && (
          <g
            className="map-active-beacon"
            transform={`translate(${activeItem.cx}, ${activeItem.cy})`}
            pointerEvents="none"
          >
            <circle r="11" className="beacon-pulse" />
            <circle r="4" fill="#fffefa" stroke="#0e5b53" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* District callout pills */}
      <div className="map-label label-one">Bogor Utara</div>
      <div className="map-label label-two">Bogor Tengah</div>
      <div className="map-label label-three">Bogor Selatan</div>

      {/* Live interactive floating badge when hovering/selecting */}
      {activeItem && activeScore !== null && (
        <div className="map-live-pill" aria-live="polite">
          <span
            className="map-live-dot"
            style={{ background: scoreToColor(activeScore) }}
          />
          <div>
            <b>{activeItem.name}</b>
            <small>{activeItem.district}</small>
          </div>
          <strong>{activeScore.toFixed(2).replace(".", ",")}</strong>
        </div>
      )}

      {!compact && (
        <>
          <div className="map-zoom">
            <button aria-label="Perbesar">+</button>
            <button aria-label="Perkecil">−</button>
          </div>
          <div className="map-attribution">68 Kelurahan · Geometri RBI BIG</div>
        </>
      )}
    </div>
  );
}

export function ScoreLegend({ title = "Indeks kelayakhunian" }: { title?: string }) {
  return (
    <div className="legend">
      <div className="legend-title">
        <span>{title}</span>
        <Icon name="info" size={15} />
      </div>
      <div className="legend-bar" />
      <div className="legend-values">
        <span>0,00</span>
        <span>0,20</span>
        <span>0,40</span>
        <span>0,60</span>
        <span>0,80</span>
        <span>1,00</span>
      </div>
      <div className="legend-classes">
        {classes.map((c) => (
          <div key={c.label}>
            <span>
              <i style={{ background: c.color }} />
              {c.label}
            </span>
            <small>{c.range}</small>
          </div>
        ))}
      </div>
      <div className="legend-note">
        <i />
        68 kelurahan · WGS 84 (EPSG:4326)
      </div>
    </div>
  );
}
