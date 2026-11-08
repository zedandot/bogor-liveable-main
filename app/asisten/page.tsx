"use client";

import { FormEvent, useState } from "react";
import { Header, Icon } from "../components/ui";
import { districts } from "../data";
import { kelurahanData } from "../kelurahan-data";
import { scoreToClass } from "../lib/livability";

type Message = { role: "user" | "bot"; text: string };

const examples = [
  "Kelurahan mana yang peringkat #1 dan apa keunggulannya?",
  "Kelurahan mana yang paling jauh dari Puskesmas (blank spot)?",
  "Bandingkan Pabaton dengan Bantarjati.",
  "Kelurahan mana yang ruang terbuka hijaunya (lingkungan) tertinggi?",
];

function generateAnswer(query: string): string {
  const q = query.toLowerCase();

  // Check if user mentions 2 kelurahan to compare
  const matchedKel = kelurahanData.filter((k) =>
    q.includes(k.kelurahan.toLowerCase())
  );

  if (matchedKel.length >= 2) {
    const [a, b] = matchedKel;
    const diff = Math.abs(a.skor_livable - b.skor_livable)
      .toFixed(2)
      .replace(".", ",");
    const winner = a.skor_livable >= b.skor_livable ? a : b;
    return `Perbandingan ${a.kelurahan} (${a.kecamatan}, Peringkat #${a.peringkat}, skor ${a.skor_livable
      .toFixed(2)
      .replace(".", ",")}) vs ${b.kelurahan} (${b.kecamatan}, Peringkat #${b.peringkat}, skor ${b.skor_livable
      .toFixed(2)
      .replace(".", ",")}): ${winner.kelurahan} unggul selisih ${diff} poin. Pada dimensi Kesehatan, ${
      a.kelurahan
    } mencatat ${a.skor_kesehatan.toFixed(2).replace(".", ",")} sedangkan ${
      b.kelurahan
    } ${b.skor_kesehatan.toFixed(2).replace(".", ",")}. Pada Lingkungan (RTH), ${
      a.kelurahan
    } memiliki tutupan vegetasi ${a.vegetasi_pct.toFixed(1).replace(".", ",")}% dibanding ${
      b.kelurahan
    } ${b.vegetasi_pct.toFixed(1).replace(".", ",")}%.`;
  }

  if (matchedKel.length === 1) {
    const k = matchedKel[0];
    return `Kelurahan ${k.kelurahan} (Kecamatan ${k.kecamatan}) berada di peringkat #${
      k.peringkat
    } dari 68 kelurahan dengan Indeks Kelayakhunian ${k.skor_livable
      .toFixed(2)
      .replace(".", ",")} (${scoreToClass(
      k.skor_livable
    )}). Rincian 6 dimensi: Kesehatan ${k.skor_kesehatan
      .toFixed(2)
      .replace(".", ",")}, Pendidikan ${k.skor_pendidikan
      .toFixed(2)
      .replace(".", ",")}, Sosial ${k.skor_sosial
      .toFixed(2)
      .replace(".", ",")}, Transportasi ${k.skor_transportasi
      .toFixed(2)
      .replace(".", ",")}, Ekonomi ${k.skor_ekonomi
      .toFixed(2)
      .replace(".", ",")}, dan Lingkungan ${k.skor_lingkungan
      .toFixed(2)
      .replace(".", ",")} (vegetasi ${k.vegetasi_pct.toFixed(1).replace(".", ",")}%). Jarak ke RS terdekat ${
      k.jarak_rs_m
    } m dan Puskesmas ${k.jarak_puskesmas_m} m.`;
  }

  if (q.includes("jauh") || q.includes("blank") || q.includes("puskesmas") || q.includes("rumah sakit") || q.includes("faskes")) {
    const farthestPkm = [...kelurahanData].sort(
      (a, b) => b.jarak_puskesmas_m - a.jarak_puskesmas_m
    )[0];
    const farthestRs = [...kelurahanData].sort(
      (a, b) => b.jarak_rs_m - a.jarak_rs_m
    )[0];
    return `Berdasarkan analisis buffer WBS 1.3.2, 84,9% luas Kota Bogor terjangkau layanan faskes primer (Puskesmas 2 km / Klinik 1 km), menyisakan 15,1% (16,86 km²) area blank spot di pinggiran kota. Kelurahan dengan jarak terjauh ke Puskesmas adalah ${
      farthestPkm.kelurahan
    } (${farthestPkm.kecamatan}) sejauh ${(farthestPkm.jarak_puskesmas_m / 1000)
      .toFixed(2)
      .replace(".", ",")} km, sedangkan jarak terjauh ke Rumah Sakit tercatat di ${
      farthestRs.kelurahan
    } (${(farthestRs.jarak_rs_m / 1000).toFixed(2).replace(".", ",")} km).`;
  }

  if (q.includes("lingkungan") || q.includes("hijau") || q.includes("rth") || q.includes("vegetasi")) {
    const topEnv = [...kelurahanData].sort(
      (a, b) => b.skor_lingkungan - a.skor_lingkungan
    );
    return `Dimensi Lingkungan (tutupan vegetasi & RTH per jiwa) tertinggi diraih oleh ${
      topEnv[0].kelurahan
    } (${topEnv[0].kecamatan}) dengan skor ${topEnv[0].skor_lingkungan
      .toFixed(2)
      .replace(".", ",")} dan tutupan vegetasi ${topEnv[0].vegetasi_pct
      .toFixed(1)
      .replace(".", ",")}% (${topEnv[0].vegetasi_m2_per_jiwa
      .toFixed(1)
      .replace(".", ",")} m²/jiwa), diikuti oleh ${topEnv[1].kelurahan} (${topEnv[1].vegetasi_pct
      .toFixed(1)
      .replace(".", ",")}%) dan ${topEnv[2].kelurahan} (${topEnv[2].vegetasi_pct
      .toFixed(1)
      .replace(".", ",")}%).`;
  }

  if (q.includes("kecamatan")) {
    const topKec = districts[0];
    const lowKec = districts[districts.length - 1];
    return `Dari 6 kecamatan di Kota Bogor, ${topKec.name} menempati urutan tertinggi dengan skor rata-rata ${topKec.score
      .toFixed(2)
      .replace(".", ",")} (${topKec.villages} kelurahan, ${topKec.population} penduduk). Sementara itu, ${
      lowKec.name
    } memiliki rata-rata ${lowKec.score
      .toFixed(2)
      .replace(".", ",")} (${lowKec.villages} kelurahan) dan menjadi prioritas pemerataan infrastruktur.`;
  }

  const top1 = kelurahanData[0];
  const top2 = kelurahanData[1];
  const top3 = kelurahanData[2];
  return `Berdasarkan Geodatabase Bogor Livable City (68 kelurahan), peringkat #1 adalah ${
    top1.kelurahan
  } (${top1.kecamatan}) dengan skor ${top1.skor_livable
    .toFixed(2)
    .replace(".", ",")} (Pendidikan 1,00; Transportasi 1,00; Kesehatan 0,92), disusul #2 ${
    top2.kelurahan
  } (${top2.skor_livable.toFixed(2).replace(".", ",")}) dan #3 ${
    top3.kelurahan
  } (${top3.skor_livable
    .toFixed(2)
    .replace(".", ",")}). Anda dapat menyebutkan nama kelurahan mana pun di Kota Bogor untuk melihat rincian indikatornya.`;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const ask = (text: string) => {
    if (!text.trim()) return;
    const reply = generateAnswer(text);
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "bot", text: reply },
    ]);
    setInput("");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <div className="assistant-page">
      <Header />
      <main>
        <aside className="assistant-aside">
          <div>
            <span className="assistant-orb">
              <Icon name="bot" size={28} />
            </span>
            <p className="eyebrow">Asisten Spasial SDSS</p>
            <h1>Tanya Bogor</h1>
            <p>
              Temukan jawaban instan dari basis data geospasial 68 kelurahan dan
              6 kecamatan Kota Bogor.
            </p>
          </div>
          <div className="assistant-scope">
            <b>Cakupan analisis langsung</b>
            <span>
              <Icon name="check" />
              Profil &amp; skor 68 kelurahan
            </span>
            <span>
              <Icon name="check" />
              Komparasi langsung 2 kelurahan
            </span>
            <span>
              <Icon name="check" />
              Blank spot &amp; jarak faskes
            </span>
            <span>
              <Icon name="check" />
              Agregasi 6 kecamatan
            </span>
          </div>
          <small>
            <Icon name="info" size={15} />
            Menjawab langsung dari atribut `kelurahan.geojson` &amp; analisis
            buffer QGIS.
          </small>
        </aside>

        <section className="chat-stage">
          {messages.length === 0 ? (
            <div className="chat-empty">
              <div className="rain-rings">
                <i />
                <i />
                <i />
                <Icon name="rain" size={34} />
              </div>
              <h2>Apa yang ingin Anda selidiki?</h2>
              <p>
                Ketik nama kelurahan (misal: <b>Pabaton</b>, <b>Bantarjati</b>,{" "}
                <b>Pasir Kuda</b>, <b>Balumbang Jaya</b>) atau pilih pertanyaan
                di bawah.
              </p>
              <div className="prompt-examples">
                {examples.map((x) => (
                  <button key={x} onClick={() => ask(x)}>
                    {x}
                    <Icon name="arrow" size={15} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="message-list">
              <div className="chat-date">Sesi Analisis Spasial · Data 2026</div>
              {messages.map((m, i) => (
                <div className={"message " + m.role} key={i}>
                  {m.role === "bot" && (
                    <span>
                      <Icon name="bot" size={16} />
                    </span>
                  )}
                  <div>
                    {m.text}
                    {m.role === "bot" && (
                      <small>
                        Sumber: Geodatabase Bogor Livable City · 68 Kelurahan
                        (WGS 84)
                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form className="chat-input" onSubmit={submit}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Sebutkan nama kelurahan atau bandingkan 2 wilayah..."
              aria-label="Pertanyaan"
            />
            <button aria-label="Kirim pertanyaan">
              <Icon name="arrow" />
            </button>
            <small>
              Tekan Enter untuk mengirim · Terhubung ke 68 kelurahan Kota Bogor.
            </small>
          </form>
        </section>
      </main>
    </div>
  );
}
