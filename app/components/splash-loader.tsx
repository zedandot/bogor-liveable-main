"use client";

import { useEffect, useRef, useState } from "react";

export function SplashLoader() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  // phases: "in" (visible/intro) -> "out" (sliding out) -> "done" (unmounted)
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.splash = "active";

    // Beri waktu 1.6 detik agar tampilan terbaca jelas dan dinikmati, bukan cuma kedip
    const timer = window.setTimeout(() => {
      triggerExit();
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  const triggerExit = () => {
    setPhase((current) => {
      if (current !== "in") return current;
      document.documentElement.dataset.splash = "exiting";

      // Tunggu animasi exit (slide-left + slide-up) selesai (~750ms) baru hilangkan dari DOM
      window.setTimeout(() => {
        document.documentElement.dataset.splash = "done";
        setPhase("done");
      }, 750);

      return "out";
    });
  };

  if (phase === "done") {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className={`rb-splash ${phase === "out" ? "rb-splash-closing" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Ruang Bogor"
      onClick={triggerExit}
    >
      {/* Background layer: meluncur ke ATAS saat exit */}
      <div className="rb-splash-bg-up" aria-hidden="true" />

      {/* Foreground panel: meluncur ke KIRI saat exit */}
      <div className="rb-splash-stage-left">
        <div className="rb-splash-inner">
          <div className="rb-splash-coords">
            06° 35′ 49″ S · 106° 47′ 55″ E
          </div>

          <h1 className="rb-splash-title">
            RUANG BOGOR
          </h1>

          <div className="rb-splash-line" aria-hidden="true" />

          <div className="rb-splash-meta">
            <span>68 KELURAHAN</span>
            <span className="rb-splash-sep">/</span>
            <span>6 KECAMATAN</span>
          </div>

          <div className="rb-splash-hint">
            klik di mana saja untuk lewati
          </div>
        </div>
      </div>
    </div>
  );
}
