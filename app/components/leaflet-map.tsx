"use client";

// WBS 1.5.1 + 1.5.2 + 1.5.3 — Map engine Leaflet, basemap switcher (4 mode),
// label nama daerah (68 kelurahan & 6 kecamatan), dan choropleth 5 kelas.

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { Feature, FeatureCollection, Geometry, Position } from "geojson";
import { classify, fmt, type KelurahanProps, type ThemeKey } from "../lib/livability";

export type OverlayKey = "labels" | "faskes" | "jangkauan" | "sekolah" | "jalan" | "kecamatan";
export type Basemap = "light" | "satellite" | "osm" | "topo";

type Props = {
  data: FeatureCollection<Geometry, KelurahanProps>;
  theme: ThemeKey;
  overlays: Record<OverlayKey, boolean>;
  basemap: Basemap;
  fillOpacity: number;
  selectedKode: string | null;
  visibleKodes: Set<string> | null; // null = semua tampil
  onSelect: (kode: string | null) => void;
};

const BASEMAPS: Record<
  Basemap,
  { url: string; labelUrl?: string; attribution: string; maxZoom: number }
> = {
  light: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    labelUrl: "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
    attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
  },
  osm: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  topo: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    maxZoom: 17,
  },
};

const FASKES_STYLE: Record<string, { color: string; label: string; radius: number }> = {
  rs: { color: "#b8432f", label: "Rumah sakit", radius: 6 },
  puskesmas: { color: "#0e5b53", label: "Puskesmas", radius: 5 },
  klinik: { color: "#5a7fb0", label: "Klinik", radius: 4 },
};

const JANGKAUAN_STYLE: Record<string, L.PathOptions> = {
  rs: { color: "#b8432f", weight: 1, fillColor: "#b8432f", fillOpacity: 0.06, dashArray: "4 4" },
  puskesmas: { color: "#0e5b53", weight: 1, fillColor: "#0e5b53", fillOpacity: 0.12 },
  klinik: { color: "#5a7fb0", weight: 1, fillColor: "#5a7fb0", fillOpacity: 0.1 },
  blank_spot: { color: "#c0392b", weight: 1.5, fillColor: "#e74c3c", fillOpacity: 0.35 },
};

const ROAD_WEIGHT: Record<string, number> = {
  "Jalan Tol Dua Jalur Dengan Pemisah Fisik": 3.2,
  "Jalan Arteri": 2.8,
  "Jalan Kolektor": 2.2,
  "Jalan Lokal": 0.9,
  "Jalan Lain": 0.6,
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Hitung titik pusat poligon terbesar agar label nama daerah jatuh pas di tengah wilayah
function featureCenterLatLng(geom: Geometry): [number, number] {
  const rings: Position[][] =
    geom.type === "Polygon"
      ? [geom.coordinates[0]]
      : geom.type === "MultiPolygon"
      ? geom.coordinates.map((p) => p[0])
      : [];

  let bestLat = -6.597;
  let bestLon = 106.799;
  let bestArea = -1;

  for (const ring of rings) {
    let area = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [x0, y0] = ring[j];
      const [x1, y1] = ring[i];
      const f = x0 * y1 - x1 * y0;
      area += f;
      cx += (x0 + x1) * f;
      cy += (y0 + y1) * f;
    }
    const absA = Math.abs(area) * 0.5;
    if (absA > bestArea && Math.abs(area) > 1e-11) {
      bestArea = absA;
      bestLon = cx / (3 * area);
      bestLat = cy / (3 * area);
    }
  }
  return [bestLat, bestLon];
}

export default function LeafletMap({
  data,
  theme,
  overlays,
  basemap,
  fillOpacity,
  selectedKode,
  visibleKodes,
  onSelect,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const baseLayerRef = useRef<L.LayerGroup | null>(null);
  const choroplethRef = useRef<L.GeoJSON<KelurahanProps> | null>(null);
  const labelGroupRef = useRef<L.LayerGroup | null>(null);
  const overlayRefs = useRef<Partial<Record<OverlayKey, L.Layer>>>({});
  const overlayLoading = useRef<Partial<Record<OverlayKey, Promise<L.Layer>>>>({});

  const state = useRef({ theme, fillOpacity, selectedKode, visibleKodes, onSelect });
  state.current = { theme, fillOpacity, selectedKode, visibleKodes, onSelect };

  const stateOverlays = useRef(overlays);
  stateOverlays.current = overlays;

  // ---- Inisialisasi peta (sekali) ------------------------------------------
  useEffect(() => {
    if (!containerRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false, minZoom: 11, preferCanvas: false });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.control.scale({ position: "bottomright", imperial: false }).addTo(map);

    map.createPane("choropleth").style.zIndex = "400";
    map.createPane("jangkauan").style.zIndex = "410";
    map.createPane("jalan").style.zIndex = "420";
    map.createPane("batas").style.zIndex = "430";
    map.createPane("regionLabels").style.zIndex = "450";
    map.getPane("jangkauan")!.style.pointerEvents = "none";
    map.getPane("jalan")!.style.pointerEvents = "none";
    map.getPane("batas")!.style.pointerEvents = "none";

    const styleFor = (f?: Feature<Geometry, KelurahanProps>): L.PathOptions => {
      if (!f) return {};
      const { theme, fillOpacity, selectedKode, visibleKodes } = state.current;
      const p = f.properties;
      const selected = p.kode === selectedKode;
      const visible = !visibleKodes || visibleKodes.has(p.kode);
      return {
        pane: "choropleth",
        fillColor: classify(p[theme]).color,
        fillOpacity: visible ? fillOpacity : 0.1,
        color: selected ? "#173b38" : "#ffffff",
        weight: selected ? 3 : 1.1,
        opacity: visible ? 1 : 0.35,
      };
    };

    const choropleth = L.geoJSON<KelurahanProps>(data, {
      style: styleFor as L.StyleFunction<KelurahanProps>,
      onEachFeature: (feature, layer) => {
        const p = feature.properties;
        layer.bindTooltip(
          () => {
            const score = p[state.current.theme];
            return `<b>${escapeHtml(p.kelurahan)}</b><br/><span>${escapeHtml(p.kecamatan)} · #${p.peringkat}</span><br/>Skor ${fmt(score)} · ${classify(score).label}`;
          },
          { sticky: true, direction: "top", className: "rb-tooltip" }
        );
        layer.on({
          mouseover: (e) => {
            const l = e.target as L.Path;
            if (p.kode !== state.current.selectedKode) l.setStyle({ weight: 2.5, color: "#173b38" });
          },
          mouseout: (e) => choropleth.resetStyle(e.target as L.Path),
          click: () => state.current.onSelect(p.kode),
        });
      },
    }).addTo(map);

    choroplethRef.current = choropleth;
    labelGroupRef.current = L.layerGroup([], { pane: "regionLabels" });
    map.fitBounds(choropleth.getBounds(), { padding: [20, 20] });
    map.setMaxBounds(choropleth.getBounds().pad(0.6));
    mapRef.current = map;

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      choroplethRef.current = null;
      baseLayerRef.current = null;
      labelGroupRef.current = null;
      overlayRefs.current = {};
      overlayLoading.current = {};
    };
  }, [data]);

  // ---- Basemap switcher (Terang / Satelit / Jalan OSM / Topografi) ----------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    baseLayerRef.current?.remove();
    const cfg = BASEMAPS[basemap];
    const group = L.layerGroup();
    L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: cfg.maxZoom,
      subdomains: "abcd",
    }).addTo(group);
    if (cfg.labelUrl) {
      L.tileLayer(cfg.labelUrl, {
        maxZoom: cfg.maxZoom,
        subdomains: "abcd",
        opacity: 0.85,
      }).addTo(group);
    }
    group.addTo(map);
    baseLayerRef.current = group;
  }, [basemap, data]);

  // ---- Restyle choropleth saat tema / transparansi / filter / seleksi berubah
  useEffect(() => {
    const layer = choroplethRef.current;
    if (!layer) return;
    layer.eachLayer((l) => layer.resetStyle(l as L.Path));
    if (selectedKode) {
      layer.eachLayer((l) => {
        const gl = l as L.Polygon & { feature?: Feature<Geometry, KelurahanProps> };
        if (gl.feature?.properties.kode === selectedKode) gl.bringToFront();
      });
    }
  }, [theme, fillOpacity, visibleKodes, selectedKode]);

  // ---- Render label nama 68 kelurahan di atas poligon ----------------------
  useEffect(() => {
    const map = mapRef.current;
    const labelGroup = labelGroupRef.current;
    if (!map || !labelGroup) return;

    labelGroup.clearLayers();
    if (!overlays.labels) {
      map.removeLayer(labelGroup);
      return;
    }

    for (const f of data.features) {
      const p = f.properties;
      if (visibleKodes && !visibleKodes.has(p.kode)) continue;
      const [lat, lon] = featureCenterLatLng(f.geometry);
      const isSelected = p.kode === selectedKode;
      const score = fmt(p[theme]);

      const marker = L.marker([lat, lon], {
        pane: "regionLabels",
        icon: L.divIcon({
          className: `kel-label ${isSelected ? "kel-label-active" : ""}`,
          html: `<span><b>${escapeHtml(p.kelurahan)}</b><small>${score}</small></span>`,
          iconSize: [0, 0],
        }),
      });
      marker.on("click", () => state.current.onSelect(p.kode));
      marker.addTo(labelGroup);
    }

    labelGroup.addTo(map);
  }, [data, overlays.labels, theme, selectedKode, visibleKodes]);

  // ---- Fly-to wilayah terpilih ---------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    const layer = choroplethRef.current;
    if (!map || !layer || !selectedKode) return;
    layer.eachLayer((l) => {
      const gl = l as L.Polygon & { feature?: Feature<Geometry, KelurahanProps> };
      if (gl.feature?.properties.kode === selectedKode) {
        map.flyToBounds(gl.getBounds(), { padding: [60, 60], maxZoom: 15, duration: 0.8 });
      }
    });
  }, [selectedKode]);

  // ---- Fit ke wilayah hasil filter -------------------------------------------
  useEffect(() => {
    const map = mapRef.current;
    const layer = choroplethRef.current;
    if (!map || !layer || !visibleKodes || visibleKodes.size === 0) return;
    const bounds = L.latLngBounds([]);
    layer.eachLayer((l) => {
      const gl = l as L.Polygon & { feature?: Feature<Geometry, KelurahanProps> };
      if (gl.feature && visibleKodes.has(gl.feature.properties.kode)) bounds.extend(gl.getBounds());
    });
    if (bounds.isValid()) map.flyToBounds(bounds, { padding: [40, 40], duration: 0.8 });
  }, [visibleKodes]);

  // ---- Layer pendukung (faskes, jangkauan, sekolah, jalan, kecamatan) ------
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    (["faskes", "jangkauan", "sekolah", "jalan", "kecamatan"] as OverlayKey[]).forEach(async (key) => {
      const existing = overlayRefs.current[key];
      if (!overlays[key]) {
        if (existing) map.removeLayer(existing);
        return;
      }
      if (existing) {
        existing.addTo(map);
        return;
      }
      overlayLoading.current[key] ??= buildOverlay(key);
      const layer = await overlayLoading.current[key]!;
      overlayRefs.current[key] = layer;
      if (mapRef.current === map && stateOverlays.current[key]) layer.addTo(map);
    });
  }, [overlays, data]);

  return <div ref={containerRef} className="leaflet-host" aria-label="Peta interaktif kelayakhunian Kota Bogor" />;
}

async function fetchJson(name: string) {
  const res = await fetch(`/data/${name}.geojson`);
  if (!res.ok) throw new Error(`Gagal memuat ${name}`);
  return res.json() as Promise<FeatureCollection>;
}

async function buildOverlay(key: OverlayKey): Promise<L.Layer> {
  switch (key) {
    case "labels":
      return L.layerGroup();
    case "faskes": {
      const fc = await fetchJson("faskes");
      return L.geoJSON(fc, {
        pointToLayer: (f, latlng) => {
          const s = FASKES_STYLE[f.properties?.jenis] ?? FASKES_STYLE.klinik;
          return L.circleMarker(latlng, { radius: s.radius, color: "#fff", weight: 1.5, fillColor: s.color, fillOpacity: 1 });
        },
        onEachFeature: (f, layer) => {
          const p = f.properties ?? {};
          const s = FASKES_STYLE[p.jenis] ?? FASKES_STYLE.klinik;
          layer.bindPopup(
            `<b>${escapeHtml(p.nama ?? "-")}</b><br/>${s.label}<br/><small>${escapeHtml(p.kelurahan ?? "")}, ${escapeHtml(p.kecamatan ?? "")}</small>`
          );
        },
      });
    }
    case "jangkauan": {
      const fc = await fetchJson("JANGKAUAN_PUSKESMAS_RUMAHSAKIT");
      const order = ["rs", "klinik", "puskesmas", "blank_spot"];
      fc.features.sort((a, b) => order.indexOf(a.properties?.kode) - order.indexOf(b.properties?.kode));
      return L.geoJSON(fc, {
        pane: "jangkauan",
        style: (f) => ({ ...JANGKAUAN_STYLE[f?.properties?.kode] }),
      });
    }
    case "sekolah": {
      const fc = await fetchJson("sekolah");
      const SEKOLAH_STYLE: Record<string, { color: string; label: string }> = {
        sd: { color: "#d8a85f", label: "SD" },
        smp: { color: "#4c8e72", label: "SMP" },
        sma_smk: { color: "#7a5ea8", label: "SMA/SMK" },
      };
      return L.geoJSON(fc, {
        pointToLayer: (f, latlng) => {
          const s = SEKOLAH_STYLE[f.properties?.jenis] ?? SEKOLAH_STYLE.sd;
          return L.circleMarker(latlng, { radius: 4, color: "#fff", weight: 1, fillColor: s.color, fillOpacity: 0.9 });
        },
        onEachFeature: (f, layer) => {
          const p = f.properties ?? {};
          const s = SEKOLAH_STYLE[p.jenis] ?? SEKOLAH_STYLE.sd;
          layer.bindPopup(
            `<b>${escapeHtml(p.nama ?? "-")}</b><br/>${s.label} · NPSN ${p.npsn ?? "-"}<br/><small>${escapeHtml(p.kelurahan ?? "")}, ${escapeHtml(p.kecamatan ?? "")}</small>`
          );
        },
      });
    }
    case "jalan": {
      const fc = await fetchJson("jalan");
      return L.geoJSON(fc, {
        pane: "jalan",
        style: (f) => {
          const w = ROAD_WEIGHT[f?.properties?.kelas] ?? 0.6;
          return { color: w >= 2 ? "#8a5a3c" : "#6f6f6f", weight: w, opacity: w >= 2 ? 0.9 : 0.55 };
        },
      });
    }
    case "kecamatan": {
      const fc = await fetchJson("kecamatan");
      const group = L.layerGroup();
      L.geoJSON(fc, {
        pane: "batas",
        style: { color: "#173b38", weight: 2.2, fill: false, dashArray: "6 4" },
      }).addTo(group);

      // Tambahkan label nama 6 kecamatan
      for (const f of fc.features) {
        const kecName = f.properties?.kecamatan ?? "";
        const [lat, lon] = featureCenterLatLng(f.geometry);
        L.marker([lat, lon], {
          pane: "batas",
          interactive: false,
          icon: L.divIcon({
            className: "kec-label",
            html: `<span>${escapeHtml(kecName)}</span>`,
            iconSize: [0, 0],
          }),
        }).addTo(group);
      }
      return group;
    }
  }
}
