"use client";

import { useState } from "react";
import { bogorSvgPaths } from "../lib/bogor-svg-paths";
import { kelurahanData } from "../kelurahan-data";
import { classes, scoreToColor, toSlug } from "../lib/livability";
import { Icon } from "./ui";

const kelurahanBySlug = new Map(
  kelurahanData.map((k) => [toSlug(k.kelurahan), k])
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

const ZOOM_LEVELS = [1, 1.3, 1.65];

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
  const [zoomIdx, setZoomIdx] = useState(0);

  const activeSlug = hoveredSlug ?? (selected ? selectedSlug : null);
  const activeItem = activeSlug
    ? bogorSvgPaths.find((p) => p.slug === activeSlug)
    : null;
  const activeScore = activeSlug
    ? getDimensionScore(activeSlug, dimension, customScores)
    : null;

  const scale = ZOOM_LEVELS[zoomIdx] ?? 1;

  return (
    <div className={`map-canvas ${compact ? "map-compact" : ""}`}>
      <div className="map-paper" aria-hidden="true" />
      <svg
        className="bogor-shape"
        viewBox="0 0 260 260"
        role="group"
        aria-label="Peta choropleth 68 kelurahan Kota Bogor"
      >
        <defs>
          <filter
            id="bogor-drop-shadow"
            x="-12%"
            y="-12%"
            width="124%"
            height="124%"
          >
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="4"
              floodColor="#0e3b34"
              floodOpacity=".14"
            />
          </filter>
        </defs>

        <g
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "130px 130px",
            transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* Real 68 kelurahan polygons */}
          <g filter="url(#bogor-drop-shadow)">
            {bogorSvgPaths.map((item) => {
              const score = getDimensionScore(
                item.slug,
                dimension,
                customScores
              );
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
                  className={`bogor-kel-path ${
                    isSelected ? "map-selected" : ""
                  } ${isHovered ? "map-hovered" : ""}`}
                  tabIndex={onSelect ? 0 : undefined}
                  role={onSelect ? "button" : undefined}
                  aria-label={`${item.name}, ${item.district}, skor ${score
                    .toFixed(2)
                    .replace(".", ",")}`}
                  onMouseEnter={() => setHoveredSlug(item.slug)}
                  onMouseLeave={() => setHoveredSlug(null)}
                  onFocus={() => setHoveredSlug(item.slug)}
                  onBlur={() => setHoveredSlug(null)}
                  onClick={() => onSelect?.(item.slug)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect?.(item.slug);
                    }
                  }}
                />
              );
            })}
          </g>

          {/* Active kelurahan marker */}
          {activeItem && (
            <g
              className="map-active-beacon"
              transform={`translate(${activeItem.cx}, ${activeItem.cy})`}
              pointerEvents="none"
            >
              <circle r="8" className="beacon-pulse" />
              <circle r="3.5" fill="#fffefa" stroke="#0e5b53" strokeWidth="2" />
            </g>
          )}
        </g>
      </svg>

      {/* District callout labels */}
      <div className="map-label label-one" aria-hidden="true">
        Bogor Utara
      </div>
      <div className="map-label label-two" aria-hidden="true">
        Bogor Tengah
      </div>
      <div className="map-label label-three" aria-hidden="true">
        Bogor Selatan
      </div>

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
          <div className="map-zoom" role="group" aria-label="Kontrol perbesaran peta">
            <button
              type="button"
              aria-label="Perbesar tampilan peta"
              disabled={zoomIdx >= ZOOM_LEVELS.length - 1}
              onClick={() =>
                setZoomIdx((z) => Math.min(ZOOM_LEVELS.length - 1, z + 1))
              }
            >
              +
            </button>
            <button
              type="button"
              aria-label="Perkecil tampilan peta"
              disabled={zoomIdx <= 0}
              onClick={() => setZoomIdx((z) => Math.max(0, z - 1))}
            >
              −
            </button>
          </div>
          <div className="map-attribution">68 Kelurahan · Geometri RBI BIG</div>
        </>
      )}
    </div>
  );
}

export function ScoreLegend({
  title = "Indeks kelayakhunian",
}: {
  title?: string;
}) {
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
            <b>{c.range}</b>
          </div>
        ))}
      </div>
      <div className="legend-note">
        <i />
        68 kelurahan · interval setara (0,00 sampai 1,00)
      </div>
    </div>
  );
}
