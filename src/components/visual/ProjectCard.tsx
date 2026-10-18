"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Play, Layers, ExternalLink, Activity, Radio, GitBranch } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Project } from "@/content/projects";

export function ProjectCard({
  project,
  index,
  onSelect,
  onMediaOpen,
  onLookbookOpen,
}: {
  project: Project;
  index: number;
  onSelect?: (p: Project) => void;
  onMediaOpen?: (p: Project) => void;
  onLookbookOpen?: (p: Project) => void;
}) {
  const isDoc = project.id === "kampung-bethek-doc" || project.id === "kampung-bethek";
  const isLookbook = project.id === "arcanova-branding" || Boolean(project.lookbook?.length);
  const isLive = project.id === "ijen-care";
  const isSmartNode = project.id === "smart-node-logistics";
  const isResearch = project.id === "student-behavior-research";

  // Color config for status dot
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-emerald-400";
    if (status.includes("Active") || status.includes("Live")) return "bg-emerald-400 shadow-[0_0_8px_#34d399]";
    if (status.includes("Research") || status.includes("Completed")) return "bg-cyan-400 shadow-[0_0_8px_#22d3ee]";
    if (status.includes("Stream") || status.includes("Published")) return "bg-amber-400 shadow-[0_0_8px_#fbbf24]";
    return "bg-violet-400 shadow-[0_0_8px_#a78bfa]";
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl h-full",
        "border border-white/10 bg-[#090a0f]/90 backdrop-blur-md",
        "hover:border-white/20 hover:bg-[#0c0d14]",
        "hover:shadow-[0_24px_50px_-15px_rgba(0,0,0,0.9)]",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
        "transition-all duration-300"
      )}
    >
      {/* 1. VISUAL HEADER / ROOM PREVIEW */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60 border-b border-white/10">
        {/* Case A: Image from public */}
        {project.image ? (
          <div className="relative h-full w-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover object-center filter brightness-[0.9] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent opacity-80" />
          </div>
        ) : isSmartNode ? (
          /* Case B: High-Tech GIS Routing & Cluster SVG Preview */
          <div className="relative h-full w-full bg-[#080a12] p-4 flex flex-col justify-between font-mono select-none overflow-hidden">
            {/* Background Map Grid */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Simulated GIS Vector Paths */}
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 40 120 Q 120 40 220 90 T 380 60 T 520 130"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <path
                d="M 60 70 L 180 130 L 320 80 L 460 140"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                opacity="0.7"
              />
              {/* Nodes */}
              <circle cx="180" cy="130" r="4" fill="#10b981" />
              <circle cx="320" cy="80" r="4" fill="#06b6d4" />
              <circle cx="460" cy="140" r="4" fill="#3b82f6" />
            </svg>

            {/* Top Telemetry Overlay */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="flex items-center gap-1.5 rounded bg-black/60 px-2 py-0.5 border border-white/10 text-emerald-400">
                <Radio className="h-3 w-3 animate-pulse" />
                DVRP ROUTING ENGINE
              </span>
              <span className="rounded bg-black/60 px-2 py-0.5 border border-white/10 text-cyan-400">
                WHATSAPP WEBHOOK SENSOR
              </span>
            </div>

            {/* Bottom Node Data Badge */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-400 bg-black/70 backdrop-blur-sm p-2 rounded-lg border border-white/10">
              <div>
                <span className="text-zinc-500">CLUSTER: </span>
                <span className="text-zinc-200">3-House Node Alpha</span>
              </div>
              <div>
                <span className="text-zinc-500">OPTIMIZATION: </span>
                <span className="text-emerald-400 font-bold">98.4% Efficiency</span>
              </div>
            </div>
          </div>
        ) : isResearch ? (
          /* Case C: Empirical Data Science Likert Spectrum Preview */
          <div className="relative h-full w-full bg-[#08090f] p-4 flex flex-col justify-between font-mono select-none overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            {/* Top Stat */}
            <div className="relative z-10 flex items-center justify-between text-[10px] text-zinc-400">
              <span className="rounded bg-black/60 px-2 py-0.5 border border-white/10 text-cyan-400 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                LIKERT SCALE METRIC (N=120)
              </span>
              <span className="rounded bg-black/60 px-2 py-0.5 border border-white/10 text-zinc-300">
                SMAN 1 GIRI ACADEMIC
              </span>
            </div>

            {/* Simulated Likert Histogram Bars */}
            <div className="relative z-10 grid grid-cols-5 gap-2 items-end h-20 px-4">
              {[
                { label: "STS", h: "25%", val: "8%" },
                { label: "TS", h: "40%", val: "14%" },
                { label: "N", h: "35%", val: "12%" },
                { label: "S", h: "85%", val: "42%" },
                { label: "SS", h: "55%", val: "24%" },
              ].map((bar) => (
                <div key={bar.label} className="flex flex-col items-center gap-1">
                  <span className="text-[9px] text-zinc-500">{bar.val}</span>
                  <div
                    style={{ height: bar.h }}
                    className="w-full rounded-t bg-gradient-to-t from-cyan-600/30 to-cyan-400 border-t border-cyan-300 transition-all duration-500 group-hover:brightness-125"
                  />
                  <span className="text-[9px] text-zinc-400">{bar.label}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 text-[9.5px] text-zinc-500 text-center">
              P-Value &lt; 0.05 · Descriptive &amp; Inferential Modeling
            </div>
          </div>
        ) : isDoc ? (
          /* Case D: Documentary Video Frame Preview */
          <div
            onClick={() => onMediaOpen?.(project)}
            className="relative h-full w-full bg-[#0a0a0c] flex flex-col items-center justify-center cursor-pointer group/video"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-black to-black opacity-80" />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 transition-transform duration-300 group-hover/video:scale-110 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                <Play className="h-5 w-5 fill-current translate-x-0.5" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">
                Play Documentary (5′26″)
              </span>
              <span className="font-mono text-[10px] text-zinc-500">
                De Djawatan · Kampung Bethek
              </span>
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full bg-zinc-900/50" />
        )}

        {/* Room Index Pill Overlays */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <span className="rounded-full bg-black/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white border border-white/15 backdrop-blur-md">
            Room 0{index + 1}
          </span>
          <span className="rounded-full bg-black/80 px-2.5 py-1 font-mono text-[10px] tracking-wider text-zinc-400 border border-white/10 backdrop-blur-md">
            {project.category}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-20">
          <span className="rounded-full bg-black/80 px-2.5 py-1 font-mono text-[10px] tracking-wider text-zinc-400 border border-white/10 backdrop-blur-md">
            {project.year}
          </span>
        </div>
      </div>

      {/* 2. CARD CONTENT / READOUT SPEC */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Status & Signal Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px]">
              <span className={cn("h-2 w-2 rounded-full", getStatusColor(project.status))} />
              <span className="text-zinc-200 font-medium">{project.status || "Completed"}</span>
            </div>
            {project.signal && (
              <span className="font-mono text-[10px] tracking-wide text-zinc-400">
                {project.signal}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => {
              if (isDoc && onMediaOpen) onMediaOpen(project);
              else if (isLookbook && onLookbookOpen) onLookbookOpen(project);
              else onSelect?.(project);
            }}
            className="mt-4 font-sans text-[20px] sm:text-[22px] font-bold leading-tight tracking-tight text-white hover:text-zinc-200 transition-colors cursor-pointer"
          >
            {project.title}
          </h3>

          {/* Context / Kicker */}
          {project.context && (
            <p className="mt-1 font-mono text-[10.5px] uppercase tracking-wider text-zinc-500">
              // {project.context}
            </p>
          )}

          {/* Technical Summary */}
          <p className="mt-2.5 font-sans text-[13.5px] leading-relaxed text-zinc-300">
            {project.description}
          </p>

          {/* Key Engineering Highlight */}
          <div className="mt-3.5 flex items-start gap-1.5 font-mono text-[11px] text-zinc-400">
            <span className="text-emerald-400 font-bold">↳</span>
            <span className="text-zinc-300">{project.highlight}</span>
          </div>

          {/* Mini Lookbook Artifact Thumbnails if Arcanova */}
          {isLookbook && project.lookbook && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {project.lookbook.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onLookbookOpen?.(project)}
                  className="group/thumb relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-black cursor-pointer"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="120px"
                    className="object-cover object-center filter brightness-[0.85] group-hover/thumb:scale-105 group-hover/thumb:brightness-100 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-1 left-1.5 right-1.5 truncate font-mono text-[9px] uppercase tracking-wider text-zinc-300">
                    {item.id}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Stack Chips */}
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[10.5px] leading-none tracking-wide text-zinc-300 hover:border-white/20 hover:bg-white/[0.06] transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 3. ACTION BUTTONS (POGGUFANZ STYLE) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <button
              id={`btn-${project.id}`}
              type="button"
              onClick={() => {
                if (isDoc && onMediaOpen) onMediaOpen(project);
                else if (isLookbook && onLookbookOpen) onLookbookOpen(project);
                else onSelect?.(project);
              }}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-white px-4 py-1.5 font-sans text-[12px] font-semibold text-black hover:bg-zinc-200 transition-colors cursor-pointer shadow-sm"
            >
              {isDoc ? (
                <>
                  <Play className="h-3 w-3 fill-current" />
                  <span>Watch Video</span>
                </>
              ) : isLookbook ? (
                <>
                  <Layers className="h-3 w-3" />
                  <span>Lookbook</span>
                </>
              ) : (
                <>
                  <span>Case Study</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>

            {project.codeUrl && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[38px] items-center gap-1 rounded-full border border-white/10 bg-transparent px-3 py-1.5 font-mono text-[11px] text-zinc-400 hover:border-white/20 hover:text-white transition-colors"
              >
                <GitBranch className="h-3 w-3" />
                <span>Code</span>
              </a>
            )}
          </div>

          <span className="font-mono text-[10px] text-zinc-600">
            ROOM_{String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
