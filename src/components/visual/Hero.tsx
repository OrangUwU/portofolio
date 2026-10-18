"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Send, ArrowDown, Sparkles, Github, ExternalLink } from "lucide-react";

const TOP_MARQUEE_ITEMS = [
  "Mobile App Developer",
  "React Native & Expo",
  "Mapbox GL",
  "Full Stack & Node.js",
  "GIS & Spatial Systems",
  "Socket.io Realtime",
  "DVRP Logistics Optimization",
  "OPSI & IMPACT 2026",
  "IEFC ITB Prototype",
  "SMAN 1 Giri XI-2 Arcanova",
];

export function Hero({ onContactOpen }: { onContactOpen?: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden bg-[#06070a]">
      {/* Top Infinite Running Marquee Banner (Poggufanz Signature) */}
      <div className="relative border-b border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
        <div className="flex w-max animate-marquee select-none py-3">
          {[...TOP_MARQUEE_ITEMS, ...TOP_MARQUEE_ITEMS].map((item, i) => (
            <span key={`${item}-${i}`} className="inline-flex items-center gap-3 sm:gap-4 pr-3 sm:pr-4">
              <span className="font-mono text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.16em] text-zinc-300 whitespace-nowrap">
                {item.toUpperCase()}
              </span>
              <span className="text-[10px] text-emerald-400 font-bold" aria-hidden>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Subtle Coordinate / Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
          backgroundSize: "36px 36px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-radial-gradient from-white/[0.04] via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-12 sm:pb-16">
        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          {/* Bento Card 1: Giant Engineering Monolith (Span 8) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="group relative lg:col-span-8 flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 sm:p-9 lg:p-11 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-white/20 transition-all duration-300"
          >
            {/* Ambient Radial Accent */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/[0.05] blur-3xl group-hover:bg-emerald-500/[0.08] transition-colors duration-500"
              aria-hidden
            />

            <div>
              {/* Kicker Pill & Geolocation */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  </span>
                  <span className="font-mono text-[11px] font-medium tracking-[0.12em] text-emerald-300">
                    Status: Active &amp; Building
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-zinc-500">
                  <span>08°12&apos;S 114°22&apos;E</span>
                  <span>·</span>
                  <span>BANYUWANGI, ID</span>
                </div>
              </div>

              {/* Massive Geometric Typography */}
              <div className="mt-8 sm:mt-10">
                <h1 className="font-sans text-[44px] sm:text-[68px] md:text-[80px] lg:text-[88px] font-black leading-[0.9] tracking-[-0.04em] text-white">
                  ACHMAD<br />
                  TAUFIQUR<br />
                  <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    RACHMAN
                  </span>
                </h1>
                <p className="mt-3 font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-zinc-400">
                  // FULL STACK ENGINEER &amp; TECH RESEARCHER · TAUFIQ (OPEK)
                </p>
              </div>

              {/* Lede Text */}
              <p className="mt-6 max-w-[56ch] font-sans text-[14.5px] sm:text-[16px] leading-relaxed text-zinc-300 font-normal">
                Siswa SMAN 1 Giri (XI-2 Arcanova) yang merancang aplikasi ride-hailing geowisata terintegrasi GIS, sistem optimasi logistik pintar, dan penelitian kuantitatif empiris. Menggabungkan kode yang rapi dengan validasi lapangan nyata.
              </p>
            </div>

            {/* Tactile Actions Bar */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
              <a
                href="#works"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 py-2.5 font-sans text-[13px] font-semibold text-black transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98] cursor-pointer shadow-sm"
              >
                <span>Lihat Proyek</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </a>

              {onContactOpen && (
                <button
                  type="button"
                  onClick={onContactOpen}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-mono text-[12px] text-zinc-200 transition-all duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-[0.98] cursor-pointer backdrop-blur-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Kirim Pesan</span>
                </button>
              )}

              <a
                href="https://github.com/achmadtaufiqurrachman"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/10 bg-transparent px-4 py-2 font-mono text-[12px] text-zinc-400 hover:text-white hover:border-white/20 transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          </motion.div>

          {/* Bento Card 2: Visual Identity & Stats Showcase (Span 4) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="group relative lg:col-span-4 flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md p-6 sm:p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-white/20 transition-all duration-300"
          >
            {/* Visual Portrait */}
            <div className="relative h-[250px] sm:h-[290px] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e]">
              <Image
                src="/achmad.jpg"
                alt="Achmad Taufiqur Rachman with Arcanova custom workshirt"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover object-top filter brightness-[0.9] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

              {/* Float Kicker */}
              <div className="absolute bottom-3 inset-x-3 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/80 px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider text-zinc-300 backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  Arcanova XI-2 Custom Workshirt
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
              <div>
                <div className="font-sans text-[24px] font-bold text-white tracking-tight">05</div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-zinc-500">Rooms / Builds</div>
              </div>
              <div>
                <div className="font-sans text-[24px] font-bold text-white tracking-tight">2026</div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-zinc-500">OPSI &amp; IMPACT</div>
              </div>
              <div>
                <div className="font-sans text-[24px] font-bold text-white tracking-tight">5′26″</div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-zinc-500">Doc Bethek</div>
              </div>
            </div>

            {/* Institutional Footnote */}
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-zinc-500 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                SMAN 1 Giri
              </span>
              <span>Banyuwangi, ID</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
