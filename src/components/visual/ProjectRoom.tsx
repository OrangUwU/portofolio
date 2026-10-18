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
  Layers,
} from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { soundManager } from "@/lib/soundManager";
import { ProjectDetailDrawer } from "./ProjectDetailDrawer";
import { MediaModal } from "./MediaModal";
import { LookbookModal } from "./LookbookModal";

// Sci-fi quote, 5D coordinates & uniform telemetry per room (ensures 100% identical height across all 5 rooms on both Mobile & Desktop)
const roomMeta = [
  {
    tickDate: "2026.02",
    shortName: "IJEN-CARE",
    dimensionCoord: "T-01 // 08°03'S 114°14'E",
    gravityFreq: "42.8 Hz",
    quote1: "Past the sulfur horizon,",
    quote2: "mobility becomes a coordinate in the dark.",
    telemetryNodes: [
      {
        step: "01",
        title: "Offline-First Mapbox GL",
        desc: "Peta topografi Kawah Ijen tetap aktif di zona blank-spot sinyal.",
      },
      {
        step: "02",
        title: "5-Tap SOS Emergency",
        desc: "Transmisi koordinat GPS darurat instan ke pos medis terdekat.",
      },
      {
        step: "03",
        title: "Toxic Gas Zone Alert",
        desc: "Peringatan dini radius bahaya gas belerang real-time.",
      },
      {
        step: "04",
        title: "1-Click Evacuation",
        desc: "Koneksi langsung armada roda dua & medis darurat.",
      },
    ],
  },
  {
    tickDate: "2025.10",
    shortName: "Smart-Node",
    dimensionCoord: "T-02 // DVRP LATTICE",
    gravityFreq: "38.4 Hz",
    quote1: "Human-as-a-Sensor.",
    quote2: "Every route optimized before the signal fades.",
    telemetryNodes: [
      {
        step: "01",
        title: "Scan QR Smart Bin",
        desc: "Warga memindai QR Code unik pada tong sampah yang penuh.",
      },
      {
        step: "02",
        title: "Auto-Fill WhatsApp",
        desc: "Membuka WhatsApp otomatis dengan format teks ID lokasi.",
      },
      {
        step: "03",
        title: "Webhook ke Server VPS",
        desc: "Gateway meneruskan pesan ke backend & mengubah status titik.",
      },
      {
        step: "04",
        title: "Rute DVRP Real-Time",
        desc: "Kalkulasi ulang jalur truk paling efisien secara instan.",
      },
    ],
  },
  {
    tickDate: "2025.03",
    shortName: "Behavior Res.",
    dimensionCoord: "T-03 // EMPIRICAL AXIS",
    gravityFreq: "29.1 Hz",
    quote1: "Patterns emerge in unmapped corridors.",
    quote2: "Data reveals what bells cannot contain.",
    telemetryNodes: [
      {
        step: "01",
        title: "Observasi Lapangan",
        desc: "Pemetaan titik kumpul & pola mobilitas siswa saat jam pelajaran.",
      },
      {
        step: "02",
        title: "Kuesioner Terstruktur",
        desc: "Pengumpulan faktor pendorong internal & eksternal secara anonim.",
      },
      {
        step: "03",
        title: "Korelasi Statistik",
        desc: "Analisis distribusi frekuensi & validasi silang antar variabel.",
      },
      {
        step: "04",
        title: "Rekomendasi Kebijakan",
        desc: "Perumusan intervensi berbasis empati & evaluasi kurikulum.",
      },
    ],
  },
  {
    tickDate: "2025.05",
    shortName: "Kampung Bethek",
    dimensionCoord: "T-04 // DJAWATAN FRAME",
    gravityFreq: "24.0 fps",
    quote1: "Five minutes of lived reality",
    quote2: "in the corridor of De Djawatan.",
    telemetryNodes: [
      {
        step: "01",
        title: "Riset Narasumber Lokal",
        desc: "Pendekatan humanis bersama warga sekitar kawasan De Djawatan.",
      },
      {
        step: "02",
        title: "Golden Hour Cinema",
        desc: "Pengambilan gambar natural light di bawah kanopi pohon trembesi.",
      },
      {
        step: "03",
        title: "5-Minute Narrative Cut",
        desc: "Penyuntingan ritme cerita dokumenter yang padat dan emosional.",
      },
      {
        step: "04",
        title: "Color Grading & Audio",
        desc: "Tone visual sinematik hangat dengan desain tata suara atmosferik.",
      },
    ],
  },
  {
    tickDate: "2024.09",
    shortName: "Arcanova",
    dimensionCoord: "T-05 // XI-2 INSIGNIA",
    gravityFreq: "19.6 Hz",
    quote1: "gnosi ine dynami.",
    quote2: "Wearable pride — NO TURNING BACK.",
    telemetryNodes: [
      {
        step: "01",
        title: "Filosofi gnosi ine dynami",
        desc: "Identitas kolektif kelas XI-2 SMAN 1 Giri: pengetahuan adalah kekuatan.",
      },
      {
        step: "02",
        title: "Tipografi NO TURNING BACK",
        desc: "Komposisi grafis punggung berenergi tinggi dengan kontras tajam.",
      },
      {
        step: "03",
        title: "Vector Precision Art",
        desc: "Detail emblem depan & belakang siap cetak sablon plastisol HD.",
      },
      {
        step: "04",
        title: "Studio Lookbook",
        desc: "Dokumentasi visual solidaritas angkatan dalam format editorial.",
      },
    ],
  },
];

interface BeamPulse {
  axis: "x" | "y" | "z";
  fixed1: number;
  fixed2: number;
  pos: number;
  speed: number;
  length: number;
  bright: boolean;
}

export function ProjectRoom() {
  const [active, setActive] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mediaProject, setMediaProject] = useState<Project | null>(null);
  const [lookbookProject, setLookbookProject] = useState<Project | null>(null);

  // Refs for the 3D Poggufanz Copper Tesseract Canvas, Touch Swipe & Interactive Monitor
  const tesseractCanvasRef = useRef<HTMLCanvasElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isHoveringWindow, setIsHoveringWindow] = useState(false);

  // Smooth camera & mouse state shared with the 60fps 3D canvas
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const activeRoomRef = useRef(0);
  const hasMountedRef = useRef(false);
  useEffect(() => {
    activeRoomRef.current = active;
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    soundManager.playTesseractRoomScrub(active);
  }, [active]);

  const mouseNormX = useMotionValue(0);
  const mouseNormY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springNormX = useSpring(mouseNormX, {
    stiffness: 220,
    damping: 26,
    mass: 0.6,
  });
  const springNormY = useSpring(mouseNormY, {
    stiffness: 220,
    damping: 26,
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

  // Subtle 3D Monitor Gyro Tilt inside the Recessed Bookcase Alcove
  const monitorRotateX = useTransform(springNormY, [-1, 1], [7, -7]);
  const monitorRotateY = useTransform(springNormX, [-1, 1], [-9, 9]);

  // Dynamic specular reflection across CRT screen
  const glareX = useTransform(springNormX, [-1, 1], ["15%", "85%"]);
  const glareY = useTransform(springNormY, [-1, 1], ["15%", "85%"]);

  const total = projects.length;
  const p = projects[active];
  const meta = roomMeta[active] || roomMeta[0];
  const prevMeta = roomMeta[(active - 1 + total) % total];
  const nextMeta = roomMeta[(active + 1) % total];

  const goToPrev = useCallback(
    () => setActive((prev) => Math.max(0, prev - 1)),
    []
  );
  const goToNext = useCallback(
    () => setActive((prev) => Math.min(total - 1, prev + 1)),
    [total]
  );

  // Horizontal Touch Swipe Handler for Mobile Phones (Swipe Left -> Next, Swipe Right -> Prev)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Trigger room change if horizontal swipe exceeds 44px and is predominantly horizontal
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      if (dx < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseTargetRef.current = { x: nx, y: ny };
    mouseNormX.set(nx);
    mouseNormY.set(ny);
  };

  const handleStageMouseLeave = () => {
    mouseTargetRef.current = { x: 0, y: 0 };
    mouseNormX.set(0);
    mouseNormY.set(0);
    setIsHoveringWindow(false);
  };

  const handleMonitorMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left - 28);
    cursorY.set(e.clientY - rect.top - 28);
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
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    },
    [selectedProject, mediaProject, lookbookProject, goToPrev, goToNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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

  // =========================================================================
  // 60FPS 3D PERSPECTIVE COPPER GIRDER LATTICE & BOOKCASE ALCOVE RENDERER
  // Responsive for both Mobile Portrait (HP) and Desktop Widescreen
  // =========================================================================
  useEffect(() => {
    const canvas = tesseractCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // 3D Lattice Structural Coordinates (World Space)
    const X_COLS = [-680, -440, -225, 225, 440, 680];
    const Y_ROWS = [-420, -275, -138, 138, 275, 420];
    const Z_PLANES = [90, 220, 380, 580, 820, 1100];

    // Pre-generate traveling photonic light streaks along X, Y, Z copper girders
    const pulses: BeamPulse[] = [];
    for (let i = 0; i < 34; i++) {
      const axisChoice = i % 3;
      if (axisChoice === 0) {
        pulses.push({
          axis: "x",
          fixed1: Y_ROWS[i % Y_ROWS.length],
          fixed2: Z_PLANES[i % (Z_PLANES.length - 1)],
          pos: -680 + Math.random() * 1360,
          speed: (2.2 + Math.random() * 3.2) * (i % 2 === 0 ? 1 : -1),
          length: 65 + Math.random() * 85,
          bright: i % 3 === 0,
        });
      } else if (axisChoice === 1) {
        pulses.push({
          axis: "y",
          fixed1: X_COLS[i % X_COLS.length],
          fixed2: Z_PLANES[i % (Z_PLANES.length - 1)],
          pos: -420 + Math.random() * 840,
          speed: (1.8 + Math.random() * 2.8) * (i % 2 === 0 ? 1 : -1),
          length: 55 + Math.random() * 75,
          bright: i % 2 === 0,
        });
      } else {
        pulses.push({
          axis: "z",
          fixed1: X_COLS[i % X_COLS.length],
          fixed2: Y_ROWS[i % Y_ROWS.length],
          pos: 90 + Math.random() * 950,
          speed: -3.5 - Math.random() * 4.5,
          length: 80 + Math.random() * 110,
          bright: true,
        });
      }
    }

    let camX = 0;
    let camY = 0;
    let roomShiftX = 0;
    let lastRoom = activeRoomRef.current;
    let rafId = 0;

    const renderTesseract = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        rafId = requestAnimationFrame(renderTesseract);
        return;
      }

      // Detect room change for a dramatic 5D camera impulse shift
      if (activeRoomRef.current !== lastRoom) {
        const dir = activeRoomRef.current > lastRoom ? 1 : -1;
        roomShiftX = dir * 95;
        lastRoom = activeRoomRef.current;
      }
      roomShiftX *= 0.9;

      // Smoothly interpolate camera toward mouse parallax + room scrub impulse
      const targetX = mouseTargetRef.current.x * 38 + roomShiftX;
      const targetY = mouseTargetRef.current.y * 24;
      camX += (targetX - camX) * 0.08;
      camY += (targetY - camY) * 0.08;

      const cx = w * 0.5;
      const cy = h * 0.44; // Centered on the monitor above the bottom timeline dock
      // Adaptive FOV so portrait mobile screens show the full 3D bookcase alcove & surrounding copper girders
      const isPortraitMobile = w < h * 1.05;
      const fov = isPortraitMobile ? w * 0.52 : Math.min(w, h) * 0.64;

      const project = (x: number, y: number, z: number) => {
        const dz = Math.max(25, z);
        const scale = fov / dz;
        return {
          sx: cx + (x - camX) * scale,
          sy: cy + (y - camY) * scale,
          scale,
        };
      };

      // 1. Deep 5D Void Background & Warm Copper Vanishing Glow
      ctx.fillStyle = "#040408";
      ctx.fillRect(0, 0, w, h);

      const coreGlow = ctx.createRadialGradient(
        cx - camX * 0.4,
        cy - camY * 0.4,
        10 * dpr,
        cx,
        cy,
        Math.max(w, h) * 0.62
      );
      coreGlow.addColorStop(0, "rgba(245, 158, 11, 0.22)");
      coreGlow.addColorStop(0.35, "rgba(180, 83, 9, 0.11)");
      coreGlow.addColorStop(0.7, "rgba(120, 53, 15, 0.04)");
      coreGlow.addColorStop(1, "rgba(4, 4, 8, 0)");
      ctx.fillStyle = coreGlow;
      ctx.fillRect(0, 0, w, h);

      // Helper to draw a 3D shaded copper/bronze girder segment between two 3D points
      const drawCopperGirder = (
        x1: number,
        y1: number,
        z1: number,
        x2: number,
        y2: number,
        z2: number,
        thickness: number,
        alphaMultiplier = 1
      ) => {
        const p1 = project(x1, y1, z1);
        const p2 = project(x2, y2, z2);

        const avgZ = (z1 + z2) * 0.5;
        const depthFade =
          Math.max(0.06, Math.min(1, 1 - avgZ / 1180)) * alphaMultiplier;
        const t1 = Math.max(1.1 * dpr, thickness * p1.scale);
        const t2 = Math.max(1.1 * dpr, thickness * p2.scale);

        const dx = p2.sx - p1.sx;
        const dy = p2.sy - p1.sy;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        // Dark 3D Bronze Metallic Body Fill
        ctx.beginPath();
        ctx.moveTo(p1.sx + nx * t1, p1.sy + ny * t1);
        ctx.lineTo(p2.sx + nx * t2, p2.sy + ny * t2);
        ctx.lineTo(p2.sx - nx * t2, p2.sy - ny * t2);
        ctx.lineTo(p1.sx - nx * t1, p1.sy - ny * t1);
        ctx.closePath();
        ctx.fillStyle = `rgba(38, 20, 8, ${(depthFade * 0.88).toFixed(3)})`;
        ctx.fill();

        // Outer Copper Wireframe Flange Edges
        ctx.beginPath();
        ctx.moveTo(p1.sx + nx * t1, p1.sy + ny * t1);
        ctx.lineTo(p2.sx + nx * t2, p2.sy + ny * t2);
        ctx.moveTo(p1.sx - nx * t1, p1.sy - ny * t1);
        ctx.lineTo(p2.sx - nx * t2, p2.sy - ny * t2);
        ctx.strokeStyle = `rgba(217, 119, 6, ${(depthFade * 0.72).toFixed(3)})`;
        ctx.lineWidth = Math.max(0.8 * dpr, 1.15 * dpr * depthFade);
        ctx.stroke();

        // Inner Specular Amber Core Line
        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.strokeStyle = `rgba(254, 240, 138, ${(depthFade * 0.28).toFixed(3)})`;
        ctx.lineWidth = Math.max(0.5 * dpr, 0.7 * dpr * depthFade);
        ctx.stroke();
      };

      // 2. Render Deep Z-Receding Copper Struts (Back to Front)
      for (let zi = Z_PLANES.length - 1; zi >= 0; zi--) {
        const z = Z_PLANES[zi];

        // Z-Axis Longitudinal Girders connecting Z_PLANES[zi] to Z_PLANES[zi - 1]
        if (zi > 0) {
          const zPrev = Z_PLANES[zi - 1];
          for (const x of X_COLS) {
            for (const y of Y_ROWS) {
              drawCopperGirder(x, y, z, x, y, zPrev, 11, 0.85);
            }
          }
        }

        // Horizontal (X) Copper Girders on plane Z
        for (const y of Y_ROWS) {
          if (z <= 380 && Math.abs(y) < 130) continue;
          drawCopperGirder(-740, y, z, 740, y, z, 13, 0.95);
        }

        // Vertical (Y) Copper Girders on plane Z
        for (const x of X_COLS) {
          if (z <= 380 && Math.abs(x) < 220) continue;
          drawCopperGirder(x, -460, z, x, 460, z, 13, 0.95);
        }
      }

      // 3. Render the 3D Recessed Bookcase Alcove (Between Z = 135 and Z = 320 around the central screen)
      const zFront = 135;
      const zBack = 320;
      const alcX = 225;
      const alcY = 138;

      const shelfYLevels = [-138, -92, -46, 0, 46, 92, 138];
      for (const side of [-1, 1]) {
        const wallX = side * alcX;

        const tl = project(wallX, -alcY, zFront);
        const tr = project(wallX, -alcY, zBack);
        const br = project(wallX, alcY, zBack);
        const bl = project(wallX, alcY, zFront);

        ctx.beginPath();
        ctx.moveTo(tl.sx, tl.sy);
        ctx.lineTo(tr.sx, tr.sy);
        ctx.lineTo(br.sx, br.sy);
        ctx.lineTo(bl.sx, bl.sy);
        ctx.closePath();
        ctx.fillStyle = "rgba(18, 10, 4, 0.86)";
        ctx.fill();
        ctx.strokeStyle = "rgba(245, 158, 11, 0.45)";
        ctx.lineWidth = 1.2 * dpr;
        ctx.stroke();

        // Horizontal 3D Shelf Planks receding from zFront to zBack
        for (let si = 0; si < shelfYLevels.length; si++) {
          const sy = shelfYLevels[si];
          const pFront = project(wallX, sy, zFront);
          const pBack = project(wallX, sy, zBack);

          ctx.beginPath();
          ctx.moveTo(pFront.sx, pFront.sy);
          ctx.lineTo(pBack.sx, pBack.sy);
          ctx.strokeStyle = "rgba(245, 158, 11, 0.55)";
          ctx.lineWidth = 1.5 * dpr;
          ctx.stroke();

          // Procedural Vertical 3D Book Spines along each shelf
          if (si < shelfYLevels.length - 1) {
            const syBottom = shelfYLevels[si + 1];
            const bookCount = 12;
            for (let bi = 1; bi < bookCount; bi++) {
              const bz = zFront + ((zBack - zFront) * bi) / bookCount;
              const bookTop = sy + ((bi * 7 + si * 3) % 4) * 3.2;
              const bt = project(wallX, bookTop, bz);
              const bb = project(wallX, syBottom, bz);

              const isGoldenStrand =
                (bi + si + activeRoomRef.current) % 5 === 0;
              ctx.beginPath();
              ctx.moveTo(bt.sx, bt.sy);
              ctx.lineTo(bb.sx, bb.sy);
              ctx.strokeStyle = isGoldenStrand
                ? "rgba(254, 240, 138, 0.72)"
                : "rgba(217, 119, 6, 0.34)";
              ctx.lineWidth = (isGoldenStrand ? 1.8 : 1.0) * dpr;
              ctx.stroke();
            }
          }
        }
      }

      // Top & Bottom Recessed Alcove Ceiling/Floor Slats
      for (const vSide of [-1, 1]) {
        const wallY = vSide * alcY;
        const fl = project(-alcX, wallY, zFront);
        const fr = project(alcX, wallY, zFront);
        const br = project(alcX, wallY, zBack);
        const bl = project(-alcX, wallY, zBack);

        ctx.beginPath();
        ctx.moveTo(fl.sx, fl.sy);
        ctx.lineTo(fr.sx, fr.sy);
        ctx.lineTo(br.sx, br.sy);
        ctx.lineTo(bl.sx, bl.sy);
        ctx.closePath();
        ctx.fillStyle = "rgba(15, 8, 3, 0.82)";
        ctx.fill();
        ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
        ctx.lineWidth = 1.1 * dpr;
        ctx.stroke();

        for (let xi = -alcX + 30; xi < alcX; xi += 30) {
          const pf = project(xi, wallY, zFront);
          const pb = project(xi, wallY, zBack);
          ctx.beginPath();
          ctx.moveTo(pf.sx, pf.sy);
          ctx.lineTo(pb.sx, pb.sy);
          ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
          ctx.lineWidth = 0.9 * dpr;
          ctx.stroke();
        }
      }

      // Outer Bold Copper Bezel Frames around the Alcove
      drawCopperGirder(-alcX, -alcY, zFront, alcX, -alcY, zFront, 15, 1.15);
      drawCopperGirder(-alcX, alcY, zFront, alcX, alcY, zFront, 15, 1.15);
      drawCopperGirder(-alcX, -alcY, zFront, -alcX, alcY, zFront, 15, 1.15);
      drawCopperGirder(alcX, -alcY, zFront, alcX, alcY, zFront, 15, 1.15);

      // 4. Animate Photonic Light Pulses Traveling Along the 3D Copper Girders
      for (const pulse of pulses) {
        pulse.pos += pulse.speed;
        let x1 = 0,
          y1 = 0,
          z1 = 0,
          x2 = 0,
          y2 = 0,
          z2 = 0;

        if (pulse.axis === "x") {
          if (pulse.pos > 700) pulse.pos = -700;
          if (pulse.pos < -700) pulse.pos = 700;
          x1 = pulse.pos;
          x2 = pulse.pos + pulse.length * Math.sign(pulse.speed);
          y1 = y2 = pulse.fixed1;
          z1 = z2 = pulse.fixed2;
        } else if (pulse.axis === "y") {
          if (pulse.pos > 440) pulse.pos = -440;
          if (pulse.pos < -440) pulse.pos = 440;
          x1 = x2 = pulse.fixed1;
          y1 = pulse.pos;
          y2 = pulse.pos + pulse.length * Math.sign(pulse.speed);
          z1 = z2 = pulse.fixed2;
        } else {
          if (pulse.pos < 90) pulse.pos = 1050;
          x1 = x2 = pulse.fixed1;
          y1 = y2 = pulse.fixed2;
          z1 = pulse.pos;
          z2 = Math.min(1100, pulse.pos + pulse.length);
        }

        const p1 = project(x1, y1, z1);
        const p2 = project(x2, y2, z2);
        const alpha = Math.max(0.15, 1 - z1 / 1100);

        const grad = ctx.createLinearGradient(p1.sx, p1.sy, p2.sx, p2.sy);
        grad.addColorStop(
          0,
          pulse.bright
            ? `rgba(255, 251, 235, ${(alpha * 0.95).toFixed(2)})`
            : `rgba(245, 158, 11, ${(alpha * 0.85).toFixed(2)})`
        );
        grad.addColorStop(1, "rgba(245, 158, 11, 0)");

        ctx.beginPath();
        ctx.moveTo(p1.sx, p1.sy);
        ctx.lineTo(p2.sx, p2.sy);
        ctx.strokeStyle = grad;
        ctx.lineWidth =
          (pulse.bright ? 2.5 : 1.7) * dpr * Math.min(1.2, p1.scale * 1.4);
        ctx.lineCap = "round";
        ctx.stroke();
      }

      // 5. Radial Vignette
      const vignette = ctx.createRadialGradient(
        cx,
        cy,
        Math.min(w, h) * 0.18,
        cx,
        cy,
        Math.max(w, h) * 0.65
      );
      vignette.addColorStop(0, "rgba(4, 4, 8, 0)");
      vignette.addColorStop(0.75, "rgba(4, 4, 8, 0.28)");
      vignette.addColorStop(1, "rgba(4, 4, 8, 0.82)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      rafId = requestAnimationFrame(renderTesseract);
    };

    rafId = requestAnimationFrame(renderTesseract);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="works"
      role="region"
      aria-label="Inside the Tesseract — Project Room Terminal"
      className="relative border-t border-amber-500/15 bg-[#030409] pt-12 pb-16 sm:pt-20 sm:pb-28 overflow-x-hidden"
    >
      {/* Top Event Horizon Golden Light Bridge */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-amber-500/[0.1] via-amber-500/[0.02] to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-[1320px] px-3.5 sm:px-6 lg:px-8 relative z-10">
        {/* =========================================================================
            HEADER: INSIDE THE TESSERACT (POGGUFANZ & INTERSTELLAR SPEC)
           ========================================================================= */}
        <div className="border-b border-white/10 pb-6 sm:pb-10">
          <div className="flex items-center gap-2.5 font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.18em] text-zinc-500">
            <span className="text-amber-500 font-bold">01</span>
            <span className="h-px w-6 bg-amber-500/40" />
            <span>Selected Work · 5D Temporal Lattice</span>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-sans text-[32px] sm:text-[52px] md:text-[68px] font-black tracking-[-0.03em] text-white leading-none">
                INSIDE THE <span className="text-amber-500">TESSERACT</span>
              </h2>
              <p className="mt-3 sm:mt-4 max-w-[48ch] font-sans text-[13.5px] sm:text-[15px] leading-relaxed text-zinc-300">
                Past the horizon, time is a direction you can walk. Every project is a room in the lattice, lit at the moment it was built.
              </p>
            </div>

            {/* Poggufanz Works Facts Counter */}
            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 sm:gap-6 rounded-2xl border border-amber-500/25 bg-[#08090F]/90 px-4 sm:px-5 py-3 backdrop-blur-md font-mono text-[10.5px] sm:text-[11px] shadow-[0_0_25px_rgba(245,158,11,0.1)]">
              <div>
                <span className="text-zinc-500 block text-[8.5px] sm:text-[9px] uppercase tracking-wider">
                  Rooms
                </span>
                <span className="text-amber-400 font-bold text-[14px] sm:text-[15px] tracking-wider">
                  0{total}
                </span>
              </div>
              <div className="h-6 w-px bg-white/10" />
              <div>
                <span className="text-zinc-500 block text-[8.5px] sm:text-[9px] uppercase tracking-wider">
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
                <span className="text-zinc-500 block text-[8.5px] sm:text-[9px] uppercase tracking-wider">
                  Direction
                </span>
                <span className="text-amber-400 font-medium flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_10px_#f59e0b]" />
                  </span>
                  <span className="hidden xs:inline">Scrub / Swipe</span>
                  <span className="xs:hidden">Swipe</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MAIN STAGE: ZERO-SHIFT LOCKED HEIGHT GRID ON BOTH MOBILE & DESKTOP
            Supports horizontal touch swipe on mobile phones!
           ========================================================================= */}
        <div className="mt-7 sm:mt-10 grid gap-5 sm:gap-6 lg:grid-cols-[1.58fr_1fr] items-stretch">
          {/* =====================================================================
              LEFT: 3D COPPER GIRDER TESSERACT CHAMBER + OVERLAID TIMELINE AXIS
              Locked height on Mobile (h-[430px]) & Desktop (lg:h-[620px])
             ===================================================================== */}
          <div
            onMouseMove={handleStageMouseMove}
            onMouseLeave={handleStageMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{ perspective: "1400px" }}
            className="relative flex flex-col justify-between h-[430px] sm:h-[560px] lg:h-[620px] rounded-[20px] sm:rounded-[24px] border border-amber-500/30 bg-[#040408] shadow-[0_0_80px_rgba(0,0,0,0.95),inset_0_0_70px_rgba(245,158,11,0.08)] overflow-hidden select-none touch-pan-y"
          >
            {/* 1. Real-Time 60fps 3D Copper Girder & Bookcase Alcove Canvas */}
            <canvas
              ref={tesseractCanvasRef}
              className="pointer-events-none absolute inset-0 h-full w-full z-0"
            />

            {/* 2. Ghosted Parallel Memory Echoes in Adjacent Lattice Cells */}
            <div
              className="pointer-events-none absolute left-3 top-12 hidden sm:block max-w-[155px] font-sans text-[10.5px] leading-snug text-amber-200/15 blur-[0.4px] z-10"
              aria-hidden="true"
            >
              <p>{prevMeta.quote1}</p>
              <p className="text-amber-500/20">{prevMeta.quote2}</p>
            </div>
            <div
              className="pointer-events-none absolute right-3 top-16 hidden sm:block max-w-[155px] text-right font-sans text-[10.5px] leading-snug text-amber-200/15 blur-[0.4px] z-10"
              aria-hidden="true"
            >
              <p>{nextMeta.quote1}</p>
              <p className="text-amber-500/20">{nextMeta.quote2}</p>
            </div>

            {/* 3. Top Chamber Telemetry Header */}
            <div className="relative z-20 flex items-center justify-between px-3.5 sm:px-6 pt-3 sm:pt-4 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-zinc-400">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-amber-500/30 bg-black/80 px-2.5 sm:px-3 py-1 text-amber-300/95 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
                ROOM 0{active + 1} // {p.category}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/80 px-2.5 sm:px-3 py-1 text-zinc-300 backdrop-blur-md">
                <span className="hidden sm:inline">{meta.dimensionCoord} · </span>
                <span className="text-amber-400">{meta.gravityFreq}</span>
              </span>
            </div>

            {/* 4. Central Recessed Alcove Monitor Screen */}
            <div className="relative z-20 my-auto mx-auto w-[86%] sm:w-[70%] md:w-[64%] max-w-[500px]">
              <motion.div
                ref={windowRef}
                onMouseMove={handleMonitorMouseMove}
                onMouseEnter={() => setIsHoveringWindow(true)}
                onMouseLeave={() => setIsHoveringWindow(false)}
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
                className="group relative aspect-[16/10] w-full cursor-pointer overflow-hidden rounded-[12px] sm:rounded-[14px] border-2 border-amber-500/60 bg-[#050509] shadow-[0_0_55px_rgba(245,158,11,0.32),inset_0_0_35px_rgba(0,0,0,0.95)] transition-[border-color,box-shadow] duration-300 hover:border-amber-300 hover:shadow-[0_0_85px_rgba(245,158,11,0.52),inset_0_0_30px_rgba(245,158,11,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 will-change-transform transform-gpu"
              >
                {/* Inner Copper CRT Bezel */}
                <div
                  className="pointer-events-none absolute inset-[3px] sm:inset-[4px] rounded-[9px] sm:rounded-[10px] border border-amber-400/25 z-30"
                  aria-hidden="true"
                />

                {/* Subtle CRT Scanlines */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.1] z-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(254, 240, 138, 0.25) 1px, transparent 1px)",
                    backgroundSize: "100% 3px",
                  }}
                  aria-hidden="true"
                />

                {/* Dynamic Specular Glare */}
                <motion.div
                  className="pointer-events-none absolute -inset-16 opacity-25 group-hover:opacity-45 transition-opacity duration-300 z-20"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(254, 240, 138, 0.22) 0%, transparent 55%)",
                    left: glareX,
                    top: glareY,
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-hidden="true"
                />

                {/* Hardware Corner Crosshairs (+) */}
                <span className="absolute left-2 top-1.5 font-mono text-[9px] sm:text-[10px] font-bold leading-none text-amber-400/80 z-30">
                  +
                </span>
                <span className="absolute right-2 top-1.5 font-mono text-[9px] sm:text-[10px] font-bold leading-none text-amber-400/80 z-30">
                  +
                </span>
                <span className="absolute bottom-1.5 left-2 font-mono text-[9px] sm:text-[10px] font-bold leading-none text-amber-400/80 z-30">
                  +
                </span>
                <span className="absolute bottom-1.5 right-2 font-mono text-[9px] sm:text-[10px] font-bold leading-none text-amber-400/80 z-30">
                  +
                </span>

                {/* Animated Room Feed */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute inset-0 flex flex-col justify-between p-3 sm:p-6 z-10"
                  >
                    {/* Background Project Image or Deep Grid */}
                    {p.image ? (
                      <div className="absolute inset-0">
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 1024px) 85vw, 520px"
                          className="object-cover object-center filter brightness-[0.42] contrast-[1.18] transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#040408]/95 via-[#040408]/65 to-[#040408]/55" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-[#05050A]">
                        <div
                          className="pointer-events-none absolute inset-0 opacity-[0.16]"
                          style={{
                            backgroundImage:
                              "linear-gradient(to right, rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,158,11,0.18) 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                          }}
                        />
                      </div>
                    )}

                    {/* Top Mini Status */}
                    <div className="relative z-20 flex items-center justify-between font-mono text-[8.5px] sm:text-[9px] uppercase tracking-[0.18em] text-zinc-400">
                      <span className="flex items-center gap-1.5 text-amber-300/90">
                        <Radio className="h-2.5 w-2.5 text-amber-400 animate-pulse" />
                        {meta.shortName}
                      </span>
                      <span className="text-zinc-400">{meta.tickDate}</span>
                    </div>

                    {/* Center Quote */}
                    <div className="relative z-20 my-auto text-center px-1.5 sm:px-2">
                      <p className="font-sans text-[13px] sm:text-[18px] md:text-[20px] font-medium text-white leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                        {meta.quote1}
                      </p>
                      <p className="mt-0.5 sm:mt-1 font-sans text-[13px] sm:text-[18px] md:text-[20px] font-semibold text-amber-400 leading-snug drop-shadow-[0_0_18px_rgba(245,158,11,0.55)]">
                        {meta.quote2}
                      </p>
                    </div>

                    {/* Bottom Screen Action Prompt */}
                    <div className="relative z-20 flex items-center justify-between font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.16em] text-zinc-400 border-t border-amber-500/20 pt-1.5 sm:pt-2">
                      <span className="text-amber-300 font-semibold group-hover:text-white transition-colors">
                        TAP / CLICK TO ENTER →
                      </span>
                      <span className="text-zinc-500 truncate max-w-[110px]">
                        {p.status || "ACTIVE"}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Floating "Enter" Cursor Bubble (Desktop Hover) */}
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
                    opacity: { duration: 0.15 },
                    scale: { type: "spring", stiffness: 450, damping: 26 },
                  }}
                  className="pointer-events-none absolute z-40 hidden sm:flex h-[54px] w-[54px] items-center justify-center rounded-full bg-amber-500 font-sans text-[11px] font-bold text-black shadow-[0_0_25px_rgba(245,158,11,0.95)] ring-2 ring-amber-200/80"
                  aria-hidden="true"
                >
                  Enter
                </motion.div>
              </motion.div>
            </div>

            {/* 5. Docked Bottom Timeline Scrubber Overlay (Zero-Shift on both HP & Desktop!) */}
            <div className="relative z-20 border-t border-amber-500/25 bg-gradient-to-t from-[#030408] via-[#05060C]/95 to-[#05060C]/85 px-3 sm:px-6 pt-2.5 sm:pt-3.5 pb-3 sm:pb-4 backdrop-blur-md">
              <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
                {/* Room Index Counter 01 / 05 */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="font-mono text-[11.5px] sm:text-[13px] font-bold tracking-[0.16em] text-amber-400 tabular-nums">
                    0{active + 1} <span className="text-zinc-600">/</span> 0{total}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[8.5px] sm:text-[9.5px] uppercase tracking-[0.14em] text-zinc-400">
                    <Compass className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-500" />
                    <span className="hidden xs:inline">5D Temporal Axis</span>
                    <span className="xs:hidden">Swipe / Tap</span>
                  </span>
                </div>

                {/* Locked-Position Prev / Next Arrow Buttons (36px tap target on mobile!) */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPrev}
                    disabled={active === 0}
                    aria-label="Previous project room"
                    className="inline-flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-amber-500/35 bg-amber-500/10 text-amber-200 disabled:opacity-25 disabled:cursor-not-allowed hover:border-amber-400 hover:bg-amber-500/25 hover:text-white active:scale-95 transition-all cursor-pointer touch-manipulation"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    disabled={active === total - 1}
                    aria-label="Next project room"
                    className="inline-flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-amber-500/35 bg-amber-500/10 text-amber-200 disabled:opacity-25 disabled:cursor-not-allowed hover:border-amber-400 hover:bg-amber-500/25 hover:text-white active:scale-95 transition-all cursor-pointer touch-manipulation"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Node Track (o----o----o----o----o with Dates 2026.02 -> 2024.09) */}
              <div className="relative pt-1">
                <div className="absolute top-[9px] sm:top-[10px] left-[8%] right-[8%] h-[1.5px] bg-white/15" />
                <div
                  className="absolute top-[9px] sm:top-[10px] left-[8%] h-[1.5px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 transition-all duration-300 shadow-[0_0_10px_#f59e0b]"
                  style={{
                    width: `${(active / Math.max(1, total - 1)) * 84}%`,
                  }}
                />

                <div className="relative grid grid-cols-5">
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
                        className="group flex flex-col items-center focus-visible:outline-none cursor-pointer touch-manipulation py-0.5"
                      >
                        <span
                          className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border-2 transition-all duration-200 ${
                            isActive
                              ? "bg-amber-400 border-white shadow-[0_0_14px_#f59e0b] scale-125"
                              : "bg-[#05060C] border-amber-500/40 group-hover:border-amber-300"
                          }`}
                        />
                        <span
                          className={`mt-1.5 sm:mt-2 font-mono text-[8.5px] sm:text-[10px] tracking-tight sm:tracking-wider transition-colors ${
                            isActive
                              ? "text-amber-300 font-bold"
                              : "text-zinc-500 group-hover:text-zinc-300"
                          }`}
                        >
                          {m.tickDate}
                        </span>
                        <span
                          className={`font-mono text-[7.5px] sm:text-[8.5px] uppercase tracking-tight sm:tracking-wider truncate max-w-[54px] sm:max-w-[96px] ${
                            isActive
                              ? "text-white font-medium"
                              : "text-zinc-600 group-hover:text-zinc-400"
                          }`}
                        >
                          {m.shortName}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              RIGHT: ZERO-SHIFT LOCKED HEIGHT TYPOGRAPHIC READOUT PANEL
              Locked height on Mobile (h-[500px]) & Desktop (lg:h-[620px])
              Supports horizontal touch swipe on mobile phones!
             ===================================================================== */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="flex flex-col justify-between h-[500px] sm:h-[560px] lg:h-[620px] rounded-[20px] sm:rounded-[24px] border border-white/10 bg-[#06070D]/90 p-4 sm:p-7 backdrop-blur-md shadow-[0_0_50px_rgba(0,0,0,0.6)] touch-pan-y"
          >
            {/* Top Section: Kicker + Quick Arrows + Title + Spec Row */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-amber-500 min-w-0">
                  <span className="font-bold shrink-0">0{active + 1}</span>
                  <span className="h-px w-4 sm:w-5 bg-amber-500/50 shrink-0" />
                  <span className="truncate">{p.category}</span>
                  <span className="text-zinc-600 shrink-0">·</span>
                  <span className="text-zinc-400 shrink-0">{meta.tickDate}</span>
                </p>

                {/* Stationary Prev/Next Arrows in Readout Header */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={goToPrev}
                    disabled={active === 0}
                    aria-label="Previous room"
                    className="inline-flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-zinc-300 disabled:opacity-25 disabled:cursor-not-allowed hover:border-amber-500/40 hover:text-white transition-colors cursor-pointer touch-manipulation"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    disabled={active === total - 1}
                    aria-label="Next room"
                    className="inline-flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-zinc-300 disabled:opacity-25 disabled:cursor-not-allowed hover:border-amber-500/40 hover:text-white transition-colors cursor-pointer touch-manipulation"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  </button>
                </div>
              </div>

              {/* Fixed-Height Title Slot (2 lines locked on mobile & desktop) */}
              <div className="mt-1.5 sm:mt-2 h-[54px] sm:h-[74px] flex items-center">
                <h3 className="font-sans text-[21px] sm:text-[31px] lg:text-[34px] font-black leading-[1.12] text-white tracking-[-0.02em] line-clamp-2">
                  {p.title}
                </h3>
              </div>

              {/* Readout Spec Grid (Period · Status · Signal) */}
              <dl className="mt-2 sm:mt-3 grid grid-cols-3 gap-2 sm:gap-3 border-y border-white/10 py-2.5 sm:py-3 font-mono">
                <div>
                  <dt className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.16em] text-zinc-500">
                    Period
                  </dt>
                  <dd className="mt-0.5 text-[10px] sm:text-[11px] font-medium text-zinc-200 truncate">
                    {p.year}
                  </dd>
                </div>
                <div>
                  <dt className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.16em] text-zinc-500">
                    Status
                  </dt>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-[#fef08a] truncate">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                    <span className="truncate">{p.status || "Active"}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-[8.5px] sm:text-[9px] uppercase tracking-[0.16em] text-zinc-500">
                    Signal
                  </dt>
                  <dd className="mt-0.5 text-[10px] sm:text-[10.5px] font-medium text-amber-300/90 truncate">
                    {p.signal ? p.signal.split("·")[0] : p.highlight}
                  </dd>
                </div>
              </dl>

              {/* Fixed-Height Description Slot (3 lines locked) */}
              <p className="mt-2.5 sm:mt-3.5 h-[58px] sm:h-[66px] font-sans text-[12.5px] sm:text-[13.5px] leading-relaxed text-zinc-300 line-clamp-3">
                {p.description}
              </p>
            </div>

            {/* Middle Section: Uniform 2x2 Operational Telemetry Grid (2x2 on BOTH Mobile & Desktop!) */}
            <div className="my-2 sm:my-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-2.5 sm:p-3">
              <div className="mb-1.5 sm:mb-2 flex items-center justify-between font-mono text-[8.5px] sm:text-[9px] uppercase tracking-[0.16em] text-amber-400/80">
                <span className="flex items-center gap-1.5 truncate">
                  <Layers className="h-3 w-3 text-amber-400 shrink-0" />
                  <span className="truncate">ROOM TELEMETRY // 4-NODE</span>
                </span>
                <span className="text-zinc-500 shrink-0">{meta.gravityFreq}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                {meta.telemetryNodes.map((wf) => (
                  <div
                    key={wf.step}
                    data-sfx="card"
                    className="flex items-start gap-1.5 sm:gap-2 rounded-lg border border-white/5 bg-black/50 p-1.5 sm:p-2 h-[54px] sm:h-[60px] overflow-hidden hover:border-amber-500/30 transition-colors"
                  >
                    <span className="mt-0.5 inline-flex h-4 w-4 sm:w-5 shrink-0 items-center justify-center rounded bg-amber-500/20 font-mono text-[8.5px] sm:text-[9px] font-bold text-amber-400">
                      {wf.step}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[9.5px] sm:text-[10px] font-semibold text-[#fef08a] leading-tight truncate">
                        {wf.title}
                      </p>
                      <p className="mt-0.5 font-sans text-[9.5px] sm:text-[10.5px] leading-tight text-zinc-400 line-clamp-2">
                        {wf.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section: Stack Chips + Action Buttons */}
            <div>
              {/* Tech Stack Chips (Single-row locked height on mobile) */}
              <ul
                className="flex items-center gap-1.5 font-mono text-[9.5px] sm:text-[10px] text-zinc-300 h-[26px] overflow-x-auto no-scrollbar whitespace-nowrap"
                aria-label="Stack"
              >
                {p.stack.slice(0, 6).map((s) => (
                  <li
                    key={s}
                    data-sfx="badge"
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 hover:border-amber-500/40 hover:text-amber-200 transition-colors cursor-default"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              {/* Action Buttons Bar */}
              <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-2.5 pt-3 sm:pt-3.5 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={handleEnterRoom}
                  className="group inline-flex items-center rounded-full bg-white text-black font-mono text-[10.5px] sm:text-[11px] font-semibold transition-all hover:bg-zinc-200 active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(255,255,255,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white touch-manipulation"
                >
                  <span className="py-2 pl-3.5 sm:pl-4 pr-2">Enter room</span>
                  <span className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-amber-500 text-black mr-1 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>

                {p.codeUrl && (
                  <a
                    href={p.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[34px] items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/[0.07] px-3 sm:px-3.5 font-mono text-[10px] sm:text-[10.5px] text-amber-200 hover:border-amber-400 hover:bg-amber-500/15 hover:text-white transition-colors"
                  >
                    <Github className="h-3.5 w-3.5 text-amber-400" />
                    <span>View Code</span>
                    <ArrowUpRight className="h-3 w-3 text-amber-400/80" />
                  </a>
                )}

                {p.demoUrl && p.demoUrl !== "#" && (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[34px] items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 sm:px-3.5 font-mono text-[10px] sm:text-[10.5px] text-zinc-300 hover:border-amber-500/40 hover:text-amber-400 transition-colors"
                  >
                    <span>Live Demo</span>
                    <ArrowUpRight className="h-3 w-3 text-zinc-500" />
                  </a>
                )}

                <span className="ml-auto inline-flex items-center gap-1 font-mono text-[9.5px] sm:text-[10px] text-amber-300/80">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  0{active + 1}
                </span>
              </div>
            </div>
          </div>
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
