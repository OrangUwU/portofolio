"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCircle2, AlertCircle } from "lucide-react";

type ProjectType = "Product" | "Research" | "Film" | "Branding" | "General";

export function ContactDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("General");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => closeBtnRef.current?.focus(), 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        setLoading(false);
        setErrorMsg(null);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isSuccess) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, projectType, message }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; message?: string };
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || `Request gagal (${res.status})`);
      }
      setIsSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim pesan. Coba lagi.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setProjectType("General");
    setMessage("");
    setIsSuccess(false);
    setErrorMsg(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-drawer-title"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Tutup form kontak"
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="relative flex h-[100dvh] max-h-screen w-full max-w-full sm:max-w-[480px] flex-col overflow-hidden border-l border-zinc-800 bg-[#0A0A0B] shadow-[-24px_0_80px_rgba(0,0,0,0.85)] transform-gpu"
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-zinc-800/80 bg-[#0A0A0B]/90 px-6 py-5 backdrop-blur-xl">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                  // Contact — Direct Message
                </p>
                <h2
                  id="contact-drawer-title"
                  className="mt-1 font-sans text-[22px] font-semibold tracking-tight text-white"
                >
                  Kirim Pesan
                </h2>
              </div>
              <button
                id="close-contact-drawer-btn"
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-zinc-800 bg-[#141416] text-zinc-400 transition-all duration-200 hover:border-zinc-600 hover:bg-white hover:text-black active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transform-gpu cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              {isSuccess ? (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="h-7 w-7" />
                  </span>
                  <h3 className="font-sans text-[22px] font-semibold tracking-tight text-white">
                    Pesan terkirim!
                  </h3>
                  <p className="max-w-[32ch] font-sans text-[13.5px] leading-relaxed text-zinc-300">
                    Terima kasih, <span className="font-semibold text-white">{name || "Teman"}</span>. Saya akan membalas via email secepatnya.
                  </p>
                  <div className="mt-4 flex w-full gap-3">
                    <button
                      id="reset-contact-form-btn"
                      type="button"
                      onClick={resetForm}
                      className="min-h-[44px] flex-1 rounded-full border border-zinc-800 bg-[#141416] font-mono text-[12px] uppercase tracking-wider text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:bg-[#1A1A1E] hover:text-white active:scale-[0.98] cursor-pointer"
                    >
                      Kirim Lagi
                    </button>
                    <button
                      id="close-success-contact-btn"
                      type="button"
                      onClick={onClose}
                      className="min-h-[44px] flex-1 rounded-full bg-white font-sans text-[13px] font-semibold text-black transition-all duration-200 hover:bg-zinc-100 active:scale-[0.98] cursor-pointer"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                      Nama <span className="text-amber-400">*</span>
                    </label>
                    <input
                      id="contact-name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama lengkap atau panggilan"
                      className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#141416] px-4 py-3 font-sans text-[13.5px] text-white placeholder:text-zinc-600 transition-all focus:border-amber-500/60 focus:bg-[#1A1A1E] focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                      Email <span className="text-amber-400">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@perusahaan.com"
                      className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#141416] px-4 py-3 font-sans text-[13.5px] text-white placeholder:text-zinc-600 transition-all focus:border-amber-500/60 focus:bg-[#1A1A1E] focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-type" className="block font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                      Kategori Minat
                    </label>
                    <select
                      id="contact-type"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value as ProjectType)}
                      className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#141416] px-4 py-3 font-sans text-[13.5px] text-white transition-all focus:border-amber-500/60 focus:bg-[#1A1A1E] focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                    >
                      <option value="General" className="bg-[#141416] text-white">General Inquiry</option>
                      <option value="Product" className="bg-[#141416] text-white">Product Development (IJEN-CARE / Smart-Node)</option>
                      <option value="Research" className="bg-[#141416] text-white">Quantitative & Field Research</option>
                      <option value="Film" className="bg-[#141416] text-white">Film & Mini Documentary</option>
                      <option value="Branding" className="bg-[#141416] text-white">Brand & Visual Identity</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                      Pesan <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder="Ceritakan proyek, kolaborasi, atau pertanyaanmu..."
                      className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-[#141416] px-4 py-3 font-sans text-[13.5px] text-white placeholder:text-zinc-600 transition-all focus:border-amber-500/60 focus:bg-[#1A1A1E] focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      aria-live="polite"
                      className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-3 font-mono text-[12px] leading-relaxed text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}

                  <button
                    id="submit-contact-form-btn"
                    type="submit"
                    disabled={loading}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-white font-sans text-[13px] font-semibold text-black transition-all duration-200 hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transform-gpu cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-black" />
                        <span>Mengirim ke Discord Webhook...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-amber-600" />
                        <span>Kirim Pesan</span>
                      </>
                    )}
                  </button>

                  <p className="text-center font-mono text-[11px] text-zinc-500">
                    Terhubung ke Discord Webhook &amp;{" "}
                    <a
                      href="mailto:opekimut2@gmail.com"
                      className="text-amber-400 hover:underline"
                    >
                      opekimut2@gmail.com
                    </a>
                  </p>
                </form>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 z-20 border-t border-zinc-800/80 bg-[#0A0A0B]/95 px-6 py-4 backdrop-blur-xl">
              <button
                id="footer-close-contact-btn"
                type="button"
                onClick={onClose}
                className="min-h-[44px] w-full rounded-full border border-zinc-800 bg-[#141416] font-mono text-[12px] uppercase tracking-wider text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-[#1A1A1E] hover:text-white cursor-pointer"
              >
                Tutup Form
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

