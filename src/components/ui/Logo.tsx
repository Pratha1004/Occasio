"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showTagline = true, size = "md" }: LogoProps) {
  const cfg = {
    sm: { badgePx: 32, titleCls: "text-[17px]", tagCls: "text-[9px]", gap: "gap-2.5" },
    md: { badgePx: 36, titleCls: "text-[19px]", tagCls: "text-[10px]", gap: "gap-3" },
    lg: { badgePx: 44, titleCls: "text-[24px]", tagCls: "text-[11px]", gap: "gap-3.5" },
  }[size];

  return (
    <div className={cn("flex items-center select-none", cfg.gap, className)}>
      {/* Geometric 'O' Monogram Icon Badge */}
      <motion.div
        className="relative flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-md shadow-blue-500/20 ring-1 ring-white/20 overflow-hidden"
        style={{ width: cfg.badgePx, height: cfg.badgePx }}
        whileHover={{ scale: 1.06, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        aria-hidden="true"
      >
        <svg
          width={cfg.badgePx * 0.65}
          height={cfg.badgePx * 0.65}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Monogram 'O' with cut ticket notch */}
          <path
            d="M16 3C8.82 3 3 8.82 3 16C3 23.18 8.82 29 16 29C23.18 29 29 23.18 29 16C29 13.8 28.45 11.73 27.5 9.92L23.8 13.62C24.57 14.34 25 15.36 25 16C25 20.97 20.97 25 16 25C11.03 25 7 20.97 7 16C7 11.03 11.03 7 16 7C16.64 7 17.66 7.43 18.38 8.2L22.08 4.5C20.27 3.55 18.2 3 16 3Z"
            fill="white"
          />
          {/* Inner Sparkle Star */}
          <path
            d="M16 9.5C16 13 13 16 13 16C13 16 16 19 16 22.5C16 19 19 16 19 16C19 16 16 13 16 9.5Z"
            fill="#60A5FA"
          />
        </svg>

        {/* Glossy Reflection overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/25 pointer-events-none" />
      </motion.div>

      {/* Brand Text Block */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={cn("font-extrabold tracking-tight text-foreground", cfg.titleCls)}>
            Occasio
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
        </div>

        {showTagline && (
          <span className={cn("font-semibold uppercase tracking-wider text-muted-foreground mt-0.5 truncate", cfg.tagCls)}>
            Event Discovery
          </span>
        )}
      </div>
    </div>
  );
}

export function SparkleIcon({ className }: { className?: string }) {
  return <Sparkles className={cn("h-4 w-4 text-blue-500", className)} aria-hidden="true" />;
}
