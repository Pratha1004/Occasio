"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Map, X, ArrowRight, Clock, Users } from "lucide-react";
import { useEvents, useModals } from "@/providers/AppProvider";
import Image from "next/image";
import { cn } from "@/lib/utils";

const CITIES = [
  { id: "Mumbai", label: "Mumbai", x: 20, y: 58, description: "Financial capital of India" },
  { id: "Delhi", label: "New Delhi", x: 32, y: 30, description: "National capital region" },
  { id: "Bangalore", label: "Bangalore", x: 30, y: 72, description: "Silicon Valley of India" },
  { id: "Goa", label: "Goa", x: 20, y: 68, description: "Party capital of India" },
  { id: "Hyderabad", label: "Hyderabad", x: 34, y: 65, description: "City of Pearls" },
];

export function MapView() {
  const { events } = useEvents();
  const { openEventModal } = useModals();
  const [activeCity, setActiveCity] = useState<string | null>("Mumbai");

  const cityEvents = activeCity
    ? events.filter((e) => e.location.toLowerCase() === activeCity.toLowerCase())
    : [];

  return (
    <section className="space-y-6">
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <Map className="h-4 w-4 text-muted-foreground" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Location
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Events Near You</h2>
        <p className="text-sm text-muted-foreground mt-1">Select a city to browse local events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ── Illustrated Map Panel ── */}
        <div className="lg:col-span-3 relative rounded-xl border border-border bg-[#F6F7F9] dark:bg-slate-900 overflow-hidden" style={{ minHeight: "340px" }}>
          {/* Decorative grid */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          {/* Map style silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full max-h-[320px] opacity-10"
              fill="none"
            >
              {/* Simplified India outline silhouette */}
              <path d="M40 5 L60 5 L70 15 L75 30 L72 45 L65 55 L60 70 L55 80 L50 90 L45 80 L40 70 L32 55 L25 45 L28 30 L30 15 Z"
                fill="currentColor" className="text-primary" />
            </svg>
          </div>

          {/* City Pins */}
          {CITIES.map((city) => {
            const count = events.filter((e) => e.location.toLowerCase() === city.id.toLowerCase()).length;
            const isActive = activeCity === city.id;
            return (
              <motion.button
                key={city.id}
                type="button"
                onClick={() => setActiveCity(isActive ? null : city.id)}
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={cn(
                  "relative flex flex-col items-center gap-1 transition-all",
                )}>
                  {/* Pin Bubble */}
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-xs font-extrabold shadow-lg transition-all",
                    isActive
                      ? "bg-primary border-white text-white scale-110"
                      : "bg-white dark:bg-slate-800 border-primary text-primary hover:bg-primary hover:text-white"
                  )}>
                    {count}
                  </div>
                  {/* Pin spike */}
                  <div className={cn(
                    "w-0.5 h-3 transition-all",
                    isActive ? "bg-primary" : "bg-primary/60"
                  )} />
                  {/* City label */}
                  <span className={cn(
                    "absolute top-11 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold shadow-sm border transition-all",
                    isActive
                      ? "bg-primary text-white border-primary"
                      : "bg-white dark:bg-slate-800 text-foreground border-border opacity-0 group-hover:opacity-100"
                  )}>
                    {city.label}
                  </span>
                </div>
              </motion.button>
            );
          })}

          {/* Bottom legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl border border-border/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-2">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold text-foreground">
              {events.length} events across {CITIES.length} cities
            </span>
          </div>
        </div>

        {/* ── City Events Panel ── */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden flex flex-col">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-extrabold text-foreground">
              {activeCity ? `Events in ${activeCity}` : "Select a city"}
            </h3>
            {activeCity && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {cityEvents.length} event{cityEvents.length !== 1 ? "s" : ""} found
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-80 scrollbar-thin">
            <AnimatePresence mode="wait">
              {!activeCity ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 gap-2 text-center"
                >
                  <Map className="h-10 w-10 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">
                    Click a city pin on the map to explore local events.
                  </p>
                </motion.div>
              ) : cityEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="text-xs text-muted-foreground">No events in {activeCity} yet.</p>
                </div>
              ) : (
                <motion.div
                  key={activeCity}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="divide-y divide-border/60"
                >
                  {cityEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => openEventModal(evt)}
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/30 transition-colors group"
                    >
                      <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                        <Image src={evt.image} alt={evt.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                          {evt.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {evt.time}
                          </span>
                          <span className="text-[10px] font-bold text-primary">{evt.priceLabel}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* City list chips */}
          <div className="border-t border-border px-4 py-3 flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => setActiveCity(city.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-[11px] font-bold transition-all border",
                  activeCity === city.id
                    ? "bg-primary text-white border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary hover:text-primary"
                )}
              >
                {city.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
