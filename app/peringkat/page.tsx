"use client";

import { useState } from "react";
import { Icon, PageIntro, PageShell } from "../components/ui";
import { ranking } from "../data";

export default function RankingPage() {
  const [query,setQuery] = useState("");
  const filtered = ranking.filter(r=>r.name.toLowerCase().includes(query.toLowerCase()));
  return <PageShell className="standard-page"><PageIntro eyebrow="Peringkat wilayah" title="Lihat siapa unggul, pahami alasannya." description="Urutan 68 kelurahan berdasarkan indeks kelayakhunian. Gunakan filter untuk menemukan wilayah yang ingin Anda kaji." action={<button className="button"><Icon name="download"/>Ekspor data</button>}/>
    <section className="ranking-summary"><article><span>Skor tertinggi</span><b>0,86</b><p>Bantarjati · Bogor Utara</p></article><article><span>Median kota</span><b>0,57</b><p>Cukup layak huni</p></article><article><span>Rentang skor</span><b>0,68</b><p>0,18 hingga 0,86</p></article><div className="class-distribution"><span>Klasifikasi kelurahan</span><div><i style={{width:"15%"}}/><i style={{width:"37%"}}/><i style={{width:"29%"}}/><i style={{width:"13%"}}/><i style={{width:"6%"}}/></div><small>10 sangat layak · 25 layak · 20 cukup · 9 tidak layak · 4 sangat tidak layak</small></div></section>
    <section className="ranking-table-wrap"><div className="table-controls"><label><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari kelurahan..."/></label><select><option>Semua kecamatan</option><option>Bogor Utara</option><option>Bogor Tengah</option></select><select><option>Semua klasifikasi</option><option>Sangat layak huni</option><option>Layak huni</option></select><button className="reset-button">Reset</button></div><div className="ranking-table"><div className="table-head"><span>Peringkat</span><span>Kelurahan</span><span>Kecamatan</span><span>Skor</span><span>Klasifikasi</span><span>Perubahan</span></div>{filtered.map(r=><a href={"/wilayah/"+r.name.toLowerCase()} className="table-row" key={r.name}><span className={r.rank<=3?"medal":""}>#{String(r.rank).padStart(2,"0")}</span><strong>{r.name}</strong><span>{r.district}</span><b>{r.score.toFixed(2).replace(".",",")}</b><span><i className="status-dot"/>{r.className}</span><span className={r.trend.startsWith("+")?"trend-up":r.trend.startsWith("−")?"trend-down":""}>{r.trend}</span></a>)}</div><div className="pagination"><span>Menampilkan 1–8 dari 68 kelurahan</span><div><button disabled>←</button><button className="active">1</button><button>2</button><button>3</button><button>…</button><button>9</button><button>→</button></div></div></section>
  </PageShell>;
}
