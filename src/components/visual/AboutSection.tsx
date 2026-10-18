"use client";
import Image from "next/image";
import { SectionReveal } from "./SectionReveal";
import { ABOUT_ME, SKILLS } from "@/content/about";
import { MapPin, ShieldCheck, Sparkles, Terminal } from "lucide-react";

export function AboutSection() {
  const capabilities = [
    {
      idx: "01",
      name: "Mobile Engineering",
      desc: "React Native & Expo modular client architectures with offline-first resilience",
    },
    {
      idx: "02",
      name: "Spatial / GIS Systems",
      desc: "Interactive Mapbox GL layers, real-time GPS telemetry & Geospatial Routing",
    },
    {
      idx: "03",
      name: "Backend & Real-Time Core",
      desc: "Node.js, Express.js, Socket.io WebSockets & lightweight SQLite persistence",
    },
    {
      idx: "04",
      name: "DVRP Logistics & Webhooks",
      desc: "Human-as-a-Sensor dynamic vehicle routing with WhatsApp Cloud API",
    },
    {
      idx: "05",
      name: "Empirical Data Research",
      desc: "Likert scale questionnaire design & quantitative behavioral modeling",
    },
    {
      idx: "06",
      name: "Brand Identity & Design",
      desc: "Figma UI/UX prototyping, vector emblem artwork & tactical apparel",
    },
  ];

  const categorizedStack = [
    { category: "Mobile", items: SKILLS.mobile },
    { category: "Spatial / GIS", items: SKILLS.spatial_gis },
    { category: "Backend", items: SKILLS.backend },
    { category: "Languages", items: SKILLS.languages },
    { category: "Tools", items: SKILLS.tools },
  ];

  return (
    <section
      id="about"
      className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-28 sm:pb-24 border-t border-amber-500/15"
    >
      <SectionReveal>
        {/* Eyebrow ala Poggufanz (Warm Amber Telemetry) */}
        <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          <span className="text-amber-500 font-bold">02</span>
          <span className="h-px w-6 bg-amber-500/40" />
          <span>About &amp; Profile</span>
        </div>

        {/* Editorial Statement + Vibecoder Tagline */}
        <div className="mt-6 max-w-[840px]">
          <h2 className="font-sans text-[28px] sm:text-[42px] md:text-[50px] font-black tracking-[-0.03em] text-white leading-[1.12]">
            I build software and spatial architectures that solve tangible problems — not just hypothetical prototypes.
          </h2>

          {/* Synced GitHub Tech Engineer / Vibecoder Bio Callout */}
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/[0.04] px-4 py-3.5 backdrop-blur-md">
            <Terminal className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <p className="font-mono text-[12px] sm:text-[13px] leading-relaxed text-[#fef08a]">
              &ldquo;{ABOUT_ME.tagline}&rdquo;
            </p>
          </div>
        </div>
      </SectionReveal>

      {/* Main Grid: Narrative (Left) + Facts & Portrait (Right) */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 items-start">
        {/* Left Column: Narrative (Span 6) */}
        <SectionReveal
          delay={0.1}
          className="lg:col-span-6 space-y-5 text-zinc-300 font-sans text-[14.5px] sm:text-[15.5px] leading-relaxed"
        >
          <p>
            Saya siswa di <strong className="text-white font-semibold">SMAN 1 Giri (XI-2 Arcanova)</strong> yang berdomisili di Banyuwangi, Jawa Timur. Fokus utama saya terletak di persimpangan antara rekayasa perangkat lunak mobile, GIS real-time, dan riset data kuantitatif.
          </p>
          <p>
            Melalui proyek <strong className="text-white font-semibold">IJEN-CARE</strong> untuk kompetisi OPSI &amp; IMPACT 2026, saya merancang ekosistem ride-hailing geowisata di kawasan Kawah Ijen dengan Mapbox GL, Express.js, Socket.io, dan SQLite. Bukan sekadar kode antarmuka, tetapi memvalidasi langsung kebutuhan para stakeholder dan puluhan driver lokal.
          </p>
          <p>
            Di ranah sistem cerdas, saya mengeksplorasi konsep <strong className="text-white font-semibold">Human-as-a-Sensor</strong> dalam sistem Smart-Node Logistics (<code className="font-mono text-[13px] text-amber-300">smartwastelogistics</code>), menghubungkan Webhook WhatsApp dengan algoritma Geospatial Routing DVRP. Di sisi akademis, saya menyusun instrumen survei skala Likert empiris untuk analisis perilaku siswa di sekolah.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span
              data-sfx="badge"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.05] px-3.5 py-1.5 text-amber-300"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              Focus: Geotourism &amp; Spatial Systems
            </span>
            <span
              data-sfx="badge"
              className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.05] px-3.5 py-1.5 text-[#fef08a]"
            >
              <ShieldCheck className="h-3 w-3 text-amber-400" />
              OPSI &amp; IMPACT 2026 Ready
            </span>
          </div>
        </SectionReveal>

        {/* Right Column: Facts Table & Portrait (Span 6) */}
        <SectionReveal delay={0.15} className="lg:col-span-6">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-6 items-start">
            {/* Facts Table ala Poggufanz (Warm Amber Glass) */}
            <div className="rounded-2xl border border-amber-500/20 bg-[#08090F]/80 p-5 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.06)]">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-amber-400/90 mb-4 pb-2 border-b border-white/10">
                // System Profile · @OrangUwU
              </p>
              <dl className="space-y-3 font-mono text-[11.5px]">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-white/5 pb-2">
                  <dt className="text-zinc-500">Education</dt>
                  <dd className="text-zinc-200 text-right">SMAN 1 Giri (XI-2 Arcanova)</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-white/5 pb-2">
                  <dt className="text-zinc-500">Current Focus</dt>
                  <dd className="text-amber-400 font-semibold text-right">Geotourism &amp; Spatial GIS</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-white/5 pb-2">
                  <dt className="text-zinc-500">Competitions</dt>
                  <dd className="text-zinc-200 text-right">OPSI &amp; IMPACT 2026 · IEFC ITB</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-white/5 pb-2">
                  <dt className="text-zinc-500">GitHub / IG</dt>
                  <dd className="text-zinc-200 text-right">@OrangUwU · @okayopek</dd>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 pb-1">
                  <dt className="text-zinc-500">Coordinates</dt>
                  <dd className="text-[#fef08a] text-right">08°12&apos;S 114°22&apos;E (Banyuwangi)</dd>
                </div>
              </dl>
            </div>

            {/* Portrait Frame with Motto */}
            <div className="flex flex-col items-center">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-amber-500/25 bg-black shadow-[0_0_25px_rgba(245,158,11,0.12)]">
                <Image
                  src="/achmad.jpg"
                  alt="Achmad Taufiqur Rachman"
                  fill
                  sizes="180px"
                  className="object-cover object-top filter grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
              </div>
              <p className="mt-2 text-center font-mono text-[9.5px] uppercase tracking-wider text-amber-400/80 italic">
                “gnosi ine dynami”
              </p>
            </div>
          </div>
        </SectionReveal>
      </div>

      {/* Capabilities & Synced GitHub Tech Stack Bottom Sub-grid */}
      <SectionReveal
        delay={0.2}
        className="mt-14 pt-10 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Capabilities List (Span 7) */}
        <div className="lg:col-span-7">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400 mb-5">
            // Core Capabilities
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {capabilities.map((cap) => (
              <li
                key={cap.idx}
                data-sfx="card"
                className="group flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3.5 hover:border-amber-500/35 hover:bg-amber-500/[0.03] transition-all"
              >
                <div>
                  <span className="font-mono text-[10px] text-amber-400 font-bold block mb-1">
                    {cap.idx}
                  </span>
                  <span className="font-sans text-[13.5px] font-semibold text-white block">
                    {cap.name}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[10.5px] text-zinc-400 leading-snug">
                  {cap.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Categorized GitHub Tech Stack Chips (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400 mb-5">
              // Technical Arsenal &amp; Tools (GitHub Sync)
            </p>
            <div className="space-y-3.5">
              {categorizedStack.map((group) => (
                <div
                  key={group.category}
                  className="rounded-xl border border-white/[0.07] bg-[#07080D]/80 p-3"
                >
                  <span className="block font-mono text-[9.5px] uppercase tracking-[0.18em] text-amber-400/90 mb-2">
                    {group.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((tech) => (
                      <span
                        key={tech}
                        data-sfx="badge"
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-zinc-200 hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-[#fef08a] transition-colors cursor-default"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location coordinate footer */}
          <div className="mt-6 rounded-xl border border-amber-500/15 bg-black/50 p-4 font-mono text-[11px] text-zinc-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <MapPin className="h-3.5 w-3.5 text-amber-400" />
              Origin: East Java, Indonesia
            </span>
            <span className="text-amber-400/80">08°12&apos;S 114°22&apos;E</span>
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
