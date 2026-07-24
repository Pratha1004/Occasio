"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Command } from "lucide-react";
import { motion } from "framer-motion";
import { useFilters } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const { filters, setSearch } = useFilters();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className={cn("relative w-full max-w-xl", className)}
    >
      <label htmlFor="event-search" className="sr-only">
        Search events
      </label>
      <Search
        className={cn(
          "pointer-events-none absolute top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-all duration-300",
          isFocused ? "left-5 text-primary scale-110" : "left-4 text-muted scale-100"
        )}
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        id="event-search"
        type="search"
        role="searchbox"
        placeholder="Search events, artists, places..."
        value={filters.search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          "h-11 w-full rounded-xl border bg-card pr-20 text-sm text-foreground shadow-sm transition-all duration-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15",
          isFocused ? "pl-12 border-primary/50 placeholder:opacity-40 shadow-md" : "pl-11 border-border placeholder:opacity-100"
        )}
      />
      <kbd
        className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-border bg-background px-2 py-0.5 text-[10px] font-medium text-muted transition-opacity sm:flex"
        style={{ opacity: isFocused ? 0 : 1 }}
        aria-hidden="true"
      >
        <Command className="h-3 w-3" />K
      </kbd>
    </motion.div>
  );
}
