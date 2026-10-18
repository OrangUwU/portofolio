"use client";
import Image from "next/image";
import { SectionReveal } from "./SectionReveal";
import { SKILLS } from "@/content/about";
import { MapPin, ShieldCheck, Sparkles } from "lucide-react";

export function AboutSection() {
  const capabilities = [
    { idx: "01", name: "Full-Stack & Mobile Engineering", desc: "React Native, Expo, and modular client architectures" },
    { idx: "02", name: "Geographic Information Systems (GIS)", desc: "Interactive Mapbox GL maps, spatial layers, and GPS tracking" },
    { idx: "03", name: "Real-time Telemetry & WebSockets", desc: "Sub-second event dispatch with Socket.io & Express" },
    { idx: "04", name: "DVRP Logistics & Dynamic Routing", desc: "Human-as-a-Sensor routing optimization with WhatsApp Webhook" },
    { idx: "05", name: "Empirical Research & Statistical Data", desc: "Likert scale questionnaire design & quantitative behavioral analysis" },
    { idx: "06", name: "Brand Identity & Tactical Apparel", desc: "Vector graphics, merrowed patches, and physical workshirt production" },
  ];

  const allStack = [
    ...SKILLS.frontend,
    ...SKILLS.backend,
    ...SKILLS.database,
    ...SKILLS.tools_and_gis,
    "Dynamic Routing (DVRP)",
    "Likert Analysis",
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

        {/* Editorial Statement */}
        <div className="mt-6 max-w-[820px]">
          <h2 className="font-sans text-[30px] sm:text-[42px] md:text-[50px] font-black tracking-[-0.03em] text-white leading-[1.12]">
            I build software and spatial architectures that solve tangible problems — not just hypothetical prototypes.
          </h2>
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
            Melalui proyek <strong className="text-white font-semibold">IJEN-CARE</strong> untuk kompetisi OPSI &amp; IMPACT 2026, saya merancang ekosistem ride-hailing geowisata di kawasan Kawah Ijen dengan Mapbox GL dan Socket.io. Bukan sekadar kode antarmuka, tetapi memvalidasi langsung kebutuhan para stakeholder dan puluhan driver lokal.
          </p>
          <p>
            Di ranah sistem cerdas, saya mengeksplorasi konsep <strong className="text-white font-semibold">Human-as-a-Sensor</strong> dalam sistem Smart-Node Logistics (IEFC ITB), menghubungkan Webhook WhatsApp dengan algoritma DVRP (Dynamic Vehicle Routing Problem). Di sisi akademis, saya menyusun instrumen survei skala Likert empiris untuk analisis perilaku siswa di sekolah.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-3 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.05] px-3.5 py-1.5 text-amber-300">
              <Sparkles className="h-3 w-3 text-amber-400" />
              Focus: Geotourism &amp; Spatial Logistics
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/[0.05] px-3.5 py-1.5 text-[#fef08a]">
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
                // System Profile
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
                  <dt className="text-zinc-500">Languages</dt>
                  <dd className="text-zinc-200 text-right">Indonesian (Native) · English</dd>
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

      {/* Capabilities & Arsenal Bottom Sub-grid */}
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

        {/* Stack Chips (Span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400 mb-5">
              // Technical Arsenal &amp; Tools
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-zinc-300 hover:border-amber-500/40 hover:text-amber-200 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Location coordinate footer */}
          <div className="mt-8 rounded-xl border border-amber-500/15 bg-black/50 p-4 font-mono text-[11px] text-zinc-500 flex items-center justify-between">
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
