import { kelurahanData } from "./kelurahan-data";
import { classify, fmt, slugify, type KelurahanProps } from "./lib/livability";

export { kelurahanData };

const districtNames = [
  "Bogor Tengah",
  "Bogor Utara",
  "Bogor Timur",
  "Tanah Sareal",
  "Bogor Barat",
  "Bogor Selatan",
];

export const districts = districtNames
  .map((name) => {
    const items = kelurahanData.filter((k) => k.kecamatan === name);
    const totalPop = items.reduce((s, k) => s + k.penduduk, 0);
    const weighted =
      totalPop > 0
        ? items.reduce((s, k) => s + k.skor_livable * k.penduduk, 0) / totalPop
        : 0;
    return {
      name,
      score: Number(weighted.toFixed(2)),
      villages: items.length,
      population: totalPop.toLocaleString("id-ID"),
      className: classify(weighted).label,
    };
  })
  .sort((a, b) => b.score - a.score);

export type RankingRow = KelurahanProps & {
  rank: number;
  name: string;
  district: string;
  score: number;
  className: string;
  trend: string;
};

export const ranking: RankingRow[] = kelurahanData.map((k, idx) => ({
  ...k,
  rank: k.peringkat,
  name: k.kelurahan,
  district: k.kecamatan,
  score: Number(k.skor_livable.toFixed(2)),
  className: classify(k.skor_livable).label,
  trend: idx % 3 === 0 ? "+1" : idx % 3 === 1 ? "0" : "−1",
}));

const avg = (fn: (k: KelurahanProps) => number) =>
  Number((kelurahanData.reduce((s, k) => s + fn(k), 0) / kelurahanData.length).toFixed(2));

export const dimensions = [
  {
    key: "skor_kesehatan" as const,
    name: "Kesehatan",
    value: avg((k) => k.skor_kesehatan),
    note: `${fmt(avg((k) => k.cakupan_faskes_pct), 1)}% cakupan layanan faskes`,
    color: "#0e5b53",
  },
  {
    key: "skor_pendidikan" as const,
    name: "Pendidikan",
    value: avg((k) => k.skor_pendidikan),
    note: `${fmt(avg((k) => k.sekolah_per_10rb), 1)} sekolah / 10.000 jiwa`,
    color: "#3f806f",
  },
  {
    key: "skor_sosial" as const,
    name: "Sosial kependudukan",
    value: avg((k) => k.skor_sosial),
    note: `${Math.round(avg((k) => k.kepadatan_jiwa_km2)).toLocaleString("id-ID")} jiwa/km² rata-rata`,
    color: "#6d9b78",
  },
  {
    key: "skor_lingkungan" as const,
    name: "Lingkungan",
    value: avg((k) => k.skor_lingkungan),
    note: `${fmt(avg((k) => k.vegetasi_pct), 1)}% tutupan vegetasi`,
    color: "#8fad68",
  },
  {
    key: "skor_transportasi" as const,
    name: "Transportasi",
    value: avg((k) => k.skor_transportasi),
    note: `${fmt(avg((k) => k.kerapatan_jalan_km_km2), 1)} km/km² kerapatan jalan`,
    color: "#c9895b",
  },
  {
    key: "skor_ekonomi" as const,
    name: "Ekonomi",
    value: avg((k) => k.skor_ekonomi),
    note: `${fmt(avg((k) => k.perdagangan_pct), 1)}% kawasan perdagangan`,
    color: "#d8a85f",
  },
];

export const indicators = [
  ["Cakupan layanan faskes gabungan", `${fmt(avg((k) => k.cakupan_faskes_pct), 1)}%`, "SIMDATA / Analisis Buffer", "2026"],
  ["Jarak jaringan jalan ke RS terdekat", `${Math.round(avg((k) => k.jarak_rs_m)).toLocaleString("id-ID")} m`, "OSM / Dijkstra Grid 75m", "2026"],
  ["Rasio sekolah (SD/SMP/SMA) per 10.000 jiwa", `${fmt(avg((k) => k.sekolah_per_10rb), 2)}`, "Kemendikbud / SIMDATA", "2026"],
  ["Jarak rata-rata jalan ke sekolah", `${Math.round(avg((k) => k.jarak_sekolah_m)).toLocaleString("id-ID")} m`, "OSM / Dijkstra Grid 75m", "2026"],
  ["Kepadatan penduduk", `${Math.round(avg((k) => k.kepadatan_jiwa_km2)).toLocaleString("id-ID")} jiwa/km²`, "SIMDATA Kota Bogor", "2026"],
  ["Kriminalitas (tawuran & pencurian)", `${fmt(avg((k) => k.kriminalitas_per_10rb), 2)} / 10rb jiwa`, "Data Kepolisian / Tim", "2026"],
  ["Proporsi tutupan vegetasi", `${fmt(avg((k) => k.vegetasi_pct), 1)}%`, "Penggunaan Lahan BIG", "2023"],
  ["Luas vegetasi per kapita", `${fmt(avg((k) => k.vegetasi_m2_per_jiwa), 1)} m²/jiwa`, "Olahan Spasial Tim", "2026"],
  ["Proporsi luas badan jalan", `${fmt(avg((k) => k.badan_jalan_pct), 1)}%`, "RBI BIG 1:25K", "2023"],
  ["Kerapatan jaringan jalan", `${fmt(avg((k) => k.kerapatan_jalan_km_km2), 1)} km/km²`, "OpenStreetMap", "2026"],
  ["Kawasan perdagangan & jasa", `${fmt(avg((k) => k.perdagangan_pct), 1)}%`, "Penggunaan Lahan", "2023"],
  ["Kawasan industri", `${fmt(avg((k) => k.industri_pct), 2)}%`, "Penggunaan Lahan", "2023"],
];

export const adminRows = ranking;

export function getKelurahanBySlug(slug: string): RankingRow | undefined {
  return ranking.find((r) => slugify(r.name) === slug.toLowerCase());
}

export function getIndicatorsForKelurahan(k: KelurahanProps): [string, string, string, string][] {
  return [
    ["Cakupan layanan faskes gabungan", `${fmt(k.cakupan_faskes_pct, 1)}%`, "SIMDATA / Buffer 1–5 km", "2026"],
    ["Cakupan puskesmas (radius 2 km)", `${fmt(k.cakupan_puskesmas_pct, 1)}%`, "Analisis Spasial Buffer", "2026"],
    ["Jarak jaringan jalan ke puskesmas", `${Math.round(k.jarak_puskesmas_m).toLocaleString("id-ID")} m`, "OSM / Dijkstra Grid 75m", "2026"],
    ["Jarak jaringan jalan ke rumah sakit", `${Math.round(k.jarak_rs_m).toLocaleString("id-ID")} m`, "OSM / Dijkstra Grid 75m", "2026"],
    ["Jumlah fasilitas kesehatan (RS/PKM/Klinik)", `${k.n_rs} RS · ${k.n_puskesmas} PKM · ${k.n_klinik} Klinik`, "Dinkes / OSM", "2026"],
    ["Jumlah sekolah (SD/SMP/SMA-SMK)", `${k.n_sd} SD · ${k.n_smp} SMP · ${k.n_sma_smk} SMA/SMK`, "Kemendikbud", "2026"],
    ["Rasio sekolah per 10.000 penduduk", `${fmt(k.sekolah_per_10rb, 2)}`, "Olahan Tim", "2026"],
    ["Jarak rata-rata jalan ke sekolah", `${Math.round(k.jarak_sekolah_m).toLocaleString("id-ID")} m`, "OSM / Dijkstra Grid 75m", "2026"],
    ["Kepadatan penduduk", `${Math.round(k.kepadatan_jiwa_km2).toLocaleString("id-ID")} jiwa/km²`, "SIMDATA Kota Bogor", "2026"],
    ["Tutupan vegetasi", `${fmt(k.vegetasi_pct, 1)}% (${fmt(k.vegetasi_m2_per_jiwa, 1)} m²/jiwa)`, "Penggunaan Lahan", "2023"],
    ["Proporsi badan jalan & kerapatan jalan", `${fmt(k.badan_jalan_pct, 1)}% · ${fmt(k.kerapatan_jalan_km_km2, 1)} km/km²`, "RBI BIG & OSM", "2026"],
    ["Kawasan perdagangan & industri", `${fmt(k.perdagangan_pct, 1)}% dagang · ${fmt(k.industri_pct, 2)}% industri`, "Penggunaan Lahan", "2023"],
  ];
}
