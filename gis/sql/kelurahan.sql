-- WBS 1.3.4 — Agregasi atribut indikator ke level kelurahan.
-- Menggabungkan skor akhir (7_livable) dengan indikator mentah tiap dimensi (1..6)
-- menjadi satu layer poligon 68 kelurahan siap pakai untuk WebGIS / impor PostGIS.
SELECT
  l.kode,
  l.kecamatan,
  l.kelurahan,
  l.penduduk,
  round(l.luas_km2, 3)                      AS luas_km2,
  round(l.skor_kesehatan, 4)                AS skor_kesehatan,
  round(l.skor_pendidikan, 4)               AS skor_pendidikan,
  round(l.skor_sosial_kependudukan, 4)      AS skor_sosial,
  round(l.skor_ekonomi, 4)                  AS skor_ekonomi,
  round(l.skor_transportasi, 4)             AS skor_transportasi,
  round(l.skor_lingkungan, 4)               AS skor_lingkungan,
  round(l.skor_livable, 4)                  AS skor_livable,
  l.kelas,
  l.peringkat,
  -- Kesehatan
  k.n_puskesmas, k.n_klinik, k.n_rs,
  round(k.K1_cakupan_gabungan_pct, 2)       AS cakupan_faskes_pct,
  round(k.cakupan_puskesmas_2km_pct, 2)     AS cakupan_puskesmas_pct,
  round(k.cakupan_rs_5km_pct, 2)            AS cakupan_rs_pct,
  round(k.jarak_puskesmas_m, 0)             AS jarak_puskesmas_m,
  round(k.jarak_klinik_m, 0)                AS jarak_klinik_m,
  round(k.jarak_rs_m, 0)                    AS jarak_rs_m,
  -- Pendidikan
  p.n_SD AS n_sd, p.n_SMP AS n_smp, p.n_SMA_SMK AS n_sma_smk,
  round(p.P1_sekolah_per_10rb_pddk, 2)      AS sekolah_per_10rb,
  round(p.P2_jarak_jalan_rata2_m, 0)        AS jarak_sekolah_m,
  -- Sosial kependudukan
  round(s.S1_kepadatan_jiwa_km2, 0)         AS kepadatan_jiwa_km2,
  round(s.S2_kriminalitas_per_10rb, 2)      AS kriminalitas_per_10rb,
  -- Ekonomi
  round(e.E1_kawasan_perdagangan_pct, 2)    AS perdagangan_pct,
  round(e.E2_kawasan_industri_pct, 2)       AS industri_pct,
  -- Transportasi
  round(t.T1_badan_jalan_pct, 2)            AS badan_jalan_pct,
  round(t.T2_kerapatan_jalan_osm_km_km2, 2) AS kerapatan_jalan_km_km2,
  -- Lingkungan
  round(g.L1_vegetasi_pct, 2)               AS vegetasi_pct,
  round(g.L2_vegetasi_m2_per_jiwa, 2)       AS vegetasi_m2_per_jiwa,
  l.geom
FROM "7_livable" l
LEFT JOIN "1_kesehatan"           k ON k.kode = l.kode
LEFT JOIN "2_pendidikan"          p ON p.kode = l.kode
LEFT JOIN "3_sosial_kependudukan" s ON s.kode = l.kode
LEFT JOIN "4_ekonomi"             e ON e.kode = l.kode
LEFT JOIN "5_transportasi"        t ON t.kode = l.kode
LEFT JOIN "6_lingkungan"          g ON g.kode = l.kode
ORDER BY l.peringkat

