"use client";

import { useState } from "react";
import { Icon, PageIntro, PageShell } from "../components/ui";
import { dimensions } from "../data";

export default function ComparePage() {
  const [left,setLeft] = useState("Bantarjati");
  const [right,setRight] = useState("Pasir Mulya");
  const swap=()=>{const previous=left;setLeft(right);setRight(previous)};
  return <PageShell className="standard-page"><PageIntro eyebrow="Perbandingan wilayah" title="Dua wilayah, dibaca berdampingan." description="Bandingkan indeks, dimensi, dan indikator mentah untuk memahami kekuatan tiap kelurahan."/>
    <section className="compare-picker"><label><span>Wilayah pertama</span><div><Icon name="search"/><select value={left} onChange={e=>setLeft(e.target.value)}><option>Bantarjati</option><option>Pasir Mulya</option><option>Babakan</option></select></div></label><button onClick={swap} aria-label="Tukar wilayah"><Icon name="compare"/></button><label><span>Wilayah kedua</span><div><Icon name="search"/><select value={right} onChange={e=>setRight(e.target.value)}><option>Pasir Mulya</option><option>Bantarjati</option><option>Babakan</option></select></div></label></section>
    <section className="compare-hero"><article><p>Bogor Utara</p><h2>{left}</h2><strong>0,86</strong><span>Sangat layak huni</span><small>Peringkat #1</small></article><div><span>Selisih indeks</span><b>+0,18</b><small>{left} lebih tinggi</small></div><article><p>Bogor Barat</p><h2>{right}</h2><strong>0,68</strong><span>Layak huni</span><small>Peringkat #9</small></article></section>
    <section className="compare-dimensions"><div className="section-heading"><p className="eyebrow">Skor dimensi</p><h2>Kekuatan tiap wilayah.</h2></div>{dimensions.map((d,i)=><div className="versus-row" key={d.name}><div><b>{String(d.value).replace(".",",")}</b><i><span style={{width:(d.value*100)+"%",background:d.color}}/></i></div><strong>{d.name}<small>{i%2===0?left+" unggul":right+" unggul tipis"}</small></strong><div><i><span style={{width:((d.value-(i%2===0?.14:-.02))*100)+"%",background:"#c9895b"}}/></i><b>{String((d.value-(i%2===0?.14:-.02)).toFixed(2)).replace(".",",")}</b></div></div>)}</section>
    <section className="compare-table"><header><div><p className="eyebrow">Nilai indikator</p><h2>Perbedaan di balik skor.</h2></div><button className="quiet-button"><Icon name="download"/>Unduh perbandingan</button></header>{["Cakupan puskesmas","Jarak ke rumah sakit","Lahan pendidikan","Kepadatan penduduk","Tutupan vegetasi","Vegetasi per kapita"].map((x,i)=><div key={x}><strong>{x}<small>{["% permukiman","meter","% wilayah","jiwa/km²","% wilayah","m²/jiwa"][i]}</small></strong><span>{["91,4","1.204","8,4","9.840","26,8","18,3"][i]}</span><i className={i===1||i===3?"lower-good":""}>{i===1||i===3?"−":"+"}{["20,6","2.910","2,3","3.110","8,7","7,4"][i]}</i><span>{["70,8","4.114","6,1","12.950","18,1","10,9"][i]}</span></div>)}</section>
  </PageShell>;
}
