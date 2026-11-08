-- Batas 6 kecamatan (dissolve dari poligon kelurahan) + agregat sederhana.
SELECT
  kecamatan,
  count(*)                         AS jumlah_kelurahan,
  sum(penduduk)                    AS penduduk,
  round(sum(luas_km2), 2)          AS luas_km2,
  round(sum(skor_livable * penduduk) / sum(penduduk), 4) AS skor_livable_tertimbang,
  ST_Union(geom)                   AS geom
FROM "7_livable"
GROUP BY kecamatan

