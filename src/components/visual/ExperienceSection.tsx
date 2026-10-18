"use client";
import { SectionReveal } from "./SectionReveal";
import { Calendar, MapPin } from "lucide-react";

type TimelineRole = {
  idx: string;
  period: string;
  isCurrent?: boolean;
  title: string;
  org: string;
  context: string;
  location: string;
  points: string[];
  chips: string[];
};

const ROLES: TimelineRole[] = [
  {
    idx: "01",
    period: "Aug 2025 — Present",
    isCurrent: true,
    title: "Lead Developer & Spatial Researcher",
    org: "IJEN-CARE — Geotourism Ride-Hailing Platform",
    context: "OPSI & IMPACT 2026 National Competition",
    location: "Kawah Ijen, Banyuwangi",
    points: [
      "Merancang arsitektur mobile ride-hailing real-time dengan React Native & Expo khusus rute lereng Kawah Ijen.",
      "Mengintegrasikan Mapbox GL tracking interaktif dengan order flow sub-detik melalui Socket.io dan Express.",
      "Melakukan riset empiris lapangan bersama 30+ driver lokal dan 80+ wisatawan untuk validasi kebutuhan.",
      "Membangun backend SQLite & Express modular untuk penyimpanan rute dan simulasi dispatch armada.",
    ],
    chips: ["React Native", "Expo", "Mapbox GL", "Socket.io", "Node.js", "SQLite"],
  },
  {
    idx: "02",
    period: "2025",
    title: "System Architect & Logistics Engineer",
    org: "Smart-Node Logistics — Prototype Web App",
    context: "IEFC ITB 2025 Prototype Submission",
    location: "Bandung / Banyuwangi",
    points: [
      "Mengembangkan arsitektur 'Human-as-a-Sensor' menghubungkan laporan warga via WhatsApp Cloud API webhook.",
      "Mengimplementasikan algoritma Dynamic Vehicle Routing Problem (DVRP) untuk optimasi rute truk pengumpul sampah.",
      "Merancang skema database 3-house cluster untuk pemetaan titik timbulan sampah secara presisi.",
      "Membangun dashboard GIS interaktif berbasis Mapbox GL untuk monitoring armada operasional.",
    ],
    chips: ["TypeScript", "Node.js", "Mapbox GL", "WhatsApp Cloud API", "DVRP Engine"],
  },
  {
    idx: "03",
    period: "Jan — Mar 2025",
    title: "Co-Researcher (bersama Arya Bagus Pratama)",
    org: "SMAN 1 Giri Academic Research",
    context: "Studi Analisis Perilaku Siswa",
    location: "SMAN 1 Giri, Banyuwangi",
    points: [
      "Merancang kuesioner skala Likert terstruktur untuk mengukur faktor pemicu siswa meninggalkan kelas ke foodcourt.",
      "Mengumpulkan dan membersihkan dataset empiris kuantitatif dari 120+ responden siswa.",
      "Melakukan analisis deskriptif dan inferensial untuk menyusun laporan empiris komprehensif.",
      "Menyusun rekomendasi intervensi digital dan tata tertib sekolah berbasis data temuan lapangan.",
    ],
    chips: ["Data Analysis", "Likert Scale", "Questionnaire Design", "Statistical Modeling"],
  },
  {
    idx: "04",
    period: "Sep 2024 — Present",
    isCurrent: true,
    title: "Lead Designer & Class Secretary",
    org: "Arcanova XI-2 — SMAN 1 Giri Class Organization",
    context: "Brand Identity & Operational Administration",
    location: "SMAN 1 Giri, Banyuwangi",
    points: [
      "Memimpin perancangan identitas visual kelas berakar pada filosofi Yunani: 'gnosi ine dynami'.",
      "Mendesain tactical workshirt custom berbahan heavyweight cotton drill dengan saku ganda fungsional.",
      "Memproduksi emblem karangan daun salam (laurel wreath) dan patch bordir 'NO TURNING BACK'.",
      "Mengelola administrasi kelas, pendataan inventaris, absensi, dan kurasi instalasi Pohon Harapan.",
    ],
    chips: ["Vector Design", "Apparel Production", "Brand Identity", "Project Management"],
  },
  {
    idx: "05",
    period: "Apr — Mei 2025",
    title: "Director & Scriptwriter",
    org: "Kampung Bethek Documentary — News-Vlog",
    context: "Independent Video Production",
    location: "De Djawatan Corridor, Banyuwangi",
    points: [
      "Memproduksi news-vlog dokumenter 5 menit yang meliput dinamika ekosistem warung kuliner di Kampung Bethek.",
      "Menulis naskah narasi, menyusun storyboard terarah, dan merekam voiceover profil pedagang lokal.",
      "Menangani proses editing, sequencing, color grading, dan audio mastering pada Adobe Premiere Pro.",
    ],
    chips: ["Video Editing", "Scriptwriting", "Voiceover", "Premiere Pro", "Sound Design"],
  },
];

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-amber-500/15"
    >
      <SectionReveal>
        {/* Eyebrow ala Poggufanz (Warm Amber Telemetry) */}
        <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
          <span className="text-amber-500 font-bold">03</span>
          <span className="h-px w-6 bg-amber-500/40" />
          <span>Experience &amp; Timeline</span>
        </div>

        {/* Heading & Lede */}
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-sans text-[36px] sm:text-[48px] md:text-[56px] font-black tracking-[-0.03em] text-white leading-none">
              RESEARCH &amp; TIMELINE
            </h2>
            <p className="mt-4 max-w-[50ch] font-sans text-[14px] sm:text-[15px] leading-relaxed text-zinc-300">
              A chronology of real-world software deployments, national research competitions, and organizational leadership — newest first.
            </p>
          </div>

          <div className="font-mono text-[11px] text-zinc-300 rounded-full border border-amber-500/20 bg-amber-500/[0.04] px-4 py-2 self-start lg:self-auto">
            <span className="text-amber-400 font-bold">05</span> roles &amp; milestones documented
          </div>
        </div>
      </SectionReveal>

      {/* Timeline List */}
      <div className="mt-12 space-y-6">
        {ROLES.map((role, i) => (
          <SectionReveal key={role.idx} delay={i * 0.06}>
            <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#08090F]/85 p-6 sm:p-8 backdrop-blur-md hover:border-amber-500/30 hover:bg-[#0b0c14] transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
              {/* Header Row: Index, Status Pill, Period */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] font-bold text-amber-400">
                    {role.idx}
                  </span>
                  {role.isCurrent ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/[0.06] border border-amber-500/25 px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#fef08a]">
                      {/* Only the 6px live radar dot uses emerald-400 */}
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                      Current Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                      Completed Milestone
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
                  <Calendar className="h-3 w-3 text-amber-500/80" />
                  <span>{role.period}</span>
                </div>
              </div>

              {/* Title & Organization */}
              <div className="mt-5">
                <h3 className="font-sans text-[20px] sm:text-[24px] font-bold text-white tracking-tight group-hover:text-zinc-100 transition-colors">
                  {role.title}
                </h3>
                <p className="mt-1 font-sans text-[14px] sm:text-[15px] font-medium text-amber-400 flex flex-wrap items-center gap-2">
                  <span>{role.org}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="font-mono text-[11px] text-zinc-400">{role.context}</span>
                </p>
                <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
                  <MapPin className="h-3 w-3 text-amber-500/60" />
                  <span>{role.location}</span>
                </p>
              </div>

              {/* Key Bullet Achievements */}
              <ul className="mt-5 space-y-2 border-t border-white/5 pt-4">
                {role.points.map((pt, pIdx) => (
                  <li
                    key={pIdx}
                    className="flex items-start gap-2.5 font-sans text-[13.5px] leading-relaxed text-zinc-300"
                  >
                    <span className="text-amber-400 font-bold mt-0.5 select-none text-[12px]">
                      ↳
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              {/* Stack Chips */}
              <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                {role.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10.5px] text-zinc-300 group-hover:border-amber-500/30 group-hover:text-amber-200 transition-colors"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </article>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
}
