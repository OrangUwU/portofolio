"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project, type ProjectCategory } from "@/content/projects";
import { FilterPills } from "@/components/interactive/FilterPills";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailDrawer } from "./ProjectDetailDrawer";
import { MediaModal } from "./MediaModal";
import { LookbookModal } from "./LookbookModal";
import { SectionReveal } from "./SectionReveal";

export function ProjectsSection() {
  const [active, setActive] = useState<ProjectCategory | "All">("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mediaProject, setMediaProject] = useState<Project | null>(null);
  const [lookbookProject, setLookbookProject] = useState<Project | null>(null);

  const filtered = useMemo(() => {
    if (active === "All") return projects;
    return projects.filter((p) => p.category === active);
  }, [active]);

  return (
    <section id="works" className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* 01 Works Section Header (Poggufanz Style) */}
      <SectionReveal>
        <div className="border-b border-white/10 pb-8">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
            <span className="text-emerald-400 font-bold">01</span>
            <span className="h-px w-6 bg-zinc-700" />
            <span>Selected work</span>
          </div>

          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-sans text-[36px] sm:text-[48px] md:text-[56px] font-black tracking-[-0.03em] text-white leading-none">
                SELECTED BUILDS &amp; RESEARCH
              </h2>
              <p className="mt-4 max-w-[50ch] font-sans text-[14px] sm:text-[15px] leading-relaxed text-zinc-300">
                Past the horizon, each build is a room in the lattice — engineered to solve concrete real-world challenges in geotourism mobility, spatial logistics, and empirical behavior.
              </p>
            </div>

            {/* Poggufanz Facts Table */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-3.5 backdrop-blur-md font-mono text-[11px]">
              <div>
                <span className="text-zinc-500 block text-[9.5px] uppercase tracking-wider">Rooms</span>
                <span className="text-white font-bold text-[14px]">{String(projects.length).padStart(2, "0")}</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-zinc-500 block text-[9.5px] uppercase tracking-wider">Span</span>
                <span className="text-zinc-300 font-medium">2026.02 <span className="text-zinc-600">→</span> 2024.09</span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-zinc-500 block text-[9.5px] uppercase tracking-wider">Status</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  All Systems Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>

      {/* Filter Pills */}
      <SectionReveal delay={0.08} className="mt-8">
        <FilterPills active={active} onChange={setActive} />
      </SectionReveal>

      {/* Bento Grid Rooms */}
      <div className="mt-8 grid gap-5 md:gap-6 grid-cols-1 md:grid-cols-12 auto-rows-fr">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, index) => {
            // Bento Spans for 5 projects
            const bentoSpans = [
              "lg:col-span-7 col-span-12", // Room 01: IJEN-CARE
              "lg:col-span-5 col-span-12", // Room 02: Smart-Node Logistics
              "lg:col-span-4 col-span-12 md:col-span-6", // Room 03: Student Behavior Research
              "lg:col-span-4 col-span-12 md:col-span-6", // Room 04: Kampung Bethek Doc
              "lg:col-span-4 col-span-12 md:col-span-12", // Room 05: Arcanova Branding
            ];
            const span = filtered.length === projects.length ? (bentoSpans[index] ?? "col-span-12 md:col-span-6") : "col-span-12 md:col-span-6";

            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full ${span}`}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  onSelect={setSelectedProject}
                  onMediaOpen={setMediaProject}
                  onLookbookOpen={setLookbookProject}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center font-mono text-[13px] text-zinc-500">
          Tidak ada proyek dalam kategori ini.
        </p>
      )}

      {/* Interactive Detail Drawer & Modals */}
      <ProjectDetailDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />
      <MediaModal
        isOpen={!!mediaProject}
        onClose={() => setMediaProject(null)}
        title={mediaProject?.title || ""}
        category={mediaProject ? `${mediaProject.category} — ${mediaProject.year}` : ""}
        videoUrl={mediaProject?.videoUrl}
        caption={mediaProject?.highlight}
      />
      <LookbookModal
        isOpen={!!lookbookProject}
        onClose={() => setLookbookProject(null)}
        project={lookbookProject}
      />
    </section>
  );
}
