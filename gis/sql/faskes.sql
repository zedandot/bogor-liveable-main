-- Titik fasilitas kesehatan (gabungan Puskesmas, Klinik, Rumah Sakit).
SELECT nama, 'puskesmas' AS jenis, kel AS kelurahan, kec AS kecamatan, geom FROM titik_puskesmas
UNION ALL
SELECT nama, 'klinik', kel, kec, geom FROM titik_klinik
UNION ALL
SELECT nama, 'rs', kel, kec, geom FROM titik_rs

