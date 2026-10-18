"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { categories, type ProjectCategory } from "@/content/projects";

export function FilterPills({
  active,
  onChange,
}: {
  active: ProjectCategory | "All";
  onChange: (c: ProjectCategory | "All") => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Filter kategori proyek"
      className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase()}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat)}
            className={cn(
              "group relative shrink-0 min-h-[36px] rounded-full px-4 py-2 text-[12px] font-medium leading-none cursor-pointer",
              "border touch-manipulation select-none transition-colors duration-200 backdrop-blur-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]",
              "active:scale-[0.97] transform-gpu",
              isActive
                ? "border-white/90 text-black font-semibold bg-white"
                : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/15 hover:bg-white/[0.07] hover:text-zinc-200"
            )}
          >
            {isActive && (
              <motion.span
                layoutId="active-pill"
                className="pointer-events-none absolute inset-0 z-0 rounded-full bg-white shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "pointer-events-none relative z-10 font-mono tracking-wide transition-colors duration-200",
                isActive ? "text-black" : "text-zinc-400 group-hover:text-zinc-200"
              )}
            >
              {cat}
            </span>
          </button>
        );
      })}
    </div>
  );
}

