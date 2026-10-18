"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface QuantumWarpTransitProps {
  isActive: boolean;
  onComplete: () => void;
}

interface WarpStar {
  x: number;
  y: number;
  z: number;
  pz: number;
  color: string;
  size: number;
}

const STAR_PALETTE = [
  "#fffbeb", // Brilliant photonic white-gold
  "#fef08a", // Warm Doppler yellow-gold
  "#f59e0b", // Gargantua amber
  "#ffffff", // Pure starlight
  "#bae6fd", // Relativistic blueshift highlight
];

// Procedural Web Audio API Spatial Whoosh & Wormhole Drone (100Hz -> 1600Hz -> 200Hz)
function playQuantumWarpWhoosh() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    const duration = 2.0;
    const now = ctx.currentTime;

    // 1. White Noise Buffer for Relativistic Wind / Spatial Whoosh
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    // Biquad Bandpass Filter sweeping 100Hz -> 1600Hz -> 200Hz
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.Q.setValueAtTime(2.6, now);
    bandpass.frequency.setValueAtTime(100, now);
    bandpass.frequency.exponentialRampToValueAtTime(1600, now + 0.88);
    bandpass.frequency.exponentialRampToValueAtTime(200, now + duration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.26, now + 0.68);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    whiteNoise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. Deep Gravitational Wormhole Sub-Bass Drone Swell
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(50, now);
    osc.frequency.exponentialRampToValueAtTime(128, now + 0.82);
    osc.frequency.exponentialRampToValueAtTime(36, now + duration);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.exponentialRampToValueAtTime(0.2, now + 0.65);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    whiteNoise.start(now);
    osc.start(now);
    whiteNoise.stop(now + duration);
    osc.stop(now + duration);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, (duration + 0.25) * 1000);

    return ctx;
  } catch {
    return null;
  }
}

export function QuantumWarpTransit({
  isActive,
  onComplete,
}: QuantumWarpTransitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSkip = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    onComplete();
  }, [onComplete]);

  // Listen for ESC key to skip warp transit
  useEffect(() => {
    if (!isActive) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isActive, handleSkip]);

  // Full-Screen 60fps 3D Hyperspace Starfield Jump with Chromatic Aberration & Wormhole Lensing
  useEffect(() => {
    if (!isActive) return;

    const audioCtx = playQuantumWarpWhoosh();

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

    const STAR_COUNT = 850;
    const spread = Math.max(window.innerWidth, window.innerHeight) * 1.65;
    const maxDepth = 1400;

    const stars: WarpStar[] = Array.from({ length: STAR_COUNT }, (_, i) => {
      const z = Math.random() * maxDepth + 1;
      // Avoid spawning directly inside the central pinhole so the wormhole throat stays crisp
      let x = (Math.random() - 0.5) * spread * 2;
      let y = (Math.random() - 0.5) * spread * 2;
      if (Math.hypot(x, y) < 35) {
        x += 55;
      }
      return {
        x,
        y,
        z,
        pz: z,
        color: STAR_PALETTE[i % STAR_PALETTE.length],
        size: 0.85 + Math.random() * 1.65,
      };
    });

    let rafId = 0;
    const startTime = performance.now();
    const totalDuration = 1820; // 1.82 seconds hyperspace jump
    let hasScrolledToOrigin = false;

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / totalDuration);

      // Scroll behind the warp curtain at peak velocity
      if (progress >= 0.62 && !hasScrolledToOrigin) {
        hasScrolledToOrigin = true;
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }

      // Speed curve: accelerates from 1 to 60 (warp velocity), then decelerates smoothly
      const bell = Math.sin(progress * Math.PI);
      const speed = 1.0 + Math.pow(bell, 1.3) * 59.0;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const fov = Math.min(w, h) * 0.66;

      // Motion blur trail persistence
      ctx.fillStyle = "rgba(3, 4, 9, 0.27)";
      ctx.fillRect(0, 0, w, h);

      // Wormhole gravitational lens radius
      const lensRadius = (36 + bell * 28) * dpr;

      for (let i = 0; i < STAR_COUNT; i++) {
        const s = stars[i];
        s.pz = s.z;
        s.z -= speed;

        if (s.z <= 8) {
          s.z = maxDepth;
          s.pz = maxDepth;
          s.x = (Math.random() - 0.5) * spread * 2;
          s.y = (Math.random() - 0.5) * spread * 2;
        }

        let sx = cx + (s.x / s.z) * fov;
        let sy = cy + (s.y / s.z) * fov;

        const streakZ = s.z + speed * 2.4;
        let px = cx + (s.x / streakZ) * fov;
        let py = cy + (s.y / streakZ) * fov;

        // Gravitational Lensing deflection near central wormhole throat
        const dx = sx - cx;
        const dy = sy - cy;
        const dist = Math.hypot(dx, dy) || 1;
        if (dist < lensRadius * 2.6) {
          const push = (lensRadius * lensRadius) / Math.max(dist, lensRadius * 0.65);
          sx += (dx / dist) * push * 0.45;
          sy += (dy / dist) * push * 0.45;
          px += (dx / dist) * push * 0.35;
          py += (dy / dist) * push * 0.35;
        }

        const depthAlpha = Math.min(1, (1 - s.z / maxDepth) * 1.35);
        const lw = s.size * dpr * (0.6 + (1 - s.z / maxDepth) * 1.3);

        // 1. Chromatic Aberration / Relativistic Doppler Fringing (at high warp velocity)
        if (bell > 0.32 && depthAlpha > 0.25) {
          const fringeOffset = bell * 2.4 * dpr;
          const ux = dx / dist;
          const uy = dy / dist;

          // Outer Blueshifted Fringe (Cyan-Blue)
          ctx.beginPath();
          ctx.moveTo(px + ux * fringeOffset, py + uy * fringeOffset);
          ctx.lineTo(sx + ux * fringeOffset * 1.5, sy + uy * fringeOffset * 1.5);
          ctx.strokeStyle = "rgba(56, 189, 248, 0.42)";
          ctx.globalAlpha = depthAlpha * 0.65;
          ctx.lineWidth = lw * 0.85;
          ctx.lineCap = "round";
          ctx.stroke();

          // Inner Redshifted Fringe (Warm Amber-Red)
          ctx.beginPath();
          ctx.moveTo(px - ux * fringeOffset, py - uy * fringeOffset);
          ctx.lineTo(sx - ux * fringeOffset * 1.4, sy - uy * fringeOffset * 1.4);
          ctx.strokeStyle = "rgba(245, 158, 11, 0.55)";
          ctx.globalAlpha = depthAlpha * 0.75;
          ctx.lineWidth = lw * 0.85;
          ctx.lineCap = "round";
          ctx.stroke();
        }

        // 2. Primary Relativistic Light Streak
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = depthAlpha;
        ctx.lineWidth = lw;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Central Wormhole Gravitational Lens Vortex
      const vortexGrad = ctx.createRadialGradient(
        cx,
        cy,
        lensRadius * 0.15,
        cx,
        cy,
        lensRadius * 2.1
      );
      vortexGrad.addColorStop(0, "rgba(0, 0, 0, 0.96)");
      vortexGrad.addColorStop(0.38, "rgba(3, 4, 9, 0.88)");
      vortexGrad.addColorStop(
        0.52,
        `rgba(254, 240, 138, ${(0.22 + bell * 0.35).toFixed(3)})`
      );
      vortexGrad.addColorStop(
        0.72,
        `rgba(245, 158, 11, ${(0.08 + bell * 0.14).toFixed(3)})`
      );
      vortexGrad.addColorStop(1, "rgba(3, 4, 9, 0)");

      ctx.fillStyle = vortexGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, lensRadius * 2.1, 0, Math.PI * 2);
      ctx.fill();

      // Razor-thin Einstein Photon Ring around Wormhole Throat
      ctx.beginPath();
      ctx.arc(cx, cy, lensRadius * 0.85, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 251, 235, ${(0.35 + bell * 0.5).toFixed(3)})`;
      ctx.lineWidth = 1.4 * dpr;
      ctx.stroke();

      if (progress < 1) {
        rafId = requestAnimationFrame(render);
      } else {
        if (!hasScrolledToOrigin) {
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        }
        onComplete();
      }
    };

    ctx.fillStyle = "#030409";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (audioCtx && audioCtx.state !== "closed") {
        audioCtx.close().catch(() => {});
      }
    };
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key="quantum-warp-transit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[95] bg-[#030409] select-none overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Transit returning to origin"
        >
          {/* 60fps 3D Starfield Hyperspace Canvas */}
          <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
          />

          {/* Top-Right Skip ESC Pill */}
          <div className="absolute right-6 top-6 sm:right-10 sm:top-8 z-20">
            <button
              type="button"
              onClick={handleSkip}
              className="rounded-full border border-white/20 bg-black/50 px-3.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-zinc-300 backdrop-blur-md hover:border-amber-400 hover:text-white transition-colors cursor-pointer"
            >
              Skip ESC
            </button>
          </div>

          {/* Bottom-Left HUD Telemetry: TRANSIT —— RETURNING TO ORIGIN */}
          <div className="pointer-events-none absolute bottom-7 left-6 sm:bottom-10 sm:left-12 z-20 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b] animate-ping" />
            <span>TRANSIT</span>
            <span className="h-px w-8 bg-amber-500/70" />
            <span className="text-amber-300 font-semibold">
              RETURNING TO ORIGIN
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
