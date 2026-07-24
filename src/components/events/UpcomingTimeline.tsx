"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { useEvents, useModals, useNavigation } from "@/providers/AppProvider";
import type { Event } from "@/lib/types";

function formatPrice(event: Event): string {
  if (event.isFree) return "Free";
  return event.priceLabel;
}

export function UpcomingTimeline() {
  const { events } = useEvents();
  const { openEventModal } = useModals();
  const { setActiveTab } = useNavigation();

  const upcomingEvents = events.slice(5, 8);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="upcoming-heading"
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-end justify-between border-b border-border pb-3">
        <div>
          <h2
            id="upcoming-heading"
            className="text-[20px] font-bold text-foreground tracking-tight leading-tight"
          >
            Upcoming This Week
          </h2>
          <p className="text-[13px] text-muted-foreground mt-0.5 leading-tight">
            Your next scheduled events
          </p>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab("calendar")}
          className="flex items-center gap-1 text-[12px] font-semibold text-primary hover:underline transition-all pb-0.5 cursor-pointer"
        >
          View Calendar
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Event Cards with staggered scroll reveal */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {upcomingEvents.map((event, idx) => (
          <motion.article
            key={event.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: idx * 0.12, duration: 0.45, ease: "easeOut" }}
            onClick={() => openEventModal(event)}
            className="group relative flex flex-col rounded-xl border border-border bg-card p-5 cursor-pointer hover:border-primary/40 hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex flex-col gap-3">
              {/* Date Block */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-[22px] font-bold text-foreground leading-none">
                  {event.day}
                </span>
                <span className="text-[11px] font-semibold text-primary uppercase tracking-widest leading-none">
                  {event.month}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[14px] font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                {/* Time + Venue */}
                <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground truncate mt-0.5">
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span>{event.time}</span>
                  </div>
                  <span className="text-border mx-0.5">•</span>
                  <div className="flex items-center gap-1 min-w-0">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{event.venue}</span>
                  </div>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-1">
                <span className="text-[14px] font-bold text-foreground">
                  {formatPrice(event)}
                </span>
                <span className="flex items-center gap-1 text-[12px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                  View Details <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
