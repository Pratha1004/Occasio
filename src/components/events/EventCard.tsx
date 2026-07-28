"use client";

import { Calendar, Clock, MapPin, Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Event } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";
import { useSavedEvents, useModals } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const { isSaved, toggleSave } = useSavedEvents();
  const { openEventModal } = useModals();
  const saved = isSaved(event.id);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, delay: index * 0.08, ease: "easeOut" }}
      className="group relative flex flex-col justify-between w-full h-[370px] rounded-xl border border-border bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all duration-200 overflow-hidden shrink-0 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
    >
      {/* ── Image Section (Fixed height for 100% consistency) ── */}
      <div className="relative w-full h-[195px] shrink-0 overflow-hidden bg-slate-50 select-none">
        <Image
          src={event.image}
          alt={event.imageAlt || event.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="lazy"
        />

        {/* Category tag — subtle, text only */}
        <span className="absolute left-3 top-3 rounded bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white z-10">
          {event.category}
        </span>

        {/* Favorite (Heart) Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          suppressHydrationWarning
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSave(event.id);
          }}
          aria-label={saved ? `Remove ${event.title} from saved` : `Save ${event.title}`}
          aria-pressed={saved}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm backdrop-blur-xs transition-colors hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <motion.div
            animate={saved ? { scale: [1, 1.35, 1], rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
            transition={
              saved
                ? { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }
                : { duration: 0.2 }
            }
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors duration-300",
                saved
                  ? "fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]"
                  : "text-slate-600"
              )}
            />
          </motion.div>
        </motion.button>
      </div>

      {/* ── Details Section ── */}
      <div className="flex flex-col justify-between flex-1 p-5 space-y-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-primary uppercase tracking-wider relative z-10 pointer-events-none">
            <Calendar className="h-3 w-3 text-primary" />
            <span>{event.month} {event.day} · {event.time}</span>
          </div>

          {/* Clickable card title with fixed min-h so 1-line and 2-line titles align perfectly */}
          <button
            type="button"
            onClick={() => openEventModal(event)}
            className="block text-left w-full outline-none"
            aria-label={`View details for ${event.title}`}
          >
            <h3 className="line-clamp-2 text-[15px] font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-200 min-h-[44px] flex items-center">
              {event.title}
            </h3>
            {/* Stretched hit-area overlay */}
            <span className="absolute inset-0 z-0 rounded-2xl pointer-events-auto" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground relative z-10 pointer-events-none mt-1">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{event.venue}, {event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 relative z-10 pointer-events-none border-t border-border/40">
          <p className="text-[15px] font-bold text-foreground">
            {event.priceLabel}
          </p>
          <span className="flex items-center gap-1 text-[12px] font-semibold text-primary">
            View details
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}
