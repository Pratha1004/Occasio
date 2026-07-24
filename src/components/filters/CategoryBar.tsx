"use client";

import { motion } from "framer-motion";
import {
  Music, Code2, UtensilsCrossed, Palette,
  Dumbbell, BookOpen, MoreHorizontal,
} from "lucide-react";
import type { EventCategory } from "@/lib/types";
import { useFilters } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

const categoryList: {
  id: EventCategory | "more";
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  color: string;
  bg: string;
  activeBg: string;
  activeColor: string;
}[] = [
  { id: "music",     label: "Music",     icon: Music,           color: "#6366F1", bg: "bg-indigo-50",   activeBg: "bg-indigo-100",  activeColor: "#4338CA" },
  { id: "tech",      label: "Tech",      icon: Code2,           color: "#0EA5E9", bg: "bg-sky-50",      activeBg: "bg-sky-100",     activeColor: "#0369A1" },
  { id: "food",      label: "Food",      icon: UtensilsCrossed, color: "#F59E0B", bg: "bg-amber-50",    activeBg: "bg-amber-100",   activeColor: "#B45309" },
  { id: "art",       label: "Arts",      icon: Palette,         color: "#EC4899", bg: "bg-pink-50",     activeBg: "bg-pink-100",    activeColor: "#BE185D" },
  { id: "sports",    label: "Sports",    icon: Dumbbell,        color: "#22C55E", bg: "bg-green-50",    activeBg: "bg-green-100",   activeColor: "#15803D" },
  { id: "workshops", label: "Workshops", icon: BookOpen,        color: "#A855F7", bg: "bg-purple-50",   activeBg: "bg-purple-100",  activeColor: "#7E22CE" },
  { id: "more",      label: "More",      icon: MoreHorizontal,  color: "#64748B", bg: "bg-slate-50",    activeBg: "bg-slate-100",   activeColor: "#334155" },
];

export function CategoryBar() {
  const { filters, setCategory } = useFilters();

  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.3 }}
      aria-label="Event categories"
      className="w-full"
    >
      <div className="overflow-x-auto scrollbar-thin rounded-xl border border-border bg-card">
        <div className="grid grid-cols-7 divide-x divide-border min-w-[580px]">
          {categoryList.map((cat) => {
            const isActive = filters.category === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (cat.id !== "more") {
                    setCategory(isActive ? "all" : (cat.id as EventCategory));
                  }
                }}
                className={cn(
                  "group relative flex flex-col items-center gap-2 py-4 px-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                  isActive
                    ? "bg-primary/5"
                    : "bg-card hover:bg-surface"
                )}
                aria-pressed={isActive}
              >
                {/* Active indicator — top bar */}
                {isActive && (
                  <span className="absolute inset-x-0 top-0 h-[2px] bg-primary rounded-b" />
                )}

                {/* Icon — per-category subtle tint on hover */}
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                  isActive ? cat.activeBg : `${cat.bg} group-hover:scale-105 group-hover:shadow-sm`,
                )}>
                  <span style={{ color: isActive ? cat.activeColor : cat.color }}>
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[11px] font-medium transition-colors duration-200",
                    isActive ? "font-semibold" : "text-muted-foreground group-hover:text-foreground"
                  )}
                  style={isActive ? { color: cat.activeColor, fontWeight: 600 } : {}}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
