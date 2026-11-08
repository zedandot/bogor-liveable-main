-- Titik sekolah (gabungan SD, SMP, SMA/SMK).
SELECT nama, 'sd' AS jenis, npsn, kel AS kelurahan, kec AS kecamatan, geom FROM titik_sd
UNION ALL
SELECT nama, 'smp', npsn, kel, kec, geom FROM titik_smp
UNION ALL
SELECT nama, 'sma_smk', npsn, kel, kec, geom FROM titik_sma_smk

