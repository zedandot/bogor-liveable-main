import Link from "next/link";
import { BogorMap } from "../components/map-visual";
import { Icon, PageIntro, PageShell } from "../components/ui";
import { dimensions, districts, kelurahanData } from "../data";
import { classify, fmt } from "../lib/livability";

export default function DashboardPage() {
  const totalPop = kelurahanData.reduce((s, k) => s + k.penduduk, 0);
  const cityWeighted =
    kelurahanData.reduce((s, k) => s + k.skor_livable * k.penduduk, 0) / totalPop;
  const top = kelurahanData[0];
  const needAttention = kelurahanData.filter((k) => k.skor_livable <= 0.4).length;
  const avgPuskesmasCov =
    kelurahanData.reduce((s, k) => s + k.cakupan_puskesmas_pct, 0) / kelurahanData.length;

  return (
    <PageShell className="standard-page">
      <PageIntro
        eyebrow="Statistik kota"
        title="Bogor dalam angka."
        description="Ringkasan kondisi kelayakhunian 68 kelurahan dan enam kecamatan berdasarkan data spasial dan atribut terbaru."
        action={
          <a className="quiet-button" href="/data/kelurahan.geojson" download>
            <Icon name="download" />
            Unduh GeoJSON
          </a>
        }
      />

      <section className="stat-cards">
        <article className="stat-primary">
          <span>Indeks agregat kota</span>
          <strong>{fmt(cityWeighted)}</strong>
          <b>{classify(cityWeighted).label}</b>
          <small>Rata-rata tertimbang penduduk ({totalPop.toLocaleString("id-ID")} jiwa)</small>
        </article>
        <article>
          <span>Kelurahan tertinggi</span>
          <strong>{fmt(top.skor_livable)}</strong>
          <b>{top.kelurahan}</b>
          <small>{top.kecamatan}</small>
        </article>
        <article>
          <span>Kelurahan perlu perhatian</span>
          <strong>{needAttention}</strong>
          <b>kelurahan</b>
          <small>Skor pada kelas Tidak Layak & Sangat Tidak Layak (≤ 0,40)</small>
        </article>
        <article>
          <span>Cakupan puskesmas</span>
          <strong>{fmt(avgPuskesmasCov, 1)}%</strong>
          <b>permukiman</b>
          <small>Radius layanan 2 km (analisis buffer)</small>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel city-map-panel">
          <header>
            <div>
              <p className="eyebrow">Sebaran spasial</p>
              <h2>Indeks per kelurahan</h2>
            </div>
            <Link href="/peta" className="quiet-button">
              Buka peta interaktif
            </Link>
          </header>
          <BogorMap compact />
          <div className="panel-legend">
            <i />
            <span>Rendah (0,00)</span>
            <b />
            <span>Tinggi (1,00)</span>
          </div>
        </article>

        <article className="dashboard-panel dimensions-panel">
          <header>
            <div>
              <p className="eyebrow">Rata-rata 68 kelurahan</p>
              <h2>Skor per dimensi</h2>
            </div>
          </header>
          {dimensions.map((d) => (
            <div className="big-bar" key={d.name}>
              <span>{d.name}</span>
              <i>
                <b style={{ width: `${d.value * 100}%`, background: d.color }} />
              </i>
              <strong>{fmt(d.value)}</strong>
            </div>
          ))}
        </article>
      </section>

      <section className="dashboard-panel district-table-panel">
        <header>
          <div>
            <p className="eyebrow">Agregat wilayah</p>
            <h2>Perbandingan enam kecamatan</h2>
          </div>
          <span className="data-note">
            <Icon name="info" size={15} />
            Ditimbang menurut jumlah penduduk
          </span>
        </header>
        <div className="district-table">
          <div>
            <b>Kecamatan</b>
            <b>Kelurahan</b>
            <b>Penduduk</b>
            <b>Indeks</b>
            <b>Klasifikasi</b>
          </div>
          {districts.map((d) => (
            <div key={d.name}>
              <strong>{d.name}</strong>
              <span>{d.villages}</span>
              <span>{d.population}</span>
              <b>{fmt(d.score)}</b>
              <span className="status-pill">{d.className}</span>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
