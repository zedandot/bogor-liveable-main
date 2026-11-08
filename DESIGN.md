# DESIGN.md: Sistem Desain Ruang Bogor

Reading this as: **Atlas WebGIS & Spatial Decision Support System (SDSS)** untuk **warga, peneliti, dan perencana Kota Bogor**, dengan bahasa visual **editorial kartografi botanikal**, dial **ENERGY 2 / RHYTHM 2 / MOTION 2**.

## 1. Identitas & Karakter Produk

Ruang Bogor menyajikan indeks kelayakhunian 68 kelurahan dan 6 kecamatan di Kota Bogor berdasarkan 10 indikator geospasial dan atribut. Karakter utamanya adalah **laporan kartografi publik yang hangat, jujur pada data, dan mudah ditelusuri**. Tokoh utamanya adalah peta poligon 68 kelurahan dan data nyatanya.

## 2. Tiga Dial Liveliness (Part 3)

| Dial | Nilai | Keputusan Visual |
|------|-------|------------------|
| **ENERGY** | **2 (Balanced)** | Hangat lewat ilustrasi cat air Kebun Raya & Gunung Salak di hero, tenang dan terstruktur pada halaman tabel, peta, serta analisis. |
| **RHYTHM** | **2 (Consistent with breaks)** | Beranda memadukan panggung hero berilustrasi, pita metrik kota, grid 6 dimensi, panggung gelap peta kelurahan unggulan, daftar peringkat, grafik batang kecamatan interaktif, dan panel tanya-jawab spasial. |
| **MOTION** | **2 (Functional transitions)** | Transisi warna poligon saat ganti dimensi/simulasi, sorotan wilayah aktif pada peta, dan pembukaan menu/panel. Semua gerak berhenti penuh pada `prefers-reduced-motion: reduce`. |

## 3. Palet Warna (2 Warna Inti + 1 Aksen + Netral)

| Token | Nilai Hex | Peran & Kontras |
|-------|-----------|-----------------|
| `--ink` | `#173b38` | Teks utama dan judul (kontras > 11:1 di atas `--paper` dan `--cream`) |
| `--green` | `#0e5b53` | Warna inti tindakan utama, tautan aktif, dan penanda fokus (kontras > 7.5:1 di atas putih) |
| `--clay` | `#b86b3d` | Aksen tunggal untuk pembanding wilayah kedua dan penanda nilai rendah |
| `--cream` | `#f7f6f0` | Latar halaman dasar agar mata tidak cepat lelah saat membaca tabel |
| `--paper` | `#fffefa` | Permukaan kartu, tabel, dan panel kontrol |
| `--muted` | `#48605a` | Teks sekunder dan keterangan (kontras >= 5.8:1 di atas `--paper` dan `--cream`, memenuhi WCAG AA) |
| `--line` | `#d5e0da` | Garis pemisah struktural antar bagian dan baris tabel |

*Catatan Skala Data:* Lima warna kelas choropleth (`#c9895b`, `#d8b56a`, `#b8cf8b`, `#6ca77e`, `#2e7468`) pada `app/lib/livability.ts` adalah representasi data interval indeks 0,00 sampai 1,00, bukan palet dekoratif UI.

## 4. Skala Tipografi

- **Judul Display & Bagian (`--serif`)**: `Georgia, "Times New Roman", serif`
  - H1 Hero: `clamp(36px, 4.8vw, 56px)`, `line-height: 1.06`
  - H1 Halaman Dalam: `clamp(28px, 3.6vw, 42px)`, `line-height: 1.12`
  - H2 Bagian: `clamp(24px, 3vw, 36px)`, `line-height: 1.15`
  - H3 Kartu / Panel: `20px`, `line-height: 1.25`
- **Teks Antarmuka & Tabel (`--font-sans`)**: `"Segoe UI", system-ui, -apple-system, sans-serif`
  - Paragraf pengantar (lead): `16px`, `line-height: 1.6`
  - Teks isi, tabel, dan kontrol: `14px`, `line-height: 1.5`
  - Keterangan sumber, label peta, dan atribut pendukung: `12px` (lantai minimum keterbacaan)
- **Angka Kode Wilayah (`--font-mono`)**: `Consolas, ui-monospace, monospace` khusus kode Kemendagri dan koordinat.

## 5. Alasan Satu Baris untuk Setiap Keputusan Utama (R-31)

- **Mengapa warna hijau tua (`#173b38` & `#0e5b53`) dan krem (`#f7f6f0`)?** Mencerminkan identitas Kota Bogor sebagai kota hujan dan Kebun Raya sekaligus menjaga kontras baca di atas kertas kartografi.
- **Mengapa aksen tanah liat (`#b86b3d`)?** Memberikan kontras hangat yang langsung membedakan wilayah pembanding kedua dan kelas skor rendah dari dominasi hijau.
- **Mengapa tipografi serif (`Georgia`) untuk judul dan sans-serif untuk tabel?** Serif memberi bobot editorial seperti atlas cetak, sedangkan sans-serif menjaga angka desimal dan nama 68 kelurahan tetap tajam di ukuran kecil.
- **Mengapa tata letak beranda dibagi menjadi pratinjau peta langsung, 6 dimensi, perbandingan kecamatan, dan asisten?** Mengikuti alur berpikir pembaca dari gambaran kota secara utuh, komponen penyusun skor, agregasi kecamatan, hingga pencarian mandiri.
- **Mengapa menggunakan kartu pada 6 dimensi?** Setiap dimensi memiliki rata-rata kota, indikator penyusun, dan kelurahan tertinggi yang perlu dibandingkan sejajar dalam satu pandangan.
- **Mengapa menggunakan ilustrasi cat air Bogor (`bogor-watercolor.png`) di hero?** Menghubungkan data abstrak dengan bentang alam nyata Kota Bogor (Kebun Raya, Tugu Kujang, Gunung Salak) sebagai elemen LCP yang dimuat via `<img>` dengan `fetchPriority="high"`.
- **Mengapa menggunakan ikon garis sederhana (`Icon`)?** Hanya dipakai sebagai penanda fungsi navigasi (peta, tabel peringkat, perbandingan, simulasi, pencarian, unduh) agar tidak mengalihkan perhatian dari geometri peta.
- **Mengapa ada bayangan (`box-shadow`) dan `backdrop-filter` terbatas?** Hanya untuk memisahkan panel mengambang di atas kanvas peta dan bilah navigasi lengket dari konten di bawahnya (maksimal 2 elemen per tampilan).
- **Mengapa ada tombol panah (`→`) pada tautan perpindahan halaman?** Menandakan perpindahan ke halaman analisis penuh (`/peta`, `/peringkat`, `/wilayah/[slug]`), dan tidak dipakai pada tombol aksi di tempat (filter, reset, normalisasi).
