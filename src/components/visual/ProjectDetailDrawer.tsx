"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight, CheckCircle2, QrCode } from "lucide-react";
import type { Project } from "@/content/projects";

export function ProjectDetailDrawer({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => btnRef.current?.focus(), 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      clearTimeout(timer);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
        >
          {/* Backdrop with cinematic blur */}
          <motion.button
            type="button"
            aria-label="Tutup modal detail"
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Drawer panel with 60fps spring */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="relative flex h-[100dvh] w-full max-w-full sm:max-w-[600px] lg:max-w-[660px] flex-col overflow-hidden border-l border-amber-500/20 bg-[#07080D] shadow-[-24px_0_80px_rgba(0,0,0,0.9)] transform-gpu"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-white/10 bg-[#07080D]/90 px-6 py-5 backdrop-blur-xl">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-amber-400">
                    {project.category} — {project.year}
                  </span>
                  {(project.id === "ijen-care" ||
                    project.id === "smart-node-logistics") && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-[#fef08a]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {project.id === "smart-node-logistics"
                        ? "LIVE SYNC"
                        : "LIVE CASE"}
                    </span>
                  )}
                </div>
                <h2
                  id="drawer-title"
                  className="mt-1.5 font-sans text-[24px] font-semibold leading-tight tracking-tight text-white sm:text-[28px]"
                >
                  {project.title}
                </h2>
                <p className="mt-1 font-sans text-[13.5px] leading-snug text-zinc-400">
                  {project.summary}
                </p>
              </div>

              <button
                ref={btnRef}
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-400 transition-all duration-200 hover:border-amber-400 hover:bg-amber-500 hover:text-black active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transform-gpu cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto px-6 py-7 space-y-7 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {/* Visual Preview Banner (If Project Image Exists) */}
              {project.image && (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-amber-500/25 bg-black shadow-[0_0_35px_rgba(245,158,11,0.12)]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 620px"
                    className="object-cover object-center"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-300">
                    <span className="rounded-md bg-black/75 border border-white/10 px-2.5 py-1 backdrop-blur-md text-amber-300">
                      INTERFACE TELEMETRY // {project.context}
                    </span>
                  </div>
                </div>
              )}

              {/* Role & Timeline Meta Card */}
              {project.caseStudy && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                      Peran / Role
                    </p>
                    <p className="mt-1 font-sans text-[13.5px] font-medium text-zinc-200">
                      {project.caseStudy.role}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                      Linimasa / Timeline
                    </p>
                    <p className="mt-1 font-mono text-[12px] tracking-wide text-amber-300">
                      {project.caseStudy.timeline}
                    </p>
                  </div>
                </div>
              )}

              {/* 01. Overview */}
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-400/90">
                  // 01. Overview
                </p>
                <p className="mt-2.5 font-sans text-[14px] leading-relaxed text-zinc-300">
                  {project.description}
                </p>
                <div className="mt-3.5 flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] px-4 py-3">
                  <span className="font-mono text-[12px] text-amber-400 font-bold">
                    ↳
                  </span>
                  <p className="font-mono text-[11.5px] tracking-wide text-[#fef08a]">
                    {project.highlight}
                  </p>
                </div>
              </div>

              {/* 02. Problem & 03. Solution */}
              {project.caseStudy && (
                <>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-400/90">
                      // 02. Tantangan &amp; Masalah
                    </p>
                    <p className="mt-2.5 font-sans text-[14px] leading-relaxed text-zinc-300">
                      {project.caseStudy.problem}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-400/90">
                      // 03. Solusi &amp; Pendekatan
                    </p>
                    <p className="mt-2.5 font-sans text-[14px] leading-relaxed text-zinc-300">
                      {project.caseStudy.solution}
                    </p>
                  </div>

                  {/* End-to-End Operational Workflow Steps (e.g., Smart-Node Logistics QR -> WA -> VPS -> DVRP) */}
                  {project.caseStudy.workflowSteps &&
                    project.caseStudy.workflowSteps.length > 0 && (
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-400 flex items-center gap-2">
                          <QrCode className="h-3.5 w-3.5 text-amber-400" />
                          <span>// Alur Operasional Sistem (End-to-End Pipeline)</span>
                        </p>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {project.caseStudy.workflowSteps.map((wf) => (
                            <div
                              key={wf.step}
                              className="rounded-xl border border-amber-500/20 bg-white/[0.02] p-3.5 hover:border-amber-500/40 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="inline-flex h-5 w-6 items-center justify-center rounded bg-amber-500/15 font-mono text-[10px] font-bold text-amber-400 border border-amber-500/30">
                                  {wf.step}
                                </span>
                                <span className="font-sans text-[13px] font-semibold text-white">
                                  {wf.title}
                                </span>
                              </div>
                              <p className="mt-2 font-sans text-[12.5px] leading-relaxed text-zinc-400">
                                {wf.desc}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 04. Metrics & Impact */}
                  {project.caseStudy.metrics &&
                    project.caseStudy.metrics.length > 0 && (
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-400/90">
                          // 04. Metrik &amp; Dampak
                        </p>
                        <div className="mt-3 grid gap-2">
                          {project.caseStudy.metrics.map((metric) => (
                            <div
                              key={metric}
                              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition-colors hover:border-amber-500/30"
                            >
                              <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                              <span className="font-mono text-[12px] tracking-wide text-zinc-200">
                                {metric}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 05. Deliverables */}
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-400/90">
                      // 05. Hasil Deliverables
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.caseStudy.deliverables.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] text-zinc-300 hover:border-amber-500/35 transition-colors"
                        >
                          <CheckCircle2 className="h-3 w-3 text-amber-400" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 06. Tech Stack & Tools */}
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-400/90">
                  // 06. Tech Stack &amp; Tools
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      data-sfx="badge"
                      className="rounded-full border border-amber-500/20 bg-amber-500/[0.05] px-3 py-1 font-mono text-[11px] tracking-wide text-amber-200 hover:border-amber-400 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 z-20 border-t border-white/10 bg-[#07080D]/95 px-6 py-4 backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[42px] rounded-full border border-white/15 bg-white/[0.04] px-5 font-mono text-[11.5px] uppercase tracking-wider text-zinc-300 transition-all duration-200 hover:border-amber-400/50 hover:bg-white/[0.08] hover:text-white active:scale-[0.98] transform-gpu cursor-pointer"
                >
                  Close
                </button>

                {project.codeUrl && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-full border border-amber-500/35 bg-amber-500/10 px-4 font-mono text-[11.5px] font-semibold text-amber-300 transition-all duration-200 hover:border-amber-400 hover:bg-amber-500/20 hover:text-white active:scale-[0.98]"
                  >
                    <span>GitHub Repo</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                )}

                <a
                  href={
                    project.caseStudy?.externalUrl ||
                    project.codeUrl ||
                    project.links?.[0]?.href ||
                    "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 text-[12.5px] font-semibold text-black transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98] transform-gpu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <span>Explore</span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-black transition-transform duration-300 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]">
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </a>

                <span className="hidden sm:inline font-mono text-[10px] uppercase text-zinc-500 whitespace-nowrap pl-1">
                  Esc
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
