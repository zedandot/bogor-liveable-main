"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminHeader, Icon } from "../../components/ui";
import { adminRows } from "../../data";

export default function DataPage(){
  const [query,setQuery]=useState("");
  return <><AdminHeader title="Data indikator." description="Tinjau dan perbarui nilai mentah untuk setiap kelurahan pada periode aktif." action={<Link className="button" href="/admin/periode"><Icon name="plus"/>Tambah periode</Link>}/><div className="data-toolbar"><label><Icon name="search"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari kelurahan..."/></label><select><option>Periode 2026</option><option>Periode 2023</option></select><select><option>Semua kecamatan</option><option>Bogor Utara</option><option>Bogor Tengah</option></select><select><option>Semua indikator</option><option>Kesehatan</option><option>Lingkungan</option></select><button><Icon name="download"/>Ekspor</button></div><div className="admin-data-table"><div className="table-head"><span>Kelurahan</span><span>Kecamatan</span><span>Cakupan puskesmas</span><span>Jarak RS</span><span>Vegetasi</span><span>Status</span><span/></div>{adminRows.filter(r=>r.name.toLowerCase().includes(query.toLowerCase())).map((r,i)=><div className="table-row" key={r.name}><strong>{r.name}</strong><span>{r.district}</span><span>{(70+i*2.4).toFixed(1).replace(".",",")}%</span><span>{(1204+i*181).toLocaleString("id-ID")} m</span><span>{(26.8-i*.7).toFixed(1).replace(".",",")}%</span><span className="complete-status"><i/>{i===8?"Belum lengkap":"Lengkap"}</span><Link href="/admin/data/bantarjati"><Icon name="edit" size={17}/>Edit</Link></div>)}</div><div className="pagination admin-pagination"><span>Menampilkan 1–10 dari 68 kelurahan</span><div><button disabled>←</button><button className="active">1</button><button>2</button><button>3</button><button>…</button><button>7</button><button>→</button></div></div></>;
}
