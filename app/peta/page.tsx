"use client";

import Link from "next/link";
import { useState } from "react";
import { BogorMap, ScoreLegend } from "../components/map-visual";
import { Header, Icon } from "../components/ui";
import { dimensions } from "../data";

export default function MapPage() {
  const [panel, setPanel] = useState<"layers"|"filters">("layers");
  const [selected, setSelected] = useState(true);
  const [theme, setTheme] = useState("Indeks kelayakhunian");
  return <div className="map-page"><Header/><main className="map-workspace">
    <aside className="map-sidebar"><div className="map-search"><Icon name="search"/><input aria-label="Cari kecamatan atau kelurahan" placeholder="Cari wilayah..."/><kbd>⌘ K</kbd></div><div className="map-tabs"><button className={panel==="layers"?"active":""} onClick={()=>setPanel("layers")}><Icon name="layers"/>Layer</button><button className={panel==="filters"?"active":""} onClick={()=>setPanel("filters")}><Icon name="sliders"/>Filter</button></div>
      {panel === "layers" ? <div className="layer-list"><p className="control-label">Peta tematik</p><label className="select-wrap"><select value={theme} onChange={e=>setTheme(e.target.value)}><option>Indeks kelayakhunian</option>{dimensions.map(d=><option key={d.name}>Dimensi {d.name}</option>)}<option>Kesesuaian pola ruang</option></select></label><p className="control-label">Layer pendukung</p>{[["Fasilitas kesehatan",true],["Jangkauan puskesmas",true],["Jaringan jalan",false],["Pola ruang",false]].map(([name,on])=><label className="toggle-row" key={String(name)}><span><i className={`layer-symbol symbol-${String(name).length%3}`}/>{name}</span><input type="checkbox" defaultChecked={Boolean(on)}/><b/></label>)}<p className="control-label">Peta dasar</p><div className="basemap-grid"><button className="active"><span className="base-light"/>Terang</button><button><span className="base-satellite"/>Satelit</button></div></div> : <div className="filter-panel"><label>Kecamatan<select><option>Semua kecamatan</option><option>Bogor Utara</option><option>Bogor Tengah</option></select></label><label>Kelurahan<select><option>Semua kelurahan</option><option>Bantarjati</option><option>Babakan</option></select></label><label>Klasifikasi<select><option>Semua klasifikasi</option><option>Sangat layak huni</option><option>Layak huni</option></select></label><button className="button full">Terapkan filter</button><button className="reset-button">Reset semua filter</button></div>}
    </aside>
    <section className="interactive-map" onClick={()=>setSelected(!selected)}><BogorMap selected={selected}/><div className="map-topbar"><span><Icon name="map" size={16}/>{theme}</span><button>Kelurahan <span>⌄</span></button></div><ScoreLegend/><div className="map-hint">Klik wilayah untuk melihat detail</div></section>
    {selected && <aside className="place-panel"><button className="panel-close" onClick={()=>setSelected(false)}>×</button><div className="place-cover"><span>Bogor Utara</span><b>#1</b></div><div className="place-content"><p className="eyebrow">Kelurahan terpilih</p><h1>Bantarjati</h1><div className="score-lockup"><strong>0,86</strong><span><b>Sangat layak huni</b><small>Peringkat 1 dari 68 kelurahan</small></span></div><div className="mini-dimensions">{dimensions.map(d=><div key={d.name}><span>{d.name}</span><i><b style={{width:`${d.value*100}%`,background:d.color}}/></i><strong>{String(d.value).replace(".",",")}</strong></div>)}</div><div className="place-facts"><div><span>Populasi</span><b>25.460 jiwa</b></div><div><span>Luas</span><b>1,87 km²</b></div><div><span>Kecamatan</span><b>Bogor Utara</b></div><div><span>Pola ruang sesuai</span><b>84,2%</b></div></div><Link className="button full" href="/wilayah/bantarjati">Lihat detail wilayah <Icon name="arrow"/></Link><button className="compare-add"><Icon name="compare"/>Tambahkan ke perbandingan</button></div></aside>}
  </main></div>;
}
