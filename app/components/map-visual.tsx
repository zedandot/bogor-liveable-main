import { Icon } from "./ui";

const regions = [
  "50,12 76,5 97,21 90,48 64,55 43,37", "97,21 128,10 150,32 139,59 112,65 90,48",
  "150,32 180,20 207,39 195,69 160,76 139,59", "43,37 64,55 60,88 30,98 14,72",
  "64,55 90,48 112,65 105,98 75,108 60,88", "112,65 139,59 160,76 150,106 125,116 105,98",
  "160,76 195,69 218,93 206,123 174,132 150,106", "30,98 60,88 75,108 64,138 34,147 15,123",
  "75,108 105,98 125,116 112,146 80,153 64,138", "125,116 150,106 174,132 156,160 129,166 112,146",
  "34,147 64,138 80,153 70,182 43,194 21,171", "80,153 112,146 129,166 113,194 82,207 70,182",
  "129,166 156,160 177,185 160,210 130,218 113,194", "177,185 203,174 222,200 203,225 174,232 160,210",
];
const colors = ["#8fbf83","#5f9f78","#3f806f","#b8cf8b","#6ca77e","#2e7468","#9fc68a","#d5d99b","#7bb184","#4c8e72","#c4d58f","#89b77f","#5a9b76","#a9c987"];

export function BogorMap({ compact = false, selected = true }: { compact?: boolean; selected?: boolean }) {
  return <div className={`map-canvas ${compact ? "map-compact" : ""}`}>
    <div className="map-paper"/>
    <svg className="bogor-shape" viewBox="0 0 240 245" role="img" aria-label="Ilustrasi peta choropleth Kota Bogor">
      <defs><filter id="shadow"><feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity=".18"/></filter></defs>
      <g filter="url(#shadow)">{regions.map((points, i)=><polygon key={points} points={points} fill={colors[i]} stroke="#f6f5ed" strokeWidth="2.2" className={selected && i === 1 ? "map-selected" : ""}/>)}</g>
      <g className="map-roads"><path d="M24 170Q80 120 205 44"/><path d="M35 55Q105 100 205 205"/><path d="M72 10Q95 85 82 207"/><path d="M150 30Q130 110 174 232"/></g>
      <g className="map-points"><circle cx="116" cy="72" r="3"/><circle cx="157" cy="118" r="3"/><circle cx="72" cy="164" r="3"/><circle cx="185" cy="196" r="3"/><path d="M116 65v14M109 72h14"/><path d="M157 111v14M150 118h14"/></g>
    </svg>
    <div className="map-label label-one">Bogor Utara</div><div className="map-label label-two">Bogor Tengah</div><div className="map-label label-three">Bogor Selatan</div>
    {!compact && <><div className="map-zoom"><button aria-label="Perbesar">+</button><button aria-label="Perkecil">−</button></div><div className="map-attribution">© OpenStreetMap contributors</div></>}
  </div>;
}

export function ScoreLegend() {
  return <div className="legend"><div className="legend-title"><span>Indeks kelayakhunian</span><Icon name="info" size={15}/></div><div className="legend-bar"/><div className="legend-values"><span>0,00</span><span>0,20</span><span>0,40</span><span>0,60</span><span>0,80</span><span>1,00</span></div><div className="legend-note"><i/>Data indeks 2026</div></div>;
}
