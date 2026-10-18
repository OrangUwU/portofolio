"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

function formatJakartaTime(d: Date) {
  return d.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Jakarta",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function HudOverlay() {
  const [time, setTime] = useState<string>("--:--:--");
  const [depth, setDepth] = useState(0);
  const [soundOn, setSoundOn] = useState(false);

  // UTC+7 live clock
  useEffect(() => {
    const tick = () => setTime(formatJakartaTime(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Depth = scroll progress 000–999
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - window.innerHeight;
      if (max <= 0) {
        setDepth(0);
        return;
      }
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setDepth(Math.round(p * 999));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const depthLabel = String(depth).padStart(3, "0");

  return (
    <div
      aria-hidden={!soundOn}
      className="pointer-events-none fixed inset-0 z-40 hidden md:block"
    >
      {/* subtle outer frame */}
      <div className="absolute inset-0 border border-white/[0.06]" />

      {/* corner crosshairs — L brackets + amber + */}
      <span className="absolute left-5 top-5 font-mono text-[11px] leading-none text-amber-500/90">+</span>
      <span className="absolute right-5 top-5 font-mono text-[11px] leading-none text-amber-500/90">+</span>
      <span className="absolute bottom-5 left-5 font-mono text-[11px] leading-none text-amber-500/90">+</span>
      <span className="absolute bottom-5 right-5 font-mono text-[11px] leading-none text-amber-500/90">+</span>

      <div className="absolute left-5 top-5 h-6 w-6 border-l border-t border-white/15" />
      <div className="absolute right-5 top-5 h-6 w-6 border-r border-t border-white/15" />
      <div className="absolute bottom-5 left-5 h-6 w-6 border-b border-l border-white/15" />
      <div className="absolute bottom-5 right-5 h-6 w-6 border-b border-r border-white/15" />

      {/* top HUD bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-10 py-4">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]" aria-hidden />
            UTC+7 · Banyuwangi / East Java
          </span>
          <span className="hidden lg:inline text-zinc-500">—</span>
          <span className="tabular-nums text-zinc-200">{time}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10px] tracking-[0.14em] text-zinc-500 sm:inline">SYS.SOUND</span>
          <button
            type="button"
            onClick={() => setSoundOn((v) => !v)}
            aria-label={soundOn ? "Mute sound" : "Enable sound"}
            aria-pressed={soundOn}
            className="pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 backdrop-blur transition hover:border-amber-500/40 hover:text-amber-400"
          >
            {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* right depth rail — vertical */}
      <div className="absolute bottom-10 right-0 top-16 flex w-10 flex-col items-center justify-center gap-3 border-l border-white/[0.06] bg-[#050505]/30 backdrop-blur-[1px]">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500 [writing-mode:vertical-lr]">Depth</span>
        <span className="font-mono text-[11px] font-semibold tabular-nums tracking-[0.14em] text-amber-500 [writing-mode:vertical-lr]">
          {depthLabel}
        </span>
        <div className="h-24 w-px bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent" aria-hidden />
        <span className="font-mono text-[9px] tracking-[0.14em] text-zinc-600 [writing-mode:vertical-lr]">999 MAX</span>
      </div>

      {/* bottom micro label */}
      <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 items-center gap-2 pb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-600 md:flex">
        <span className="h-px w-6 bg-white/10" />
        POGGUFANZ · SCROLLYTELLING HUD · ROOM 01
        <span className="h-px w-6 bg-white/10" />
      </div>
    </div>
  );
}
