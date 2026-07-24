"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket, Download, X, QrCode, Calendar, Clock, MapPin, CheckCircle2,
  Trash2, ArrowRight, ScanLine,
} from "lucide-react";
import Image from "next/image";
import { useBookedTickets } from "@/providers/AppProvider";
import { cn } from "@/lib/utils";

function TicketQRMini({ seed, size = "sm" }: { seed: string; size?: "sm" | "lg" }) {
  // Deterministic pattern from seed string
  const cells = Array.from({ length: 49 }, (_, i) => {
    const charCode = seed.charCodeAt(i % seed.length);
    return (charCode + i * 7 + i) % 3 !== 0;
  });
  const dim = size === "lg" ? 7 : 5;
  const cellSize = size === "lg" ? 24 : 16;

  return (
    <svg width={dim * cellSize} height={dim * cellSize} viewBox={`0 0 ${dim * cellSize} ${dim * cellSize}`} shapeRendering="crispEdges">
      {cells.slice(0, dim * dim).map((filled, i) => {
        const col = i % dim;
        const row = Math.floor(i / dim);
        return filled ? (
          <rect key={i} x={col * cellSize} y={row * cellSize} width={cellSize} height={cellSize} fill="currentColor" />
        ) : null;
      })}
    </svg>
  );
}

const PASS_GRADIENTS = [
  "from-violet-600 to-indigo-700",
  "from-blue-600 to-cyan-600",
  "from-emerald-600 to-teal-700",
  "from-rose-600 to-pink-600",
  "from-amber-500 to-orange-600",
];

export function MyTicketsView() {
  const { bookedTickets, cancelTicket } = useBookedTickets();
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = (ticketId: string) => {
    setCancellingId(ticketId);
    setTimeout(() => {
      cancelTicket(ticketId);
      setCancellingId(null);
      if (expandedTicket === ticketId) setExpandedTicket(null);
    }, 500);
  };

  if (bookedTickets.length === 0) {
    return (
      <section className="space-y-5">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-extrabold text-foreground">My Tickets</h2>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card py-20 text-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Ticket className="h-10 w-10 text-primary/60" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-foreground">No tickets yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              Browse events and click "Book Tickets" to claim your digital passes. They'll appear here instantly!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-extrabold text-foreground">My Tickets</h2>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {bookedTickets.length} Pass{bookedTickets.length !== 1 ? "es" : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AnimatePresence>
          {bookedTickets.map((ticket, idx) => {
            const gradient = PASS_GRADIENTS[idx % PASS_GRADIENTS.length];
            const isExpanded = expandedTicket === ticket.ticketId;
            const isCancelling = cancellingId === ticket.ticketId;

            return (
              <motion.div
                key={ticket.ticketId}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: isCancelling ? 0 : 1, scale: isCancelling ? 0.9 : 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "relative overflow-hidden rounded-3xl border border-white/10 shadow-xl cursor-pointer select-none",
                  `bg-gradient-to-br ${gradient}`
                )}
                onClick={() => setExpandedTicket(isExpanded ? null : ticket.ticketId)}
              >
                {/* Perforated Edge */}
                <div className="absolute inset-y-0 right-[88px] border-r border-dashed border-white/20 z-0" />

                <div className="relative z-10 p-5 space-y-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase tracking-[0.15em] text-white/70 font-bold block">
                        OCCASIO PASS
                      </span>
                      <h3 className="text-sm font-black text-white leading-tight mt-0.5 line-clamp-2 pr-4">
                        {ticket.eventTitle}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-400/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      ✓ ACTIVE
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[9px] text-white/50 uppercase tracking-wider block">Date</span>
                      <span className="text-[11px] font-bold text-white">{ticket.dateLabel}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/50 uppercase tracking-wider block">Time</span>
                      <span className="text-[11px] font-bold text-white">{ticket.time}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/50 uppercase tracking-wider block">Venue</span>
                      <span className="text-[11px] font-bold text-white truncate block">{ticket.venue}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/50 uppercase tracking-wider block">Pass Type</span>
                      <span className="text-[11px] font-bold text-white">{ticket.tierName} ({ticket.quantity}x)</span>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-end justify-between border-t border-white/15 pt-3">
                    <div>
                      <span className="text-[9px] text-white/50 block">Ticket ID</span>
                      <span className="text-[11px] font-mono font-bold text-white/80">{ticket.ticketId}</span>
                    </div>
                    {/* QR Code Area */}
                    <div className="h-14 w-14 bg-white rounded-xl p-1.5 flex items-center justify-center">
                      <span className="text-slate-900">
                        <TicketQRMini seed={ticket.qrCodeSeed} size="sm" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/20 bg-black/30 backdrop-blur-sm overflow-hidden"
                    >
                      <div className="p-4 space-y-3">
                        {/* Expanded QR */}
                        <div className="flex items-center justify-center py-3 gap-6">
                          <div className="bg-white rounded-2xl p-3 flex items-center justify-center">
                            <span className="text-slate-900">
                              <TicketQRMini seed={ticket.qrCodeSeed} size="lg" />
                            </span>
                          </div>
                          <div className="text-white space-y-1.5">
                            <div className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              <span>Valid Entry Pass</span>
                            </div>
                            <div className="text-[11px] text-white/60">
                              Show QR at venue for entry
                            </div>
                            <div className="text-[10px] font-mono text-white/40 break-all">
                              {ticket.qrCodeSeed.slice(0, 30)}...
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); }}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/20 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download Pass
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleCancel(ticket.ticketId); }}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-red-400/30 py-2.5 text-xs font-bold text-red-300 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Cancel Ticket
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Expand indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20">
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <div className="h-1 w-6 rounded-full bg-white/30 mx-auto" />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
