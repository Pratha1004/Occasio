"use client";

import { motion } from "framer-motion";
import { SearchX, RotateCcw } from "lucide-react";
import { useFilters } from "@/providers/AppProvider";

export function CustomSvgEmpty() {
  const { resetFilters } = useFilters();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center backdrop-blur-sm"
    >
      <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
        {/* Animated Background Circles */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-primary/10"
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute inset-2 rounded-full bg-indigo-500/10"
        />

        {/* Custom SVG Ticket Search Illustration */}
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 text-primary drop-shadow-md"
        >
          {/* Ticket Base */}
          <rect
            x="14"
            y="28"
            width="68"
            height="44"
            rx="8"
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />
          {/* Ticket Notches */}
          <circle cx="14" cy="50" r="5" fill="var(--background)" stroke="currentColor" strokeWidth="2" />
          <circle cx="82" cy="50" r="5" fill="var(--background)" stroke="currentColor" strokeWidth="2" />
          
          {/* Ticket barcode lines */}
          <line x1="28" y1="38" x2="28" y2="62" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="38" x2="34" y2="62" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="38" x2="40" y2="62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Magnifying Glass Overlay */}
          <circle cx="60" cy="46" r="14" fill="var(--card)" stroke="#8B5CF6" strokeWidth="3" />
          <line x1="70" y1="56" x2="80" y2="66" stroke="#8B5CF6" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M55 46L65 46" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
        </svg>

        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-2 top-0 rounded-full bg-amber-500/20 p-2 text-amber-500"
        >
          <SearchX className="h-5 w-5" />
        </motion.div>
      </div>

      <h3 className="text-xl font-bold tracking-tight text-foreground">
        No Events Found
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted">
        We couldn’t find any events matching your search or active filter settings. Try adjusting your search query or reset filters.
      </p>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={resetFilters}
        type="button"
        className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <RotateCcw className="h-4 w-4" />
        Reset All Filters
      </motion.button>
    </motion.div>
  );
}
