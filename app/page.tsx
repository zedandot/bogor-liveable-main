import Link from "next/link";
import {
  AnimatedStatStrip,
  HeroInteractivePreview,
  InteractiveDistrictRibbon,
  ScrollRevealEffects,
} from "./components/home-interactive";
import { BogorMap } from "./components/map-visual";
import { Footer, Header, Icon } from "./components/ui";
import { dimensions, districts, kelurahanData, ranking } from "./data";
import { fmt, toSlug } from "./lib/livability";

export default function Home() {
  const topKel = kelurahanData[0];

  return (
    <>
      <ScrollRevealEffects />
      <Header />
      <main id="main-content">
        <div className="landing-wash">
          <section className="hero">
            <div className="hero-city-art">
              <img
                src="/bogor-watercolor.png"
                alt="Ilustrasi cat air panorama Kebun Raya Bogor, Tugu Kujang, dan Gunung Salak"
                width={1920}
                height={1080}
                fetchPriority="high"
                decoding="async"
                className="hero-city-img"
              />
            </div>

            <div className="hero-copy">
              <h1>
                Kelurahan mana di <em>Kota Bogor</em> yang paling layak huni?
              </h1>
              <p>
                Bandingkan indeks kelayakhunian 68 kelurahan dan 6 kecamatan
                berdasarkan data fasilitas kesehatan, sekolah, ruang terbuka
                hijau, jaringan jalan, ekonomi, dan kependudukan.
              </p>
              <div className="hero-actions">
                <Link className="button hero-cta-primary" href="/peta">
                  Buka peta 68 kelurahan <Icon name="arrow" />
                </Link>
                <Link
                  className="quiet-button hero-cta-secondary"
                  href="/peringkat"
                >
                  Lihat tabel peringkat
                </Link>
              </div>
            </div>

            <HeroInteractivePreview />
          </section>

          <AnimatedStatStrip />
        </div>

        <div className="home-content">
          <section className="story-section reveal-on-scroll">
            <div className="section-heading">
              <p className="eyebrow">Komponen indeks</p>
              <h2>Enam dimensi penyusun kelayakhunian.</h2>
            </div>
            <p className="section-lead">
              Setiap kelurahan dinilai dari sepuluh indikator spasial dan
              atribut yang dikelompokkan ke dalam enam dimensi utama dengan
              rentang skor ternormalisasi 0,00 sampai 1,00.
            </p>
            <div className="dimension-grid">
              {dimensions.map((d, i) => (
                <article
                  key={d.key}
                  className={`dimension-card reveal-on-scroll ${
                    i === 0 ? "dimension-card-lead" : ""
                  }`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className="dimension-number">0{i + 1}</span>
                  <div className="dimension-card-top">
                    <div
                      className="dimension-icon"
                      style={{ background: d.color }}
                    >
                      <Icon name={d.icon} />
                    </div>
                    <span className="dimension-avg-pill">
                      Rata-rata kota <b>{fmt(d.value)}</b>
                    </span>
                  </div>
                  <h3>{d.name}</h3>
                  <p>{d.desc}</p>
                  <div className="dimension-meter">
                    <i
                      style={{
                        width: `${Math.max(d.value * 100, 12)}%`,
                        background: d.color,
                      }}
                    />
                  </div>
                  <div className="dimension-card-foot">
                    <small>Tertinggi: {d.top}</small>
                    <span>{d.stat}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="featured-section reveal-on-scroll">
            <div className="featured-map">
              <BogorMap compact selectedSlug="pabaton" />
            </div>
            <div className="featured-copy">
              <p className="eyebrow"> Eksplorasi peta tematik</p>
              <h2>Periksa poligon, layer fasilitas, dan jangkauan layanan.</h2>
              <p>
                Pilih kelurahan langsung di atas peta, ganti peta dasar ke citra
                satelit atau mode ekstrusi 3D, nyalakan radius layanan Puskesmas
                dan Rumah Sakit, lalu bandingkan dua kelurahan berdampingan.
              </p>
              <ul>
                <li>
                  <Icon name="check" />
                  Choropleth 5 kelas untuk indeks utama dan 6 dimensi
                </li>
                <li>
                  <Icon name="check" />
                  Mode peta 2D (Terang, Satelit, OSM, Topografi) dan Prisma 3D
                </li>
                <li>
                  <Icon name="check" />
                  Layer jangkauan layanan faskes (RS 5 km, Puskesmas 2 km,
                  Klinik 1 km)
                </li>
              </ul>
              <div className="featured-actions">
                <Link className="button button-cream" href="/peta">
                  Buka peta lengkap <Icon name="arrow" />
                </Link>
                <Link className="featured-ghost-link" href="/perbandingan">
                  Bandingkan 2 kelurahan <Icon name="compare" size={16} />
                </Link>
              </div>
            </div>
          </section>

          <section className="ranking-preview reveal-on-scroll">
            <div>
              <p className="eyebrow">Peringkat tertinggi</p>
              <h2>Empat kelurahan teratas di Kota Bogor.</h2>
              <p>
                Urutan dihitung dari rata-rata enam dimensi pada seluruh 68
                kelurahan. Klik salah satu baris untuk membuka rincian indikator
                mentahnya.
              </p>
              <Link className="text-arrow" href="/peringkat">
                Lihat seluruh 68 kelurahan <Icon name="arrow" />
              </Link>
            </div>
            <div className="ranking-stack">
              {ranking.slice(0, 4).map((r) => (
                <Link
                  href={`/wilayah/${toSlug(r.name)}`}
                  key={r.name}
                  className="ranking-row-card"
                >
                  <span className="ranking-rank-num">
                    #{String(r.rank).padStart(2, "0")}
                  </span>
                  <div>
                    <b>{r.name}</b>
                    <small>
                      {r.district} · <em>{r.className}</em>
                    </small>
                    <i className="ranking-inline-bar">
                      <u style={{ width: `${Math.max(r.score * 100, 15)}%` }} />
                    </i>
                  </div>
                  <strong>{fmt(r.score)}</strong>
                  <Icon name="chevron" />
                </Link>
              ))}
            </div>
          </section>

          <InteractiveDistrictRibbon districts={districts} />

          <section className="assistant-banner reveal-on-scroll">
            <div>
              <p className="eyebrow">Pencarian berbasis pertanyaan</p>
              <h2>Cari jawaban cepat dari data 68 kelurahan.</h2>
              <p>
                Tanyakan peringkat kelurahan, area di luar radius Puskesmas,
                atau perbandingan dua wilayah. Jawaban dihitung langsung dari
                atribut geodatabase Kota Bogor.
              </p>
              <Link className="button button-cream" href="/asisten">
                Buka halaman Tanya Bogor <Icon name="arrow" />
              </Link>
            </div>
            <div className="chat-preview">
              <div className="chat-user">
                Kelurahan mana yang menempati peringkat #1 dan bagaimana cakupan
                faskesnya?
              </div>
              <div className="chat-bot">
                <span aria-hidden="true">
                  <Icon name="map" size={16} />
                </span>
                <p>
                  <b>{topKel.kelurahan}</b> ({topKel.kecamatan}) menempati
                  peringkat <b>#{topKel.peringkat}</b> dengan indeks{" "}
                  <b>{fmt(topKel.skor_livable)}</b>. Cakupan layanan faskes
                  mencapai <b>{fmt(topKel.cakupan_faskes_pct, 1)}%</b> dengan
                  jarak jaringan jalan ke RS terdekat{" "}
                  <b>{Math.round(topKel.jarak_rs_m).toLocaleString("id-ID")} m</b>.
                  <small>
                    Data: Geodatabase Ruang Bogor · 68 Kelurahan (kode{" "}
                    {topKel.kode})
                  </small>
                </p>
              </div>
              <div className="chat-suggestions">
                <Link
                  href={`/asisten?q=${encodeURIComponent(
                    "Bandingkan Pabaton dengan Bantarjati"
                  )}`}
                >
                  Bandingkan Pabaton &amp; Bantarjati
                </Link>
                <Link
                  href={`/asisten?q=${encodeURIComponent(
                    "Di mana blank spot Puskesmas?"
                  )}`}
                >
                  Di mana blank spot Puskesmas?
                </Link>
                <Link
                  href={`/asisten?q=${encodeURIComponent(
                    "Kelurahan mana yang skor lingkungan tertinggi?"
                  )}`}
                >
                  Skor lingkungan tertinggi
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
