"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function SplashLoader() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<"in" | "out" | "done">("in");

  const triggerExit = useCallback(() => {
    setPhase((current) => {
      if (current !== "in") return current;
      document.documentElement.dataset.splash = "exiting";
      try {
        sessionStorage.setItem("rb_splash_seen", "1");
      } catch {
        // Abaikan jika mode privat memblokir sessionStorage
      }

      window.setTimeout(() => {
        document.documentElement.dataset.splash = "done";
        setPhase("done");
      }, 680);

      return "out";
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let alreadySeen = false;
    try {
      alreadySeen = sessionStorage.getItem("rb_splash_seen") === "1";
    } catch {
      alreadySeen = false;
    }

    if (prefersReducedMotion || alreadySeen) {
      document.documentElement.dataset.splash = "done";
      setPhase("done");
      return;
    }

    document.documentElement.dataset.splash = "active";

    const timer = window.setTimeout(() => {
      triggerExit();
    }, 950);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        triggerExit();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [triggerExit]);

  if (phase === "done") {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className={`rb-splash ${phase === "out" ? "rb-splash-closing" : ""}`}
      role="region"
      aria-label="Pembuka Ruang Bogor"
    >
      <div className="rb-splash-bg-up" aria-hidden="true" />

      <div className="rb-splash-stage-left">
        <div className="rb-splash-inner">
          <div className="rb-splash-coords">
            ATLAS GEOSPASIAL KOTA BOGOR · WGS 84
          </div>

          <p className="rb-splash-title">RUANG BOGOR</p>

          <div className="rb-splash-line" aria-hidden="true" />

          <div className="rb-splash-meta">
            <span>68 KELURAHAN</span>
            <span className="rb-splash-sep">/</span>
            <span>6 KECAMATAN</span>
          </div>

          <button
            type="button"
            className="rb-splash-skip-btn"
            onClick={triggerExit}
          >
            Lewati pembuka
          </button>
        </div>
      </div>
    </div>
  );
}
