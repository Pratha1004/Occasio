"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Music, Code2, UtensilsCrossed, Palette, Dumbbell,
  BookOpen, Zap, Flag, LayoutGrid, ArrowRight, ChevronRight
} from "lucide-react";
import { useFilters, useNavigation, useEvents, useModals } from "@/providers/AppProvider";
import type { EventCategory } from "@/lib/types";
import Image from "next/image";
import { cn } from "@/lib/utils";

const categoryData: {
  id: EventCategory;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "music",      label: "Music",      sub: "Concerts & Live Shows",   icon: Music },
  { id: "tech",       label: "Technology", sub: "Summits & Conferences",   icon: Code2 },
  { id: "food",       label: "Food",       sub: "Tastings & Pop-Ups",      icon: UtensilsCrossed },
  { id: "art",        label: "Arts",       sub: "Exhibitions & Culture",   icon: Palette },
  { id: "sports",     label: "Sports",     sub: "Matches & Fitness",       icon: Dumbbell },
  { id: "workshops",  label: "Education",  sub: "Workshops & Seminars",    icon: BookOpen },
  { id: "electronic", label: "Electronic", sub: "EDM & Nightlife",         icon: Zap },
  { id: "festival",   label: "Festivals",  sub: "Fairs & Community",       icon: Flag },
];

export function CategoriesView() {
  const { events } = useEvents();
  const { setCategory } = useFilters();
  const { setActiveTab } = useNavigation();
  const { openEventModal } = useModals();
  const [selectedCat, setSelectedCat] = useState<EventCategory | null>(null);

  const filteredEvents = selectedCat
    ? events.filter((e) => e.category === selectedCat)
    : [];

  const getCount = (cat: EventCategory) =>
    events.filter((e) => e.category === cat).length;

  const handleCategoryClick = (cat: EventCategory) =>
    setSelectedCat(selectedCat === cat ? null : cat);

  const handleGoDiscover = (cat: EventCategory) => {
    setCategory(cat);
    setActiveTab("discover");
  };

  return (
    <section className="space-y-8">
      {/* Section header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Browse Events
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Categories
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select a category to explore upcoming events.
        </p>
      </div>

      {/* Category Grid — clean bordered cards, no gradients */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
        {categoryData.map((cat, i) => {
          const Icon = cat.icon;
          const count = getCount(cat.id);
          const isActive = selectedCat === cat.id;

          return (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              className={cn(
                "group flex items-start gap-3.5 p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary",
                isActive
                  ? "bg-primary text-white"
                  : "bg-card hover:bg-surface"
              )}
            >
              {/* Icon container — simple, no gradients */}
              <div className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                isActive
                  ? "border-white/20 bg-white/10"
                  : "border-border bg-background group-hover:border-primary/30 group-hover:bg-primary/5"
              )}>
                <Icon className={cn(
                  "h-4 w-4",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-primary"
                )} />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                <h3 className={cn(
                  "text-[13px] font-semibold leading-tight",
                  isActive ? "text-white" : "text-foreground"
                )}>
                  {cat.label}
                </h3>
                <p className={cn(
                  "text-[11px] mt-0.5 leading-tight truncate",
                  isActive ? "text-white/70" : "text-muted-foreground"
                )}>
                  {cat.sub}
                </p>
                <span className={cn(
                  "inline-block mt-2 text-[10px] font-semibold tracking-wide",
                  isActive ? "text-white/80" : "text-muted-foreground"
                )}>
                  {count} {count === 1 ? "event" : "events"}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Events for selected category */}
      {selectedCat && (
        <motion.div
          key={selectedCat}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Sub-section header */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {categoryData.find((c) => c.id === selectedCat)?.label} Events
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {filteredEvents.length} upcoming event{filteredEvents.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleGoDiscover(selectedCat)}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-70 transition-opacity"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border py-10 text-center">
              <p className="text-sm text-muted-foreground">No events in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredEvents.slice(0, 6).map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => openEventModal(event)}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 cursor-pointer hover:border-primary/30 hover:shadow-[var(--shadow-hover)] transition-all"
                >
                  <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-surface">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{event.dateLabel}</p>
                    <span className="text-[11px] font-semibold text-primary">{event.priceLabel}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
