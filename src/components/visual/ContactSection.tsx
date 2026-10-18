"use client";

import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Send,
  Github,
  MessageSquare,
  MapPin,
  ArrowUp,
  Instagram,
} from "lucide-react";
import { SectionReveal } from "./SectionReveal";
import { CopyEmailPill } from "@/components/interactive/CopyEmailPill";

const BOTTOM_MARQUEE_ITEMS = [
  "LET'S CONNECT",
  "OPEN FOR RESEARCH COLLABORATIONS",
  "REACT NATIVE & EXPO",
  "MAPBOX GL GIS",
  "OPSI & IMPACT 2026",
  "DVRP LOGISTICS",
  "SMAN 1 GIRI XI-2 ARCANOVA",
  "BANYUWANGI, EAST JAVA",
];

interface ContactSectionProps {
  onContactOpen?: () => void;
  onReturnToOrigin?: () => void;
}

// 16 vertices of a 4D Hypercube (Tesseract): all combinations of (±1, ±1, ±1, ±1)
const TESSERACT_VERTICES: [number, number, number, number][] = [];
for (let i = 0; i < 16; i++) {
  TESSERACT_VERTICES.push([
    i & 1 ? 1 : -1,
    i & 2 ? 1 : -1,
    i & 4 ? 1 : -1,
    i & 8 ? 1 : -1,
  ]);
}

// 32 edges connecting vertices that differ by exactly 1 bit
const TESSERACT_EDGES: [number, number][] = [];
for (let i = 0; i < 16; i++) {
  for (let j = i + 1; j < 16; j++) {
    const diff = i ^ j;
    if (diff && (diff & (diff - 1)) === 0) {
      TESSERACT_EDGES.push([i, j]);
    }
  }
}

export function ContactSection({
  onContactOpen,
  onReturnToOrigin,
}: ContactSectionProps) {
  const galaxyCanvasRef = useRef<HTMLCanvasElement>(null);
  const isHoveringPortalRef = useRef(false);

  const triggerQuantumWarp = () => {
    if (onReturnToOrigin) {
      onReturnToOrigin();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 4D-to-3D Rotating Tesseract Wireframe + Relativistic Golden Spiral Vortex Renderer
  useEffect(() => {
    const canvas = galaxyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = 460;
    const height = 270;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // 480 Relativistic Spiral Stream Particles with velocity trail angles
    const PARTICLE_COUNT = 480;
    const ARMS = 3;
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const u = Math.random();
      const dist = 18 + Math.pow(u, 1.35) * 155;
      const armOffset = ((i % ARMS) / ARMS) * Math.PI * 2;
      const spiralTwist = dist * 0.038;
      const scatter = (Math.random() - 0.5) * (0.32 + dist * 0.0025);
      return {
        dist,
        baseAngle: armOffset + spiralTwist + scatter,
        size: 0.65 + Math.random() * 1.45,
        alpha: 0.28 + Math.random() * 0.72,
        isPhotonicWhite: dist < 48 || i % 4 === 0,
        trailArc: 0.08 + (165 - dist) * 0.0012,
      };
    });

    let rafId = 0;
    let timePhase = 0;
    let lastTime = performance.now();

    const renderPortal = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) * 0.001);
      lastTime = now;

      // Boost speed smoothly when user hovers over the portal
      const speedMult = isHoveringPortalRef.current ? 2.35 : 1.0;
      timePhase += dt * speedMult;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;

      ctx.clearRect(0, 0, w, h);

      // 1. Deep Relativistic Singularity Golden Bloom
      const ambientGrad = ctx.createRadialGradient(
        cx,
        cy,
        2 * dpr,
        cx,
        cy,
        155 * dpr
      );
      ambientGrad.addColorStop(0, "rgba(255, 251, 235, 0.85)");
      ambientGrad.addColorStop(0.16, "rgba(254, 240, 138, 0.42)");
      ambientGrad.addColorStop(0.42, "rgba(245, 158, 11, 0.16)");
      ambientGrad.addColorStop(0.75, "rgba(180, 83, 9, 0.05)");
      ambientGrad.addColorStop(1, "rgba(3, 4, 9, 0)");
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Relativistic Accretion Spiral Ribbons & Keplerian Particle Trails
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.24); // Characteristic Gargantua / Poggufanz orbital tilt

      // Subtle Concentric Telemetry Rings in Orbital Plane
      for (const r of [46, 86, 128, 162]) {
        ctx.beginPath();
        ctx.ellipse(0, 0, r * dpr, r * 0.44 * dpr, 0, 0, Math.PI * 2);
        ctx.strokeStyle =
          r === 86
            ? "rgba(254, 240, 138, 0.22)"
            : "rgba(245, 158, 11, 0.11)";
        ctx.lineWidth = 0.85 * dpr;
        ctx.stroke();
      }

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        // Keplerian differential angular velocity (inner orbits spin faster)
        const omega = timePhase * (0.45 + 16 / Math.max(p.dist, 14));
        const a1 = p.baseAngle + omega;
        const a0 = a1 - p.trailArc * (isHoveringPortalRef.current ? 1.65 : 1.0);

        const x0 = Math.cos(a0) * p.dist * dpr;
        const y0 = Math.sin(a0) * p.dist * 0.44 * dpr;
        const x1 = Math.cos(a1) * p.dist * dpr;
        const y1 = Math.sin(a1) * p.dist * 0.44 * dpr;

        // Relativistic Doppler beaming (brighter on approaching left-bottom wing)
        const doppler = 0.72 + 0.28 * Math.cos(a1 + 0.6);
        const alpha = Math.min(1, p.alpha * doppler);

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = p.isPhotonicWhite
          ? `rgba(255, 251, 235, ${alpha.toFixed(2)})`
          : `rgba(245, 158, 11, ${(alpha * 0.88).toFixed(2)})`;
        ctx.lineWidth = p.size * dpr;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      ctx.restore();

      // 3. 4D-to-3D Rotating Hypercube (Tesseract Wireframe Core)
      const angleXY = timePhase * 0.55;
      const angleXZ = timePhase * 0.38;
      const angleXW = timePhase * 0.72;
      const angleZW = timePhase * 0.48;

      const cosXY = Math.cos(angleXY),
        sinXY = Math.sin(angleXY);
      const cosXZ = Math.cos(angleXZ),
        sinXZ = Math.sin(angleXZ);
      const cosXW = Math.cos(angleXW),
        sinXW = Math.sin(angleXW);
      const cosZW = Math.cos(angleZW),
        sinZW = Math.sin(angleZW);

      const scale3D = 48 * dpr;
      const projectedVerts = TESSERACT_VERTICES.map(([vx, vy, vz, vw]) => {
        // 4D Rotation in XW plane
        let x = vx * cosXW - vw * sinXW;
        let w4 = vx * sinXW + vw * cosXW;
        let y = vy;
        let z = vz;

        // 4D Rotation in ZW plane
        const zTemp = z * cosZW - w4 * sinZW;
        w4 = z * sinZW + w4 * cosZW;
        z = zTemp;

        // 3D Rotation in XY & XZ planes
        const xTemp = x * cosXY - y * sinXY;
        y = x * sinXY + y * cosXY;
        x = xTemp;

        const xTemp2 = x * cosXZ - z * sinXZ;
        z = x * sinXZ + z * cosXZ;
        x = xTemp2;

        // Stereographic projection from 4D -> 3D -> 2D
        const wPerspective = 1 / (2.45 - w4 * 0.65);
        const x3 = x * wPerspective;
        const y3 = y * wPerspective;
        const z3 = z * wPerspective;

        const zPerspective = 1 / (3.2 - z3 * 0.55);
        return {
          sx: cx + x3 * zPerspective * scale3D * 2.2,
          sy: cy + y3 * zPerspective * scale3D * 2.2,
          depth: wPerspective * zPerspective,
          isInner: vw < 0,
        };
      });

      // Draw 32 4D Hypercube Copper/Gold Wireframe Struts
      for (const [i, j] of TESSERACT_EDGES) {
        const v1 = projectedVerts[i];
        const v2 = projectedVerts[j];
        const avgDepth = (v1.depth + v2.depth) * 0.5;
        const isHyperBridge = (i ^ j) === 8; // 4th-dimension W-bridge edge

        ctx.beginPath();
        ctx.moveTo(v1.sx, v1.sy);
        ctx.lineTo(v2.sx, v2.sy);

        if (isHyperBridge) {
          ctx.strokeStyle = `rgba(254, 240, 138, ${Math.min(0.92, avgDepth * 1.65).toFixed(2)})`;
          ctx.lineWidth = 1.35 * dpr;
        } else {
          ctx.strokeStyle = `rgba(245, 158, 11, ${Math.min(0.88, avgDepth * 1.45).toFixed(2)})`;
          ctx.lineWidth = 1.15 * dpr;
        }
        ctx.stroke();
      }

      // Draw Glowing Photonic Vertex Joints on the 4D Tesseract
      for (const v of projectedVerts) {
        ctx.beginPath();
        ctx.arc(v.sx, v.sy, (v.isInner ? 1.6 : 2.1) * dpr, 0, Math.PI * 2);
        ctx.fillStyle = v.isInner
          ? "rgba(255, 251, 235, 0.95)"
          : "rgba(245, 158, 11, 0.9)";
        ctx.fill();
      }

      rafId = requestAnimationFrame(renderPortal);
    };

    rafId = requestAnimationFrame(renderPortal);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      id="contact"
      className="relative pt-16 sm:pt-24 border-t border-amber-500/15"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <SectionReveal>
          {/* Eyebrow ala Poggufanz (Warm Amber Telemetry) */}
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            <span className="text-amber-500 font-bold">04</span>
            <span className="h-px w-6 bg-amber-500/40" />
            <span>Contact &amp; Origin</span>
          </div>

          <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h2 className="font-sans text-[44px] sm:text-[64px] md:text-[76px] font-black tracking-[-0.04em] text-white leading-none">
                LET&apos;S CONNECT
              </h2>
              <p className="mt-4 max-w-[48ch] font-sans text-[14.5px] sm:text-[16px] leading-relaxed text-zinc-300">
                Terbuka untuk diskusi proyek pengembangan perangkat lunak, kolaborasi riset geowisata &amp; optimasi logistik, atau sekadar berbincang seputar teknologi.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                {onContactOpen && (
                  <button
                    type="button"
                    onClick={onContactOpen}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-6 py-2.5 font-sans text-[13px] font-semibold text-black transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98] cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                  >
                    <Send className="h-4 w-4 text-amber-600" />
                    <span>Kirim Pesan Langsung</span>
                  </button>
                )}

                {/* Sacred "RETURN TO ORIGIN" Trigger Button */}
                <button
                  type="button"
                  onClick={triggerQuantumWarp}
                  onMouseEnter={() => {
                    isHoveringPortalRef.current = true;
                  }}
                  onMouseLeave={() => {
                    isHoveringPortalRef.current = false;
                  }}
                  className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-amber-500/35 bg-amber-500/[0.08] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-300 hover:border-amber-400 hover:bg-amber-500/20 hover:text-white transition-all cursor-pointer shadow-[0_0_28px_rgba(245,158,11,0.16)]"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping absolute" />
                    <span className="h-2 w-2 rounded-full bg-amber-400 relative" />
                  </span>
                  <span>RETURN TO ORIGIN</span>
                  <span className="text-amber-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </button>
              </div>
            </div>

            {/* 4D Rotating Tesseract Wireframe & Relativistic Spiral Portal */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div
                onClick={triggerQuantumWarp}
                onMouseEnter={() => {
                  isHoveringPortalRef.current = true;
                }}
                onMouseLeave={() => {
                  isHoveringPortalRef.current = false;
                }}
                onTouchStart={() => {
                  isHoveringPortalRef.current = true;
                }}
                onTouchEnd={() => {
                  isHoveringPortalRef.current = false;
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    triggerQuantumWarp();
                  }
                }}
                aria-label="Trigger Quantum Warp — Return to Origin"
                className="group relative flex flex-col items-center justify-center w-full max-w-[440px] rounded-2xl border border-amber-500/25 bg-[#04050A]/90 p-4 sm:p-5 backdrop-blur-md hover:border-amber-400/60 active:scale-[0.99] transition-all duration-300 cursor-pointer overflow-hidden shadow-[0_0_55px_rgba(0,0,0,0.85),inset_0_0_40px_rgba(245,158,11,0.08)] touch-manipulation"
              >
                {/* Top HUD Corner Telemetry */}
                <div className="w-full flex items-center justify-between font-mono text-[8.5px] sm:text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1">
                  <span className="text-amber-400/80">5D HYPERCUBE GATE</span>
                  <span>08°12&apos;S 114°22&apos;E</span>
                </div>

                <canvas
                  ref={galaxyCanvasRef}
                  style={{ mixBlendMode: "screen" }}
                  className="w-full max-w-[390px] aspect-[460/270] h-auto transition-transform duration-500 group-hover:scale-105"
                />

                <div className="mt-2 flex items-center gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.26em] text-amber-300 group-hover:text-white transition-colors">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping" />
                  <span>RETURN TO ORIGIN</span>
                  <span className="text-amber-400 group-hover:text-white group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
                <span className="mt-1 font-mono text-[8.5px] sm:text-[9px] uppercase tracking-[0.18em] sm:tracking-[0.22em] text-zinc-500 group-hover:text-amber-200/70 transition-colors text-center">
                  TESSERACT FOLD // SINGULARITY TRANSIT
                </span>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Poggufanz Contact Rows */}
        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {/* Row 1: Email */}
          <div className="group flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-3 transition-colors hover:bg-amber-500/[0.03] px-2 sm:px-4 rounded-lg">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500 w-32">
              Email
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:opekimut2@gmail.com"
                className="font-mono text-[13px] sm:text-[14px] text-zinc-200 hover:text-amber-300 transition-colors"
              >
                opekimut2@gmail.com
              </a>
              <CopyEmailPill
                email="opekimut2@gmail.com"
                align="center"
              />
            </div>
            <ArrowUpRight className="hidden sm:block h-4 w-4 text-zinc-600 group-hover:text-amber-400 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          {/* Row 2: Direct Message Drawer */}
          <div
            onClick={onContactOpen}
            className="group flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-3 transition-colors hover:bg-amber-500/[0.03] px-2 sm:px-4 rounded-lg cursor-pointer"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500 w-32">
              Drawer Form
            </span>
            <div className="font-sans text-[13px] sm:text-[14px] text-zinc-200 group-hover:text-white transition-colors flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
              <span>Buka Formulir Pesan Cepat (Terhubung API &amp; Webhook)</span>
            </div>
            <ArrowUpRight className="hidden sm:block h-4 w-4 text-zinc-600 group-hover:text-amber-400 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          {/* Row 3: GitHub */}
          <a
            href="https://github.com/OrangUwU"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-3 transition-colors hover:bg-amber-500/[0.03] px-2 sm:px-4 rounded-lg"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500 w-32">
              GitHub
            </span>
            <span className="font-mono text-[13px] sm:text-[14px] text-zinc-200 group-hover:text-white transition-colors flex items-center gap-2">
              <Github className="h-3.5 w-3.5 text-amber-400/80" />
              @OrangUwU
            </span>
            <ArrowUpRight className="hidden sm:block h-4 w-4 text-zinc-600 group-hover:text-amber-400 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Row 4: Instagram */}
          <a
            href="https://instagram.com/okayopek"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-3 transition-colors hover:bg-amber-500/[0.03] px-2 sm:px-4 rounded-lg"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500 w-32">
              Instagram
            </span>
            <span className="font-mono text-[13px] sm:text-[14px] text-zinc-200 group-hover:text-white transition-colors flex items-center gap-2">
              <Instagram className="h-3.5 w-3.5 text-amber-400/80" />
              @okayopek
            </span>
            <ArrowUpRight className="hidden sm:block h-4 w-4 text-zinc-600 group-hover:text-amber-400 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Row 5: Location */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-3 px-2 sm:px-4 text-zinc-400 font-mono text-[12px]">
            <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-500 w-32">
              Based In
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              Banyuwangi, East Java, Indonesia · 08°12&apos;S 114°22&apos;E
            </span>
            <span className="hidden sm:block text-amber-400/80 font-mono text-[11px]">
              UTC+7
            </span>
          </div>
        </div>
      </div>

      {/* Infinite Running Marquee Footer Divider */}
      <div className="mt-20 border-y border-amber-500/20 bg-amber-500/[0.02] overflow-hidden">
        <div className="flex w-max animate-marquee select-none py-3.5">
          {[...BOTTOM_MARQUEE_ITEMS, ...BOTTOM_MARQUEE_ITEMS].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="inline-flex items-center gap-4 pr-4"
            >
              <span className="font-mono text-[11px] font-semibold tracking-[0.18em] text-zinc-300 whitespace-nowrap">
                {item}
              </span>
              <span className="text-amber-400 font-bold" aria-hidden>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Sleek Minimalist Footer */}
      <footer className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono text-[11px] text-zinc-500">
        <div>
          <p>© 2026 Achmad Taufiqur Rachman · SMAN 1 Giri (XI-2 Arcanova)</p>
          <p className="mt-1 text-zinc-600">
            Engineered with Next.js 15, React 19, Tailwind CSS &amp; Framer Motion. Zero layout shifts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/OrangUwU"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub @OrangUwU"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-amber-300 transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span>@OrangUwU</span>
          </a>
          <a
            href="https://instagram.com/okayopek"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @okayopek"
            className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-amber-300 transition-colors"
          >
            <Instagram className="h-3.5 w-3.5" />
            <span>@okayopek</span>
          </a>

          <button
            type="button"
            onClick={triggerQuantumWarp}
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400 hover:text-white transition-colors cursor-pointer"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>RETURN TO ORIGIN</span>
            <ArrowUp className="h-3.5 w-3.5 text-amber-400 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </footer>
    </section>
  );
}
