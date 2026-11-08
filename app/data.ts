export const districts = [
  { name: "Bogor Tengah", score: 0.78, villages: 11, population: "104.853" },
  { name: "Bogor Utara", score: 0.73, villages: 8, population: "199.842" },
  { name: "Bogor Timur", score: 0.71, villages: 6, population: "111.291" },
  { name: "Bogor Selatan", score: 0.65, villages: 16, population: "210.210" },
  { name: "Tanah Sareal", score: 0.69, villages: 11, population: "242.842" },
  { name: "Bogor Barat", score: 0.62, villages: 16, population: "245.980" },
];

export const ranking = [
  { rank: 1, name: "Bantarjati", district: "Bogor Utara", score: 0.86, className: "Sangat layak huni", trend: "+2" },
  { rank: 2, name: "Babakan", district: "Bogor Tengah", score: 0.83, className: "Sangat layak huni", trend: "−1" },
  { rank: 3, name: "Paledang", district: "Bogor Tengah", score: 0.81, className: "Sangat layak huni", trend: "+1" },
  { rank: 4, name: "Baranangsiang", district: "Bogor Timur", score: 0.78, className: "Layak huni", trend: "−1" },
  { rank: 5, name: "Kedungbadak", district: "Tanah Sareal", score: 0.76, className: "Layak huni", trend: "+3" },
  { rank: 6, name: "Tegallega", district: "Bogor Tengah", score: 0.74, className: "Layak huni", trend: "0" },
  { rank: 7, name: "Katulampa", district: "Bogor Timur", score: 0.72, className: "Layak huni", trend: "+1" },
  { rank: 8, name: "Cibogor", district: "Bogor Tengah", score: 0.71, className: "Layak huni", trend: "−2" },
];

export const dimensions = [
  { name: "Kesehatan", value: 0.88, note: "1,2 km ke RS terdekat", color: "#0e5b53" },
  { name: "Pendidikan", value: 0.76, note: "8,4% lahan pendidikan", color: "#3f806f" },
  { name: "Sosial kependudukan", value: 0.67, note: "9.840 jiwa/km²", color: "#6d9b78" },
  { name: "Lingkungan", value: 0.82, note: "26,8% tutupan vegetasi", color: "#8fad68" },
  { name: "Transportasi", value: 0.79, note: "12,1% kepadatan jalan", color: "#c9895b" },
  { name: "Ekonomi", value: 0.73, note: "Indeks kesejahteraan 0,71", color: "#d8a85f" },
];

export const indicators = [
  ["Cakupan puskesmas", "91,4%", "Dinkes / OSM", "2026"],
  ["Jarak ke rumah sakit", "1.204 m", "OSM", "2026"],
  ["Luas lahan pendidikan", "8,4%", "Penggunaan lahan", "2023"],
  ["Kepadatan penduduk", "9.840 jiwa/km²", "BPS Kota Bogor", "2022"],
  ["Tutupan vegetasi", "26,8%", "Penggunaan lahan", "2023"],
  ["Vegetasi per kapita", "18,3 m²/jiwa", "Olahan tim", "2023"],
  ["Kepadatan badan jalan", "12,1%", "BIG", "2021"],
  ["Indeks kesejahteraan", "0,71", "BPS Kota Bogor", "2022"],
  ["Kawasan perdagangan", "6,7%", "Penggunaan lahan", "2023"],
  ["Kesesuaian pola ruang", "84,2%", "RTRW Kota Bogor", "2021"],
];

export const adminRows = ranking.concat([
  { rank: 9, name: "Pasir Mulya", district: "Bogor Barat", score: 0.68, className: "Layak huni", trend: "0" },
  { rank: 10, name: "Mulyaharja", district: "Bogor Selatan", score: 0.64, className: "Layak huni", trend: "+1" },
]);
