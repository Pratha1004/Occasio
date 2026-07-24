"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Bookmark, Trash2, QrCode, Ticket, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useSavedEvents, useDrawer, useEvents } from "@/providers/AppProvider";
import { TicketBarcode } from "@/components/ui/TicketBarcode";
import type { Event } from "@/lib/types";

export function SavedDrawer() {
  const { isOpen, close } = useDrawer();
  const { savedIds, toggleSave } = useSavedEvents();
  const { events } = useEvents();

  const savedEvents = events.filter((e: Event) => savedIds.has(e.id));

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
                savedEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 p-4 shadow-xs"
                  >
                    <div className="flex items-start gap-3.5">
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
                            onClick={() => toggleSave(event.id)}
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
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer Actions */}
            {savedEvents.length > 0 && (
              <div className="border-t border-border/80 p-6 space-y-3 bg-card">
                <button
                  type="button"
                  onClick={close}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
                >
                  Book Saved Tickets
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
