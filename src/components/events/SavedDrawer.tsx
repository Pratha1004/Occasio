"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bookmark, Trash2, QrCode, Ticket, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import Image from "next/image";
import { useSavedEvents, useDrawer, useEvents, useModals } from "@/providers/AppProvider";
import { TicketBarcode } from "@/components/ui/TicketBarcode";
import type { Event } from "@/lib/types";

export function SavedDrawer() {
  const { isOpen, close } = useDrawer();
  const { savedIds, toggleSave } = useSavedEvents();
  const { events } = useEvents();
  const { openEventModal } = useModals();

  const savedEvents = events.filter((e: Event) => savedIds.has(e.id));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Default to first saved event when list changes
  useEffect(() => {
    if (savedEvents.length > 0 && (!selectedId || !savedEvents.some((e) => e.id === selectedId))) {
      setSelectedId(savedEvents[0].id);
    }
  }, [savedEvents, selectedId]);

  const selectedEvent = savedEvents.find((e) => e.id === selectedId) || savedEvents[0];

  const handleBookEvent = (event: Event) => {
    close();
    // Small delay so drawer exit animation plays cleanly before modal opens
    setTimeout(() => openEventModal(event), 200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Drawer Slide-Over Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card border-l border-border shadow-2xl"
            aria-label="Saved events drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/80 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bookmark className="h-5 w-5 fill-primary" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-foreground">
                    My Saved Events
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {savedEvents.length} {savedEvents.length === 1 ? "event" : "events"} bookmarked
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Close saved events drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {savedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/60 text-muted-foreground mb-4">
                    <Ticket className="h-8 w-8" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Your drawer is empty</h3>
                  <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                    You haven’t saved any events yet. Explore events on the main feed and click the heart icon to save them for later!
                  </p>
                </div>
              ) : (
                savedEvents.map((event) => {
                  const isSelected = selectedId === event.id;
                  return (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setSelectedId(event.id)}
                      className={`relative overflow-hidden rounded-2xl border p-4 transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border/60 bg-background/80 hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Radio selection indicator */}
                        <div className="pt-0.5 text-primary shrink-0">
                          {isSelected ? (
                            <CheckCircle2 className="h-5 w-5 fill-primary text-primary-foreground" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground/40 hover:text-muted-foreground" />
                          )}
                        </div>

                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                          <Image
                            src={event.image}
                            alt={event.imageAlt}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-foreground truncate">
                              {event.title}
                            </h4>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSave(event.id);
                              }}
                              className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                              aria-label={`Remove ${event.title}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            {event.dateLabel} · {event.venue}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs font-extrabold text-primary">
                              {event.priceLabel}
                            </span>
                            <div className="flex items-center gap-2">
                              <QrCode className="h-4 w-4 text-muted-foreground" />
                              <TicketBarcode orientation="horizontal" height={12} className="text-muted-foreground/60" />
                            </div>
                          </div>
                          {/* Per-card Book button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookEvent(event);
                            }}
                            className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary py-1.5 text-[11px] font-bold transition-colors"
                          >
                            <Ticket className="h-3.5 w-3.5" />
                            Book Now
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer Actions */}
            {savedEvents.length > 0 && (
              <div className="border-t border-border/80 p-6 space-y-3 bg-card">
                <button
                  type="button"
                  disabled={!selectedEvent}
                  onClick={() => selectedEvent && handleBookEvent(selectedEvent)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-50"
                >
                  {selectedEvent ? `Book Selected Ticket: ${selectedEvent.title}` : "Book Saved Tickets"}
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
