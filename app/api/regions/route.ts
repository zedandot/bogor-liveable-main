import { NextResponse } from "next/server";
import { kelurahanData } from "../../data";
import { classify } from "../../lib/livability";

// WBS 1.4.2 — Endpoint REST API query wilayah & filter kecamatan/kelurahan/kelas.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kecamatan = searchParams.get("kecamatan");
  const kelas = searchParams.get("kelas");
  const q = searchParams.get("q")?.toLowerCase();

  const data = kelurahanData.filter((k) => {
    if (kecamatan && k.kecamatan.toLowerCase() !== kecamatan.toLowerCase()) return false;
    if (kelas && classify(k.skor_livable).label.toLowerCase() !== kelas.toLowerCase()) return false;
    if (q && !k.kelurahan.toLowerCase().includes(q) && !k.kecamatan.toLowerCase().includes(q)) return false;
    return true;
  });

  return NextResponse.json({ count: data.length, data });
}

