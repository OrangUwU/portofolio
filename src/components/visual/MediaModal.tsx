"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Film, Sparkles } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  videoUrl?: string;
  caption?: string;
};

export function MediaModal({ isOpen, onClose, title, category, videoUrl, caption }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => btnRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-title"
        >
          {/* Backdrop with cinematic blur */}
          <motion.button
            id="close-media-backdrop-btn"
            type="button"
            aria-label="Tutup pemutar media"
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="relative flex max-h-[92vh] w-full max-w-[840px] flex-col overflow-hidden rounded-[24px] border border-zinc-800 bg-[#0E0E10] shadow-[0_24px_80px_rgba(0,0,0,0.95)] transform-gpu z-10"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800/80 bg-[#0E0E10]/95 px-5 py-4 sm:px-6 sm:py-5 backdrop-blur-xl">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF3B30] shadow-[0_0_8px_rgba(255,59,48,0.7)]" aria-hidden />
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                    // {category || "Film & Documentary"}
                  </p>
                </div>
                <h2
                  id="media-title"
                  className="mt-1 font-sans text-[18px] sm:text-[22px] font-semibold tracking-tight text-white leading-tight"
                >
                  {title}
                </h2>
              </div>
              <button
                id="close-media-modal-btn"
                ref={btnRef}
                type="button"
                onClick={onClose}
                aria-label="Tutup modal"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-[#141416] text-zinc-400 transition-all duration-200 hover:border-zinc-600 hover:bg-white hover:text-black active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transform-gpu cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* 16:9 Video Player Frame */}
              <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800/90 bg-black shadow-[0_12px_40px_rgba(0,0,0,0.9)]">
                {videoUrl ? (
                  videoUrl.includes("youtube") || videoUrl.includes("youtu.be") || videoUrl.includes("vimeo") ? (
                    <iframe
                      src={videoUrl}
                      title={title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={videoUrl} controls className="h-full w-full object-contain" playsInline />
                  )
                ) : (
                  <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center overflow-hidden">
                    {/* Background subtle radial texture */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                      aria-hidden
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
                      aria-hidden
                    />

                    {/* Play Badge Icon */}
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md shadow-[0_0_35px_rgba(255,255,255,0.15)] transition-transform duration-300 hover:scale-105">
                        <Play className="h-7 w-7 translate-x-0.5 fill-white text-white" />
                      </div>

                      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-[#141416]/90 px-3.5 py-1 backdrop-blur-sm">
                        <Film className="h-3.5 w-3.5 text-[#FF3B30]" />
                        <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">
                          5′ Short News-Vlog · Kampung Bethek
                        </span>
                      </div>

                      <p className="mt-1 max-w-[42ch] font-sans text-[13px] leading-relaxed text-zinc-400">
                        Dokumenter ekosistem warung kuliner di sekitar De Djawatan. Workflow: scriptwriting, voiceover lapangan, &amp; editing Premiere Pro.
                      </p>
                    </div>

                    <div className="absolute bottom-3 inset-x-0 z-10 flex justify-center">
                      <span className="font-mono text-[10.5px] text-zinc-500">
                        Siap dihubungkan ke embed YouTube atau file MP4.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Editorial Metadata Strip */}
              <div className="mt-5 rounded-xl border border-zinc-800/80 bg-[#141416]/80 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#FF3B30]" /> Production Highlights
                  </span>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300">
                    5′ Format
                  </span>
                </div>
                {caption && (
                  <p className="mt-2 font-mono text-[12px] leading-relaxed text-zinc-300">
                    ↳ {caption}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {["Scriptwriting", "Voiceover", "Premiere Pro", "Sound Design", "Field Interview"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-zinc-800 bg-[#0A0A0B] px-2.5 py-0.5 font-mono text-[10.5px] text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="flex items-center justify-between border-t border-zinc-800/80 bg-[#0E0E10]/95 px-5 py-3.5 sm:px-6 backdrop-blur-xl">
              <span className="font-mono text-[11px] text-zinc-500 hidden sm:inline-block">
                Tekan <kbd className="rounded border border-zinc-800 bg-[#141416] px-1.5 py-0.5 text-zinc-400">Esc</kbd> untuk menutup
              </span>
              <button
                id="footer-close-media-modal-btn"
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[44px] w-full sm:w-auto items-center justify-center rounded-full border border-zinc-800 bg-[#141416] px-6 font-mono text-[12px] uppercase tracking-wider text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:bg-[#1A1A1E] hover:text-white active:scale-[0.98] cursor-pointer"
              >
                Tutup Media
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

