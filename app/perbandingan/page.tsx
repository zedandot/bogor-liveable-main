"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Icon, PageIntro, PageShell } from "../components/ui";
import { kelurahanData } from "../data";
import {
  classify,
  dimensionKeys,
  fmt,
  type KelurahanProps,
} from "../lib/livability";

const RAW_METRICS: {
  label: string;
  unit: string;
  lowerGood?: boolean;
  digits: number;
  get: (k: KelurahanProps) => number;
}[] = [
  {
    label: "Cakupan layanan faskes",
    unit: "% permukiman",
    digits: 1,
    get: (k) => k.cakupan_faskes_pct,
  },
  {
    label: "Jarak ke rumah sakit",
    unit: "meter (jalan)",
    lowerGood: true,
    digits: 0,
    get: (k) => k.jarak_rs_m,
  },
  {
    label: "Jarak ke puskesmas",
    unit: "meter (jalan)",
    lowerGood: true,
    digits: 0,
    get: (k) => k.jarak_puskesmas_m,
  },
  {
    label: "Rasio sekolah",
    unit: "per 10.000 jiwa",
    digits: 2,
    get: (k) => k.sekolah_per_10rb,
  },
  {
    label: "Kepadatan penduduk",
    unit: "jiwa/km²",
    lowerGood: true,
    digits: 0,
    get: (k) => k.kepadatan_jiwa_km2,
  },
  {
    label: "Tutupan vegetasi",
    unit: "% wilayah",
    digits: 1,
    get: (k) => k.vegetasi_pct,
  },
  {
    label: "Vegetasi per kapita",
    unit: "m²/jiwa",
    digits: 1,
    get: (k) => k.vegetasi_m2_per_jiwa,
  },
  {
    label: "Kerapatan jalan",
    unit: "km/km²",
    digits: 1,
    get: (k) => k.kerapatan_jalan_km_km2,
  },
  {
    label: "Kawasan perdagangan",
    unit: "% wilayah",
    digits: 1,
    get: (k) => k.perdagangan_pct,
  },
];

function CompareContent() {
  const searchParams = useSearchParams();
  const paramA = searchParams.get("a");
  const paramB = searchParams.get("b");

  const [leftName, setLeftName] = useState(
    kelurahanData[0]?.kelurahan ?? "Pabaton"
  );
  const [rightName, setRightName] = useState(
    kelurahanData[11]?.kelurahan ?? "Bantarjati"
  );

  useEffect(() => {
    if (paramA) {
      const foundA = kelurahanData.find(
        (k) => k.kelurahan.toLowerCase() === paramA.toLowerCase()
      );
      if (foundA) {
        setLeftName(foundA.kelurahan);
        if (!paramB && foundA.kelurahan === rightName) {
          const fallback =
            kelurahanData.find((k) => k.kelurahan !== foundA.kelurahan) ??
            kelurahanData[0];
          setRightName(fallback.kelurahan);
        }
      }
    }
    if (paramB) {
      const foundB = kelurahanData.find(
        (k) => k.kelurahan.toLowerCase() === paramB.toLowerCase()
      );
      if (foundB) setRightName(foundB.kelurahan);
    }
  }, [paramA, paramB]);

  const left = useMemo(
    () =>
      kelurahanData.find((k) => k.kelurahan === leftName) ?? kelurahanData[0],
    [leftName]
  );
  const right = useMemo(
    () =>
      kelurahanData.find((k) => k.kelurahan === rightName) ?? kelurahanData[1],
    [rightName]
  );

  const swap = () => {
    setLeftName(rightName);
    setRightName(leftName);
  };

  const diff = left.skor_livable - right.skor_livable;

  return (
    <>
      <section className="compare-picker">
        <label>
          <span>Wilayah pertama</span>
          <div>
            <Icon name="search" />
            <select
              value={leftName}
              onChange={(e) => setLeftName(e.target.value)}
            >
              {kelurahanData.map((k) => (
                <option key={k.kode} value={k.kelurahan}>
                  #{k.peringkat} {k.kelurahan} ({k.kecamatan})
                </option>
              ))}
            </select>
          </div>
        </label>
        <button type="button" onClick={swap} aria-label="Tukar wilayah">
          <Icon name="compare" />
        </button>
        <label>
          <span>Wilayah kedua</span>
          <div>
            <Icon name="search" />
            <select
              value={rightName}
              onChange={(e) => setRightName(e.target.value)}
            >
              {kelurahanData.map((k) => (
                <option key={k.kode} value={k.kelurahan}>
                  #{k.peringkat} {k.kelurahan} ({k.kecamatan})
                </option>
              ))}
            </select>
          </div>
        </label>
      </section>

      <section className="compare-hero">
        <article>
          <p>{left.kecamatan}</p>
          <h2>{left.kelurahan}</h2>
          <strong>{fmt(left.skor_livable)}</strong>
          <span>{classify(left.skor_livable).label}</span>
          <small>Peringkat #{left.peringkat} dari 68</small>
        </article>
        <div>
          <span>Selisih indeks</span>
          <b>
            {diff >= 0 ? "+" : "−"}
            {fmt(Math.abs(diff))}
          </b>
          <small>
            {Math.abs(diff) < 0.005
              ? "Skor setara"
              : `${diff > 0 ? left.kelurahan : right.kelurahan} lebih unggul`}
          </small>
        </div>
        <article>
          <p>{right.kecamatan}</p>
          <h2>{right.kelurahan}</h2>
          <strong>{fmt(right.skor_livable)}</strong>
          <span>{classify(right.skor_livable).label}</span>
          <small>Peringkat #{right.peringkat} dari 68</small>
        </article>
      </section>

      <section className="compare-dimensions">
        <div className="section-heading">
          <p className="eyebrow">Skor dimensi</p>
          <h2>Kekuatan tiap wilayah.</h2>
        </div>
        {dimensionKeys.map((d) => {
          const lv = left[d.key];
          const rv = right[d.key];
          const winner =
            Math.abs(lv - rv) < 0.005
              ? "Seimbang"
              : lv > rv
              ? `${left.kelurahan} unggul`
              : `${right.kelurahan} unggul`;
          return (
            <div className="versus-row" key={d.key}>
              <div>
                <b>{fmt(lv)}</b>
                <i>
                  <span
                    style={{
                      width: `${Math.max(2, lv * 100)}%`,
                      background: d.color,
                    }}
                  />
                </i>
              </div>
              <strong>
                {d.label}
                <small>{winner}</small>
              </strong>
              <div>
                <i>
                  <span
                    style={{
                      width: `${Math.max(2, rv * 100)}%`,
                      background: "#b86b3d",
                    }}
                  />
                </i>
                <b>{fmt(rv)}</b>
              </div>
            </div>
          );
        })}
      </section>

      <section className="compare-table">
        <header>
          <div>
            <p className="eyebrow">Nilai indikator mentah</p>
            <h2>Perbedaan di balik skor.</h2>
          </div>
        </header>
        {RAW_METRICS.map((m) => {
          const lv = m.get(left);
          const rv = m.get(right);
          const delta = lv - rv;
          return (
            <div key={m.label}>
              <strong>
                {m.label}
                <small>{m.unit}</small>
              </strong>
              <span>{fmt(lv, m.digits)}</span>
              <i className={m.lowerGood ? "lower-good" : ""}>
                {delta >= 0 ? "+" : "−"}
                {fmt(Math.abs(delta), m.digits)}
              </i>
              <span>{fmt(rv, m.digits)}</span>
            </div>
          );
        })}
      </section>
    </>
  );
}

export default function ComparePage() {
  return (
    <PageShell className="standard-page">
      <PageIntro
        eyebrow="Perbandingan wilayah"
        title="Dua kelurahan, dibaca berdampingan."
        description="Bandingkan indeks, enam dimensi, dan indikator mentah dari 68 kelurahan untuk memeriksa keunggulan tiap wilayah."
      />
      <Suspense fallback={<p>Memuat perbandingan wilayah...</p>}>
        <CompareContent />
      </Suspense>
    </PageShell>
  );
}
