import { Icon, PageShell } from "../components/ui";
import { dimensions, indicators } from "../data";

export default function MethodPage() {
  return (
    <PageShell className="method-page">
      <section className="method-hero">
        <p className="eyebrow">Metodologi penilaian</p>
        <h1>
          Data yang terbuka.
          <br />
          Rumus yang dapat ditelusuri.
        </h1>
        <p>
          Indeks Ruang Bogor menggabungkan sepuluh indikator spasial dan
          atribut menjadi enam dimensi kelayakhunian dengan tahapan perhitungan
          yang transparan.
        </p>
        <div>
          <span>Rujukan utama</span>
          <b>Dewi, Yahya &amp; Situmorang (2025)</b>
          <small>Jurnal Pembangunan Wilayah dan Kota, 21(3)</small>
        </div>
      </section>

      <section className="method-flow">
        <div className="section-heading">
          <p className="eyebrow">Tahap perhitungan</p>
          <h2>Dari nilai mentah ke indeks 0,00 sampai 1,00.</h2>
        </div>
        <div className="method-steps">
          <article>
            <span>1</span>
            <h3>Normalisasi Min-Max</h3>
            <p>
              Setiap nilai indikator diubah ke rentang 0 sampai 1 agar satuan
              yang berbeda (meter, persen, rasio) dapat dibandingkan secara
              setara.
            </p>
            <code>X&prime; = (X &minus; Xmin) / (Xmax &minus; Xmin)</code>
          </article>
          <article>
            <span>2</span>
            <h3>Agregasi enam dimensi</h3>
            <p>
              Sub-indikator dijumlahkan dan dinormalisasi ulang menjadi enam
              skor dimensi: Kesehatan, Pendidikan, Sosial, Lingkungan,
              Transportasi, dan Ekonomi.
            </p>
            <div className="mini-dots" aria-hidden="true">
              {dimensions.map((d) => (
                <i key={d.name} style={{ background: d.color }} />
              ))}
            </div>
          </article>
          <article>
            <span>3</span>
            <h3>Klasifikasi lima kelas</h3>
            <p>
              Skor komposit dikelompokkan ke dalam lima interval setara agar
              prioritas intervensi tiap kelurahan terbaca jelas.
            </p>
            <div className="mini-gradient" aria-hidden="true" />
          </article>
        </div>
      </section>

      <section className="classification-section">
        <div>
          <p className="eyebrow">Lima kelas indeks</p>
          <h2>Membaca sebuah skor.</h2>
          <p>
            Kelas menggunakan interval setara pada rentang 0,00 sampai 1,00.
            Skor tinggi menunjukkan capaian fasilitas dan kualitas lingkungan
            yang relatif lebih baik di antara 68 kelurahan Kota Bogor.
          </p>
        </div>
        <div className="class-list">
          {[
            ["0,81 sampai 1,00", "Sangat layak huni"],
            ["0,61 sampai 0,80", "Layak huni"],
            ["0,41 sampai 0,60", "Cukup layak huni"],
            ["0,21 sampai 0,40", "Tidak layak huni"],
            ["0,00 sampai 0,20", "Sangat tidak layak huni"],
          ].map((x, i) => (
            <div key={x[0]}>
              <i className={"class-color c" + i} aria-hidden="true" />
              <b>{x[1]}</b>
              <span>{x[0]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="source-section" id="sumber">
        <div className="section-heading">
          <p className="eyebrow">Sumber data</p>
          <h2>Rincian indikator dan instansi sumber.</h2>
          <p>
            Setiap indikator mencatat nilai rata-rata kota, metode pengolahan
            spasial, dan tahun pemutakhiran data.
          </p>
        </div>
        <div className="source-grid">
          {indicators.map((row, i) => (
            <article key={row[0]}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{row[0]}</h3>
              <p>
                Rata-rata kota: <b>{row[1]}</b> · {row[2]}
              </p>
              <small>Tahun data: {row[3]}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="method-note">
        <Icon name="info" size={26} />
        <div>
          <h3>Catatan interpretasi</h3>
          <p>
            Indeks bersifat relatif terhadap 68 kelurahan di Kota Bogor.
            Perubahan nilai minimum atau maksimum pada periode baru akan
            menyesuaikan skor relatif seluruh wilayah.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
