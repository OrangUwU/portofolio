"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowUpRight, Compass, Github, Instagram, Radio } from "lucide-react";

interface HeroSingularityProps {
  onContactOpen?: () => void;
}

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// 60FPS-Optimized Kerr Black Hole Ray-Tracing & Relativistic Doppler Beaming Shader (Zero Bounding Box)
const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 v_uv;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_scroll;

  mat2 rot(float a) {
    float s = sin(a), c = cos(a);
    return mat2(c, -s, s, c);
  }

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Ultra-fast 2-octave harmonic fbm for 60/120fps lock
  float fbm2(vec2 p) {
    float v = 0.65 * noise(p);
    p = p * 2.08 + vec2(1.7, 9.2);
    v += 0.35 * noise(p);
    return v;
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    // Subtle 3D gyro camera shift from mouse pointer
    uv += u_mouse * 0.022;

    // Tilt coordinate frame by -17 degrees (Gargantua equatorial tilt)
    float tiltAngle = -0.2967 + u_mouse.x * 0.032;
    vec2 p = rot(tiltAngle) * uv;

    float r = length(p);
    float rs = 0.145;
    float photonRadius = 0.152;

    // 1. Upper & Lower Relativistic Gravitational Lensing Arcs
    float upperArcMask = smoothstep(-0.05, 0.15, p.y);
    float lowerArcMask = smoothstep(-0.01, -0.17, p.y);

    float angle = atan(p.y, p.x);
    float swirl = fbm2(vec2(r * 15.0 - u_time * 0.28, angle * 3.0 + u_time * 0.92));
    float fineRings = sin(r * 130.0 - u_time * 2.5 + swirl * 4.2) * 0.5 + 0.5;

    float upperHalo = exp(-pow((r - 0.178) / (0.030 + 0.012 * upperArcMask), 2.0)) * upperArcMask;
    upperHalo *= (0.76 + 0.45 * swirl + 0.25 * fineRings);

    float lowerHalo = exp(-pow((r - 0.172) / 0.025, 2.0)) * lowerArcMask * 0.85;
    lowerHalo *= (0.72 + 0.4 * swirl);

    // 2. Equatorial Accretion Disk (Front & Extended Wings)
    float warpY = p.y * (4.5 - 1.5 * exp(-r * 3.8));
    vec2 diskCoord = vec2(p.x, warpY);
    float diskR = length(diskCoord);
    float diskAngle = atan(diskCoord.y, diskCoord.x);

    float spiralNoise = fbm2(vec2(diskR * 13.0, diskAngle * 4.0 - u_time * 1.45 + 1.5 / max(diskR, 0.13)));
    float concentric = sin(diskR * 100.0 - u_time * 3.1 + spiralNoise * 4.8) * 0.5 + 0.5;

    float innerCutoff = smoothstep(0.140, 0.168, diskR);
    float outerFade = exp(-max(diskR - 0.16, 0.0) * 8.2);
    float verticalSheet = exp(-abs(p.y) * 21.0);
    float diskDensity = innerCutoff * outerFade * verticalSheet * (0.60 + 0.55 * spiralNoise + 0.32 * concentric);

    // Front occlusion: front half of disk crosses IN FRONT of the black hole shadow
    float isFrontDisk = smoothstep(0.022, -0.012, p.y) * smoothstep(0.130, 0.185, diskR);

    // 3. Relativistic Doppler Beaming (Approaching left side is super-luminous, receding right is redshifted)
    float beta = 0.55 * sqrt(rs / max(diskR, rs));
    float cosTheta = -p.x / max(diskR, 0.001);
    float dopplerFactor = pow(1.0 / max(1.0 - beta * cosTheta, 0.35), 2.35);
    dopplerFactor = clamp(dopplerFactor, 0.28, 2.7);

    // 4. Photon Sphere & Event Horizon Shadow Mask
    float shadowMask = smoothstep(rs - 0.004, rs + 0.004, r);
    float effectiveShadow = clamp(shadowMask + isFrontDisk * 1.15, 0.0, 1.0);

    float photonRing = exp(-pow((r - photonRadius) / 0.0042, 2.0)) * 1.55;
    float secondaryPhotonRing = exp(-pow((r - (photonRadius + 0.008)) / 0.009, 2.0)) * 0.58;

    float totalIntensity = (upperHalo + lowerHalo) * shadowMask + diskDensity * effectiveShadow + photonRing + secondaryPhotonRing * shadowMask;
    totalIntensity *= mix(0.64, 1.42, clamp((dopplerFactor - 0.3) / 2.2, 0.0, 1.0));

    // Relativistic Blackbody Color Spectrum
    float beamShift = clamp(-p.x * 2.6 + 0.55, 0.0, 1.0);
    vec3 colReceding = vec3(0.72, 0.26, 0.03);   // Deep redshifted amber-ochre (#b45309)
    vec3 colMid = vec3(0.96, 0.62, 0.05);        // Golden Gargantua amber (#f59e0b)
    vec3 colApproaching = vec3(1.0, 0.96, 0.82); // Super-heated white-gold (#fef08a / #fffbeb)
    vec3 colBlueHot = vec3(1.0, 0.99, 0.94);     // Brilliant photonic white core

    vec3 baseColor = mix(colReceding, colMid, smoothstep(0.0, 0.55, beamShift));
    baseColor = mix(baseColor, colApproaching, smoothstep(0.45, 0.90, beamShift));
    baseColor = mix(baseColor, colBlueHot, smoothstep(0.80, 1.0, beamShift) * smoothstep(0.7, 1.6, totalIntensity));

    vec3 col = baseColor * totalIntensity;
    col += vec3(1.0, 0.97, 0.88) * pow(max(totalIntensity - 0.70, 0.0), 1.85) * 0.95;

    // Pure black Schwarzschild/Kerr shadow interior
    float voidInterior = (1.0 - smoothstep(rs - 0.005, rs + 0.003, r)) * (1.0 - isFrontDisk);
    col *= (1.0 - voidInterior);

    // Smooth radial falloff so canvas boundaries are 100% invisible (Zero Bounding Box!)
    float distFromCenter = length(uv);
    float edgeFade = smoothstep(0.48, 0.22, distFromCenter);
    vec2 borderDist = abs(v_uv - 0.5) * 2.0;
    float boxFade = smoothstep(0.94, 0.60, max(borderDist.x, borderDist.y));
    float finalFade = edgeFade * boxFade;

    col *= finalFade;
    float alpha = clamp(length(col) * 1.1 * finalFade, 0.0, 1.0);

    gl_FragColor = vec4(col, alpha);
  }
`;

interface AccretionParticle {
  r: number;
  angle: number;
  zOffset: number;
  size: number;
  speedFactor: number;
  inspiralRate: number;
  isLensedHalo: boolean;
  brightness: number;
}

export function HeroSingularity({ onContactOpen }: HeroSingularityProps) {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const [telemetryTick, setTelemetryTick] = useState(0);

  // 1. Live telemetry ticker for authentic sci-fi instrumentation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryTick((prev) => (prev + 1) % 1000);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // 2. Smooth 3D Pointer Gyro Parallax (useMotionValue + useSpring damping 25)
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, { stiffness: 110, damping: 25, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 110, damping: 25, mass: 0.6 });

  const cameraRotateX = useTransform(smoothY, [-1, 1], [8, -8]);
  const cameraRotateY = useTransform(smoothX, [-1, 1], [-11, 11]);
  const cameraTranslateX = useTransform(smoothX, [-1, 1], [-20, 20]);
  const cameraTranslateY = useTransform(smoothY, [-1, 1], [-14, 14]);

  // 3. Sticky Scrollytelling Timeline (h-[180vh] outer track -> sticky top-0 h-screen viewport)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scroll 0% -> 35%: Editorial text & buttons smoothly fade out upward
  const heroOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const heroTranslateY = useTransform(scrollYProgress, [0, 0.35], [0, -60]);
  const hudBottomOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0]);
  const calloutOpacity = useTransform(scrollYProgress, [0, 0.42], [1, 0]);

  // Scroll 15% -> 90%: Smooth 60fps zoom-through dive directly into the Event Horizon (scale: 1 -> 3.8)
  const blackholeScale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.55, 0.88, 1],
    [1, 1.15, 1.9, 3.3, 3.8]
  );
  const blackholeX = useTransform(
    scrollYProgress,
    [0, 0.2, 0.85, 1],
    ["0%", "-2%", "-12%", "-14%"]
  );
  const blackholeY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["0%", "2%", "6%"]
  );
  const diskRotate = useTransform(scrollYProgress, [0, 0.85], [-17, -3]);

  // Scroll 75% -> 100%: Golden Photonic Event Horizon Tunnel & Tesseract Bridge (Zero Black Void)
  const tunnelRingOpacity = useTransform(
    scrollYProgress,
    [0, 0.65, 0.88, 1],
    [0, 0.12, 0.72, 0.95]
  );
  const tunnelScale = useTransform(scrollYProgress, [0.55, 1], [0.75, 1.65]);

  // Pointer handler on the hero section
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny =
      ((e.clientY - rect.top) / (window.innerHeight || rect.height)) * 2 - 1;
    pointerX.set(Math.max(-1, Math.min(1, nx)));
    pointerY.set(Math.max(-1, Math.min(1, ny)));
    mouseTargetRef.current = {
      x: Math.max(-1, Math.min(1, nx)),
      y: Math.max(-1, Math.min(1, -ny)),
    };
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
    mouseTargetRef.current = { x: 0, y: 0 };
  };

  // 4. WebGL Kerr Metric Shader Initialization (Capped DPR for 60/120fps Lock)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uScroll = gl.getUniformLocation(program, "u_scroll");

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth || 1200;
      const height = canvas.clientHeight || 900;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;
    const startTime = performance.now();
    const currentMouse = { x: 0, y: 0 };

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      currentMouse.x += (mouseTargetRef.current.x - currentMouse.x) * 0.06;
      currentMouse.y += (mouseTargetRef.current.y - currentMouse.y) * 0.06;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);
      gl.uniform1f(uScroll, scrollYProgress.get());

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      gl.deleteBuffer(buffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
    };
  }, [scrollYProgress]);

  // 5. Keplerian Relativistic Accretion Particle & Cosmic Dust Stream (260 Particles)
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const PARTICLE_COUNT = 260;
    const R_SHADOW = 0.162;
    const R_MIN = 0.168;
    const R_MAX = 0.375;

    const particles: AccretionParticle[] = Array.from(
      { length: PARTICLE_COUNT },
      (_, i) => {
        const isLensedHalo = i < 60;
        const u = Math.random();
        const r = isLensedHalo
          ? R_SHADOW + 0.01 + Math.random() * 0.048
          : R_MIN + Math.pow(u, 1.35) * (R_MAX - R_MIN);

        return {
          r,
          angle: Math.random() * Math.PI * 2,
          zOffset: (Math.random() - 0.5) * 0.02,
          size: 0.75 + Math.random() * 1.8,
          speedFactor: 0.85 + Math.random() * 0.35,
          inspiralRate: 0.00012 + Math.random() * 0.00022,
          isLensedHalo,
          brightness: 0.55 + Math.random() * 0.45,
        };
      }
    );

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth || 1200;
      const height = canvas.clientHeight || 900;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;
    let lastTime = performance.now();

    const renderParticles = (now: number) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      const scale = Math.min(w, h);

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(cx, cy);
      const tiltRad = (-17 * Math.PI) / 180 + mouseTargetRef.current.x * 0.032;
      ctx.rotate(tiltRad);

      const shadowPx = R_SHADOW * scale;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Keplerian relativistic angular velocity: omega ~ r^(-1.5)
        const omega = 0.24 * Math.pow(R_MIN / p.r, 1.5) * p.speedFactor;
        p.angle += omega * dt * 6.0;

        // Spiral inspiral into the black hole event horizon
        p.r -= p.inspiralRate * (R_MIN / p.r);
        if (p.r <= R_MIN) {
          p.r = p.isLensedHalo
            ? R_SHADOW + 0.04 + Math.random() * 0.02
            : R_MAX - Math.random() * 0.035;
          p.angle = Math.random() * Math.PI * 2;
        }

        const cosA = Math.cos(p.angle);
        const sinA = Math.sin(p.angle);

        let x = 0;
        let y = 0;
        let tx = 0;
        let ty = 0;

        if (p.isLensedHalo) {
          const haloR = p.r * scale;
          x = cosA * haloR;
          y = sinA * haloR * 0.96;
          tx = -sinA;
          ty = cosA * 0.96;
        } else {
          const diskRx = p.r * scale;
          const diskRy = p.r * scale * (0.22 + 0.04 * (R_MIN / p.r));
          x = cosA * diskRx;
          y = sinA * diskRy + p.zOffset * scale;

          const distFromCenter = Math.hypot(x, y);
          if (sinA < 0 && distFromCenter < shadowPx * 1.04) {
            continue;
          }

          tx = -sinA * diskRx;
          ty = cosA * diskRy;
          const tLen = Math.hypot(tx, ty) || 1;
          tx /= tLen;
          ty /= tLen;
        }

        const doppler = Math.max(0.22, Math.min(1.0, (-cosA + 0.65) * 0.72));
        const radialFade =
          Math.min(1, (p.r - R_MIN) / 0.022) *
          Math.min(1, (R_MAX - p.r) / 0.075);
        const alpha = Math.max(
          0.04,
          Math.min(0.95, p.brightness * doppler * (p.isLensedHalo ? 0.75 : radialFade))
        );

        const streakLen =
          (3.5 + 14.0 * Math.pow(R_MIN / p.r, 1.6) * doppler) *
          (scale / 900);

        let strokeColor: string;
        if (doppler > 0.78) {
          strokeColor = `rgba(255, 251, 235, ${alpha.toFixed(3)})`;
        } else if (doppler > 0.52) {
          strokeColor = `rgba(254, 240, 138, ${alpha.toFixed(3)})`;
        } else if (doppler > 0.34) {
          strokeColor = `rgba(245, 158, 11, ${alpha.toFixed(3)})`;
        } else {
          strokeColor = `rgba(217, 119, 6, ${(alpha * 0.85).toFixed(3)})`;
        }

        ctx.beginPath();
        ctx.moveTo(x - tx * streakLen, y - ty * streakLen);
        ctx.lineTo(x + tx * streakLen * 0.35, y + ty * streakLen * 0.35);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = p.size * (scale / 900) * (0.75 + 0.45 * doppler);
        ctx.lineCap = "round";
        ctx.stroke();

        if (doppler > 0.72 && p.size > 1.3) {
          ctx.beginPath();
          ctx.arc(x, y, p.size * 0.65 * (scale / 900), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.9).toFixed(3)})`;
          ctx.fill();
        }
      }

      ctx.restore();
      rafId = requestAnimationFrame(renderParticles);
    };

    rafId = requestAnimationFrame(renderParticles);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const dopplerReadout = (2.84 + Math.sin(telemetryTick * 0.7) * 0.03).toFixed(2);
  const redshiftReadout = (0.412 + Math.cos(telemetryTick * 0.5) * 0.004).toFixed(3);

  return (
    <section
      ref={containerRef}
      id="top"
      data-world="blackhole"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative h-[175vh] sm:h-[180vh] w-full bg-[#030409] select-none touch-pan-y"
    >
      {/* STICKY 100SVH VIEWPORT FOR SMOOTH 60FPS SCROLLYTELLING ZOOM DIVE */}
      <div
        style={{ perspective: "1400px" }}
        className="sticky top-0 h-[100svh] min-h-[580px] w-full overflow-hidden flex flex-col justify-between px-4 sm:px-8 lg:px-14 pt-16 sm:pt-24 pb-6 sm:pb-10"
      >
        {/* 1. Deep Space Cosmic Starfield & Relativistic Lensing Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.075]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.92) 1px, transparent 1px), radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.65) 1px, transparent 1px)",
            backgroundSize: "36px 36px, 96px 96px",
          }}
          aria-hidden="true"
        />

        {/* 2. Ambient Relativistic Nebula & Doppler Asymmetric Glow */}
        <div className="pointer-events-none absolute right-[4%] top-[40%] h-[420px] sm:h-[680px] w-[420px] sm:w-[680px] -translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-600/[0.17] via-amber-400/[0.08] to-transparent blur-[120px] sm:blur-[140px]" />
        <div className="pointer-events-none absolute left-[25%] sm:left-[38%] top-[28%] h-[280px] sm:h-[420px] w-[280px] sm:w-[420px] rounded-full bg-amber-200/[0.07] blur-[100px] sm:blur-[120px]" />

        {/* Mobile Compact FIG. 00 Telemetry Badge (Visible on Mobile HP) */}
        <motion.div
          style={{ opacity: calloutOpacity }}
          className="md:hidden relative z-20 flex items-center justify-between rounded-full border border-amber-500/25 bg-black/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-zinc-300 backdrop-blur-md"
        >
          <span className="text-amber-400 font-bold">FIG. 00 // KERR METRIC</span>
          <span className="text-amber-200">
            a≈0.998M · δ={dopplerReadout}
          </span>
        </motion.div>

        {/* =========================================================================
            3. GARGANTUA KERR BLACK HOLE (WIDE 1200x900 VIEWBOX — ZERO BOUNDING BOX & 60FPS)
           ========================================================================= */}
        <div
          data-anchor="blackhole"
          aria-hidden="true"
          className="pointer-events-none absolute aspect-[4/3] -translate-x-1/2 -translate-y-1/2 left-1/2 top-[34%] w-[136vw] sm:w-[min(120vw,1050px)] md:left-[61%] md:top-[42%] md:w-[min(86vw,1180px)] z-10 overflow-visible"
        >
          <motion.div
            style={{
              scale: blackholeScale,
              x: blackholeX,
              y: blackholeY,
              rotateX: cameraRotateX,
              rotateY: cameraRotateY,
              translateX: cameraTranslateX,
              translateY: cameraTranslateY,
              transformStyle: "preserve-3d",
            }}
            className="relative h-full w-full flex items-center justify-center will-change-transform transform-gpu overflow-visible"
          >
            {/* 3.1 Real-Time WebGL Kerr Metric Ray-Tracing Shader Canvas (Screen Blend = Zero Box) */}
            <canvas
              ref={canvasRef}
              style={{ mixBlendMode: "screen" }}
              className="pointer-events-none absolute inset-0 h-full w-full opacity-95 transform-gpu will-change-transform"
            />

            {/* 3.2 Wide 1200x900 GPU-Accelerated SVG Relativistic Lensing & Photon Sphere (Zero CPU feTurbulence Lag!) */}
            <svg
              viewBox="0 0 1200 900"
              className="relative z-10 h-full w-full overflow-visible pointer-events-none transform-gpu will-change-transform"
            >
              <defs>
                {/* Relativistic Doppler Beaming Gradient (Left super-luminous #fffbeb/#fef08a -> Right redshifted #d97706/#b45309) */}
                <linearGradient id="kerrDopplerDisk" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0" />
                  <stop offset="8%" stopColor="#fef08a" stopOpacity="0.35" />
                  <stop offset="20%" stopColor="#fffbeb" stopOpacity="1" />
                  <stop offset="36%" stopColor="#fef08a" stopOpacity="0.98" />
                  <stop offset="56%" stopColor="#f59e0b" stopOpacity="0.88" />
                  <stop offset="78%" stopColor="#d97706" stopOpacity="0.45" />
                  <stop offset="92%" stopColor="#b45309" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
                </linearGradient>

                {/* Upper & Lower Lensing Arc Asymmetric Doppler Gradient */}
                <linearGradient id="poggLensingHalo" x1="0%" y1="30%" x2="100%" y2="70%">
                  <stop offset="0%" stopColor="#fde68a" stopOpacity="0.25" />
                  <stop offset="22%" stopColor="#fffbeb" stopOpacity="0.98" />
                  <stop offset="46%" stopColor="#fef08a" stopOpacity="0.92" />
                  <stop offset="72%" stopColor="#d97706" stopOpacity="0.58" />
                  <stop offset="90%" stopColor="#b45309" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#78350f" stopOpacity="0" />
                </linearGradient>

                {/* Wide Unbounded Front/Rear Geometry Clipping Centered at Y=450 (Zero Edge Cutoff) */}
                <clipPath id="frontHalfClip">
                  <rect x="-400" y="444" width="2000" height="900" />
                </clipPath>
                <clipPath id="rearHalfClip">
                  <rect x="-400" y="-450" width="2000" height="902" />
                </clipPath>
              </defs>

              {/* 3A. Relativistic Einstein Ring & Ambient Lensing Corona */}
              <circle
                cx="600"
                cy="450"
                r="195"
                fill="none"
                stroke="url(#poggLensingHalo)"
                strokeWidth="26"
                opacity="0.18"
              />

              {/* Sci-Fi Orbital Coordinate Reticle Rings */}
              <circle
                cx="600"
                cy="450"
                r="268"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="0.6"
                strokeDasharray="4 10"
                opacity="0.22"
              />
              <circle
                cx="600"
                cy="450"
                r="224"
                fill="none"
                stroke="#fef08a"
                strokeWidth="0.5"
                strokeDasharray="2 14"
                opacity="0.18"
              />

              {/* 3B. UPPER GRAVITATIONAL LENSING ARC (Light from behind disk bent over top of event horizon) */}
              <g transform="rotate(-17 600 450)">
                <ellipse
                  cx="600"
                  cy="450"
                  rx="186"
                  ry="181"
                  fill="none"
                  stroke="url(#poggLensingHalo)"
                  strokeWidth="20"
                  strokeDasharray="550 800"
                  strokeDashoffset="-45"
                  strokeLinecap="round"
                  opacity="0.78"
                />
                <ellipse
                  cx="600"
                  cy="450"
                  rx="174"
                  ry="170"
                  fill="none"
                  stroke="url(#kerrDopplerDisk)"
                  strokeWidth="8.5"
                  strokeDasharray="510 750"
                  strokeDashoffset="-68"
                  strokeLinecap="round"
                  opacity="0.94"
                />
                <ellipse
                  cx="600"
                  cy="450"
                  rx="165"
                  ry="163"
                  fill="none"
                  stroke="#fffbeb"
                  strokeWidth="2.5"
                  strokeDasharray="430 700"
                  strokeDashoffset="-95"
                  strokeLinecap="round"
                  className="animate-accretion-flow"
                  opacity="0.96"
                />
                <ellipse
                  cx="600"
                  cy="450"
                  rx="159"
                  ry="158"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="2.8"
                  strokeDasharray="390 700"
                  strokeDashoffset="-110"
                  strokeLinecap="round"
                  opacity="0.82"
                />

                {/* 3C. LOWER GRAVITATIONAL LENSING ARC (Complete unclipped rounded arc beneath event horizon) */}
                <ellipse
                  cx="600"
                  cy="450"
                  rx="178"
                  ry="173"
                  fill="none"
                  stroke="url(#poggLensingHalo)"
                  strokeWidth="15"
                  strokeDasharray="320 800"
                  strokeDashoffset="-425"
                  strokeLinecap="round"
                  opacity="0.72"
                />
                <ellipse
                  cx="600"
                  cy="450"
                  rx="168"
                  ry="164"
                  fill="none"
                  stroke="url(#kerrDopplerDisk)"
                  strokeWidth="5.5"
                  strokeDasharray="270 800"
                  strokeDashoffset="-450"
                  strokeLinecap="round"
                  opacity="0.88"
                />
                <ellipse
                  cx="600"
                  cy="450"
                  rx="160"
                  ry="158"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="2"
                  strokeDasharray="230 800"
                  strokeDashoffset="-470"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </g>

              {/* 3D. REAR EQUATORIAL ACCRETION DISK (Behind Event Horizon) */}
              <g clipPath="url(#rearHalfClip)">
                <g transform="rotate(-17 600 450)">
                  <ellipse
                    cx="600"
                    cy="450"
                    rx="355"
                    ry="78"
                    fill="none"
                    stroke="url(#kerrDopplerDisk)"
                    strokeWidth="26"
                    opacity="0.58"
                  />
                  <ellipse
                    cx="600"
                    cy="450"
                    rx="320"
                    ry="70"
                    fill="none"
                    stroke="url(#kerrDopplerDisk)"
                    strokeWidth="9"
                    opacity="0.78"
                  />
                  <ellipse
                    cx="600"
                    cy="450"
                    rx="288"
                    ry="62"
                    fill="none"
                    stroke="#fffbeb"
                    strokeWidth="3"
                    strokeDasharray="210 55"
                    className="animate-accretion-flow"
                    opacity="0.92"
                  />
                  <ellipse
                    cx="600"
                    cy="450"
                    rx="254"
                    ry="54"
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth="4.5"
                    opacity="0.85"
                  />
                  <ellipse
                    cx="600"
                    cy="450"
                    rx="218"
                    ry="46"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="4"
                    opacity="0.7"
                  />
                </g>
              </g>

              {/* 3E. SCHWARZSCHILD / KERR EVENT HORIZON SHADOW & PHOTON SPHERE */}
              <circle cx="600" cy="450" r="146" fill="#000000" />

              {/* Subtle Inner Frame-Dragging Ergosphere Rim */}
              <circle
                cx="600"
                cy="450"
                r="147.5"
                fill="none"
                stroke="url(#kerrDopplerDisk)"
                strokeWidth="3.5"
                opacity="0.82"
              />

              {/* Razor-Thin Relativistic Photon Sphere Ring (r_ph) */}
              <circle
                cx="600"
                cy="450"
                r="149"
                fill="none"
                stroke="#fffbeb"
                strokeWidth="2"
                className="animate-photon-pulse"
              />

              {/* 3F. EQUATORIAL FRONT ACCRETION DISK (Crossing IN FRONT of the Event Horizon) */}
              <motion.g
                style={{
                  rotate: diskRotate,
                  transformOrigin: "600px 450px",
                }}
              >
                <g clipPath="url(#frontHalfClip)">
                  <ellipse
                    cx="600"
                    cy="450"
                    rx="360"
                    ry="78"
                    fill="none"
                    stroke="url(#kerrDopplerDisk)"
                    strokeWidth="30"
                    opacity="0.86"
                  />
                  <ellipse
                    cx="600"
                    cy="450"
                    rx="320"
                    ry="70"
                    fill="none"
                    stroke="url(#kerrDopplerDisk)"
                    strokeWidth="13"
                    opacity="0.95"
                  />
                  <ellipse
                    cx="600"
                    cy="450"
                    rx="292"
                    ry="62"
                    fill="none"
                    stroke="#fffbeb"
                    strokeWidth="4"
                    strokeDasharray="280 65"
                    className="animate-accretion-fast"
                    opacity="0.98"
                  />
                  <ellipse
                    cx="600"
                    cy="450"
                    rx="264"
                    ry="55"
                    fill="none"
                    stroke="#fef08a"
                    strokeWidth="6.5"
                    opacity="0.92"
                  />
                  <ellipse
                    cx="600"
                    cy="450"
                    rx="234"
                    ry="48"
                    fill="none"
                    stroke="url(#kerrDopplerDisk)"
                    strokeWidth="5.5"
                    strokeDasharray="170 45"
                    className="animate-accretion-flow"
                    opacity="0.88"
                  />
                  <ellipse
                    cx="600"
                    cy="450"
                    rx="204"
                    ry="42"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    opacity="0.74"
                  />
                </g>
              </motion.g>

              {/* Precision Target Reticle Marks on Singularity Axis */}
              <g stroke="#f59e0b" strokeWidth="1" opacity="0.45">
                <line x1="594" y1="450" x2="606" y2="450" />
                <line x1="600" y1="444" x2="600" y2="456" />
                <path d="M 425 285 L 415 285 L 415 295" fill="none" />
                <path d="M 775 285 L 785 285 L 785 295" fill="none" />
                <path d="M 425 615 L 415 615 L 415 605" fill="none" />
                <path d="M 775 615 L 785 615 L 785 605" fill="none" />
              </g>
            </svg>

            {/* 3.3 Dynamic Keplerian Accretion Particles & Cosmic Dust Stream Canvas (Screen Blend = Zero Box) */}
            <canvas
              ref={particleCanvasRef}
              style={{ mixBlendMode: "screen" }}
              className="pointer-events-none absolute inset-0 z-20 h-full w-full transform-gpu will-change-transform"
            />

            {/* =========================================================================
                FIG. 00 · KERR METRIC ACCRETION DISK HUD TELEMETRY CALLOUT
               ========================================================================= */}
            <motion.div
              style={{ opacity: calloutOpacity }}
              className="hidden md:block absolute left-[54%] top-[24%] pointer-events-none z-30 select-none"
            >
              <svg
                width="310"
                height="90"
                viewBox="0 0 310 90"
                fill="none"
                className="overflow-visible"
              >
                <circle cx="4" cy="72" r="3.5" fill="#fef08a" />
                <circle
                  cx="4"
                  cy="72"
                  r="8"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeOpacity="0.6"
                />
                <path
                  d="M4 72 L56 16 L285 16"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeOpacity="0.85"
                />
                <rect x="56" y="13" width="18" height="3" fill="#f59e0b" />
              </svg>

              <div className="absolute left-[64px] top-[-10px] whitespace-nowrap font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="uppercase tracking-[0.22em] text-amber-400 font-bold">
                    FIG. 00: KERR METRIC ACCRETION DISK
                  </span>
                </div>
                <p className="mt-0.5 font-sans text-[14px] font-bold text-white tracking-tight">
                  The singularity · Gargantua Horizon
                </p>
                <p className="font-sans text-[11px] text-zinc-300 tracking-wide">
                  Full Stack Engineer &amp; Tech Researcher · Banyuwangi
                </p>
                <div className="mt-2 flex items-center gap-3 rounded-md border border-amber-500/25 bg-black/75 px-2.5 py-1 text-[9.5px] text-zinc-400 backdrop-blur-md">
                  <span>
                    SPIN <strong className="text-amber-400">a ≈ 0.998M</strong>
                  </span>
                  <span className="text-zinc-700">|</span>
                  <span>
                    DOPPLER{" "}
                    <strong className="text-amber-200">δ={dopplerReadout}</strong>
                  </span>
                  <span className="text-zinc-700">|</span>
                  <span>
                    z=<strong className="text-amber-500">{redshiftReadout}</strong>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Lower-Left Relativistic Lensing Telemetry Micro-HUD */}
            <motion.div
              style={{ opacity: calloutOpacity }}
              className="hidden lg:flex items-center gap-2.5 absolute left-[18%] bottom-[16%] pointer-events-none z-30 rounded-full border border-amber-500/20 bg-black/75 px-3.5 py-1.5 backdrop-blur-md font-mono text-[9.5px] uppercase tracking-[0.18em] text-zinc-400"
            >
              <Radio className="h-3 w-3 text-amber-400 animate-pulse" />
              <span>PHOTON RING r_ph = 1.5 R_s</span>
              <span className="text-amber-500/60">·</span>
              <span className="text-amber-300">KEPLERIAN DUST ω ∝ r⁻¹·⁵</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Spacer to push editorial copy to bottom-left */}
        <div className="flex-1" />

        {/* =========================================================================
            4. HERO COPY & ACTION BUTTONS (POGGUFANZ BOTTOM-LEFT EDITORIAL STACK)
           ========================================================================= */}
        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroTranslateY,
          }}
          className="relative z-20 max-w-[760px] pb-4 select-none will-change-transform transform-gpu"
        >
          {/* Live Telemetry Pill above Headline */}
          <div className="mb-3 sm:mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/[0.06] px-3 sm:px-3.5 py-1 font-mono text-[8.5px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-amber-300 backdrop-blur-md">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-pulse" />
            <span className="truncate">SINGULARITY HORIZON // SMAN 1 GIRI · ARCANOVA XI-2</span>
          </div>

          {/* Editorial Headline: Fluid responsive scaling for mobile (320px-430px) up to desktop */}
          <h1
            id="hero-heading"
            tabIndex={-1}
            className="font-sans text-[clamp(2.1rem,8.8vw,7rem)] leading-[0.9] tracking-[-0.04em] text-white"
          >
            <span className="font-light text-white block">ACHMAD</span>
            <span className="font-black text-zinc-100 tracking-tight block">
              TAUFIQUR RACHMAN
            </span>
          </h1>

          {/* Lede summary statement (Tech Engineer / Vibecoder Bio) */}
          <p className="mt-3.5 sm:mt-6 max-w-[48ch] font-sans text-[13.5px] sm:text-[16.5px] leading-relaxed text-zinc-300">
            Mobile &amp; Full-Stack Builder specializing in Geotourism &amp; Spatial Systems. Rapid prototyping, clean architecture, and shipping fast.
          </p>

          {/* Action Controls: Get In Touch + GitHub (@OrangUwU) + Instagram (@okayopek) */}
          <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-2.5 sm:gap-4">
            {onContactOpen ? (
              <button
                type="button"
                onClick={onContactOpen}
                className="group inline-flex items-center rounded-full bg-white text-black font-sans text-[13px] font-semibold transition-all hover:bg-zinc-200 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <span className="py-2.5 pl-5 pr-2.5">Get in touch</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-black mr-1 transition-transform duration-300 group-hover:translate-y-0.5">
                  <ArrowDown className="h-4 w-4" />
                </span>
              </button>
            ) : (
              <a
                href="#contact"
                className="group inline-flex items-center rounded-full bg-white text-black font-sans text-[13px] font-semibold transition-all hover:bg-zinc-200 active:scale-95 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <span className="py-2.5 pl-5 pr-2.5">Get in touch</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-black mr-1 transition-transform duration-300 group-hover:translate-y-0.5">
                  <ArrowDown className="h-4 w-4" />
                </span>
              </a>
            )}

            {/* GitHub Link */}
            <a
              href="https://github.com/OrangUwU"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 font-mono text-[11px] text-zinc-300 hover:border-amber-500/40 hover:text-white transition-colors cursor-pointer backdrop-blur-sm"
            >
              <Github className="h-3.5 w-3.5 text-amber-400" />
              <span>GitHub</span>
              <ArrowUpRight className="h-3 w-3 text-zinc-500" />
            </a>

            {/* Instagram Link */}
            <a
              href="https://instagram.com/okayopek"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 font-mono text-[11px] text-zinc-300 hover:border-amber-500/40 hover:text-white transition-colors cursor-pointer backdrop-blur-sm"
            >
              <Instagram className="h-3.5 w-3.5 text-amber-400" />
              <span>@okayopek</span>
              <ArrowUpRight className="h-3 w-3 text-zinc-500" />
            </a>
          </div>
        </motion.div>

        {/* =========================================================================
            5. BOTTOM SCROLL CUE & COORDINATE TELEMETRY BAR
           ========================================================================= */}
        <motion.div
          style={{ opacity: hudBottomOpacity }}
          className="relative z-20 flex flex-wrap items-center justify-between gap-4 font-mono text-[10.5px] uppercase tracking-[0.2em] text-zinc-500 select-none border-t border-white/[0.08] pt-3.5"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-3.5 w-px bg-amber-500 shadow-[0_0_8px_#f59e0b] animate-pulse" />
            <span className="text-zinc-300">
              Scroll to fall into the singularity
            </span>
          </div>

          <div className="hidden md:flex items-center gap-5 text-zinc-500">
            <span>GRAVITY // 1.49×10¹² m/s²</span>
            <span className="text-amber-500/40">·</span>
            <span className="inline-flex items-center gap-1.5 text-zinc-400">
              <Compass className="h-3 w-3 text-amber-500" />
              COORDINATE // 08°12&apos;S 114°22&apos;E · BANYUWANGI
            </span>
          </div>
        </motion.div>

        {/* =========================================================================
            6. EVENT HORIZON PHOTON TUNNEL -> TESSERACT BRIDGE (SCROLL 75% -> 100%)
           ========================================================================= */}
        <motion.div
          style={{
            opacity: tunnelRingOpacity,
            scale: tunnelScale,
          }}
          className="pointer-events-none absolute inset-0 z-15 flex items-center justify-center will-change-transform transform-gpu"
          aria-hidden="true"
        >
          <div className="h-[65vh] w-[65vh] rounded-full border border-amber-400/35 shadow-[0_0_120px_rgba(245,158,11,0.35),inset_0_0_90px_rgba(254,240,138,0.22)]" />
        </motion.div>

        {/* Bottom Feathered Golden Gradient Bridge into Section 01 */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#030409] via-[#030409]/70 to-transparent z-15"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
