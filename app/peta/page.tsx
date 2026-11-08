"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FeatureCollection, Geometry } from "geojson";
import type { Basemap, OverlayKey } from "../components/leaflet-map";
import Map3D from "../components/map-3d";
import { ScoreLegend } from "../components/map-visual";
import { Header, Icon } from "../components/ui";
import { districts, kelurahanData } from "../data";
import {
  classes,
  classify,
  dimensionKeys,
  fmt,
  slugify,
  themes,
  type KelurahanProps,
  type ThemeKey,
} from "../lib/livability";

const LeafletMap = dynamic(() => import("../components/leaflet-map"), {
  ssr: false,
  loading: () => <div className="map-canvas" />,
});

const OVERLAY_ITEMS: { key: OverlayKey; label: string; symbol: string }[] = [
  { key: "labels", label: "Nama 68 kelurahan", symbol: "symbol-0" },
  { key: "kecamatan", label: "Batas & nama 6 kecamatan", symbol: "symbol-0" },
  { key: "faskes", label: "Fasilitas kesehatan (120)", symbol: "symbol-1" },
  { key: "jangkauan", label: "Jangkauan faskes & blank spot", symbol: "symbol-1" },
  { key: "sekolah", label: "Fasilitas pendidikan (556)", symbol: "symbol-2" },
  { key: "jalan", label: "Jaringan jalan RBI", symbol: "symbol-2" },
];

export default function MapPage() {
  const [panel, setPanel] = useState<"layers" | "filters">("layers");
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [theme, setTheme] = useState<ThemeKey>("skor_livable");
  const [basemap, setBasemap] = useState<Basemap>("light");
  const [fillOpacity, setFillOpacity] = useState(0.75);
  const [overlays, setOverlays] = useState<Record<OverlayKey, boolean>>({
    labels: true,
    kecamatan: true,
    faskes: true,
    jangkauan: false,
    sekolah: false,
    jalan: false,
  });

  const [geoData, setGeoData] = useState<FeatureCollection<Geometry, KelurahanProps> | null>(null);
  const [selectedKode, setSelectedKode] = useState<string | null>(kelurahanData[0]?.kode ?? null);

  // Pencarian & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterKecamatan, setFilterKecamatan] = useState("Semua kecamatan");
  const [filterKelurahan, setFilterKelurahan] = useState("Semua kelurahan");
  const [filterKelas, setFilterKelas] = useState("Semua klasifikasi");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/data/kelurahan.geojson")
      .then((res) => res.json())
      .then((fc: FeatureCollection<Geometry, KelurahanProps>) => setGeoData(fc))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const searchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return kelurahanData
      .filter(
        (k) =>
          k.kelurahan.toLowerCase().includes(q) ||
          k.kecamatan.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [searchQuery]);

  const kelurahanOptions = useMemo(() => {
    if (filterKecamatan === "Semua kecamatan") return kelurahanData;
    return kelurahanData.filter((k) => k.kecamatan === filterKecamatan);
  }, [filterKecamatan]);

  const visibleKodes = useMemo(() => {
    const hasFilter =
      filterKecamatan !== "Semua kecamatan" ||
      filterKelurahan !== "Semua kelurahan" ||
      filterKelas !== "Semua klasifikasi";
    if (!hasFilter) return null;

    const matched = kelurahanData.filter((k) => {
      if (filterKecamatan !== "Semua kecamatan" && k.kecamatan !== filterKecamatan) return false;
      if (filterKelurahan !== "Semua kelurahan" && k.kelurahan !== filterKelurahan) return false;
      if (filterKelas !== "Semua klasifikasi" && classify(k[theme]).label !== filterKelas) return false;
      return true;
    });
    return new Set(matched.map((k) => k.kode));
  }, [filterKecamatan, filterKelurahan, filterKelas, theme]);

  const selectedPlace = useMemo(
    () => kelurahanData.find((k) => k.kode === selectedKode) ?? null,
    [selectedKode]
  );

  const currentTheme = themes.find((t) => t.key === theme) ?? themes[0];

  const toggleOverlay = (key: OverlayKey) =>
    setOverlays((prev) => ({ ...prev, [key]: !prev[key] }));

  const switchBasemap = (next: Basemap) => {
    setBasemap(next);
    if (next === "satellite" && fillOpacity > 0.65) {
      setFillOpacity(0.55);
    } else if (next === "light" && fillOpacity < 0.6) {
      setFillOpacity(0.75);
    }
  };

  const resetFilters = () => {
    setFilterKecamatan("Semua kecamatan");
    setFilterKelurahan("Semua kelurahan");
    setFilterKelas("Semua klasifikasi");
    setSearchQuery("");
  };

  const applyFilterSelection = () => {
    if (filterKelurahan !== "Semua kelurahan") {
      const target = kelurahanData.find((k) => k.kelurahan === filterKelurahan);
      if (target) setSelectedKode(target.kode);
    } else if (visibleKodes && visibleKodes.size > 0) {
      const firstKode = Array.from(visibleKodes)[0];
      setSelectedKode(firstKode);
    }
  };

  return (
    <div className="map-page">
      <Header />
      <main className="map-workspace">
        <aside className="map-sidebar">
          <div className="map-search">
            <Icon name="search" />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari kecamatan atau kelurahan"
              placeholder="Cari kelurahan / kecamatan..."
            />
            <kbd>⌘ K</kbd>
          </div>
          {searchMatches.length > 0 && (
            <div className="search-results">
              {searchMatches.map((m) => (
                <button
                  key={m.kode}
                  type="button"
                  onClick={() => {
                    setSelectedKode(m.kode);
                    setSearchQuery("");
                  }}
                >
                  <div>
                    <b>{m.kelurahan}</b>
                    <small>{m.kecamatan} · #{m.peringkat}</small>
                  </div>
                  <strong>{fmt(m[theme])}</strong>
                </button>
              ))}
            </div>
          )}

          <div className="map-tabs">
            <button
              className={panel === "layers" ? "active" : ""}
              onClick={() => setPanel("layers")}
            >
              <Icon name="layers" />
              Layer
            </button>
            <button
              className={panel === "filters" ? "active" : ""}
              onClick={() => setPanel("filters")}
            >
              <Icon name="sliders" />
              Filter
            </button>
          </div>

          {panel === "layers" ? (
            <div className="layer-list">
              <p className="control-label">Peta tematik</p>
              <label className="select-wrap">
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as ThemeKey)}
                >
                  {themes.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="opacity-row">
                <span>Transparansi poligon</span>
                <strong>{Math.round(fillOpacity * 100)}%</strong>
                <input
                  type="range"
                  min={15}
                  max={95}
                  value={Math.round(fillOpacity * 100)}
                  onChange={(e) => setFillOpacity(Number(e.target.value) / 100)}
                />
              </div>

              <p className="control-label">Layer & label daerah</p>
              {OVERLAY_ITEMS.map((item) => (
                <label className="toggle-row" key={item.key}>
                  <span>
                    <i className={`layer-symbol ${item.symbol}`} />
                    {item.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={overlays[item.key]}
                    onChange={() => toggleOverlay(item.key)}
                  />
                  <b />
                </label>
              ))}

              <p className="control-label">Mode peta dasar (2D)</p>
              <div className="basemap-grid">
                <button
                  type="button"
                  className={basemap === "light" && viewMode === "2d" ? "active" : ""}
                  onClick={() => {
                    setViewMode("2d");
                    switchBasemap("light");
                  }}
                >
                  <span className="base-light" />
                  Terang
                </button>
                <button
                  type="button"
                  className={basemap === "satellite" && viewMode === "2d" ? "active" : ""}
                  onClick={() => {
                    setViewMode("2d");
                    switchBasemap("satellite");
                  }}
                >
                  <span className="base-satellite" />
                  Satelit
                </button>
                <button
                  type="button"
                  className={basemap === "osm" && viewMode === "2d" ? "active" : ""}
                  onClick={() => {
                    setViewMode("2d");
                    switchBasemap("osm");
                  }}
                >
                  <span className="base-osm" />
                  Jalan (OSM)
                </button>
                <button
                  type="button"
                  className={basemap === "topo" && viewMode === "2d" ? "active" : ""}
                  onClick={() => {
                    setViewMode("2d");
                    switchBasemap("topo");
                  }}
                >
                  <span className="base-topo" />
                  Topografi
                </button>
              </div>
            </div>
          ) : (
            <div className="filter-panel">
              <label>
                Kecamatan
                <select
                  value={filterKecamatan}
                  onChange={(e) => {
                    setFilterKecamatan(e.target.value);
                    setFilterKelurahan("Semua kelurahan");
                  }}
                >
                  <option>Semua kecamatan</option>
                  {districts.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.villages})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Kelurahan
                <select
                  value={filterKelurahan}
                  onChange={(e) => setFilterKelurahan(e.target.value)}
                >
                  <option>Semua kelurahan</option>
                  {kelurahanOptions.map((k) => (
                    <option key={k.kode} value={k.kelurahan}>
                      {k.kelurahan}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Klasifikasi
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                >
                  <option>Semua klasifikasi</option>
                  {classes.map((c) => (
                    <option key={c.label} value={c.label}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                className="button full"
                onClick={applyFilterSelection}
              >
                Terapkan filter
              </button>
              <button
                type="button"
                className="reset-button"
                onClick={resetFilters}
              >
                Reset semua filter
              </button>
            </div>
          )}
        </aside>

        <section className="interactive-map">
          {geoData ? (
            viewMode === "3d" ? (
              <Map3D
                data={geoData}
                theme={theme}
                selectedKode={selectedKode}
                visibleKodes={visibleKodes}
                showLabels={overlays.labels}
                onSelect={setSelectedKode}
              />
            ) : (
              <LeafletMap
                data={geoData}
                theme={theme}
                overlays={overlays}
                basemap={basemap}
                fillOpacity={fillOpacity}
                selectedKode={selectedKode}
                visibleKodes={visibleKodes}
                onSelect={setSelectedKode}
              />
            )
          ) : (
            <div className="map-canvas" />
          )}

          <div className="map-topbar">
            <span>
              <Icon name="map" size={16} />
              {currentTheme.label}
            </span>

            <div className="mode-switch">
              <button
                type="button"
                className={viewMode === "2d" ? "active" : ""}
                onClick={() => setViewMode("2d")}
              >
                2D Peta
              </button>
              <button
                type="button"
                className={viewMode === "3d" ? "active" : ""}
                onClick={() => setViewMode("3d")}
              >
                3D Ekstrusi
              </button>
            </div>
          </div>

          <ScoreLegend title={currentTheme.label} />
          <div className="map-hint">
            {viewMode === "3d"
              ? "Geser untuk memutar 3D · Scroll untuk zoom · Klik balok kelurahan untuk detail"
              : "Klik poligon atau nama kelurahan pada peta untuk melihat detail"}
          </div>
        </section>

        {selectedPlace && (
          <aside className="place-panel">
            <button
              className="panel-close"
              onClick={() => setSelectedKode(null)}
              aria-label="Tutup panel"
            >
              ×
            </button>
            <div className="place-cover">
              <span>{selectedPlace.kecamatan}</span>
              <b>#{selectedPlace.peringkat}</b>
            </div>
            <div className="place-content">
              <p className="eyebrow">Kelurahan terpilih</p>
              <h1>{selectedPlace.kelurahan}</h1>
              <div className="score-lockup">
                <strong>{fmt(selectedPlace[theme])}</strong>
                <span>
                  <b>{classify(selectedPlace[theme]).label}</b>
                  <small>
                    Peringkat {selectedPlace.peringkat} dari 68 kelurahan
                  </small>
                </span>
              </div>

              <div className="mini-dimensions">
                {dimensionKeys.map((d) => {
                  const val = selectedPlace[d.key];
                  return (
                    <div key={d.key}>
                      <span>{d.label}</span>
                      <i>
                        <b
                          style={{
                            width: `${Math.max(2, val * 100)}%`,
                            background: d.color,
                          }}
                        />
                      </i>
                      <strong>{fmt(val)}</strong>
                    </div>
                  );
                })}
              </div>

              <div className="place-facts">
                <div>
                  <span>Populasi</span>
                  <b>{selectedPlace.penduduk.toLocaleString("id-ID")} jiwa</b>
                </div>
                <div>
                  <span>Luas</span>
                  <b>{fmt(selectedPlace.luas_km2)} km²</b>
                </div>
                <div>
                  <span>Kepadatan</span>
                  <b>
                    {Math.round(selectedPlace.kepadatan_jiwa_km2).toLocaleString("id-ID")} jiwa/km²
                  </b>
                </div>
                <div>
                  <span>Cakupan faskes</span>
                  <b>{fmt(selectedPlace.cakupan_faskes_pct, 1)}%</b>
                </div>
              </div>

              <Link
                className="button full"
                href={`/wilayah/${slugify(selectedPlace.kelurahan)}`}
              >
                Lihat detail wilayah <Icon name="arrow" />
              </Link>
              <Link
                className="compare-add"
                href={`/perbandingan?a=${encodeURIComponent(selectedPlace.kelurahan)}`}
              >
                <Icon name="compare" />
                Bandingkan kelurahan ini
              </Link>
            </div>
          </aside>
        )}
      </main>
    </div>
  );
}
