"use client";

import { useState } from "react";
import { BogorMap } from "../components/map-visual";
import { Icon, PageIntro, PageShell } from "../components/ui";
import { dimensions, ranking } from "../data";

export default function SensitivityPage() {
  const defaultWeights=[17,17,17,17,16,16];
  const [weights,setWeights]=useState(defaultWeights);
  const change=(i:number,v:number)=>setWeights(weights.map((w,x)=>x===i?v:w));
  const total=weights.reduce((a,b)=>a+b,0);
  return <PageShell className="standard-page"><PageIntro eyebrow="Analisis sensitivitas" title="Uji prioritas Anda." description="Ubah bobot enam dimensi untuk melihat bagaimana prioritas berbeda dapat memengaruhi peringkat wilayah." action={<button className="quiet-button" onClick={()=>setWeights(defaultWeights)}>Atur ulang bobot</button>}/>
    <div className="sensitivity-note"><Icon name="info"/><p><b>Ini adalah simulasi, bukan indeks resmi.</b> Indeks utama memakai bobot setara sesuai jurnal rujukan. Hasil simulasi tidak disimpan.</p></div>
    <section className="sensitivity-grid"><article className="weight-panel"><header><div><h2>Bobot dimensi</h2><p>Total bobot harus mendekati 100%</p></div><strong className={total===102?"valid":""}>{total}%</strong></header>{dimensions.map((d,i)=><label className="weight-row" key={d.name}><span><i style={{background:d.color}}/>{d.name}</span><div><input type="range" min="0" max="40" value={weights[i]} onChange={e=>change(i,Number(e.target.value))}/><output>{weights[i]}%</output></div></label>)}<button className="button full"><Icon name="sliders"/>Terapkan simulasi</button></article>
      <article className="simulation-map"><header><div><p className="eyebrow">Hasil simulasi</p><h2>Peta indeks baru</h2></div><span><i/>Bobot kustom</span></header><BogorMap compact/><div className="simulation-callout"><span>Perubahan terbesar</span><b>Pasir Mulya naik 7 posisi</b><small>Didorong bobot lingkungan yang lebih tinggi</small></div></article></section>
    <section className="simulation-ranking"><header><div><p className="eyebrow">Dampak pada peringkat</p><h2>Lima wilayah teratas.</h2></div><div><span>Indeks resmi</span><span>Simulasi Anda</span></div></header>{ranking.slice(0,5).map((r,i)=><div key={r.name}><b>#{i+1}</b><strong>{r.name}<small>{r.district}</small></strong><span>{r.score.toFixed(2).replace(".",",")}</span><i>{i===0?"→":i%2?"↑ "+i:"↓ "+i}</i><span>{(r.score+(i%2?.03:-.01)).toFixed(2).replace(".",",")}</span></div>)}</section>
  </PageShell>;
}
