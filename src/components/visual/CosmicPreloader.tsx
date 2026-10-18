"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CosmicPreloaderProps {
  onComplete?: () => void;
}

interface FilamentNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  isAmber: boolean;
}

interface SupernovaParticle {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

const SUPERNOVA_COLORS = [
  "#ffffff", // Pure photonic white
  "#fffbeb", // Super-heated white-gold
  "#fef08a", // Warm Doppler gold
  "#f59e0b", // Gargantua amber
  "#e0f2fe", // Warm relativistic cyan-white
];

export function CosmicPreloader({ onComplete }: CosmicPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"counting" | "supernova" | "done">("counting");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<"counting" | "supernova" | "done">("counting");

  const finishPreloader = useCallback(() => {
    phaseRef.current = "done";
    setPhase("done");
    try {
      sessionStorage.setItem("cosmic_dawn_loaded", "1");
    } catch {
      // ignore storage errors
    }
    if (onComplete) onComplete();
  }, [onComplete]);

  // Listen for ESC key to skip anytime
  useEffect(() => {
    if (phase === "done") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        finishPreloader();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, finishPreloader]);

  // Counter 000 -> 100 animation via requestAnimationFrame, then trigger Supernova Star Explosion
  useEffect(() => {
    let rafId = 0;
    let supernovaTimer: ReturnType<typeof setTimeout> | null = null;
    const duration = 1950; // ~1.95s dynamic easing counter
    const startTime = performance.now();

    const tick = (now: number) => {
      if (phaseRef.current !== "counting") return;
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);

      // Dynamic easing: brisk early cosmic inflation, deliberate precision near 90-100%
      const eased =
        t < 0.75
          ? (t / 0.75) * 0.86
          : 0.86 + (1 - Math.pow(1 - (t - 0.75) / 0.25, 2.2)) * 0.14;

      const currentVal = Math.min(100, Math.floor(eased * 100));
      setProgress(currentVal);

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        // Trigger Supernova Star Explosion right at 100%!
        phaseRef.current = "supernova";
        setPhase("supernova");
        supernovaTimer = setTimeout(() => {
          finishPreloader();
        }, 720);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      if (supernovaTimer) clearTimeout(supernovaTimer);
    };
  }, [finishPreloader]);

  // Cosmic Web Filament + Supernova Star Explosion Canvas (320 Radial Photons)
  useEffect(() => {
    if (phase === "done") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const NODE_COUNT = 68;
    const nodes: FilamentNode[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35 * dpr,
      vy: (Math.random() - 0.5) * 0.35 * dpr,
      radius: (0.8 + Math.random() * 1.8) * dpr,
      alpha: 0.25 + Math.random() * 0.65,
      isAmber: i % 3 === 0,
    }));

    let supernovaSpawned = false;
    const burstParticles: SupernovaParticle[] = [];

    const spawnSupernova = (w: number, h: number) => {
      // Origin centered near the giant 100 counter & lower-center focal nexus
      const originX = w * 0.26;
      const originY = h * 0.72;
      const BURST_COUNT = 320;

      for (let i = 0; i < BURST_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (4.5 + Math.pow(Math.random(), 0.7) * 34.0) * dpr;
        burstParticles.push({
          x: originX + (Math.random() - 0.5) * 40 * dpr,
          y: originY + (Math.random() - 0.5) * 30 * dpr,
          px: originX,
          py: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: (1.0 + Math.random() * 2.6) * dpr,
          alpha: 0.85 + Math.random() * 0.15,
          decay: 0.012 + Math.random() * 0.018,
          color: SUPERNOVA_COLORS[i % SUPERNOVA_COLORS.length],
        });
      }
    };

    let rafId = 0;
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      if (phaseRef.current === "supernova") {
        if (!supernovaSpawned) {
          supernovaSpawned = true;
          spawnSupernova(w, h);
        }
        // Trail persistence during supernova explosion
        ctx.fillStyle = "rgba(3, 4, 9, 0.24)";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      // Subtle central primordial glow
      const grad = ctx.createRadialGradient(
        w * 0.52,
        h * 0.45,
        10,
        w * 0.52,
        h * 0.45,
        Math.max(w, h) * 0.5
      );
      grad.addColorStop(0, "rgba(245, 158, 11, 0.09)");
      grad.addColorStop(0.45, "rgba(217, 119, 6, 0.03)");
      grad.addColorStop(1, "rgba(3, 4, 9, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const maxDist = 175 * dpr;

      // Render Cosmic Web Filaments
      for (let i = 0; i < NODE_COUNT; i++) {
        const a = nodes[i];
        a.x += a.vx * (phaseRef.current === "supernova" ? 4.5 : 1);
        a.y += a.vy * (phaseRef.current === "supernova" ? 4.5 : 1);

        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;

        for (let j = i + 1; j < NODE_COUNT; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle =
              a.isAmber || b.isAmber
                ? `rgba(245, 158, 11, ${lineAlpha.toFixed(3)})`
                : `rgba(255, 255, 255, ${(lineAlpha * 0.65).toFixed(3)})`;
            ctx.lineWidth = 0.8 * dpr;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fillStyle = a.isAmber
          ? `rgba(254, 240, 138, ${a.alpha.toFixed(2)})`
          : `rgba(255, 255, 255, ${(a.alpha * 0.75).toFixed(2)})`;
        ctx.fill();
      }

      // Render Supernova Radial Star Explosion
      if (phaseRef.current === "supernova") {
        for (let i = 0; i < burstParticles.length; i++) {
          const p = burstParticles[i];
          p.px = p.x;
          p.py = p.y;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.965;
          p.vy *= 0.965;
          p.alpha = Math.max(0, p.alpha - p.decay);

          if (p.alpha <= 0.01) continue;

          // High-velocity photon streak
          ctx.beginPath();
          ctx.moveTo(p.px - p.vx * 1.4, p.py - p.vy * 1.4);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.lineWidth = p.size;
          ctx.lineCap = "round";
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [phase]);

  const formattedCounter = String(progress).padStart(3, "0");

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="cosmic-preloader"
          initial={{ opacity: 1, scale: 1 }}
          exit={{
            opacity: 0,
            scale: 1.12,
            filter: "blur(12px)",
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-[#030409] px-6 sm:px-12 lg:px-16 py-8 sm:py-12 select-none overflow-hidden"
          role="status"
          aria-live="polite"
          aria-label={`Loading portfolio ${progress} percent`}
        >
          {/* Cosmic Web Filament & Supernova Explosion Canvas */}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden="true"
          />

          {/* Supernova Shockwave Ring & Photonic Flash at 100% */}
          <AnimatePresence>
            {phase === "supernova" && (
              <>
                {/* Expanding Amber Relativistic Shockwave Ring */}
                <motion.div
                  key="supernova-shockwave"
                  initial={{ scale: 0.1, opacity: 0.9 }}
                  animate={{ scale: 4.4, opacity: 0 }}
                  transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-none absolute left-[22%] bottom-[22%] h-[360px] w-[360px] -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-amber-400 shadow-[0_0_90px_rgba(245,158,11,0.9),inset_0_0_60px_rgba(254,240,138,0.6)] z-20"
                  aria-hidden="true"
                />
                {/* Brief Cosmic Ignition Flash */}
                <motion.div
                  key="supernova-flash"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.42, 0] }}
                  transition={{ duration: 0.55, times: [0, 0.22, 1] }}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber-200 via-white to-amber-400 mix-blend-screen z-30"
                  aria-hidden="true"
                />
              </>
            )}
          </AnimatePresence>

          {/* Top Telemetry Header & Skip ESC Button */}
          <div className="relative z-20 flex items-center justify-between gap-2 font-mono text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.16em] sm:tracking-[0.22em] text-zinc-500">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse" />
              <span className="text-zinc-400 truncate">
                ACHMAD TAUFIQUR RACHMAN // SINGULARITY
              </span>
            </div>

            <button
              type="button"
              onClick={finishPreloader}
              className="shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-3 sm:px-3.5 py-1 text-[9.5px] sm:text-[10px] tracking-[0.18em] text-zinc-300 hover:border-amber-400 hover:text-white transition-colors cursor-pointer touch-manipulation"
            >
              Skip <span className="hidden sm:inline">ESC</span>
            </button>
          </div>

          {/* Bottom-Left Giant Monospace Counter + Progress Line + Metadata */}
          <div className="relative z-20 mt-auto">
            {/* Giant 000 - 100 Counter exploding at Supernova */}
            <motion.div
              animate={
                phase === "supernova"
                  ? {
                      scale: 1.38,
                      opacity: 0,
                      filter: "blur(14px)",
                    }
                  : {
                      scale: 1,
                      opacity: 1,
                      filter: "blur(0px)",
                    }
              }
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
              className="origin-left font-mono text-[82px] sm:text-[140px] md:text-[180px] font-light text-white tracking-tighter leading-none tabular-nums drop-shadow-[0_0_35px_rgba(245,158,11,0.22)]"
            >
              {formattedCounter}
            </motion.div>

            {/* Expanding Amber Horizon Line */}
            <div className="mt-5 sm:mt-8 relative h-[1.5px] w-full bg-white/10 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600 via-amber-400 to-[#fffbeb] shadow-[0_0_16px_#f59e0b]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Bottom Telemetry Row: COSMIC DAWN 100 Myr & BANYUWANGI, ID */}
            <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center justify-between gap-2 sm:gap-4 font-mono text-[9.5px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.24em] text-zinc-500">
              <div className="flex items-center gap-3">
                <span className="text-amber-400 font-semibold">
                  COSMIC DAWN 100 Myr
                </span>
                <span className="hidden sm:inline text-zinc-700">·</span>
                <span className="hidden sm:inline text-zinc-400">
                  {phase === "supernova"
                    ? "SUPERNOVA SINGULARITY IGNITION"
                    : "KERR METRIC INITIALIZATION"}
                </span>
              </div>

              <div className="text-zinc-400">
                BANYUWANGI, ID · 08°12&apos;S 114°22&apos;E
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
