-- WBS 1.3.2 — Analisis buffer jangkauan fasilitas kesehatan.
-- Radius mengikuti parameter yang dipakai pada perhitungan dimensi kesehatan:
--   Puskesmas 2 km, Klinik 1 km, Rumah Sakit 5 km.
-- Buffer dihitung dalam meter (UTM 48S / EPSG:32748), dipotong batas Kota Bogor,
-- lalu dikembalikan ke WGS 84 (EPSG:4326).
-- Output juga memuat "blank spot": wilayah kota di luar jangkauan layanan kesehatan
-- PRIMER (Puskesmas 2 km & Klinik 1 km). Catatan: buffer RS 5 km sudah menutup ~99%
-- wilayah kota, sehingga blank spot terhadap RS hampir tidak ada.
WITH
city AS (SELECT ST_Union(ST_Transform(SetSRID(geom, 4326), 32748)) AS g FROM "7_livable"),
pk   AS (SELECT ST_Union(ST_Buffer(ST_Transform(SetSRID(geom, 4326), 32748), 2000)) AS g FROM titik_puskesmas),
kl   AS (SELECT ST_Union(ST_Buffer(ST_Transform(SetSRID(geom, 4326), 32748), 1000)) AS g FROM titik_klinik),
rs   AS (SELECT ST_Union(ST_Buffer(ST_Transform(SetSRID(geom, 4326), 32748), 5000)) AS g FROM titik_rs),
cov  AS (SELECT ST_Union(pk.g, kl.g) AS g FROM pk, kl)
SELECT 'rs' AS kode, 'Jangkauan Rumah Sakit (5 km)' AS kategori, 5000 AS radius_m,
       round(ST_Area(ST_Intersection(rs.g, city.g)) / 1e6, 2) AS luas_km2,
       round(100.0 * ST_Area(ST_Intersection(rs.g, city.g)) / ST_Area(city.g), 1) AS cakupan_kota_pct,
       ST_Transform(ST_Intersection(rs.g, city.g), 4326) AS geom
FROM rs, city
UNION ALL
SELECT 'puskesmas', 'Jangkauan Puskesmas (2 km)', 2000,
       round(ST_Area(ST_Intersection(pk.g, city.g)) / 1e6, 2),
       round(100.0 * ST_Area(ST_Intersection(pk.g, city.g)) / ST_Area(city.g), 1),
       ST_Transform(ST_Intersection(pk.g, city.g), 4326)
FROM pk, city
UNION ALL
SELECT 'klinik', 'Jangkauan Klinik (1 km)', 1000,
       round(ST_Area(ST_Intersection(kl.g, city.g)) / 1e6, 2),
       round(100.0 * ST_Area(ST_Intersection(kl.g, city.g)) / ST_Area(city.g), 1),
       ST_Transform(ST_Intersection(kl.g, city.g), 4326)
FROM kl, city
UNION ALL
SELECT 'blank_spot', 'Blank spot layanan primer (di luar Puskesmas 2 km & Klinik 1 km)', NULL,
       round(ST_Area(ST_Difference(city.g, cov.g)) / 1e6, 2),
       round(100.0 * ST_Area(ST_Difference(city.g, cov.g)) / ST_Area(city.g), 1),
       ST_Transform(ST_Difference(city.g, cov.g), 4326)
FROM city, cov
