// Konfigurasi bersama WebGIS: tipe data kelurahan, tema peta, dan klasifikasi 5 kelas.
// Sumber data: public/data/kelurahan.geojson (dihasilkan oleh gis/build-data.ps1).

export type KelurahanProps = {
  kode: string;
  kecamatan: string;
  kelurahan: string;
  penduduk: number;
  luas_km2: number;
  skor_kesehatan: number;
  skor_pendidikan: number;
  skor_sosial: number;
  skor_ekonomi: number;
  skor_transportasi: number;
  skor_lingkungan: number;
  skor_livable: number;
  kelas: string;
  peringkat: number;
  n_puskesmas: number;
  n_klinik: number;
  n_rs: number;
  cakupan_faskes_pct: number;
  cakupan_puskesmas_pct: number;
  cakupan_rs_pct: number;
  jarak_puskesmas_m: number;
  jarak_klinik_m: number;
  jarak_rs_m: number;
  n_sd: number;
  n_smp: number;
  n_sma_smk: number;
  sekolah_per_10rb: number;
  jarak_sekolah_m: number;
  kepadatan_jiwa_km2: number;
  kriminalitas_per_10rb: number;
  perdagangan_pct: number;
  industri_pct: number;
  badan_jalan_pct: number;
  kerapatan_jalan_km_km2: number;
  vegetasi_pct: number;
  vegetasi_m2_per_jiwa: number;
};

export type ThemeKey =
  | "skor_livable"
  | "skor_kesehatan"
  | "skor_pendidikan"
  | "skor_sosial"
  | "skor_ekonomi"
  | "skor_transportasi"
  | "skor_lingkungan";

export const themes: { key: ThemeKey; label: string; color: string }[] = [
  { key: "skor_livable", label: "Indeks kelayakhunian", color: "#0e5b53" },
  { key: "skor_kesehatan", label: "Dimensi Kesehatan", color: "#0e5b53" },
  { key: "skor_pendidikan", label: "Dimensi Pendidikan", color: "#3f806f" },
  { key: "skor_sosial", label: "Dimensi Sosial kependudukan", color: "#6d9b78" },
  { key: "skor_lingkungan", label: "Dimensi Lingkungan", color: "#8fad68" },
  { key: "skor_transportasi", label: "Dimensi Transportasi", color: "#c9895b" },
  { key: "skor_ekonomi", label: "Dimensi Ekonomi", color: "#d8a85f" },
];

export const dimensionKeys: { key: ThemeKey; label: string; color: string }[] = themes.slice(1).map((t) => ({
  ...t,
  label: t.label.replace("Dimensi ", ""),
}));

// Interval setara pada rentang 0 sampai 1 (sama dengan halaman Metodologi).
export const classes = [
  { min: 0.8, label: "Sangat layak huni", range: "0,81 - 1,00", color: "#2e7468" },
  { min: 0.6, label: "Layak huni", range: "0,61 - 0,80", color: "#6ca77e" },
  { min: 0.4, label: "Cukup layak huni", range: "0,41 - 0,60", color: "#b8cf8b" },
  { min: 0.2, label: "Tidak layak huni", range: "0,21 - 0,40", color: "#d8b56a" },
  { min: -Infinity, label: "Sangat tidak layak huni", range: "0,00 - 0,20", color: "#c9895b" },
];

export function classify(score: number) {
  return classes.find((c) => score > c.min) ?? classes[classes.length - 1];
}

export const fmt = (n: number, digits = 2) =>
  n.toLocaleString("id-ID", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const slugify = (name: string) => name.toLowerCase().trim().replace(/\s+/g, "-");

export const scoreToColor = (score: number) => classify(score).color;
export const scoreToClass = (score: number) => classify(score).label;
export const toSlug = slugify;
