"use client";

import { useEffect, useRef, useState } from "react";

let supportsDisplayTransition: boolean | undefined;
function canTransitionDisplay(): boolean {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (
    typeof window === "undefined" ||
    !window.CSS?.supports?.("transition-behavior", "allow-discrete") ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement("div");
  probe.style.cssText =
    "transition: display 1s allow-discrete !important; display: block;";
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = "none";
  supportsDisplayTransition = getComputedStyle(probe).display === "block";
  probe.remove();
  return supportsDisplayTransition;
}

export function SplashLoader() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<"in" | "out" | "hidden">("in");

  useEffect(() => {
    // Jalankan sekali per session agar tidak mengganggu saat refresh/dev
    if (typeof window !== "undefined" && sessionStorage.getItem("rb_splash_seen") === "1") {
      document.documentElement.dataset.splash = "done";
      setPhase("hidden");
      return;
    }

    const html = document.documentElement;
    html.dataset.splash = "active";

    // Durasi cepat & snappy: ~650ms sebelum meluncur keluar
    const exitTimer = window.setTimeout(() => {
      triggerExit();
    }, 650);

    return () => clearTimeout(exitTimer);
  }, []);

  const triggerExit = async () => {
    const el = rootRef.current;
    if (!el || phase !== "in") return;

    setPhase("out");
    document.documentElement.dataset.splash = "exiting";
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rb_splash_seen", "1");
    }

    if (canTransitionDisplay()) {
      el.hidden = true;
    } else {
      el.setAttribute("data-closing", "");
    }

    const animations = el.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 850)),
      ]);
    }

    if (el.hasAttribute("data-closing")) {
      el.removeAttribute("data-closing");
      el.hidden = true;
    }

    document.documentElement.dataset.splash = "done";
    setPhase("hidden");
  };

  if (phase === "hidden") return null;

  return (
    <div
      ref={rootRef}
      className="rb-splash"
      role="status"
      aria-live="polite"
      aria-label="Ruang Bogor"
      onClick={triggerExit}
    >
      {/* Background layer: meluncur ke ATAS saat keluar */}
      <div className="rb-splash-bg-up" aria-hidden="true" />

      {/* Foreground panel: meluncur ke KIRI saat keluar */}
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
        </div>
      </div>
    </div>
  );
}
