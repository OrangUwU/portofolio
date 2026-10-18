"use client";

// ============================================================================
// SECTION-AWARE SPATIAL AUDIO ENGINE (POGGUFANZ & INTERSTELLAR SPEC)
// - Zero mouse-over-text noise!
// - Every section has its own warm, low-pass filtered acoustic signature:
//   * "singularity" (Hero #top): Deep relativistic sub-harmonic swell & low gravity pulse
//   * "tesseract"   (#works): Warm 5D copper time-strand pluck & watch-escapement room scrub
//   * "about"       (#about): Soft analog low-mid telemetry pulse
//   * "experience"  (#experience): Muted pendulum / chronicle step tick
//   * "contact"     (#contact): Warm harmonic fifth resonance & Quantum Warp Whoosh
// ============================================================================

const STORAGE_KEY = "portfolio_sfx_muted";

export type SectionAudioId =
  | "singularity"
  | "tesseract"
  | "about"
  | "experience"
  | "contact";

type Listener = (state: { muted: boolean; section: SectionAudioId }) => void;

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted = false;
  private isUnlocked = false;
  private currentSection: SectionAudioId = "singularity";
  private listeners = new Set<Listener>();

  // Strict cooldowns so audio never stacks or feels noisy
  private lastScrollSoundAt = 0;
  private lastSectionChangeAt = 0;
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
      }
    }
    return this.ctx;
  }

  private notify() {
    const snapshot = { muted: this.isMuted, section: this.currentSection };
    this.listeners.forEach((fn) => fn(snapshot));
  }

  public unlock = () => {
    if (this.isUnlocked) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

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

  public getSection(): SectionAudioId {
    return this.currentSection;
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
      this.playSectionTransitionChime(this.currentSection);
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public subscribe(
    fn: (muted: boolean, section?: SectionAudioId) => void
  ): () => void {
    const wrapped: Listener = (state) => fn(state.muted, state.section);
    this.listeners.add(wrapped);
    return () => {
      this.listeners.delete(wrapped);
    };
  }

  /**
   * Called when user scrolls from one major section into another.
   * Plays a soft, atmospheric signature chord/swell unique to that section.
   */
  public setActiveSection(section: SectionAudioId) {
    if (this.currentSection === section) return;
    this.currentSection = section;
    this.notify();

    const nowMs = performance.now();
    if (nowMs - this.lastSectionChangeAt < 650) return;
    this.lastSectionChangeAt = nowMs;

    this.playSectionTransitionChime(section);
  }

  /**
   * Atmospheric Section Entry Sound (Unique per section, warm & low-frequency)
   */
  public playSectionTransitionChime(section: SectionAudioId) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx || ctx.state !== "running") return;

    const now = ctx.currentTime;

    if (section === "singularity") {
      // Section 00 (Hero Black Hole): Deep Kerr gravitational sub-bass swell (65Hz -> 98Hz)
      const osc = ctx.createOscillator();
      const sub = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sine";
      sub.type = "triangle";
      osc.frequency.setValueAtTime(65.41, now); // C2
      osc.frequency.exponentialRampToValueAtTime(98.0, now + 0.55); // G2
      sub.frequency.setValueAtTime(130.81, now); // C3

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(260, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.075, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.65);

      osc.connect(filter);
      sub.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      sub.start(now);
      osc.stop(now + 0.68);
      sub.stop(now + 0.68);
    } else if (section === "tesseract") {
      // Section 01 (Inside the Tesseract): Warm 5D copper harp/string fifth (A3 220Hz + E4 329.6Hz)
      const freqs = [220.0, 329.63, 440.0];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        const start = now + idx * 0.045;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(f, start);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(900, start);
        filter.frequency.exponentialRampToValueAtTime(280, start + 0.42);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.048 - idx * 0.01, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.45);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.48);
      });
    } else if (section === "about") {
      // Section 02 (About & Profile): Soft warm analog two-note interval (D3 146.8Hz -> A3 220Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(146.83, now);
      osc.frequency.setValueAtTime(220.0, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.36);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } else if (section === "experience") {
      // Section 03 (Experience Chronicle): Warm low clockwork chime (E3 164.8Hz -> B3 246.9Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(164.81, now);
      osc.frequency.exponentialRampToValueAtTime(246.94, now + 0.22);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.048, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.32);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.34);
    } else if (section === "contact") {
      // Section 04 (Contact & Origin): Warm golden resolution chord (F3 174.6Hz + C4 261.6Hz)
      [174.61, 261.63].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.05;

        osc.type = "sine";
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.045, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.52);
      });
    }
  }

  /**
   * Section-Specific Scroll Sound:
   * Triggered only every ~220px of scroll with a minimum 180ms cooldown.
   * Each section has a completely different, warm, non-intrusive acoustic texture!
   */
  public playSectionScrollStep(velocityRatio = 0.4) {
    if (this.isMuted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastScrollSoundAt < 185) return;
    this.lastScrollSoundAt = nowMs;

    const ctx = this.getAudioContext();
    if (!ctx || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const v = Math.max(0, Math.min(1, velocityRatio));

    if (this.currentSection === "singularity") {
      // Hero Black Hole: Deep muffled magnetic horizon pulse (90Hz -> 52Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(95 + v * 28, now);
      osc.frequency.exponentialRampToValueAtTime(48, now + 0.065);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.065, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.075);
    } else if (this.currentSection === "tesseract") {
      // Tesseract Section: Warm 5D copper wire / wooden bookcase harmonic pluck (280Hz -> 190Hz)
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(290 + v * 60, now);
      osc.frequency.exponentialRampToValueAtTime(175, now + 0.045);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(520, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.052, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.05);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } else if (this.currentSection === "about") {
      // About Section: Soft muted low-pass carbon tap (210Hz -> 120Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(215 + v * 35, now);
      osc.frequency.exponentialRampToValueAtTime(115, now + 0.032);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.042, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.036);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } else if (this.currentSection === "experience") {
      // Experience Timeline: Soft watch-escapement pendulum tick (240Hz -> 140Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(245, now);
      osc.frequency.exponentialRampToValueAtTime(135, now + 0.028);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.032);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } else {
      // Contact & Origin: Warm orbital harmonic pulse (196Hz G3)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(196 + v * 40, now);
      osc.frequency.exponentialRampToValueAtTime(146.8, now + 0.045);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    }
  }

  /**
   * Dedicated Tesseract Room Scrub Sound (When clicking <, >, or timeline nodes 01-05):
   * Plays a pitched 5D time-strand harmonic chord based on room index (0..4).
   */
  public playTesseractRoomScrub(roomIndex: number) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    // Pentatonic warm frequencies for Rooms 01 -> 05
    const roomNotes = [220.0, 246.94, 293.66, 329.63, 392.0];
    const baseFreq = roomNotes[roomIndex % roomNotes.length] || 220.0;

    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "triangle";
    overtone.type = "sine";
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.005, now + 0.18);
    overtone.frequency.setValueAtTime(baseFreq * 1.5, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(780, now);
    filter.frequency.exponentialRampToValueAtTime(260, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.075, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.24);

    osc.connect(filter);
    overtone.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + 0.25);
    overtone.stop(now + 0.25);
  }

  /**
   * Subtle tactile click ONLY when clicking interactive buttons/links (never on text hover!)
   */
  public playClick() {
    if (this.isMuted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastClickAt < 90) return;
    this.lastClickAt = nowMs;

    const ctx = this.getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Section-aware click pitch (warm low-mid, never piercing)
    const clickFreqMap: Record<SectionAudioId, number> = {
      singularity: 180,
      tesseract: 330,
      about: 260,
      experience: 240,
      contact: 293,
    };
    const freq = clickFreqMap[this.currentSection] || 260;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.032);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.038);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  /**
   * Quantum Warp Whoosh ("RETURN TO ORIGIN"):
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
      noiseGain.gain.exponentialRampToValueAtTime(0.22, now + 0.68);
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
      oscGain.gain.exponentialRampToValueAtTime(0.16, now + 0.65);
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
