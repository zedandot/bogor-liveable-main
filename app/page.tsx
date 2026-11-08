import Link from "next/link";
import {
  AnimatedStatStrip,
  HeroInteractivePreview,
  InteractiveDistrictRibbon,
  ScrollRevealEffects,
} from "./components/home-interactive";
import { BogorMap } from "./components/map-visual";
import { Footer, Header, Icon } from "./components/ui";
import { dimensions, districts, ranking } from "./data";
import { toSlug } from "./lib/livability";

const dimensionMeta = [
  {
    desc: "Cakupan buffer faskes primer (Puskesmas 2 km & Klinik 1 km) serta jarak tempuh menuju 23 RS.",
    top: "Gudang & Empang (1,00)",
    stat: "84,9% terlayani primer",
  },
  {
    desc: "Sebaran 556 titik sekolah (SD, SMP, SMA/SMK), rasio per 10.000 penduduk, dan jarak akses.",
    top: "Pabaton (1,00)",
    stat: "556 unit sekolah",
  },
  {
    desc: "Tekanan kepadatan jiwa per km² serta tingkat keamanan lingkungan permukiman.",
    top: "Pakuan (0,94)",
    stat: "68 kelurahan terukur",
  },
  {
    desc: "Proporsi tutupan vegetasi ruang terbuka hijau dan ketersediaan m² RTH per jiwa.",
    top: "Paledang (0,48)",
    stat: "53,9% RTH Kebun Raya",
  },
  {
    desc: "Kerapatan jaringan jalan RBI BIG (km/km²) dan persentase luas badan jalan wilayah.",
    top: "Pabaton (1,00)",
    stat: "33,15 km/km² tertinggi",
  },
  {
    desc: "Aktivitas kawasan perdagangan, jasa, serta keseimbangan tata ruang produktif perkotaan.",
    top: "Kebon Pedes (1,00)",
    stat: "6 koridor niaga",
  },
];

export default function Home() {
  return (
    <>
      <ScrollRevealEffects />
      <div className="landing-wash">
        <Header />
        <main>
          <section className="hero">
            {/* Full-bleed elevated watercolor panorama of Kota Bogor */}
            <div className="hero-city-art" aria-hidden="true">
              <div className="hero-rain-layer" />
            </div>

            <div className="hero-copy">
              <p className="hero-kicker">
                <span />
                Kota hujan, dilihat lebih jernih · Atlas Spasial 2026
              </p>
              <h1>
                Memahami ruang hidup
                <br />
                di <em>Kota Bogor</em> jadi mudah.
              </h1>
              <p>
                Jelajahi indeks kelayakhunian 68 kelurahan dan 6 kecamatan lewat
                analisis geospasial kesehatan, pendidikan, lingkungan,
                transportasi, ekonomi, serta sosial kependudukan.
              </p>
              <div className="hero-actions">
                <Link className="button hero-cta-primary" href="/peta">
                  Jelajahi peta interaktif <Icon name="arrow" />
                </Link>
                <Link className="quiet-button hero-cta-secondary" href="/peringkat">
                  Lihat 68 peringkat wilayah
                </Link>
              </div>
            </div>

            <HeroInteractivePreview />
          </section>

          <AnimatedStatStrip />
        </main>
      </div>

      <main className="home-content">
        <section className="story-section reveal-on-scroll">
          <div className="section-heading">
            <p className="eyebrow">Membaca kota</p>
            <h2>
              Satu peta, enam cara
              <br />
              memahami kehidupan.
            </h2>
          </div>
          <p className="section-lead">
            Kelayakhunian bukan sekadar angka tunggal. Sistem merangkai 10
            indikator spasial dan atribut menjadi enam dimensi utama agar
            kesenjangan dan keunggulan tiap kelurahan terbaca utuh.
          </p>
          <div className="dimension-grid">
            {dimensions.map((d, i) => (
              <article
                key={d.name}
                className="dimension-card reveal-on-scroll"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span className="dimension-number">0{i + 1}</span>
                <div className="dimension-card-top">
                  <div
                    className="dimension-icon"
                    style={{ background: d.color }}
                  >
                    <Icon
                      name={
                        ["plus", "chart", "rank", "rain", "map", "sliders"][i]
                      }
                    />
                  </div>
                  <span className="dimension-avg-pill">
                    Rata-rata kota <b>{d.value.toFixed(2).replace(".", ",")}</b>
                  </span>
                </div>
                <h3>{d.name}</h3>
                <p>{dimensionMeta[i]?.desc}</p>
                <div className="dimension-meter">
                  <i
                    style={{
                      width: `${Math.max(d.value * 100, 12)}%`,
                      background: d.color,
                    }}
                  />
                </div>
                <div className="dimension-card-foot">
                  <small>Unggulan: {dimensionMeta[i]?.top}</small>
                  <span>{dimensionMeta[i]?.stat}</span>
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
            <p className="eyebrow">Spatial Decision Support System</p>
            <h2>
              Dari gambaran kota
              <br />
              hingga cerita kelurahan.
            </h2>
            <p>
              Pilih kelurahan langsung di peta, beralih ke citra satelit atau
              ekstrusi 3D, nyalakan radius layanan Puskesmas &amp; Rumah Sakit,
              lalu bandingkan dua wilayah secara berdampingan.
            </p>
            <ul>
              <li>
                <Icon name="check" />
                Choropleth 5 kelas untuk indeks utama &amp; 6 dimensi
              </li>
              <li>
                <Icon name="check" />
                Mode peta 2D (Terang, Satelit, OSM, Topografi) &amp; Prisma 3D
              </li>
              <li>
                <Icon name="check" />
                Analisis buffer faskes (RS 5 km, Puskesmas 2 km, Klinik 1 km)
              </li>
            </ul>
            <div className="featured-actions">
              <Link className="button button-cream" href="/peta">
                Buka peta interaktif <Icon name="arrow" />
              </Link>
              <Link className="featured-ghost-link" href="/perbandingan">
                Bandingkan 2 kelurahan <Icon name="compare" size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="ranking-preview reveal-on-scroll">
          <div>
            <p className="eyebrow">Potret wilayah · Data 2026</p>
            <h2>
              Kelurahan teratas
              <br />
              di Kota Bogor.
            </h2>
            <p>
              Peringkat dihitung dari komposit enam dimensi pada seluruh 68
              kelurahan Kota Bogor berdasarkan pemrosesan geospasial QGIS.
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
                <strong>{r.score.toFixed(2).replace(".", ",")}</strong>
                <Icon name="chevron" />
              </Link>
            ))}
          </div>
        </section>

        <InteractiveDistrictRibbon districts={districts} />

        <section className="assistant-banner reveal-on-scroll">
          <div>
            <span className="assistant-orb">
              <Icon name="bot" size={30} />
            </span>
            <p className="eyebrow">Tanya Bogor · Asisten Spasial</p>
            <h2>
              Ada yang ingin
              <br />
              Anda tanyakan?
            </h2>
            <p>
              Tanyakan peringkat kelurahan, area blank spot faskes, atau
              perbandingan antarwilayah. Jawaban dihitung langsung dari basis
              data 68 kelurahan Kota Bogor.
            </p>
            <Link className="button button-cream" href="/asisten">
              Mulai bertanya <Icon name="arrow" />
            </Link>
          </div>
          <div className="chat-preview">
            <div className="chat-user">
              Kelurahan mana yang memiliki skor tertinggi dan bagaimana cakupan
              faskesnya?
            </div>
            <div className="chat-bot">
              <span>
                <Icon name="bot" size={16} />
              </span>
              <p>
                <b>Pabaton</b> (Bogor Tengah) menempati peringkat <b>#1</b>{" "}
                dengan indeks <b>1,00</b> (Sangat Layak Huni). Cakupan layanan
                Puskesmas &amp; RS mencapai <b>100%</b> dengan jarak ke RS
                terdekat <b>536 m</b>.
                <small>
                  Sumber: Geodatabase Bogor Livable City · 68 Kelurahan (2026)
                </small>
              </p>
            </div>
            <div className="chat-suggestions">
              <Link href="/asisten">Bandingkan Pabaton &amp; Bantarjati</Link>
              <Link href="/asisten">Dimana blank spot Puskesmas?</Link>
              <Link href="/asisten">Skor lingkungan tertinggi</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
