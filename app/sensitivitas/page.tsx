"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BogorMap } from "../components/map-visual";
import { Icon, PageIntro, PageShell } from "../components/ui";
import { dimensions } from "../data";
import { kelurahanData } from "../kelurahan-data";
import { scoreToClass, scoreToColor, toSlug } from "../lib/livability";

const presets: { label: string; weights: number[] }[] = [
  { label: "Setara (Resmi)", weights: [17, 17, 17, 17, 16, 16] },
  { label: "Prioritas Kesehatan & RTH", weights: [35, 15, 10, 25, 10, 5] },
  { label: "Keluarga & Pendidikan", weights: [25, 30, 20, 10, 10, 5] },
  { label: "Mobilitas & Ekonomi", weights: [10, 10, 10, 10, 35, 25] },
];

export default function SensitivityPage() {
  const defaultWeights = [17, 17, 17, 17, 16, 16];
  const [weights, setWeights] = useState(defaultWeights);
  const [selectedSlug, setSelectedSlug] = useState("pabaton");

  const change = (i: number, v: number) =>
    setWeights((prev) => prev.map((w, x) => (x === i ? v : w)));

  const total = weights.reduce((a, b) => a + b, 0);

  const simulation = useMemo(() => {
    const denom = total > 0 ? total : 1;
    // Order in dimensions: Kesehatan, Pendidikan, Sosial & Kependudukan, Lingkungan, Transportasi, Ekonomi
    const [wKes, wPend, wSos, wLing, wTrans, wEko] = weights.map(
      (w) => w / denom
    );

    const rawScores = kelurahanData.map((k) => {
      const raw =
        k.skor_kesehatan * wKes +
        k.skor_pendidikan * wPend +
        k.skor_sosial * wSos +
        k.skor_lingkungan * wLing +
        k.skor_transportasi * wTrans +
        k.skor_ekonomi * wEko;
      return { k, raw };
    });

    const minRaw = Math.min(...rawScores.map((r) => r.raw));
    const maxRaw = Math.max(...rawScores.map((r) => r.raw));
    const span = maxRaw - minRaw || 1;

    const ranked = rawScores
      .map(({ k, raw }) => ({
        ...k,
        slug: toSlug(k.kelurahan),
        simScore: Number(((raw - minRaw) / span).toFixed(4)),
      }))
      .sort((a, b) => b.simScore - a.simScore)
      .map((item, idx) => ({
        ...item,
        simRank: idx + 1,
        rankDelta: item.peringkat - (idx + 1),
      }));

    const customScores: Record<string, number> = {};
    for (const r of ranked) {
      customScores[r.slug] = r.simScore;
    }

    const biggestGain = [...ranked].sort(
      (a, b) => b.rankDelta - a.rankDelta
    )[0];

    return { ranked, customScores, biggestGain };
  }, [weights, total]);

  return (
    <PageShell className="standard-page">
      <PageIntro
        eyebrow="Analisis sensitivitas · 68 Kelurahan"
        title="Uji prioritas Anda."
        description="Geser bobot enam dimensi untuk menyimulasikan perubahan peta choropleth dan peringkat 68 kelurahan secara langsung."
        action={
          <button
            className="quiet-button"
            onClick={() => setWeights(defaultWeights)}
          >
            Atur ulang bobot
          </button>
        }
      />

      <div className="sensitivity-note">
        <Icon name="info" />
        <p>
          <b>Simulasi interaktif real-time pada 68 kelurahan.</b> Indeks utama
          menggunakan bobot setara. Pilih preset di bawah atau geser slider
          untuk menguji skenario kebijakan.
        </p>
      </div>

      <div className="preset-bar">
        <span>Skenario cepat:</span>
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            className={
              weights.join(",") === p.weights.join(",") ? "active" : ""
            }
            onClick={() => setWeights(p.weights)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <section className="sensitivity-grid">
        <article className="weight-panel">
          <header>
            <div>
              <h2>Bobot dimensi</h2>
              <p>Proporsi dinormalisasi otomatis terhadap total bobot</p>
            </div>
            <strong className={total === 100 ? "valid" : ""}>{total}%</strong>
          </header>
          {dimensions.map((d, i) => (
            <label className="weight-row" key={d.name}>
              <span>
                <i style={{ background: d.color }} />
                {d.name}
              </span>
              <div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights[i]}
                  onChange={(e) => change(i, Number(e.target.value))}
                />
                <output>{weights[i]}%</output>
              </div>
            </label>
          ))}
          <button
            type="button"
            className="button full"
            onClick={() =>
              setWeights(
                weights.map((w) =>
                  total > 0 ? Math.round((w / total) * 100) : 17
                )
              )
            }
          >
            <Icon name="sliders" />
            Normalisasi ke 100%
          </button>
        </article>

        <article className="simulation-map">
          <header>
            <div>
              <p className="eyebrow">Hasil simulasi spasial</p>
              <h2>Peta indeks baru</h2>
            </div>
            <span>
              <i />
              Live 68 Kelurahan
            </span>
          </header>
          <BogorMap
            compact
            selectedSlug={selectedSlug}
            onSelect={setSelectedSlug}
            customScores={simulation.customScores}
          />
          {simulation.biggestGain && (
            <div className="simulation-callout">
              <span>Lonjakan peringkat terbesar</span>
              <b>
                {simulation.biggestGain.kelurahan}{" "}
                {simulation.biggestGain.rankDelta > 0
                  ? `naik ${simulation.biggestGain.rankDelta} posisi (ke #${simulation.biggestGain.simRank})`
                  : "tetap stabil di puncak"}
              </b>
              <small>
                Kecamatan {simulation.biggestGain.kecamatan} · Skor simulasi{" "}
                {simulation.biggestGain.simScore.toFixed(2).replace(".", ",")}
              </small>
            </div>
          )}
        </article>
      </section>

      <section className="simulation-ranking">
        <header>
          <div>
            <p className="eyebrow">Dampak pada peringkat</p>
            <h2>Sepuluh wilayah teratas hasil simulasi.</h2>
          </div>
          <div>
            <span>Indeks resmi</span>
            <span>Perubahan</span>
            <span>Simulasi Anda</span>
          </div>
        </header>
        {simulation.ranked.slice(0, 10).map((r) => (
          <div
            key={r.kode}
            onClick={() => setSelectedSlug(r.slug)}
            style={{ cursor: "pointer" }}
          >
            <b>#{r.simRank}</b>
            <strong>
              <Link href={`/wilayah/${r.slug}`}>{r.kelurahan}</Link>
              <small>
                {r.kecamatan} · Resmi #{r.peringkat} ({scoreToClass(r.simScore)})
              </small>
            </strong>
            <span>{r.skor_livable.toFixed(2).replace(".", ",")}</span>
            <i
              style={{
                color:
                  r.rankDelta > 0
                    ? "#0e5b53"
                    : r.rankDelta < 0
                    ? "#b85c3c"
                    : "#657a74",
                fontWeight: 700,
              }}
            >
              {r.rankDelta === 0
                ? "→ Tetap"
                : r.rankDelta > 0
                ? `↑ +${r.rankDelta}`
                : `↓ ${r.rankDelta}`}
            </i>
            <span style={{ color: scoreToColor(r.simScore), fontWeight: 700 }}>
              {r.simScore.toFixed(2).replace(".", ",")}
            </span>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
