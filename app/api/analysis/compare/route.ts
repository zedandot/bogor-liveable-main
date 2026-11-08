import { NextResponse } from "next/server";
import { kelurahanData } from "../../../data";

// WBS 1.4.4 — Endpoint perbandingan head-to-head 2 wilayah (?a=Pabaton&b=Bantarjati).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const aKey = (searchParams.get("a") ?? "Pabaton").toLowerCase();
  const bKey = (searchParams.get("b") ?? "Bantarjati").toLowerCase();

  const a =
    kelurahanData.find(
      (k) => k.kelurahan.toLowerCase() === aKey || k.kode === aKey
    ) ?? kelurahanData[0];
  const b =
    kelurahanData.find(
      (k) => k.kelurahan.toLowerCase() === bKey || k.kode === bKey
    ) ?? kelurahanData[1];

  return NextResponse.json({
    left: a,
    right: b,
    diff: {
      skor_livable: Number((a.skor_livable - b.skor_livable).toFixed(4)),
      skor_kesehatan: Number((a.skor_kesehatan - b.skor_kesehatan).toFixed(4)),
      skor_pendidikan: Number((a.skor_pendidikan - b.skor_pendidikan).toFixed(4)),
      skor_sosial: Number((a.skor_sosial - b.skor_sosial).toFixed(4)),
      skor_ekonomi: Number((a.skor_ekonomi - b.skor_ekonomi).toFixed(4)),
      skor_transportasi: Number((a.skor_transportasi - b.skor_transportasi).toFixed(4)),
      skor_lingkungan: Number((a.skor_lingkungan - b.skor_lingkungan).toFixed(4)),
    },
  });
}

