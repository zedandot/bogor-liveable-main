import { NextResponse } from "next/server";
import { districts, kelurahanData } from "../../../data";

// WBS 1.4.4 — Endpoint ranking wilayah (Top 5 tertinggi & Top 5 prioritas).
export async function GET() {
  const top5 = kelurahanData.slice(0, 5);
  const priority5 = [...kelurahanData].slice(-5).reverse();

  return NextResponse.json({
    total_kelurahan: kelurahanData.length,
    top5,
    priority5,
    districts,
    ranking: kelurahanData,
  });
}

