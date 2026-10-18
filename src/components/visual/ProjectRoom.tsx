"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Github,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Compass,
  Radio,
  Sparkles,
} from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { ProjectDetailDrawer } from "./ProjectDetailDrawer";
import { MediaModal } from "./MediaModal";
import { LookbookModal } from "./LookbookModal";

// Sci-fi quote & timeline metadata per project room (Poggufanz & Interstellar 5D Tesseract spec)
const roomMeta = [
  {
    tickDate: "2026.02",
    shortName: "IJEN-CARE",
    dimensionCoord: "T-01 // 08°03'S 114°14'E",
    gravityFreq: "42.8 Hz",
    quote1: "Past the sulfur horizon,",
    quote2: "mobility becomes a coordinate in the dark.",
  },
  {
    tickDate: "2025.10",
    shortName: "Smart-Node",
    dimensionCoord: "T-02 // DVRP LATTICE",
    gravityFreq: "38.4 Hz",
    quote1: "Human-as-a-Sensor.",
    quote2: "Every route optimized before the signal fades.",
  },
  {
    tickDate: "2025.03",
    shortName: "Behavior Res.",
    dimensionCoord: "T-03 // EMPIRICAL AXIS",
    gravityFreq: "29.1 Hz",
    quote1: "Patterns emerge in unmapped corridors.",
    quote2: "Data reveals what bells cannot contain.",
  },
  {
    tickDate: "2025.05",
    shortName: "Kampung Bethek",
    dimensionCoord: "T-04 // DJAWATAN FRAME",
    gravityFreq: "24.0 fps",
    quote1: "Five minutes of lived reality",
    quote2: "in the corridor of De Djawatan.",
  },
  {
    tickDate: "2024.09",
    shortName: "Arcanova",
    dimensionCoord: "T-05 // XI-2 INSIGNIA",
    gravityFreq: "19.6 Hz",
    quote1: "gnosi ine dynami.",
    quote2: "Wearable pride — NO TURNING BACK.",
  },
];

// Procedural bookcase shelf verticals for the 5D Tesseract backdrop
const BOOKCASE_RIBS = Array.from({ length: 28 }, (_, i) => i);
const BOOKCASE_TIERS = Array.from({ length: 7 }, (_, i) => i);

export function ProjectRoom() {
  const [active, setActive] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mediaProject, setMediaProject] = useState<Project | null>(null);
  const [lookbookProject, setLookbookProject] = useState<Project | null>(null);

  // 3D Mouse Gyro Parallax & Hover Cursor state with hardware-accelerated springs
  const windowRef = useRef<HTMLDivElement>(null);
  const [isHoveringWindow, setIsHoveringWindow] = useState(false);

  const mouseNormX = useMotionValue(0);
  const mouseNormY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springNormX = useSpring(mouseNormX, {
    stiffness: 220,
    damping: 25,
    mass: 0.6,
  });
  const springNormY = useSpring(mouseNormY, {
    stiffness: 220,
    damping: 25,
    mass: 0.6,
  });

  const smoothCursorX = useSpring(cursorX, {
    stiffness: 460,
    damping: 28,
    mass: 0.45,
  });
  const smoothCursorY = useSpring(cursorY, {
    stiffness: 460,
    damping: 28,
    mass: 0.45,
  });

  // 3D Monitor Gyro Tilt
  const monitorRotateX = useTransform(springNormY, [-1, 1], [11, -11]);
  const monitorRotateY = useTransform(springNormX, [-1, 1], [-14, 14]);

  // Counter-parallax for the deep 5D Bookcase Lattice behind the monitor
  const latticeShiftX = useTransform(springNormX, [-1, 1], [18, -18]);
  const latticeShiftY = useTransform(springNormY, [-1, 1], [12, -12]);

  // Dynamic specular reflection across CRT screen
  const glareX = useTransform(springNormX, [-1, 1], ["15%", "85%"]);
  const glareY = useTransform(springNormY, [-1, 1], ["15%", "85%"]);

  const total = projects.length;
  const p = projects[active];
  const meta = roomMeta[active] || roomMeta[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nx = (x / rect.width) * 2 - 1;
    const ny = (y / rect.height) * 2 - 1;

    mouseNormX.set(nx);
    mouseNormY.set(ny);
    cursorX.set(x - 30);
    cursorY.set(y - 30);
  };

  const handleMouseLeave = () => {
    mouseNormX.set(0);
    mouseNormY.set(0);
    setIsHoveringWindow(false);
  };

  // Keyboard navigation: ArrowLeft & ArrowRight to scrub rooms
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName) ||
        selectedProject !== null ||
        mediaProject !== null ||
        lookbookProject !== null
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActive((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActive((prev) => Math.min(total - 1, prev + 1));
      }
    },
    [total, selectedProject, mediaProject, lookbookProject]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const goToPrev = () => setActive((prev) => Math.max(0, prev - 1));
  const goToNext = () => setActive((prev) => Math.min(total - 1, prev + 1));

  // Primary action button handler (Enter room)
  const handleEnterRoom = () => {
    if (p.caseStudy) {
      setSelectedProject(p);
    } else if (p.lookbook && p.lookbook.length > 0) {
      setLookbookProject(p);
    } else if (p.videoUrl) {
      setMediaProject(p);
    } else if (p.demoUrl && p.demoUrl !== "#") {
      window.open(p.demoUrl, "_blank", "noopener,noreferrer");
    } else if (p.codeUrl) {
      window.open(p.codeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      id="works"
      role="region"
      aria-label="Inside the Tesseract — Project Room Terminal"
      className="relative border-t border-amber-500/15 bg-[#030409] pt-14 pb-20 sm:pt-20 sm:pb-28 overflow-x-hidden"
    >
      {/* Top Event Horizon Golden Light Bridge (Connects seamlessly from HeroSingularity) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-amber-500/[0.1] via-amber-500/[0.02] to-transparent"
        aria-hidden="true"
      />

      {/* Sci-Fi Background Starfield & Subtle Cosmic Copper Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.45) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden="true"
      />

      {/* Ambient 5D Chamber Depth Glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/5 h-[540px] w-[540px] rounded-full bg-amber-500/[0.05] blur-[150px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[620px] w-[620px] rounded-full bg-amber-600/[0.04] blur-[160px]" />

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 relative z-10">
        {/* =========================================================================
            HEADER: INSIDE THE TESSERACT (POGGUFANZ & INTERSTELLAR SPEC)
           ========================================================================= */}
        <div className="border-b border-white/10 pb-8 sm:pb-10">
          <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <span className="text-amber-500 font-bold">01</span>
            <span className="h-px w-6 bg-amber-500/40" />
            <span>Selected Work · 5D Temporal Lattice</span>
          </div>

          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-sans text-[36px] sm:text-[52px] md:text-[68px] font-black tracking-[-0.03em] text-white leading-none">
                INSIDE THE <span className="text-amber-500">TESSERACT</span>
              </h2>
              <p className="mt-4 max-w-[46ch] font-sans text-[14px] sm:text-[15px] leading-relaxed text-zinc-300">
                Past the horizon, time is a direction you can walk. Every project is a room in the lattice, lit at the moment it was built.
              </p>
            </div>

            {/* Poggufanz Works Facts Counter */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 rounded-2xl border border-amber-500/25 bg-[#08090F]/90 px-5 py-3.5 backdrop-blur-md font-mono text-[11px] shadow-[0_0_25px_rgba(245,158,11,0.1)]">
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">
                  Rooms
                </span>
                <span className="text-amber-400 font-bold text-[15px] tracking-wider">
                  0{total}
                </span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">
                  Span
                </span>
                <span className="text-zinc-200 font-medium">
                  {roomMeta[0].tickDate}{" "}
                  <span className="text-amber-500/70">→</span>{" "}
                  {roomMeta[total - 1].tickDate}
                </span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">
                  Direction
                </span>
                <span className="text-amber-400 font-medium flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
                  </span>
                  Scrub to travel back
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MAIN STAGE: 5D TESSERACT BOOKCASE ROOM (LEFT) + TYPOGRAPHIC READOUT (RIGHT)
           ========================================================================= */}
        <div className="mt-10 sm:mt-12 grid gap-8 lg:grid-cols-[1.68fr_1fr] items-center">
          {/* 5D Tesseract Bookcase Chamber Container */}
          <div className="relative" style={{ perspective: "1400px" }}>
            <div className="relative rounded-[26px] border border-amber-500/25 bg-[#05060A] p-4 sm:p-6 md:p-7 shadow-[0_0_70px_rgba(0,0,0,0.9),inset_0_0_60px_rgba(245,158,11,0.06)] overflow-hidden">
              {/* =================================================================
                  1. 3D COPPER/AMBER WIREFRAME LATTICE & VANISHING CORRIDOR
                 ================================================================= */}
              <motion.div
                style={{
                  x: latticeShiftX,
                  y: latticeShiftY,
                }}
                className="pointer-events-none absolute inset-0 z-0 will-change-transform transform-gpu"
                aria-hidden="true"
              >
                {/* Vanishing Point Perspective Copper Lattice SVG */}
                <svg
                  viewBox="0 0 800 520"
                  preserveAspectRatio="none"
                  className="h-full w-full opacity-55"
                >
                  <defs>
                    <linearGradient id="copperBeamH" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.55" />
                      <stop offset="25%" stopColor="#d97706" stopOpacity="0.22" />
                      <stop offset="50%" stopColor="#fef08a" stopOpacity="0.08" />
                      <stop offset="75%" stopColor="#d97706" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.55" />
                    </linearGradient>
                    <linearGradient id="copperBeamV" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.65" />
                      <stop offset="50%" stopColor="#b45309" stopOpacity="0.18" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.65" />
                    </linearGradient>
                    <radialGradient id="vanishingCore" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.22" />
                      <stop offset="60%" stopColor="#b45309" stopOpacity="0.06" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Deep Vanishing Chamber Core Glow */}
                  <ellipse cx="400" cy="260" rx="320" ry="200" fill="url(#vanishingCore)" />

                  {/* Perspective Diagonal Corner Struts Converging to Central Vanishing Point (400, 260) */}
                  <g stroke="url(#copperBeamH)" strokeWidth="1.2">
                    <line x1="0" y1="0" x2="400" y2="260" />
                    <line x1="800" y1="0" x2="400" y2="260" />
                    <line x1="0" y1="520" x2="400" y2="260" />
                    <line x1="800" y1="520" x2="400" y2="260" />
                    {/* Intermediate 5D Hypercube Perspective Rays */}
                    <line x1="200" y1="0" x2="400" y2="260" strokeOpacity="0.45" />
                    <line x1="600" y1="0" x2="400" y2="260" strokeOpacity="0.45" />
                    <line x1="200" y1="520" x2="400" y2="260" strokeOpacity="0.45" />
                    <line x1="600" y1="520" x2="400" y2="260" strokeOpacity="0.45" />
                    <line x1="0" y1="130" x2="400" y2="260" strokeOpacity="0.45" />
                    <line x1="800" y1="130" x2="400" y2="260" strokeOpacity="0.45" />
                    <line x1="0" y1="390" x2="400" y2="260" strokeOpacity="0.45" />
                    <line x1="800" y1="390" x2="400" y2="260" strokeOpacity="0.45" />
                  </g>

                  {/* Concentric Receding 3D Tesseract Depth Frames */}
                  {[0.12, 0.24, 0.36, 0.48, 0.62, 0.76].map((scale, idx) => {
                    const w = 800 * (1 - scale);
                    const h = 520 * (1 - scale);
                    const x = (800 - w) / 2;
                    const y = (520 - h) / 2;
                    return (
                      <rect
                        key={idx}
                        x={x}
                        y={y}
                        width={w}
                        height={h}
                        rx={8}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth={idx % 2 === 0 ? "1.1" : "0.6"}
                        strokeOpacity={0.34 - idx * 0.04}
                      />
                    );
                  })}
                </svg>

                {/* =================================================================
                    2. PROCEDURAL ENDLESS BOOKCASE WALL RIBS (MURPHY'S 5D LIBRARY)
                   ================================================================= */}
                <div className="absolute inset-3 sm:inset-4 flex flex-col justify-between opacity-45">
                  {BOOKCASE_TIERS.map((tier) => (
                    <div
                      key={tier}
                      className="relative flex-1 border-b border-amber-500/20 flex items-stretch justify-between px-2"
                    >
                      {/* Horizontal glowing copper shelf ledge */}
                      <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-amber-500/40 via-amber-300/20 to-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.35)]" />

                      {/* Vertical Bookcase Ribs & Time Strands */}
                      {BOOKCASE_RIBS.map((rib) => {
                        const isHighlightRib = (rib + tier * 3) % 5 === 0;
                        const isGoldenStrand = (rib + active * 2) % 7 === 0;
                        return (
                          <div
                            key={rib}
                            className={`h-full transition-opacity duration-500 ${
                              isGoldenStrand
                                ? "w-[1.5px] bg-amber-300/60 shadow-[0_0_8px_#fef08a] animate-tesseract-pulse"
                                : isHighlightRib
                                ? "w-px bg-amber-500/35"
                                : "w-px bg-amber-500/15"
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* =================================================================
                  3. GOLDEN VERTICAL LIGHT COLUMNS (SEPARATING TIME DIMENSIONS)
                 ================================================================= */}
              {/* Left Temporal Pillar */}
              <div
                className="pointer-events-none absolute left-3 sm:left-4 top-0 bottom-0 w-10 bg-gradient-to-r from-amber-500/22 via-amber-400/5 to-transparent z-10"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute left-3 sm:left-4 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-amber-400/20 via-amber-300/70 to-amber-400/20 shadow-[0_0_15px_#f59e0b] z-10"
                aria-hidden="true"
              />
              {/* Right Temporal Pillar */}
              <div
                className="pointer-events-none absolute right-3 sm:right-4 top-0 bottom-0 w-10 bg-gradient-to-l from-amber-500/25 via-amber-400/5 to-transparent z-10"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute right-3 sm:right-4 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-amber-400/20 via-amber-300/75 to-amber-400/20 shadow-[0_0_15px_#f59e0b] z-10"
                aria-hidden="true"
              />

              {/* Top Chamber Telemetry Bar */}
              <div className="relative z-20 flex items-center justify-between pb-3.5 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                <span className="flex items-center gap-2 text-amber-300/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
                  ROOM 0{active + 1} &nbsp;//&nbsp; {p.category.toUpperCase()}
                </span>
                <span className="hidden sm:inline-flex items-center gap-2 text-zinc-400">
                  <span>{meta.dimensionCoord}</span>
                  <span className="text-amber-500/50">·</span>
                  <span className="text-amber-400/90">LATTICE [0{active + 1}:0{total}]</span>
                </span>
              </div>

              {/* =================================================================
                  4. 3D FLOATING CRT / HOLOGRAM MONITOR (WITH GYRO TILT & ENTER BUBBLE)
                 ================================================================= */}
              <motion.div
                ref={windowRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHoveringWindow(true)}
                onMouseLeave={handleMouseLeave}
                onClick={handleEnterRoom}
                tabIndex={0}
                role="button"
                aria-label={`Explore ${p.title} (Click to enter)`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleEnterRoom();
                  }
                }}
                style={{
                  rotateX: monitorRotateX,
                  rotateY: monitorRotateY,
                  transformStyle: "preserve-3d",
                }}
                className="group relative z-20 aspect-[16/10] sm:aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-[20px] border-2 border-amber-500/45 bg-[#05060B] shadow-[0_0_50px_rgba(245,158,11,0.25),inset_0_0_32px_rgba(245,158,11,0.12)] transition-[border-color,box-shadow] duration-500 hover:border-amber-300/80 hover:shadow-[0_0_75px_rgba(245,158,11,0.42),inset_0_0_40px_rgba(245,158,11,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 will-change-transform transform-gpu"
              >
                {/* Inner Hardware CRT Bezel Frame */}
                <div
                  className="pointer-events-none absolute inset-[5px] rounded-[15px] border border-amber-400/20 z-30"
                  aria-hidden="true"
                />

                {/* Dynamic Phosphor Scanlines Overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.12] z-20 animate-scanlines"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(254, 240, 138, 0.22) 1px, transparent 1px)",
                    backgroundSize: "100% 3px",
                  }}
                  aria-hidden="true"
                />

                {/* Dynamic Specular CRT Glass Glare */}
                <motion.div
                  className="pointer-events-none absolute -inset-20 opacity-25 group-hover:opacity-40 transition-opacity duration-300 z-20"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(254, 240, 138, 0.22) 0%, transparent 55%)",
                    left: glareX,
                    top: glareY,
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-hidden="true"
                />

                {/* Hardware Corner Bolts (+) */}
                <span className="absolute left-3.5 top-3 font-mono text-[11px] font-bold leading-none text-amber-400/90 z-30 select-none drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">
                  +
                </span>
                <span className="absolute right-3.5 top-3 font-mono text-[11px] font-bold leading-none text-amber-400/90 z-30 select-none drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">
                  +
                </span>
                <span className="absolute bottom-3 left-3.5 font-mono text-[11px] font-bold leading-none text-amber-400/90 z-30 select-none drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">
                  +
                </span>
                <span className="absolute bottom-3 right-3.5 font-mono text-[11px] font-bold leading-none text-amber-400/90 z-30 select-none drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]">
                  +
                </span>

                {/* Animated Room Window Inner Feed */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.94, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
                    transition={{
                      type: "spring",
                      stiffness: 360,
                      damping: 30,
                      mass: 0.8,
                    }}
                    className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8 transform-gpu z-10"
                  >
                    {/* Background Visual: Project Image or 5D Bookcase Hologram Matrix */}
                    {p.image ? (
                      <div className="absolute inset-0">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 800px"
                          className="object-cover object-center filter brightness-[0.68] contrast-[1.18] transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/50 to-black/35" />
                        <div className="absolute inset-0 bg-amber-500/[0.08] mix-blend-color-dodge pointer-events-none" />
                      </div>
                    ) : (
                      /* Procedural 5D Holographic Bookcase Matrix for Non-Image Rooms */
                      <div className="absolute inset-0 bg-gradient-to-br from-[#090A10] via-[#06070C] to-black overflow-hidden">
                        {/* Glowing 5D Matrix Grid */}
                        <div
                          className="pointer-events-none absolute inset-0 opacity-[0.18]"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, rgba(245,158,11,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,158,11,0.2) 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                          }}
                        />
                        {/* Vertical golden bookcase light strands inside the CRT */}
                        <div className="pointer-events-none absolute inset-x-8 inset-y-0 flex justify-around opacity-25">
                          <div className="w-px h-full bg-gradient-to-b from-transparent via-amber-400 to-transparent" />
                          <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-amber-300 to-transparent shadow-[0_0_12px_#f59e0b]" />
                          <div className="w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent" />
                          <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-amber-200 to-transparent shadow-[0_0_12px_#fef08a]" />
                          <div className="w-px h-full bg-gradient-to-b from-transparent via-amber-500 to-transparent" />
                        </div>
                        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-amber-500/[0.12] blur-3xl" />
                      </div>
                    )}

                    {/* Top Monitor HUD Header Bar */}
                    <div className="relative z-20 flex items-center justify-between pointer-events-none font-mono text-[9.5px] uppercase tracking-[0.2em]">
                      <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-black/80 px-3 py-1 text-amber-300 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <Radio className="h-2.5 w-2.5 text-amber-400 animate-pulse" />
                        ROOM 0{active + 1} &nbsp;·&nbsp; {p.category}
                      </span>
                      <span className="rounded-full border border-white/15 bg-black/80 px-3 py-1 text-zinc-300 backdrop-blur-md">
                        {p.year} &nbsp;·&nbsp; {meta.gravityFreq}
                      </span>
                    </div>

                    {/* Center Philosophical Sci-Fi Quote (Glowing Amber Typewriter Style) */}
                    <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 py-3 select-none">
                      <div className="mb-2.5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.28em] text-amber-400/75">
                        <span className="h-px w-6 bg-amber-500/40" />
                        <span>MEMORY STRAND 0{active + 1}</span>
                        <span className="h-px w-6 bg-amber-500/40" />
                      </div>

                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                        className="font-sans text-[17px] sm:text-[21px] md:text-[24px] font-medium text-white leading-snug drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
                      >
                        &ldquo;{meta.quote1}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.14 }}
                        className="mt-1 font-sans text-[17px] sm:text-[21px] md:text-[24px] font-semibold text-amber-400 leading-snug drop-shadow-[0_0_20px_rgba(245,158,11,0.55)]"
                      >
                        {meta.quote2}&rdquo;
                      </motion.p>
                    </div>

                    {/* Bottom Monitor Telemetry Tag Bar: Date + "Click to enter" */}
                    <div className="relative z-20 flex items-center justify-between pointer-events-none font-mono text-[10px] uppercase tracking-[0.2em] border-t border-amber-500/20 pt-2.5">
                      <span className="text-zinc-300 drop-shadow flex items-center gap-2">
                        <span className="text-amber-400 font-bold">{meta.tickDate}</span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-amber-300 font-semibold underline decoration-amber-500/50 underline-offset-4">
                          CLICK TO ENTER
                        </span>
                      </span>
                      <span className="text-zinc-400 hidden sm:inline">
                        SIGNAL // {p.status || "ACTIVE"}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Floating "Enter" Orange Cursor Bubble (Follows Mouse Pointer smoothly) */}
                <motion.div
                  initial={false}
                  style={{
                    x: smoothCursorX,
                    y: smoothCursorY,
                    top: 0,
                    left: 0,
                  }}
                  animate={{
                    opacity: isHoveringWindow ? 1 : 0,
                    scale: isHoveringWindow ? 1 : 0.5,
                  }}
                  transition={{
                    opacity: { duration: 0.18 },
                    scale: { type: "spring", stiffness: 450, damping: 26 },
                  }}
                  className="pointer-events-none absolute z-40 hidden sm:flex h-[60px] w-[60px] items-center justify-center rounded-full bg-amber-500 font-sans text-[12px] font-bold tracking-tight text-black shadow-[0_0_30px_rgba(245,158,11,0.95)] ring-2 ring-amber-200/80"
                  aria-hidden="true"
                >
                  Enter
                </motion.div>
              </motion.div>

              {/* Bottom Chamber Status Bar */}
              <div className="relative z-20 mt-3.5 flex items-center justify-between px-2 font-mono text-[10px] text-zinc-400">
                <span className="tracking-[0.16em] truncate max-w-[70%]">
                  SYSTEM: <strong className="text-zinc-200 font-normal">{p.signal || p.summary}</strong>
                </span>
                <span className="text-amber-400 tracking-widest hidden sm:inline-flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  TESSERACT STAGE 0{active + 1}
                </span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT: TYPOGRAPHIC READOUT (POGGUFANZ EXACT SPEC)
             ========================================================================= */}
          <div className="flex flex-col">
            {/* Kicker */}
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-500">
              <span className="font-bold">0{active + 1}</span>
              <span className="h-px w-5 bg-amber-500/50" />
              <span>{p.category}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">{meta.tickDate}</span>
            </p>

            {/* Readout Title */}
            <h3 className="mt-2.5 font-sans text-[30px] sm:text-[38px] lg:text-[42px] font-black leading-tight text-white tracking-[-0.02em]">
              {p.title}
            </h3>

            {/* Readout Spec Grid (Period · Status · Signal) */}
            <dl className="mt-6 grid grid-cols-3 gap-3 border-y border-white/10 py-4 font-mono">
              <div>
                <dt className="text-[9.5px] uppercase tracking-[0.18em] text-zinc-500">
                  Period
                </dt>
                <dd className="mt-1 text-[11.5px] font-medium text-zinc-200">
                  {p.year}
                </dd>
              </div>
              <div>
                <dt className="text-[9.5px] uppercase tracking-[0.18em] text-zinc-500">
                  Status
                </dt>
                <dd className="mt-1 flex items-center gap-1.5 text-[11.5px] font-medium text-[#fef08a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                  {p.status || "Active"}
                </dd>
              </div>
              <div>
                <dt className="text-[9.5px] uppercase tracking-[0.18em] text-zinc-500">
                  Signal
                </dt>
                <dd className="mt-1 text-[11px] font-medium text-amber-300/90 truncate">
                  {p.signal ? p.signal.split("·")[0] : p.highlight}
                </dd>
              </div>
            </dl>

            {/* Description */}
            <p className="mt-5 font-sans text-[14.5px] leading-relaxed text-zinc-300">
              {p.description}
            </p>

            {/* Factual Operational Pipeline (e.g., Smart-Node Logistics 4-Step QR -> WA -> VPS -> DVRP) */}
            {p.caseStudy?.workflowSteps && p.caseStudy.workflowSteps.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-3">
                {p.caseStudy.workflowSteps.map((wf) => (
                  <div
                    key={wf.step}
                    className="flex items-start gap-2 rounded-lg border border-white/5 bg-black/40 p-2"
                  >
                    <span className="mt-0.5 inline-flex h-4 w-5 shrink-0 items-center justify-center rounded bg-amber-500/20 font-mono text-[9px] font-bold text-amber-400">
                      {wf.step}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10.5px] font-semibold text-[#fef08a] leading-tight">
                        {wf.title}
                      </p>
                      <p className="mt-0.5 font-sans text-[11px] leading-snug text-zinc-400 line-clamp-2">
                        {wf.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tech Stack Chips */}
            <ul
              className="mt-5 flex flex-wrap gap-1.5 font-mono text-[10.5px] text-zinc-300"
              aria-label="Stack"
            >
              {p.stack.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 hover:border-amber-500/40 hover:text-amber-200 transition-colors"
                >
                  {s}
                </li>
              ))}
            </ul>

            {/* Readout Action Buttons: Enter room → + Code + Links */}
            <div className="mt-7 flex flex-wrap items-center gap-3 pt-5 border-t border-white/[0.08]">
              {/* Primary "Enter room →" Button with Attached Circular Amber Port */}
              <button
                type="button"
                onClick={handleEnterRoom}
                className="group inline-flex items-center rounded-full bg-white text-black font-mono text-[11.5px] font-semibold transition-all hover:bg-zinc-200 active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="py-2.5 pl-4 pr-2">Enter room</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-black mr-1 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>

              {/* GitHub Link */}
              {p.codeUrl && (
                <a
                  href={p.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 font-mono text-[11px] text-zinc-300 hover:border-white/30 hover:text-white transition-colors"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>Code</span>
                  <ArrowUpRight className="h-3 w-3 text-zinc-500" />
                </a>
              )}

              {/* Live Demo or External Link */}
              {p.demoUrl && p.demoUrl !== "#" && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 font-mono text-[11px] text-zinc-300 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
                >
                  <span>Live Demo</span>
                  <ArrowUpRight className="h-3 w-3 text-zinc-500" />
                </a>
              )}

              {/* Context Tag */}
              <span className="inline-flex min-h-[38px] items-center rounded-full border border-amber-500/20 bg-amber-500/[0.04] px-3.5 font-mono text-[10.5px] text-amber-300/90">
                {p.context || p.highlight}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PRECISION TIMELINE AXIS SCRUBBER (2026.02 → 2024.09)
           ========================================================================= */}
        <div className="mt-14 rounded-2xl border border-amber-500/20 bg-[#07080D]/90 p-5 sm:p-7 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.6)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-zinc-300">
                Timeline Axis // 5D Temporal Scrubber
              </p>
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[9.5px] text-zinc-500">
                <Compass className="h-2.5 w-2.5 text-amber-500" />
                Use ← / → keys or slider
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Room Counter 01 / 05 */}
              <span className="font-mono text-[13px] font-bold tracking-[0.16em] text-amber-400 tabular-nums">
                0{active + 1} &nbsp;<span className="text-zinc-600">/</span>&nbsp; 0{total}
              </span>

              {/* Prev / Next buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={goToPrev}
                  disabled={active === 0}
                  aria-label="Previous project room"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  disabled={active === total - 1}
                  aria-label="Next project room"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline Axis Track with Precision Ticks */}
          <div className="relative mt-8 mb-4">
            {/* Base Horizontal Track Line */}
            <div className="absolute top-[8px] h-[2px] w-full bg-white/10 -translate-y-1/2" />

            {/* Glowing Active Progress Bar */}
            <div
              className="absolute top-[8px] h-[2px] -translate-y-1/2 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 transition-all duration-300 shadow-[0_0_12px_#f59e0b]"
              style={{ width: `${(active / Math.max(1, total - 1)) * 100}%` }}
            />

            {/* Ticks and Room Buttons */}
            <div className="relative flex justify-between">
              {projects.map((proj, i) => {
                const isActive = i === active;
                const m = roomMeta[i] || roomMeta[0];
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Select Room 0${i + 1}: ${proj.title}`}
                    aria-pressed={isActive}
                    className="group relative flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1 transition-all duration-200 cursor-pointer"
                  >
                    {/* Tick Mark / Circle */}
                    <span
                      className={`h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
                        isActive
                          ? "bg-amber-400 border-amber-100 shadow-[0_0_16px_#f59e0b] scale-125"
                          : "bg-[#07080D] border-white/25 group-hover:border-amber-400 group-hover:scale-110"
                      }`}
                    />

                    {/* Tick Date & Project Name */}
                    <div className="mt-3 flex flex-col items-center font-mono text-center">
                      <span
                        className={`text-[10.5px] tracking-wider transition-colors ${
                          isActive
                            ? "text-amber-400 font-bold"
                            : "text-zinc-500 group-hover:text-zinc-300"
                        }`}
                      >
                        {m.tickDate}
                      </span>
                      <span
                        className={`text-[9.5px] uppercase tracking-wider transition-colors max-w-[96px] truncate ${
                          isActive
                            ? "text-white font-semibold"
                            : "text-zinc-600 group-hover:text-zinc-400"
                        }`}
                      >
                        {m.shortName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Range Slider */}
          <input
            type="range"
            min={0}
            max={total - 1}
            step={1}
            value={active}
            onChange={(e) => setActive(Number(e.target.value))}
            className="tesseract-scrubber mt-5 w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Scrub projects timeline"
            aria-valuemin={0}
            aria-valuemax={total - 1}
            aria-valuenow={active}
            aria-valuetext={p.title}
          />
        </div>
      </div>

      {/* Connected Accessible Modals (Preserving role="dialog") */}
      <ProjectDetailDrawer
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <MediaModal
        isOpen={!!mediaProject}
        onClose={() => setMediaProject(null)}
        title={mediaProject?.title || ""}
        category={
          mediaProject ? `${mediaProject.category} — ${mediaProject.year}` : ""
        }
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
