"use client";

// ============================================================================
// POGGUFANZ-STYLE ZERO-LATENCY WEB AUDIO API & SFX ENGINE
// Supports:
// 1. Dynamic Scroll Mechanical Tick (throttled, tactile 0.15 - 0.22 volume)
// 2. Interactive Cursor / Hover Micro-Beep (cards, tech stack badges, links, buttons)
// 3. Cursor Velocity Trail Harmonic Pulse
// 4. Quantum Warp Whoosh ("RETURN TO ORIGIN")
// 5. Persistent Mute/Unmute state in localStorage + Autoplay Policy unlock
// ============================================================================

const STORAGE_KEY = "portfolio_sfx_muted";

type SfxKind = "scroll" | "hover" | "click";
type Listener = (muted: boolean) => void;

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private isUnlocked = false;
  private buffers: Partial<Record<SfxKind, AudioBuffer>> = {};
  private listeners = new Set<Listener>();

  // Throttling timestamps (ms) to prevent audio stacking on ProMotion 120Hz displays
  private lastScrollTickAt = 0;
  private lastHoverTickAt = 0;
  private lastTrailTickAt = 0;
  private lastClickAt = 0;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          this.isMuted = saved === "1" || saved === "true";
        }
      } catch {
        // ignore storage errors
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.preloadAudioFiles();
      }
    }
    return this.ctx;
  }

  private async preloadAudioFiles() {
    const ctx = this.ctx;
    if (!ctx) return;

    const files: Record<SfxKind, string> = {
      scroll: "/sounds/scroll-tick.wav",
      hover: "/sounds/hover-tick.wav",
      click: "/sounds/ui-click.wav",
    };

    for (const [key, url] of Object.entries(files) as [SfxKind, string][]) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const arrayBuf = await res.arrayBuffer();
        const decoded = await ctx.decodeAudioData(arrayBuf);
        this.buffers[key] = decoded;
      } catch {
        // Procedural Web Audio synthesis remains active as zero-latency primary/fallback
      }
    }
  }

  public unlock = () => {
    if (this.isUnlocked) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    // Play a silent 1-sample buffer to unlock iOS Safari / Chrome AudioContext
    try {
      const buf = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
      this.isUnlocked = true;
    } catch {
      // ignore
    }
  };

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
      } catch {
        // ignore
      }
    }
    if (!muted) {
      this.unlock();
      this.playClick();
    }
    this.listeners.forEach((fn) => fn(this.isMuted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  /**
   * 1. Dynamic Scroll Sound Effect:
   * Subtle mechanical precision tick when scrolling past steps/thresholds.
   * Volume: 0.16 - 0.22. Throttled to 72ms minimum interval so fast scrolling never stacks.
   */
  public playScrollTick(velocityRatio = 0.5) {
    if (this.isMuted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastScrollTickAt < 72) return;
    this.lastScrollTickAt = nowMs;

    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const clampedVel = Math.max(0, Math.min(1, velocityRatio));
    const volume = 0.15 + clampedVel * 0.07; // 0.15 - 0.22

    // Layer A: Preloaded acoustic sample (if ready) with slight pitch shift
    if (this.buffers.scroll) {
      try {
        const src = ctx.createBufferSource();
        src.buffer = this.buffers.scroll;
        src.playbackRate.setValueAtTime(0.92 + clampedVel * 0.24, now);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(volume * 0.65, now);
        src.connect(gain);
        gain.connect(ctx.destination);
        src.start(now);
      } catch {
        // fallback to synthesis below
      }
    }

    // Layer B: Zero-latency procedural mechanical escapement click
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "triangle";
    const baseFreq = 1180 + clampedVel * 420;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.018);

    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(3.2, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.022);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.024);
  }

  /**
   * 2. Interactive Cursor Hover Tick / Micro-Beep:
   * Triggered when cursor crosses project cards, tech stack badges, social links, or buttons.
   */
  public playHoverTick(
    variant: "card" | "badge" | "link" | "button" = "button"
  ) {
    if (this.isMuted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastHoverTickAt < 45) return;
    this.lastHoverTickAt = nowMs;

    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const freqMap = {
      card: 1680,
      badge: 2480,
      link: 2120,
      button: 1920,
    };
    const startFreq = freqMap[variant];
    const volume = variant === "badge" ? 0.14 : 0.17;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 1.28, now + 0.024);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.028);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * 3. Subtle Cursor Velocity Trail Micro-Tick:
   * Gently responds to rapid cursor sweeps across the 5D spacetime canvas.
   */
  public playCursorTrailPulse(speedPxPerMs: number) {
    if (this.isMuted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastTrailTickAt < 155) return;
    this.lastTrailTickAt = nowMs;

    const ctx = this.getAudioContext();
    if (!ctx || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const norm = Math.min(1, Math.max(0, (speedPxPerMs - 1.8) / 4.0));
    const volume = 0.045 + norm * 0.055; // Ultra-gentle 0.045 - 0.10

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1450 + norm * 650, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.016);

    gain.gain.setValueAtTime(0.0008, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.018);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  /**
   * 4. UI Click Confirmation SFX:
   */
  public playClick() {
    if (this.isMuted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastClickAt < 55) return;
    this.lastClickAt = nowMs;

    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(1840, now + 0.036);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.21, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.042);
  }

  /**
   * 5. Quantum Warp Whoosh ("RETURN TO ORIGIN"):
   * Relativistic Bandpass Noise Sweep (100Hz -> 1600Hz -> 200Hz) + Wormhole Sub-Bass Drone
   */
  public playQuantumWarpWhoosh() {
    if (this.isMuted) return null;
    const ctx = this.getAudioContext();
    if (!ctx) return null;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    try {
      const duration = 2.0;
      const now = ctx.currentTime;

      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.Q.setValueAtTime(2.6, now);
      bandpass.frequency.setValueAtTime(100, now);
      bandpass.frequency.exponentialRampToValueAtTime(1600, now + 0.88);
      bandpass.frequency.exponentialRampToValueAtTime(200, now + duration);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.24, now + 0.68);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(50, now);
      osc.frequency.exponentialRampToValueAtTime(128, now + 0.82);
      osc.frequency.exponentialRampToValueAtTime(36, now + duration);

      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.18, now + 0.65);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      whiteNoise.start(now);
      osc.start(now);
      whiteNoise.stop(now + duration);
      osc.stop(now + duration);

      return ctx;
    } catch {
      return null;
    }
  }
}

export const soundManager = new SoundManager();
