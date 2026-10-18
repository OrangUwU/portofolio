"use client";
import { useState } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CosmicPreloader } from "@/components/visual/CosmicPreloader";
import { QuantumWarpTransit } from "@/components/visual/QuantumWarpTransit";
import { HeroSingularity } from "@/components/visual/HeroSingularity";
import { ProjectRoom } from "@/components/visual/ProjectRoom";
import { AboutSection } from "@/components/visual/AboutSection";
import { ExperienceSection } from "@/components/visual/ExperienceSection";
import { ContactSection } from "@/components/visual/ContactSection";
import { ContactDrawer } from "@/components/interactive/ContactDrawer";
import { AudioController } from "@/components/interactive/AudioController";

export default function Page() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isWarpActive, setIsWarpActive] = useState(false);

  return (
    <div className="min-h-screen [overflow-x:clip] bg-[#030409] text-[#d4d4d8] selection:bg-amber-500 selection:text-black">
      {/* 0. Cosmic Dawn 000 -> 100% Preloader (Poggufanz 1:1 Spec) */}
      <CosmicPreloader />

      {/* 0.5 Full-Screen Hyperspace Quantum Warp Tunnel (Triggered by RETURN TO ORIGIN) */}
      <QuantumWarpTransit
        isActive={isWarpActive}
        onComplete={() => setIsWarpActive(false)}
      />

      {/* 1. HUD Top-Bar ala poggufanz.xyz with Live UTC+7 Banyuwangi Clock */}
      <SiteHeader onContactOpen={() => setIsContactOpen(true)} />

      <main className="[overflow-x:clip]">
        {/* 2. Hero Section: Singularity with Zero-Box Clipping & Sticky Scrollytelling Zoom Dive */}
        <HeroSingularity onContactOpen={() => setIsContactOpen(true)} />

        {/* 3. Section 01: INSIDE THE TESSERACT (5D Bookcase Room & Timeline Scrubber) */}
        <ProjectRoom />

        {/* 4. Section 02: About & Technical Profile (Statement, Facts, Portrait, Capabilities & Stack) */}
        <AboutSection />

        {/* 5. Section 03: Professional & Research Timeline (5 Milestones, Bullets, Stack Chips) */}
        <ExperienceSection />

        {/* 6. Section 04: Contact, Golden Spiral Galaxy, RETURN TO ORIGIN & Minimal Footer */}
        <ContactSection
          onContactOpen={() => setIsContactOpen(true)}
          onReturnToOrigin={() => setIsWarpActive(true)}
        />
      </main>

      {/* 7. Global Interactive Contact Drawer (Connected to /api/contact & Webhooks) */}
      <ContactDrawer
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* 8. Global Interactive SFX Engine & Floating Mute/Unmute HUD Toggle */}
      <AudioController />
    </div>
  );
}
