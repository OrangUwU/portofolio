"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CopyEmailPill } from "@/components/interactive/CopyEmailPill";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function SiteHeader({ onContactOpen }: { onContactOpen?: () => void }) {
  const [time, setTime] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in UTC+7 (Asia/Jakarta)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat("en-GB", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06070a]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#06070a]/60">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand Mark ala poggufanz orbital mark */}
          <Link
            href="#top"
            className="group flex items-center gap-3 active:scale-[0.98] transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-lg"
            aria-label="Achmad Taufiqur Rachman - Back to top"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-colors group-hover:border-white/40 group-hover:bg-white/10">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="4.5" />
                <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-25 12 12)" strokeDasharray="2 2" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-[13px] font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                  ACHMAD
                </span>
                <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                  ’26
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                Portfolio · SMAN 1 Giri
              </span>
            </div>
          </Link>

          {/* Numbered Nav Links (Poggufanz Style) */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 backdrop-blur-md">
            {[
              { idx: "01", label: "Works", href: "#works" },
              { idx: "02", label: "About", href: "#about" },
              { idx: "03", label: "Experience", href: "#experience" },
              { idx: "04", label: "Contact", href: "#contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
              >
                <span className="text-zinc-600 group-hover:text-zinc-400 transition-colors font-mono text-[10px]">
                  {item.idx}
                </span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Right Status & Clock Actions */}
          <div className="flex items-center gap-3">
            {/* Live Clock HUD */}
            <div className="hidden lg:flex items-center gap-2 border-r border-white/10 pr-3 font-mono text-[11px] text-zinc-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </span>
              <span className="tabular-nums font-mono text-zinc-300">
                {time || "00:00:00"}
              </span>
              <span className="text-zinc-500 text-[10px] tracking-wider">
                UTC+7 · Banyuwangi
              </span>
            </div>

            {/* Direct Contact Button / Email Pill */}
            <div className="hidden sm:flex items-center gap-2">
              <CopyEmailPill email="opekimut2@gmail.com" align="end" />
              {onContactOpen && (
                <button
                  type="button"
                  onClick={onContactOpen}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 font-sans text-[12px] font-semibold text-black transition-all duration-200 hover:bg-zinc-200 active:scale-[0.98] cursor-pointer shadow-sm"
                >
                  <span>Connect</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[57px] z-30 border-b border-white/10 bg-[#06070a]/95 backdrop-blur-2xl p-5 shadow-2xl">
          <div className="flex flex-col gap-3">
            {[
              { idx: "01", label: "Selected Works", href: "#works" },
              { idx: "02", label: "About & Profile", href: "#about" },
              { idx: "03", label: "Experience & Timeline", href: "#experience" },
              { idx: "04", label: "Contact & Socials", href: "#contact" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-zinc-200 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="font-sans text-[14px] font-medium">{item.label}</span>
                <span className="font-mono text-[11px] text-zinc-500">{item.idx}</span>
              </a>
            ))}

            <div className="mt-2 pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between font-mono text-[11px] text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Status: Available
                </span>
                <span className="tabular-nums">{time} UTC+7</span>
              </div>
              <CopyEmailPill email="opekimut2@gmail.com" align="center" />
              {onContactOpen && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onContactOpen();
                  }}
                  className="w-full rounded-full bg-white py-2.5 font-sans text-[13px] font-semibold text-black transition-colors hover:bg-zinc-200"
                >
                  Direct Message
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
