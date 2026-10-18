"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { soundManager, type SectionAudioId } from "@/lib/soundManager";

const SECTION_MAP: { id: string; audioId: SectionAudioId; label: string }[] = [
  { id: "contact", audioId: "contact", label: "CONTACT" },
  { id: "experience", audioId: "experience", label: "CHRONOLOGY" },
  { id: "about", audioId: "about", label: "TELEMETRY" },
  { id: "works", audioId: "tesseract", label: "TESSERACT" },
  { id: "top", audioId: "singularity", label: "SINGULARITY" },
];

export function AudioController() {
  const [isMuted, setIsMuted] = useState(false);
  const [activeSection, setActiveSection] =
    useState<SectionAudioId>("singularity");

  useEffect(() => {
    setIsMuted(soundManager.getMuted());
    setActiveSection(soundManager.getSection());
    const unsub = soundManager.subscribe((muted, section) => {
      setIsMuted(muted);
      if (section) setActiveSection(section);
    });
    return unsub;
  }, []);

  useEffect(() => {
    // 1. Unlock AudioContext on first user interaction (Autoplay Policy Compliance)
    const handleUnlock = () => {
      soundManager.unlock();
    };

    window.addEventListener("pointerdown", handleUnlock, { passive: true });
    window.addEventListener("touchstart", handleUnlock, { passive: true });
    window.addEventListener("keydown", handleUnlock, { passive: true });

    // 2. Section Detection + Section-Specific Scroll Sound Effect (Passive listener)
    // No mousemove or hover sounds on text! Sound only responds to section context & deliberate actions.
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let accumulatedDelta = 0;
    const SCROLL_STEP_PX = 220;

    const detectActiveSection = (): SectionAudioId => {
      const viewportCenter = window.innerHeight * 0.42;
      for (const item of SECTION_MAP) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter * 0.25) {
            return item.audioId;
          }
        }
      }
      return window.scrollY < 500 ? "singularity" : soundManager.getSection();
    };

    const handleScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const dy = Math.abs(currentY - lastScrollY);
      const dt = Math.max(1, now - lastScrollTime);

      // Check if user entered a different section and switch acoustic signature
      const detectedSection = detectActiveSection();
      if (detectedSection !== soundManager.getSection()) {
        soundManager.setActiveSection(detectedSection);
        accumulatedDelta = 0;
      } else {
        accumulatedDelta += dy;
        if (accumulatedDelta >= SCROLL_STEP_PX) {
          accumulatedDelta = accumulatedDelta % SCROLL_STEP_PX;
          const velocityRatio = Math.min(1, dy / dt / 2.5);
          soundManager.playSectionScrollStep(velocityRatio);
        }
      }

      lastScrollY = currentY;
      lastScrollTime = now;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 3. Deliberate Click / Tap Feedback on Buttons & Links only (Zero hover noise on text)
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const interactiveEl = target.closest('button, a, [role="button"]');
      if (interactiveEl) {
        soundManager.playClick();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointerdown", handleUnlock);
      window.removeEventListener("touchstart", handleUnlock);
      window.removeEventListener("keydown", handleUnlock);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  const sectionLabel =
    SECTION_MAP.find((s) => s.audioId === activeSection)?.label ??
    "SINGULARITY";

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <button
        type="button"
        onClick={() => soundManager.toggleMute()}
        aria-label={
          isMuted ? "Unmute spatial section audio" : "Mute spatial section audio"
        }
        aria-pressed={!isMuted}
        className="group flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-[#06070D]/90 px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-200 backdrop-blur-xl shadow-[0_0_25px_rgba(0,0,0,0.85)] hover:border-amber-400 hover:text-white active:scale-95 transition-all cursor-pointer touch-manipulation"
      >
        {isMuted ? (
          <VolumeX className="h-3.5 w-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
        ) : (
          <Volume2 className="h-3.5 w-3.5 text-amber-400" />
        )}

        {/* Animated Waveform Indicator Bars */}
        <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
          <span
            className={`w-[2px] rounded-full transition-all duration-300 ${
              isMuted
                ? "h-1 bg-zinc-600"
                : "h-2.5 bg-amber-400 animate-pulse"
            }`}
          />
          <span
            className={`w-[2px] rounded-full transition-all duration-300 ${
              isMuted
                ? "h-1 bg-zinc-600"
                : "h-3 bg-[#fef08a] animate-pulse [animation-delay:150ms]"
            }`}
          />
          <span
            className={`w-[2px] rounded-full transition-all duration-300 ${
              isMuted
                ? "h-1 bg-zinc-600"
                : "h-2 bg-amber-500 animate-pulse [animation-delay:300ms]"
            }`}
          />
        </span>

        <span className="hidden xs:inline">
          {isMuted ? "SFX OFF" : `SFX · ${sectionLabel}`}
        </span>
      </button>
    </div>
  );
}

