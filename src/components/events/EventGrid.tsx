"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EventCard } from "./EventCard";
import { TiltCard } from "@/components/ui/TiltCard";
import { CustomSvgEmpty } from "@/components/ui/CustomSvgEmpty";
import { useFilters, useEvents } from "@/providers/AppProvider";
import type { Event } from "@/lib/types";

export function EventGrid() {
  const { filters } = useFilters();
  const { events } = useEvents();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredEvents = useMemo(() => {
    return events.filter((event: Event) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchTitle = event.title.toLowerCase().includes(query);
        const matchDesc = event.description.toLowerCase().includes(query);
        const matchVenue = event.venue.toLowerCase().includes(query);
        const matchLocation = event.location.toLowerCase().includes(query);
        const matchTags = event.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchVenue && !matchLocation && !matchTags) {
          return false;
        }
      }

      if (filters.category !== "all") {
        if (event.category !== filters.category) return false;
      }

      if (filters.freeOnly && !event.isFree) {
        return false;
      }

      if (filters.price !== "any") {
        if (filters.price === "free" && !event.isFree) return false;
        if (filters.price === "under-1000" && event.price >= 1000) return false;
        if (filters.price === "1000-2500" && (event.price < 1000 || event.price > 2500)) return false;
        if (filters.price === "2500-plus" && event.price < 2500) return false;
      }

      if (filters.date !== "all") {
        if (filters.date === "today" && !event.dateLabel.toLowerCase().includes("today")) return false;
        if (
          filters.date === "this-weekend" &&
          !event.dateLabel.toLowerCase().includes("sun") &&
          !event.dateLabel.toLowerCase().includes("sat")
        )
          return false;
      }

      return true;
    });
  }, [filters, events]);

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    const container = carouselRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      const timer = setTimeout(updateScrollButtons, 150);
      return () => {
        container.removeEventListener("scroll", updateScrollButtons);
        clearTimeout(timer);
      };
    }
  }, [filteredEvents]);

  const handleScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.85;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (filteredEvents.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-bold tracking-tight text-foreground">
            Events Near You
          </h2>
        </div>
        <CustomSvgEmpty />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-label="Events Near You"
      className="space-y-4"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-[20px] font-bold tracking-tight text-foreground">
            Events Near You
          </h2>
          <span className="text-xs font-semibold text-muted-foreground">
            ({filteredEvents.length})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" role="group" aria-label="Carousel navigation">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-2xs hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-2xs hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-border mx-1" />

          <a
            href="#events-grid"
            className="text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            View All
          </a>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        id="events-grid"
        className="flex gap-5 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-4 select-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        role="region"
        aria-roledescription="carousel"
      >
        <AnimatePresence mode="popLayout">
          {filteredEvents.map((event, index) => (
            <div
              key={event.id}
              className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] shrink-0 snap-start"
            >
              <TiltCard maxTilt={10}>
                <EventCard event={event} index={index} />
              </TiltCard>
            </div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
