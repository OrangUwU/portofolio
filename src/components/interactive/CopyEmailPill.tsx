"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/cn";

export function CopyEmailPill({
  email = "hello@achmad.dev",
  className,
  align = "center",
}: {
  email?: string;
  className?: string;
  align?: "center" | "end" | "start";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // hardened fallback for non-HTTPS or restrictive environments
      const el = document.createElement("textarea");
      el.value = email;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy email ${email}`}
        className={cn(
          "group inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 sm:px-5 cursor-pointer",
          "bg-[#141416] text-zinc-300 transition-all duration-200",
          "hover:bg-[#1A1A1E] hover:border-zinc-700 hover:text-white",
          "active:scale-[0.97] transform-gpu",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0B]",
          "min-h-[44px] touch-manipulation select-none",
          copied
            ? "border-white/60 shadow-[0_0_20px_rgba(255,255,255,0.08)]"
            : "border-zinc-800"
        )}
      >
        <span className="font-mono text-[13px] tracking-wide text-zinc-200 group-hover:text-white transition-colors">
          {email}
        </span>
        <span
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-200",
            copied
              ? "bg-white border-white text-black shadow-sm"
              : "bg-zinc-900 border-zinc-700 text-zinc-400 group-hover:border-zinc-500 group-hover:text-zinc-200"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                <Copy className="h-3.5 w-3.5 transition-transform duration-200 group-hover:scale-105" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </button>

      {/* Tooltip Copied! — smooth, no layout shift */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "pointer-events-none absolute top-full z-20 mt-2 whitespace-nowrap rounded-full bg-white px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-black shadow-[0_8px_24px_rgba(0,0,0,0.5)]",
              align === "end"
                ? "right-0"
                : align === "start"
                ? "left-0"
                : "left-1/2 -translate-x-1/2"
            )}
          >
            Copied!
            <span
              className={cn(
                "absolute -top-1 h-2 w-2 rotate-45 bg-white",
                align === "end" ? "right-6" : align === "start" ? "left-6" : "left-1/2 -translate-x-1/2"
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

