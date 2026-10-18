"use client";

import { useEffect, useRef } from "react";
import {
  ArrowUpRight,
  Send,
  Github,
  MessageSquare,
  MapPin,
  ArrowUp,
  Linkedin,
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

export function ContactSection({
  onContactOpen,
  onReturnToOrigin,
}: ContactSectionProps) {
  const galaxyCanvasRef = useRef<HTMLCanvasElement>(null);

  const triggerQuantumWarp = () => {
    if (onReturnToOrigin) {
      onReturnToOrigin();
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Golden Spiral Galaxy Particle Renderer (Foto 2 Reference)
  useEffect(() => {
    const canvas = galaxyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = 440;
    const height = 280;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const STAR_COUNT = 380;
    const ARMS = 2;
    const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
      const u = Math.random();
      const dist = Math.pow(u, 1.3) * 145;
      const armOffset = ((i % ARMS) / ARMS) * Math.PI * 2;
      const spin = dist * 0.032;
      const scatter = (Math.random() - 0.5) * (0.45 + dist * 0.004);
      return {
        dist,
        baseAngle: armOffset + spin + scatter,
        size: 0.7 + Math.random() * 1.6,
        alpha: 0.3 + Math.random() * 0.7,
        isCoreHot: dist < 36 || i % 4 === 0,
      };
    });

    let rafId = 0;
    const startTime = performance.now();

    const renderGalaxy = (now: number) => {
      const elapsed = (now - startTime) * 0.00045;
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;

      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.26); // Subtle galactic tilt

      // Galactic core golden bloom
      const coreGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 95 * dpr);
      coreGrad.addColorStop(0, "rgba(255, 251, 235, 0.75)");
      coreGrad.addColorStop(0.22, "rgba(254, 240, 138, 0.38)");
      coreGrad.addColorStop(0.55, "rgba(245, 158, 11, 0.12)");
      coreGrad.addColorStop(1, "rgba(3, 4, 9, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.scale(1, 0.48);
      ctx.arc(0, 0, 95 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.setTransform(1, 0, 0, 1, cx, cy);
      ctx.rotate(-0.26);

      for (let i = 0; i < STAR_COUNT; i++) {
        const s = stars[i];
        const omega = elapsed * (1.2 + 18 / Math.max(s.dist, 12));
        const angle = s.baseAngle + omega;
        const x = Math.cos(angle) * s.dist * dpr;
        const y = Math.sin(angle) * s.dist * 0.44 * dpr;

        ctx.beginPath();
        ctx.arc(x, y, s.size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = s.isCoreHot
          ? `rgba(255, 251, 235, ${s.alpha.toFixed(2)})`
          : `rgba(245, 158, 11, ${(s.alpha * 0.85).toFixed(2)})`;
        ctx.fill();
      }

      ctx.restore();
      rafId = requestAnimationFrame(renderGalaxy);
    };

    rafId = requestAnimationFrame(renderGalaxy);
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

                {/* Sacred "RETURN TO ORIGIN" Trigger Button (Foto 2 Spec) */}
                <button
                  type="button"
                  onClick={triggerQuantumWarp}
                  className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-amber-500/30 bg-amber-500/[0.06] px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400 hover:border-amber-400 hover:bg-amber-500/15 hover:text-white transition-all cursor-pointer shadow-[0_0_25px_rgba(245,158,11,0.12)]"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping absolute" />
                    <span className="h-2 w-2 rounded-full bg-amber-400 relative" />
                  </span>
                  <span>RETURN TO ORIGIN</span>
                  <span className="text-amber-500/70 group-hover:text-white group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </button>
              </div>
            </div>

            {/* Golden Spiral Galaxy & RETURN TO ORIGIN Orbital Portal (Foto 2 Exact Aesthetic) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div
                onClick={triggerQuantumWarp}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    triggerQuantumWarp();
                  }
                }}
                aria-label="Trigger Quantum Warp — Return to Origin"
                className="group relative flex flex-col items-center justify-center w-full max-w-[420px] rounded-2xl border border-amber-500/15 bg-[#05060B]/70 p-4 backdrop-blur-md hover:border-amber-500/40 transition-all cursor-pointer overflow-hidden"
              >
                <canvas
                  ref={galaxyCanvasRef}
                  style={{ mixBlendMode: "screen" }}
                  className="h-[190px] w-[320px] sm:h-[210px] sm:w-[360px] transition-transform duration-700 group-hover:scale-105"
                />

                <div className="mt-2 flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.25em] text-amber-400 group-hover:text-white transition-colors">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                  <span>RETURN TO ORIGIN</span>
                  <span className="text-zinc-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
                <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                  QUANTUM TRANSIT // SINGULARITY JUMP
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
                href="mailto:achmadtaufiqurrachman@gmail.com"
                className="font-mono text-[13px] sm:text-[14px] text-zinc-200 hover:text-amber-300 transition-colors"
              >
                achmadtaufiqurrachman@gmail.com
              </a>
              <CopyEmailPill
                email="achmadtaufiqurrachman@gmail.com"
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
            href="https://github.com/achmadtaufiqurrachman"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-3 transition-colors hover:bg-amber-500/[0.03] px-2 sm:px-4 rounded-lg"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500 w-32">
              GitHub
            </span>
            <span className="font-mono text-[13px] sm:text-[14px] text-zinc-200 group-hover:text-white transition-colors flex items-center gap-2">
              <Github className="h-3.5 w-3.5 text-amber-400/80" />
              @achmadtaufiqurrachman
            </span>
            <ArrowUpRight className="hidden sm:block h-4 w-4 text-zinc-600 group-hover:text-amber-400 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          {/* Row 4: LinkedIn */}
          <a
            href="https://linkedin.com/in/achmadtaufiqurrachman"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row sm:items-center sm:justify-between py-5 gap-3 transition-colors hover:bg-amber-500/[0.03] px-2 sm:px-4 rounded-lg"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500 w-32">
              LinkedIn
            </span>
            <span className="font-mono text-[13px] sm:text-[14px] text-zinc-200 group-hover:text-white transition-colors flex items-center gap-2">
              <Linkedin className="h-3.5 w-3.5 text-amber-400/80" />
              Achmad Taufiqur Rachman
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

        <button
          type="button"
          onClick={triggerQuantumWarp}
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400 hover:text-white transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
          <span>RETURN TO ORIGIN</span>
          <ArrowUp className="h-3.5 w-3.5 text-amber-400 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </footer>
    </section>
  );
}
