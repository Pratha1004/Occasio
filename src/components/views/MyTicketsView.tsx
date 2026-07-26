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
import type { BookedTicket } from "@/lib/types";

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
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownloadPass = (e: React.MouseEvent, ticket: BookedTicket) => {
    e.stopPropagation();

    const totalDisplay =
      ticket.totalAmount === 0
        ? "FREE"
        : `₹${ticket.totalAmount.toLocaleString()}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Occasio Pass – ${ticket.eventTitle}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #0f0f1a; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 24px; }
    .pass { width: 480px; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border-radius: 24px; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,0.6); border: 1px solid rgba(99,102,241,0.3); }
    .pass-header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 28px 28px 20px; }
    .brand { font-size: 10px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 6px; }
    .event-title { font-size: 22px; font-weight: 900; color: #fff; line-height: 1.2; }
    .badge { display: inline-block; margin-top: 10px; background: rgba(16,185,129,0.2); color: #34d399; border: 1px solid rgba(52,211,153,0.4); border-radius: 999px; padding: 3px 12px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; }
    .pass-body { padding: 24px 28px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; margin-bottom: 24px; }
    .field label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; font-weight: 700; display: block; margin-bottom: 3px; }
    .field span { font-size: 13px; font-weight: 700; color: #e2e8f0; }
    .divider { border: none; border-top: 1px dashed rgba(99,102,241,0.3); margin: 20px 0; }
    .qr-section { display: flex; align-items: center; justify-content: space-between; }
    .qr-info label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; font-weight: 700; display: block; margin-bottom: 4px; }
    .qr-code-text { font-family: monospace; font-size: 9px; color: #818cf8; word-break: break-all; max-width: 280px; line-height: 1.6; }
    .qr-box { width: 72px; height: 72px; background: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .qr-placeholder { width: 56px; height: 56px; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(5, 1fr); gap: 2px; }
    .qr-cell { background: #1e1b4b; border-radius: 1px; }
    .qr-cell.w { background: transparent; }
    .pass-footer { background: rgba(0,0,0,0.3); padding: 14px 28px; display: flex; justify-content: space-between; align-items: center; }
    .pass-footer span { font-size: 10px; color: #475569; }
    .price { font-size: 16px; font-weight: 900; color: #818cf8; }
    @media print {
      body { background: white; padding: 0; }
      .pass { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="pass">
    <div class="pass-header">
      <div class="brand">✦ Occasio Digital Pass</div>
      <div class="event-title">${ticket.eventTitle}</div>
      <div class="badge">✓ ACTIVE / VALID ENTRY</div>
    </div>
    <div class="pass-body">
      <div class="grid">
        <div class="field"><label>Ticket ID</label><span>${ticket.ticketId}</span></div>
        <div class="field"><label>Pass Type</label><span>${ticket.tierName}</span></div>
        <div class="field"><label>Date</label><span>${ticket.dateLabel}</span></div>
        <div class="field"><label>Time</label><span>${ticket.time}</span></div>
        <div class="field"><label>Venue</label><span>${ticket.venue}</span></div>
        <div class="field"><label>Quantity</label><span>${ticket.quantity}x</span></div>
        <div class="field"><label>Guest Name</label><span>${ticket.buyerName || "Guest"}</span></div>
        <div class="field"><label>Total Paid</label><span>${totalDisplay}</span></div>
      </div>
      <hr class="divider" />
      <div class="qr-section">
        <div class="qr-info">
          <label>Entry Barcode / QR Seed</label>
          <div class="qr-code-text">${ticket.qrCodeSeed}</div>
        </div>
        <div class="qr-box">
          <div class="qr-placeholder">
            ${[1,1,1,1,1,1,0,0,0,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,1].map(v=>`<div class="qr-cell${v===0?' w':''}"></div>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="pass-footer">
      <span>Present at venue entry • Occasio Event Discovery</span>
      <span class="price">${totalDisplay}</span>
    </div>
  </div>
  <script>window.onload=()=>{window.print();}<\/script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }

    setDownloadedId(ticket.ticketId);
    setTimeout(() => setDownloadedId(null), 2500);
  };

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
                            onClick={(e) => handleDownloadPass(e, ticket)}
                            className={cn(
                              "flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer",
                              downloadedId === ticket.ticketId
                                ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                                : "border-white/20 text-white hover:bg-white/10"
                            )}
                          >
                            {downloadedId === ticket.ticketId ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                Pass Downloaded!
                              </>
                            ) : (
                              <>
                                <Download className="h-3.5 w-3.5" />
                                Download Pass
                              </>
                            )}
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
