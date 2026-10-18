"use client";

import { useEffect, useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { soundManager } from "@/lib/soundManager";

export function AudioController() {
  const [isMuted, setIsMuted] = useState(false);
  const lastHoveredElRef = useRef<Element | null>(null);

  useEffect(() => {
    setIsMuted(soundManager.getMuted());
    const unsub = soundManager.subscribe((muted) => {
      setIsMuted(muted);
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

    // 2. Dynamic Scroll Sound Effect (Step threshold ~110px + velocity ratio, passive listener)
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let accumulatedDelta = 0;
    const SCROLL_STEP_PX = 110;

    const handleScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const dy = Math.abs(currentY - lastScrollY);
      const dt = Math.max(1, now - lastScrollTime);

      accumulatedDelta += dy;
      lastScrollY = currentY;
      lastScrollTime = now;

      if (accumulatedDelta >= SCROLL_STEP_PX) {
        accumulatedDelta = accumulatedDelta % SCROLL_STEP_PX;
        const velocityRatio = Math.min(1, dy / dt / 2.5);
        soundManager.playScrollTick(velocityRatio);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // 3. Interactive Cursor / Hover Micro-Beep & Velocity Trail Audio (Passive listeners)
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastMouseTime = performance.now();

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      const dt = now - lastMouseTime;
      if (dt > 16) {
        const dist = Math.hypot(e.clientX - lastMouseX, e.clientY - lastMouseY);
        const speed = dist / dt; // px per ms
        if (speed > 2.1) {
          soundManager.playCursorTrailPulse(speed);
        }
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        lastMouseTime = now;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'button, a, [role="button"], [data-sfx]'
      );

      if (interactiveEl && interactiveEl !== lastHoveredElRef.current) {
        lastHoveredElRef.current = interactiveEl;
        const sfxAttr = interactiveEl.getAttribute("data-sfx");
        if (sfxAttr === "badge") {
          soundManager.playHoverTick("badge");
        } else if (sfxAttr === "card") {
          soundManager.playHoverTick("card");
        } else if (interactiveEl.tagName === "A") {
          soundManager.playHoverTick("link");
        } else {
          soundManager.playHoverTick("button");
        }
      } else if (!interactiveEl) {
        lastHoveredElRef.current = null;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const interactiveEl = target.closest('button, a, [role="button"]');
      if (interactiveEl) {
        soundManager.playClick();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointerdown", handleUnlock);
      window.removeEventListener("touchstart", handleUnlock);
      window.removeEventListener("keydown", handleUnlock);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <button
        type="button"
        onClick={() => soundManager.toggleMute()}
        aria-label={
          isMuted ? "Unmute interactive sound effects" : "Mute sound effects"
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
        <span
          className="flex items-end gap-[2px] h-3"
          aria-hidden="true"
        >
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
          {isMuted ? "SFX OFF" : "SFX ON"}
        </span>
      </button>
    </div>
  );
}
