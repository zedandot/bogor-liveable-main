"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    map: <><path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3Z"/><path d="M8 3v15M16 6v15"/></>,
    chart: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2"/></>,
    rank: <><path d="M8 21V11h8v10M12 11V3M9 6l3-3 3 3M3 21h18"/></>,
    compare: <><path d="M7 4 3 8l4 4M3 8h11M17 20l4-4-4-4M21 16H10"/></>,
    sliders: <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/></>,
    bot: <><rect x="4" y="7" width="16" height="13" rx="4"/><path d="M9 12h.01M15 12h.01M9 16h6M12 7V3M9 3h6"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    layers: <><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    edit: <><path d="m4 20 4.5-1 10-10-3.5-3.5-10 10L4 20Z"/><path d="m13.5 7 3.5 3.5"/></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3M21 3v18h-7"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    chevron: <><path d="m9 18 6-6-6-6"/></>,
    check: <><path d="m5 12 4 4L19 6"/></>,
    rain: <><path d="M7 17a4 4 0 1 1 1-7.9A6 6 0 0 1 19 12a3 3 0 0 1-1 5H7Z"/><path d="m8 20-1 2M13 20l-1 2M18 20l-1 2"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name] ?? paths.info}</svg>;
}

export function Logo({ light = false }: { light?: boolean }) {
  return <Link href="/" className={`logo ${light ? "logo-light" : ""}`} aria-label="Ruang Bogor — beranda"><span className="logo-mark"><i/><i/><i/></span><span>ruang<b>bogor</b></span></Link>;
}

const nav = [
  ["/peta", "Peta", "map"], ["/dashboard", "Statistik", "chart"],
  ["/peringkat", "Peringkat", "rank"], ["/perbandingan", "Bandingkan", "compare"],
  ["/sensitivitas", "Simulasi", "sliders"], ["/asisten", "Tanya Bogor", "bot"],
];

export function Header() {
  const pathname = usePathname();
  return <header className="site-header"><div className="header-inner"><Logo/><nav className="main-nav" aria-label="Navigasi utama">{nav.map(([href, label]) => <Link key={href} className={pathname.startsWith(href) ? "active" : ""} href={href}>{label}</Link>)}</nav><div className="header-actions"><Link className="text-link" href="/metodologi">Metodologi</Link><Link className="button button-small" href="/peta">Jelajahi peta <Icon name="arrow" size={15}/></Link></div></div></header>;
}

export function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <><Header/><main className={`page-shell ${className}`}>{children}</main><Footer/></>;
}

export function Footer() {
  return <footer className="footer"><div><Logo light/><p>WebGIS untuk memahami kelayakhunian<br/>68 kelurahan di Kota Bogor.</p></div><div><span>Jelajahi</span><Link href="/peta">Peta kelayakhunian</Link><Link href="/peringkat">Peringkat wilayah</Link><Link href="/perbandingan">Bandingkan wilayah</Link></div><div><span>Tentang data</span><Link href="/metodologi">Metodologi</Link><Link href="/metodologi#sumber">Sumber data</Link><Link href="/admin/login">Masuk admin</Link></div><div className="footer-note"><Icon name="rain"/><p>Data statis untuk prototipe UI<br/>Terakhir diperbarui 25 Oktober 2026</p></div></footer>;
}

export function PageIntro({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-intro"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

const adminNav = [["/admin","Ringkasan","chart"],["/admin/data","Data indikator","map"],["/admin/periode","Tambah periode","plus"],["/admin/riwayat","Riwayat perubahan","history"]];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return <div className="admin-shell"><aside className="admin-sidebar"><Logo light/><div className="admin-profile"><span>AR</span><div><b>Admin Ruang Bogor</b><small>Pengelola data</small></div></div><nav>{adminNav.map(([href,label,icon])=><Link key={href} href={href} className={pathname === href || (href !== "/admin" && pathname.startsWith(href)) ? "active" : ""}><Icon name={icon}/>{label}</Link>)}</nav><div className="admin-sidebar-bottom"><Link href="/peta"><Icon name="map"/>Lihat situs publik</Link><Link href="/admin/login"><Icon name="logout"/>Keluar</Link></div></aside><main className="admin-main">{children}</main></div>;
}

export function AdminHeader({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <header className="admin-header"><div><p className="eyebrow">Dashboard admin</p><h1>{title}</h1><p>{description}</p></div>{action}</header>;
}
