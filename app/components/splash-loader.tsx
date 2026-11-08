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
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"in" | "out" | "hidden">("in");

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.splash = "active";

    const start = performance.now();
    const duration = 1350; // ms for 0 -> 100% fade-in & counter
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // Cubic ease-out counter
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);

    const exitTimer = window.setTimeout(() => {
      triggerExit();
    }, 1500);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(exitTimer);
    };
  }, []);

  const triggerExit = async () => {
    const el = rootRef.current;
    if (!el || phase !== "in") return;

    setProgress(100);
    setPhase("out");
    document.documentElement.dataset.splash = "exiting";

    if (canTransitionDisplay()) {
      el.hidden = true;
    } else {
      el.setAttribute("data-closing", "");
    }

    const animations = el.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 1400)),
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

  const kelCount = Math.round((progress / 100) * 68);

  return (
    <div
      ref={rootRef}
      className="rb-splash"
      role="status"
      aria-live="polite"
      aria-label="Memuat Ruang Bogor"
    >
      {/* Background layer that slides UP when exiting */}
      <div className="rb-splash-bg-up" aria-hidden="true">
        <div className="rb-splash-watercolor-echo" />
        <svg
          className="rb-splash-topo"
          viewBox="0 0 800 800"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="400" cy="400" r="140" />
          <circle cx="400" cy="400" r="230" />
          <circle cx="400" cy="400" r="320" />
          <circle cx="400" cy="400" r="410" />
          <line x1="400" y1="0" x2="400" y2="800" />
          <line x1="0" y1="400" x2="800" y2="400" />
        </svg>
      </div>

      {/* Foreground panel that fades IN initially, then slides LEFT on exit */}
      <div className="rb-splash-stage-left">
        <div className="rb-splash-inner">
          <div className="rb-splash-kicker">
            <span className="rb-splash-dot" />
            Spatial Decision Support System · Kota Bogor
          </div>

          <div className="rb-splash-brand">
            <span className="rb-splash-mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="rb-splash-word">
              ruang<b>bogor</b>
            </span>
          </div>

          <p className="rb-splash-tagline">
            Memetakan <em>68 kelurahan</em> &amp; <em>6 kecamatan</em> di Kota
            Hujan
          </p>

          <div className="rb-splash-progress-wrap">
            <div className="rb-splash-progress-meta">
              <span>Memuat geometri &amp; 6 dimensi kelayakhunian</span>
              <b>
                {kelCount}/68 kelurahan · {progress}%
              </b>
            </div>
            <div className="rb-splash-progress-track">
              <i style={{ transform: `scaleX(${progress / 100})` }} />
            </div>
          </div>

          <div className="rb-splash-dims" aria-hidden="true">
            <span>Kesehatan</span>
            <span>Pendidikan</span>
            <span>Lingkungan</span>
            <span>Transportasi</span>
            <span>Ekonomi</span>
            <span>Sosial</span>
          </div>
        </div>

        <button
          type="button"
          className="rb-splash-skip"
          onClick={triggerExit}
          aria-label="Lewati animasi pembuka"
        >
          Lewati →
        </button>
      </div>
    </div>
  );
}

