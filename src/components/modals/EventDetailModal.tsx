"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Users,
  CheckCircle2,
  Ticket,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  CreditCard,
  QrCode,
  ShieldCheck,
  Building2,
  Download,
} from "lucide-react";
import Image from "next/image";
import {
  useModals,
  useSavedEvents,
  useBookedTickets,
  useToast,
  useNotifications,
  useNavigation,
} from "@/providers/AppProvider";
import { CATEGORY_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";

const TICKET_TIERS = [
  {
    id: "gen",
    name: "General Admission",
    priceMultiplier: 1,
    description: "Full event access + complimentary welcome drink",
    perks: ["Entry Pass", "Standard Seating / Standing Area"],
  },
  {
    id: "vip",
    name: "VIP Lounge Pass",
    priceMultiplier: 1.8,
    description: "Exclusive VIP deck, complimentary lounge food & priority entry",
    perks: ["Priority Express Line", "VIP Lounge Access", "Artist Meet & Greet Chance"],
  },
];

export function EventDetailModal() {
  const { selectedEvent, closeEventModal } = useModals();
  const { isSaved, toggleSave } = useSavedEvents();
  const { bookTicket } = useBookedTickets();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const { setActiveTab } = useNavigation();

  const [selectedTierId, setSelectedTierId] = useState("gen");
  const [quantity, setQuantity] = useState(1);
  const [bookingStep, setBookingStep] = useState<"details" | "checkout" | "confirmed">("details");
  const [name, setName] = useState("Prabh");
  const [email, setEmail] = useState("prabh@occasio.app");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [confirmedTicket, setConfirmedTicket] = useState<any>(null);
  const [downloadedModalPass, setDownloadedModalPass] = useState(false);

  if (!selectedEvent) return null;

  const saved = isSaved(selectedEvent.id);
  const basePrice = selectedEvent.isFree ? 0 : selectedEvent.price;

  const currentTier = TICKET_TIERS.find((t) => t.id === selectedTierId) || TICKET_TIERS[0];
  const unitPrice = selectedEvent.isFree ? 0 : Math.round(basePrice * currentTier.priceMultiplier);
  const totalPrice = unitPrice * quantity;

  const handleDownloadConfirmedPass = () => {
    if (!confirmedTicket) return;

    const totalDisplay =
      confirmedTicket.totalPrice === 0
        ? "FREE"
        : `₹${confirmedTicket.totalPrice.toLocaleString()}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Occasio Pass – ${confirmedTicket.eventTitle}</title>
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
      <div class="event-title">${confirmedTicket.eventTitle}</div>
      <div class="badge">✓ ACTIVE / VALID ENTRY</div>
    </div>
    <div class="pass-body">
      <div class="grid">
        <div class="field"><label>Ticket ID</label><span>${confirmedTicket.ticketId}</span></div>
        <div class="field"><label>Pass Type</label><span>${confirmedTicket.tierName}</span></div>
        <div class="field"><label>Date</label><span>${confirmedTicket.dateLabel}</span></div>
        <div class="field"><label>Time</label><span>${confirmedTicket.time}</span></div>
        <div class="field"><label>Venue</label><span>${confirmedTicket.venue}</span></div>
        <div class="field"><label>Quantity</label><span>${confirmedTicket.quantity}x</span></div>
        <div class="field"><label>Guest Name</label><span>${confirmedTicket.buyerName}</span></div>
        <div class="field"><label>Total Paid</label><span>${totalDisplay}</span></div>
      </div>
      <hr class="divider" />
      <div class="qr-section">
        <div class="qr-info">
          <label>Entry Barcode / QR Seed</label>
          <div class="qr-code-text">${confirmedTicket.qrCodeSeed}</div>
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

    setDownloadedModalPass(true);
    setTimeout(() => setDownloadedModalPass(false), 2500);
  };

  const handleBookNow = () => {
    if (selectedEvent.isFree) {
      // Direct booking for free events
      processBooking();
    } else {
      setBookingStep("checkout");
    }
  };

  const processBooking = () => {
    const ticket = bookTicket({
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      eventImage: selectedEvent.image,
      dateLabel: selectedEvent.dateLabel,
      time: selectedEvent.time,
      venue: selectedEvent.venue,
      location: selectedEvent.location,
      tierName: selectedEvent.isFree ? "Free Access Pass" : currentTier.name,
      quantity,
      totalAmount: totalPrice,
      buyerName: name || "Guest User",
      buyerEmail: email || "user@occasio.app",
    });

    setConfirmedTicket(ticket);
    setBookingStep("confirmed");

    showToast(`🎉 Ticket confirmed for ${selectedEvent.title}!`, "success");
    addNotification({
      title: "Booking Confirmed! 🎫",
      message: `Your pass for ${selectedEvent.title} (${quantity}x ${currentTier.name}) is ready in My Tickets.`,
      type: "ticket",
    });
  };

  const handleClose = () => {
    setBookingStep("details");
    setSelectedTierId("gen");
    setQuantity(1);
    setConfirmedTicket(null);
    closeEventModal();
  };

  const viewInMyTickets = () => {
    handleClose();
    setActiveTab("tickets");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-card border border-border shadow-2xl my-auto max-h-[90vh] flex flex-col"
        >
          {/* Top Sticky Bar / Header Image Banner */}
          {bookingStep === "details" && (
            <div className="relative h-56 sm:h-64 w-full shrink-0 overflow-hidden bg-slate-900">
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.title}
                fill
                className="object-cover opacity-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/80"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Save Button */}
              <button
                type="button"
                onClick={() => toggleSave(selectedEvent.id)}
                className="absolute top-4 right-16 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/80"
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    saved ? "fill-red-500 text-red-500" : "text-white"
                  )}
                />
              </button>

              {/* Overlay Content */}
              <div className="absolute bottom-4 left-6 right-6 space-y-2 text-white">
                <span
                  className={cn(
                    "inline-block rounded-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider",
                    CATEGORY_COLORS[selectedEvent.category]
                  )}
                >
                  {selectedEvent.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black leading-tight drop-shadow-md">
                  {selectedEvent.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    {selectedEvent.dateLabel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-red-400" />
                    {selectedEvent.venue}, {selectedEvent.location}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 scrollbar-thin">

            {/* ── STEP 1: DETAILS & TICKET SELECTION ── */}
            {bookingStep === "details" && (
              <>
                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    About Event
                  </h3>
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Event Highlights Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-border bg-secondary/30 p-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-primary shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">Time</span>
                      <span className="text-xs font-bold text-foreground">{selectedEvent.time}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-secondary/30 p-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">Attending</span>
                      <span className="text-xs font-bold text-foreground">{selectedEvent.attendees.toLocaleString()} people</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-secondary/30 p-3 flex items-center gap-3 col-span-2 sm:col-span-1">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-medium">Organizer</span>
                      <span className="text-xs font-bold text-foreground truncate max-w-[100px] block">
                        {selectedEvent.organizer || "Occasio Verified"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ticket Tier Selector (If not free) */}
                {!selectedEvent.isFree && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Select Ticket Tier
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {TICKET_TIERS.map((tier) => {
                        const price = Math.round(basePrice * tier.priceMultiplier);
                        const isSelected = selectedTierId === tier.id;
                        return (
                          <div
                            key={tier.id}
                            onClick={() => setSelectedTierId(tier.id)}
                            className={cn(
                              "relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 flex flex-col justify-between gap-3",
                              isSelected
                                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                                : "border-border bg-card hover:bg-secondary/30"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-sm font-bold text-foreground">
                                  {tier.name}
                                </h4>
                                <p className="text-[11px] text-muted-foreground mt-0.5">
                                  {tier.description}
                                </p>
                              </div>
                              <span className="text-base font-black text-primary">
                                ₹{price.toLocaleString()}
                              </span>
                            </div>

                            <div className="space-y-1">
                              {tier.perks.map((perk, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                  <span>{perk}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Control & Pricing Bar */}
                <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/20 p-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all disabled:opacity-40 hover:bg-secondary"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-base font-extrabold text-foreground w-6 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all hover:bg-secondary"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                      Total Price
                    </span>
                    <span className="text-2xl font-black text-primary">
                      {selectedEvent.isFree ? "Free" : `₹${totalPrice.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 2: CHECKOUT / PAYMENT FORM ── */}
            {bookingStep === "checkout" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Checkout Details</h3>
                    <p className="text-xs text-muted-foreground">Confirm your reservation</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBookingStep("details")}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    ← Back to event
                  </button>
                </div>

                {/* Summary Box */}
                <div className="rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 p-4 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">{selectedEvent.title}</span>
                    <span className="font-bold text-primary">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex justify-between">
                    <span>{quantity}x {currentTier.name}</span>
                    <span>{selectedEvent.dateLabel}</span>
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Attendee Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-foreground block mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-foreground block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium focus:border-primary focus:outline-none"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Select Payment Option
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all",
                        paymentMethod === "upi"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border bg-card hover:bg-secondary/30"
                      )}
                    >
                      <Sparkles className="h-5 w-5 text-indigo-500" />
                      <div>
                        <span className="text-xs font-bold block text-foreground">Instant UPI / QR</span>
                        <span className="text-[10px] text-muted-foreground">GPay, PhonePe, Paytm</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all",
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border bg-card hover:bg-secondary/30"
                      )}
                    >
                      <CreditCard className="h-5 w-5 text-sky-500" />
                      <div>
                        <span className="text-xs font-bold block text-foreground">Card / NetBanking</span>
                        <span className="text-[10px] text-muted-foreground">Visa, Mastercard, HDFC</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>Safe &amp; Encrypted transaction. Instant pass generation.</span>
                </div>
              </div>
            )}

            {/* ── STEP 3: BOOKING CONFIRMED SCREEN ── */}
            {bookingStep === "confirmed" && confirmedTicket && (
              <div className="flex flex-col items-center justify-center text-center py-4 space-y-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div>
                  <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 block">
                    BOOKING CONFIRMED!
                  </span>
                  <h3 className="text-2xl font-black text-foreground mt-1">
                    You're going to {selectedEvent.title}!
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ticket ID: <span className="font-mono font-bold text-foreground">{confirmedTicket.ticketId}</span>
                  </p>
                </div>

                {/* Digital Ticket Pass Card */}
                <div className="w-full max-w-md rounded-2xl border border-border bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white text-left shadow-xl space-y-4 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold block">
                        OCCASIO DIGITAL PASS
                      </span>
                      <h4 className="text-base font-bold text-white leading-tight mt-0.5">
                        {confirmedTicket.eventTitle}
                      </h4>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      ACTIVE PASS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Date &amp; Time</span>
                      <span className="font-semibold">{confirmedTicket.dateLabel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Venue</span>
                      <span className="font-semibold truncate block">{confirmedTicket.venue}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pass Type</span>
                      <span className="font-semibold">{confirmedTicket.tierName} ({confirmedTicket.quantity}x)</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Guest Name</span>
                      <span className="font-semibold">{confirmedTicket.buyerName}</span>
                    </div>
                  </div>

                  {/* QR Code Container */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 block">Entry Barcode</span>
                      <span className="text-[10px] font-mono text-indigo-300">{confirmedTicket.qrCodeSeed.slice(0, 22)}</span>
                    </div>
                    <div className="h-10 w-10 bg-white p-1 rounded-lg flex items-center justify-center">
                      <QrCode className="h-8 w-8 text-slate-900" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Sticky Footer CTA */}
          <div className="border-t border-border bg-card p-4 sm:px-8 flex items-center justify-between gap-4">
            {bookingStep === "details" && (
              <>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Total
                  </span>
                  <span className="text-xl font-black text-foreground">
                    {selectedEvent.isFree ? "Free" : `₹${totalPrice.toLocaleString()}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleBookNow}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-extrabold text-primary-foreground shadow-md hover:bg-primary/90 transition-transform active:scale-95"
                >
                  <Ticket className="h-4 w-4" />
                  <span>{selectedEvent.isFree ? "Register Free RSVP" : "Book Tickets"}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}

            {bookingStep === "checkout" && (
              <>
                <button
                  type="button"
                  onClick={() => setBookingStep("details")}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={processBooking}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-extrabold text-white shadow-md hover:bg-emerald-700 transition-transform active:scale-95"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Pay ₹{totalPrice.toLocaleString()} &amp; Confirm</span>
                </button>
              </>
            )}

            {bookingStep === "confirmed" && (
              <div className="flex w-full items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadConfirmedPass}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-3 text-xs font-bold transition-all cursor-pointer",
                    downloadedModalPass
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "border-border bg-secondary text-foreground hover:bg-border"
                  )}
                >
                  {downloadedModalPass ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      <span>Download Pass</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={viewInMyTickets}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90"
                >
                  <span>My Tickets Wallet</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
