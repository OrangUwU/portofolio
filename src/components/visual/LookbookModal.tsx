"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles, Compass, ShieldCheck } from "lucide-react";
import type { Project, LookbookItem } from "@/content/projects";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
};

export function LookbookModal({ isOpen, onClose, project }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const items: LookbookItem[] = project?.lookbook || [];
  const activeItem = items[currentIndex] || null;

  // Reset to first slide when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => closeBtnRef.current?.focus(), 50);

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") handlePrev();
        if (e.key === "ArrowRight") handleNext();
      };
      document.addEventListener("keydown", onKeyDown);

      return () => {
        document.body.style.overflow = prev;
        document.removeEventListener("keydown", onKeyDown);
        clearTimeout(t);
      };
    }
  }, [isOpen, onClose, items.length]);

  const handlePrev = () => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (items.length <= 1) return;
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <AnimatePresence>
      {isOpen && project && items.length > 0 && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lookbook-modal-title"
        >
        {/* Backdrop */}
        <motion.button
          type="button"
          aria-label="Tutup lookbook"
          onClick={onClose}
          className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="relative flex max-h-[92vh] w-full max-w-[960px] flex-col overflow-hidden rounded-[26px] border border-zinc-800 bg-[#0E0E10] shadow-[0_28px_90px_rgba(0,0,0,0.95)] transform-gpu z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 bg-[#0E0E10]/95 px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-xl">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B30] shadow-[0_0_8px_rgba(255,59,48,0.7)]" aria-hidden />
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                  // {project.title} · Artifact Showcase
                </p>
              </div>
              <h2
                id="lookbook-modal-title"
                className="mt-1 font-sans text-[18px] sm:text-[22px] font-semibold tracking-tight text-white leading-tight"
              >
                Arcanova XI-2 Lookbook
              </h2>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Tutup modal lookbook"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-[#141416] text-zinc-400 transition-all duration-200 hover:border-zinc-600 hover:bg-white hover:text-black active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transform-gpu cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body: Scrollable Dual-Column Editorial Layout */}
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 items-start">
              {/* Left Column: Visual Showcase Frame */}
              <div className="flex flex-col gap-3">
                <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-zinc-800 bg-[#0A0A0B] shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
                  <AnimatePresence mode="wait">
                    {activeItem && (
                      <motion.div
                        key={activeItem.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative h-full w-full"
                      >
                        <Image
                          src={activeItem.image}
                          alt={activeItem.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 550px"
                          className="object-cover object-center filter contrast-[1.04] brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-[1.02] transform-gpu"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Top Badges */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3.5 sm:p-4 z-10">
                    <span className="rounded-full border border-white/15 bg-black/70 px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider text-zinc-200 backdrop-blur-md">
                      {activeItem?.category}
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/70 px-3 py-1 font-mono text-[10.5px] uppercase tracking-wider text-zinc-300 backdrop-blur-md">
                      {String(currentIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Prev/Next Overlay Buttons */}
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Artefak sebelumnya"
                    className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white hover:text-black active:scale-95 z-20 cursor-pointer shadow-lg"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Artefak berikutnya"
                    className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white hover:text-black active:scale-95 z-20 cursor-pointer shadow-lg"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Thumbnail Selector Strip */}
                <div className="grid grid-cols-3 gap-2.5">
                  {items.map((item, idx) => {
                    const isSelected = idx === currentIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`group relative flex flex-col overflow-hidden rounded-xl border p-1.5 text-left transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-white bg-[#1A1A1E] shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                            : "border-zinc-800/80 bg-[#121214] hover:border-zinc-700 hover:bg-[#161619]"
                        }`}
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-black">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="180px"
                            className="object-cover object-center filter brightness-[0.9] group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="mt-1.5 px-0.5">
                          <p className="truncate font-sans text-[11px] font-medium text-white">
                            {item.title}
                          </p>
                          <p className="font-mono text-[9.5px] uppercase tracking-wider text-zinc-500">
                            0{idx + 1} // {item.category.split(" ")[0]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Editorial Breakdown & Specs */}
              {activeItem && (
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                        Artifact 0{currentIndex + 1}
                      </span>
                      <span className="rounded bg-[#1A1A1E] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                        Verified Spec
                      </span>
                    </div>
                    <h3 className="mt-1 font-sans text-[22px] font-semibold text-white tracking-tight leading-snug">
                      {activeItem.title}
                    </h3>
                    <p className="mt-1 font-sans text-[13px] text-zinc-400">
                      {activeItem.subtitle}
                    </p>
                  </div>

                  {/* Specification Card */}
                  <div className="rounded-xl border border-zinc-800/80 bg-[#141416] p-4">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                      <Compass className="h-3.5 w-3.5 text-[#FF3B30]" />
                      Specification
                    </div>
                    <p className="mt-2 font-mono text-[12px] leading-relaxed text-zinc-300">
                      {activeItem.spec}
                    </p>
                  </div>

                  {/* Design & Narrative */}
                  <div className="rounded-xl border border-zinc-800/80 bg-[#141416] p-4">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#FF3B30]" />
                      Curatorial Context
                    </div>
                    <p className="mt-2 font-sans text-[13px] leading-relaxed text-zinc-300">
                      {activeItem.description}
                    </p>
                  </div>

                  {/* Philosophy Quote */}
                  {activeItem.philosophy && (
                    <div className="rounded-xl border border-white/10 bg-gradient-to-br from-[#18181C] to-[#121214] p-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white/90">
                        <Sparkles className="h-3.5 w-3.5 text-[#FF3B30]" />
                        Motto &amp; Slogan
                      </div>
                      <p className="mt-2 font-serif italic text-[13.5px] leading-relaxed text-zinc-200">
                        &ldquo;{activeItem.philosophy}&rdquo;
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                        <span className="font-mono text-[10.5px] uppercase tracking-wider text-zinc-500">
                          SMAN 1 Giri · Arcanova XI-2
                        </span>
                        <span className="font-mono text-[10.5px] text-[#FF3B30]">
                          gnosi ine dynami
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex items-center justify-between border-t border-zinc-800/80 bg-[#0E0E10]/95 px-5 py-3.5 sm:px-6 backdrop-blur-xl">
            <span className="font-mono text-[11px] text-zinc-500 hidden sm:inline-block">
              Navigasi: <kbd className="rounded border border-zinc-800 bg-[#141416] px-1.5 py-0.5 text-zinc-400">←</kbd> <kbd className="rounded border border-zinc-800 bg-[#141416] px-1.5 py-0.5 text-zinc-400">→</kbd> · Tutup: <kbd className="rounded border border-zinc-800 bg-[#141416] px-1.5 py-0.5 text-zinc-400">Esc</kbd>
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex min-h-[44px] flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-full border border-zinc-800 bg-[#141416] px-4 font-mono text-[12px] text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:bg-[#1A1A1E] hover:text-white active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex min-h-[44px] flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-full border border-zinc-800 bg-[#141416] px-4 font-mono text-[12px] text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:bg-[#1A1A1E] hover:text-white active:scale-95 cursor-pointer"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[44px] flex-1 sm:flex-initial items-center justify-center rounded-full border border-zinc-800 bg-[#141416] px-5 font-mono text-[12px] uppercase tracking-wider text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:bg-[#1A1A1E] hover:text-white active:scale-95 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
}
