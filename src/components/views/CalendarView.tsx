"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, ArrowRight } from "lucide-react";
import { useEvents, useModals } from "@/providers/AppProvider";
import { CATEGORY_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Parse event date from 'YYYY-MM-DD' string
function getEventDay(dateStr: string): { y: number; m: number; d: number } | null {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;
  return { y: parseInt(parts[0]), m: parseInt(parts[1]) - 1, d: parseInt(parts[2]) };
}

export function CalendarView() {
  const { events } = useEvents();
  const { openEventModal } = useModals();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map events to their day numbers for fast lookup
  const eventsByDay = useMemo(() => {
    const map: Record<number, typeof events> = {};
    events.forEach((evt) => {
      const parsed = getEventDay(evt.date);
      if (parsed && parsed.y === year && parsed.m === month) {
        if (!map[parsed.d]) map[parsed.d] = [];
        map[parsed.d].push(evt);
      }
    });
    return map;
  }, [events, year, month]);

  const selectedDayEvents = selectedDay ? (eventsByDay[selectedDay] || []) : [];

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  };

  const cells = Array.from({ length: firstDay }).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <section className="space-y-6">
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Schedule
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Event Calendar</h2>
        <p className="text-sm text-muted-foreground mt-1">Navigate by month and click a date to see events.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ── Calendar Grid ── */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={prevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="text-sm font-extrabold text-foreground">
              {MONTH_NAMES[month]} {year}
            </h3>
            <button
              type="button"
              onClick={nextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-background hover:bg-secondary transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day Name Headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-[11px] font-bold text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((cell, i) => {
              if (cell === null) return <div key={`empty-${i}`} />;
              const day = cell as number;
              const hasEvents = !!eventsByDay[day];
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = day === selectedDay;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={cn(
                    "relative mx-auto flex h-9 w-9 flex-col items-center justify-center rounded-xl text-xs font-semibold transition-all",
                    isSelected && "bg-primary text-white shadow-md",
                    !isSelected && isToday && "border border-primary text-primary font-bold",
                    !isSelected && !isToday && hasEvents && "text-foreground hover:bg-primary/10",
                    !isSelected && !isToday && !hasEvents && "text-muted-foreground/60 cursor-default"
                  )}
                >
                  {day}
                  {hasEvents && !isSelected && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {(eventsByDay[day] || []).slice(0, 3).map((_, j) => (
                        <div key={j} className="h-1 w-1 rounded-full bg-primary" />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              Events scheduled
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-xl border border-primary text-primary text-[10px] font-bold flex items-center justify-center">
                T
              </div>
              Today
            </div>
          </div>
        </div>

        {/* ── Day Event List ── */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-extrabold text-foreground">
              {selectedDay
                ? `Events on ${MONTH_NAMES[month].slice(0, 3)} ${selectedDay}`
                : "Select a date to see events"}
            </h3>
            {selectedDay && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {selectedDayEvents.length} event{selectedDayEvents.length !== 1 ? "s" : ""} scheduled
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-72 scrollbar-thin">
            <AnimatePresence mode="wait">
              {!selectedDay ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                  <CalendarIcon className="h-10 w-10 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground px-4">
                    Click a highlighted date on the calendar to see events.
                  </p>
                </div>
              ) : selectedDayEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-center">
                  <p className="text-xs text-muted-foreground">No events on this date.</p>
                </div>
              ) : (
                <motion.div
                  key={`${month}-${selectedDay}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="divide-y divide-border/60"
                >
                  {selectedDayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => openEventModal(evt)}
                      className="flex items-start gap-3 p-4 cursor-pointer hover:bg-secondary/30 transition-colors group"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{evt.title}</h4>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {evt.venue}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[11px] font-bold text-primary">{evt.priceLabel}</span>
                          <span className="text-[10px] text-muted-foreground">{evt.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
