"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ArrowRight } from "lucide-react";
import { useSavedEvents, useDrawer, useModals, useToast, useEvents } from "@/providers/AppProvider";
import type { Event } from "@/lib/types";

// Exact Figma Ticket Styles matching Image 2 with softer pastel tones
const ticketStyles: Record<string, { ribbon: string; cardBg: string; leftBg: string }> = {
  red: { ribbon: "#EF4444", cardBg: "#FFF5F6", leftBg: "#FCE4E8" },
  green: { ribbon: "#15803D", cardBg: "#FFFDF5", leftBg: "#FAF4DF" },
  blue: { ribbon: "#2563EB", cardBg: "#F5F8FF", leftBg: "#EBF0FF" },
};

// Fixed list of 6 items matching Image 2
const figmaTicketItems = [
  {
    id: "evt-006",
    day: "18",
    month: "NOV",
    title: "The Weeknd- After Hours Til Dawn Tour",
    details: "7:30 PM • Mumbai",
    theme: "red",
  },


  {
    id: "evt-007",
    day: "25",
    month: "OCT",
    title: "Future of AI Summit 2024",
    details: "BKC, Mumbai",
    theme: "blue",
  },
  {
    id: "evt-007-dup",
    day: "25",
    month: "OCT",
    title: "Future of AI Summit 2024",
    details: "BKC, Mumbai",
    theme: "blue",
  },
  {
    id: "evt-008-dup",
    day: "12-14",
    month: "OCT",
    title: "Mumbai Street Food Festival",
    details: "Mahalaxmi Racecourse",
    theme: "green",
  },
];

// Vector QR Code matching Image 2
function TicketQRCode({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={`${className} shrink-0 text-slate-900`} fill="currentColor">
      <rect x="1" y="1" width="11" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="4" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="24" y="1" width="11" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="27" y="4" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="1" y="24" width="11" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="4" y="27" width="5" height="5" rx="1" fill="currentColor" />
      <rect x="15" y="2" width="3" height="3" fill="currentColor" />
      <rect x="15" y="8" width="3" height="3" fill="currentColor" />
      <rect x="20" y="15" width="3" height="3" fill="currentColor" />
      <rect x="26" y="15" width="3" height="3" fill="currentColor" />
      <rect x="32" y="15" width="3" height="3" fill="currentColor" />
      <rect x="15" y="21" width="3" height="3" fill="currentColor" />
      <rect x="15" y="27" width="3" height="3" fill="currentColor" />
      <rect x="21" y="27" width="3" height="3" fill="currentColor" />
      <rect x="27" y="21" width="3" height="3" fill="currentColor" />
      <rect x="32" y="27" width="3" height="3" fill="currentColor" />
      <rect x="27" y="32" width="3" height="3" fill="currentColor" />
      <rect x="32" y="32" width="3" height="3" fill="currentColor" />
    </svg>
  );
}

// Apple Icon for App Store
function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.3c.64-.78 1.08-1.85.96-2.92-.93.04-2.06.62-2.73 1.4-.6.69-1.12 1.79-.98 2.85 1.04.08 2.11-.55 2.75-1.33z" />
    </svg>
  );
}

// Google Play Icon
function GooglePlayIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.609 1.814L15.392 12 3.609 22.186A2.25 2.25 0 0 1 2 20.372V3.628a2.25 2.25 0 0 1 1.609-1.814zm13.14 11.237l3.208-2.775a1.5 1.5 0 0 0 0-2.552L16.749 4.95 14.12 12l2.629 1.051zM4.953 23.475l10.354-8.966-2.529-1.011L4.953 23.475zm0-22.95l7.825 8.452 2.529-1.011L4.953.525z" />
    </svg>
  );
}

// 3D Megaphone Graphic using custom PNG image
function Megaphone3D() {
  return (
    <div className="w-[120px] h-[120px] relative">
      <Image
        src="/organizer-megaphone.png"
        alt="Megaphone illustration"
        fill
        className="object-contain mix-blend-multiply"
        priority
      />
    </div>
  );
}

// Paper Airplane with Wave Line underneath
function PaperPlaneWithWave() {
  return (
    <div className="relative flex flex-col items-center">
      {/* Paper Plane */}
      <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#2563EB]">
        <path d="M4 20 L40 4 L24 40 L18 26 L4 20 Z" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 26 L40 4" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 26 L18 34 L23 29" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      {/* Wavy line under paper plane */}
      <svg viewBox="0 0 32 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-2 -mt-1 text-[#3B82F6]">
        <path d="M2 3 Q 8 8, 14 3 T 26 3" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

// 4-Point Star icon matching bottom of card
function FourPointStar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#7C3AED]">
      <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#7C3AED" />
    </svg>
  );
}

export function RightPanel() {
  const { savedIds, toggleSave } = useSavedEvents();
  const { open: openDrawer } = useDrawer();
  const { openCreateEventModal } = useModals();
  const { showToast } = useToast();
  const { events } = useEvents();
  const [email, setEmail] = useState("");

  // Map saved IDs to full event objects
  const savedEvents = events.filter((e) => savedIds.has(e.id));

  // Map each event to a display theme
  const themeKeys = ["red", "blue", "green"];
  const getTheme = (idx: number) => themeKeys[idx % themeKeys.length];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast("Please enter a valid email!", "error");
      return;
    }
    showToast("🎉 You're subscribed! Events will arrive in your inbox.", "success");
    setEmail("");
  };

  return (
    <aside className="hidden xl:flex h-full w-[330px] shrink-0 flex-col gap-5 border-l border-border/60 bg-sidebar/30 p-4 overflow-y-auto scrollbar-thin">
      {/* ── 1. My Saved Events Card ── */}
      <div className="shrink-0 rounded-[14px] border border-gray-100/80 bg-white p-3.5 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#0F172A]">My Saved Events</h3>
            <motion.span
              key={savedEvents.length}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB] text-[11px] font-extrabold text-white"
            >
              {savedEvents.length}
            </motion.span>
          </div>
          <button
            type="button"
            onClick={openDrawer}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Open saved events drawer"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[10px] text-gray-400 mb-3">
          Your favorite events, all in one place.
        </p>

        {/* Ticket List with AnimatePresence for exit animations */}
        <div className="space-y-5 min-h-[60px]">
          <AnimatePresence initial={false}>
            {savedEvents.length === 0 ? (
              /* Empty State */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-6 text-center gap-3"
              >
                {/* Custom SVG: Calendar + Magnifying Glass */}
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Calendar body */}
                  <rect x="8" y="14" width="38" height="34" rx="5" fill="#EEF3FF" stroke="#C7D2FE" strokeWidth="2"/>
                  {/* Calendar header */}
                  <rect x="8" y="14" width="38" height="10" rx="5" fill="#818CF8"/>
                  <rect x="8" y="19" width="38" height="5" fill="#818CF8"/>
                  {/* Calendar hooks */}
                  <rect x="18" y="10" width="4" height="8" rx="2" fill="#6366F1"/>
                  <rect x="32" y="10" width="4" height="8" rx="2" fill="#6366F1"/>
                  {/* Calendar grid dots */}
                  <rect x="15" y="30" width="4" height="4" rx="1" fill="#C7D2FE"/>
                  <rect x="24" y="30" width="4" height="4" rx="1" fill="#C7D2FE"/>
                  <rect x="33" y="30" width="4" height="4" rx="1" fill="#C7D2FE"/>
                  <rect x="15" y="39" width="4" height="4" rx="1" fill="#E0E7FF"/>
                  <rect x="24" y="39" width="4" height="4" rx="1" fill="#E0E7FF"/>
                  {/* Magnifying glass circle */}
                  <circle cx="47" cy="47" r="10" fill="white" stroke="#6366F1" strokeWidth="2.5"/>
                  <circle cx="47" cy="47" r="6" fill="#EEF3FF"/>
                  {/* Magnifying glass handle */}
                  <line x1="54" y1="54" x2="59" y2="59" stroke="#6366F1" strokeWidth="3" strokeLinecap="round"/>
                  {/* Small star sparkle */}
                  <path d="M53 20 L54.2 23.2 L57.5 23.2 L54.9 25.2 L55.9 28.4 L53 26.4 L50.1 28.4 L51.1 25.2 L48.5 23.2 L51.8 23.2 Z" fill="#FCD34D"/>
                </svg>
                <div>
                  <p className="text-[13px] font-semibold text-slate-700">No saved events yet</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hit the ♡ on any card to save events here.</p>
                </div>
              </motion.div>
            ) : (
              savedEvents.map((event, idx) => {
                const themeKey = getTheme(idx);
                const style = ticketStyles[themeKey];
                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: -40,
                      height: 0,
                      marginTop: 0,
                      transition: { duration: 0.28, ease: "easeInOut" },
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="group relative w-full overflow-hidden"
                  >
                    {/* The Ticket Card */}
                    <div
                      className="relative w-full flex items-center h-[92px] rounded-[12px] overflow-hidden border border-slate-100/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_3px_8px_rgba(15,23,42,0.06)]"
                      style={{
                        backgroundColor: style.cardBg,
                        boxShadow: "0 1px 4px rgba(15,23,42,0.06)"
                      }}
                    >
                      {/* Left Shaded Date Block */}
                      <div
                        className="flex shrink-0 flex-col items-center justify-center w-[72px] h-full text-center select-none"
                        style={{ backgroundColor: style.leftBg }}
                      >
                        <span className="text-[16px] font-semibold text-slate-800 leading-none">
                          {event.day}
                        </span>
                        <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider mt-1.5 leading-none">
                          {event.month}
                        </span>
                      </div>

                      {/* Perforation line */}
                      <div className="h-full border-r border-dashed border-slate-300/40 shrink-0" />

                      {/* Middle Content */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between pl-4 pr-3.5 py-3 h-full">
                        <h4 className="text-[12px] font-semibold text-slate-800 leading-snug line-clamp-2 pr-4 select-none">
                          {event.title}
                        </h4>
                        <div className="flex items-center justify-between w-full mt-1.5 gap-2">
                          <p className="text-[10px] text-slate-400 font-normal leading-normal truncate select-none flex-1">
                            {event.time} • {event.venue}
                          </p>
                          <div className="shrink-0 w-[28px] h-[28px] bg-white p-0.5 rounded-[5px] border border-slate-100/50 flex items-center justify-center shadow-3xs">
                            <TicketQRCode className="w-5 h-5 text-slate-800" />
                          </div>
                        </div>
                      </div>

                      {/* Bookmark Ribbon */}
                      <div
                        className="absolute top-0 right-[32px] w-[8px] h-[16px] z-10 [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]"
                        style={{ backgroundColor: style.ribbon }}
                      />

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => toggleSave(event.id)}
                        className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-sm text-[#9CA3AF] opacity-50 hover:opacity-100 hover:text-red-400 transition-all z-20 cursor-pointer"
                        aria-label={`Remove ${event.title}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* View All Saved Events */}
        {savedEvents.length > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={openDrawer}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* ── 2. BE AN ORGANIZER! Card (Matches Image 1 Exactly) ── */}
      <div className="shrink-0 relative overflow-hidden rounded-[28px] bg-[#EEF3FF] p-5.5 border border-[#E0E7FF] shadow-2xs">
        {/* Top Header */}
        <span className="text-[10px] font-bold tracking-[0.12em] text-[#B8B5FF] uppercase block mb-1">
          BE AN ORGANIZER!
        </span>

        {/* Title - Clean, No Overlap! */}
        <h3 className="text-xl font-black text-[#334155] leading-tight mb-3">
          Host.Manage. <br />
          Inspire.
        </h3>

        {/* Paragraph Copy - Left Aligned */}
        <p className="text-[11px] text-[#94A3B8] leading-[1.5] max-w-[155px] mb-4 font-normal">
          Create and manage events with ease. Build your community and sell tickets all in one place.
        </p>

        {/* Get Started Button */}
        <button
          type="button"
          onClick={openCreateEventModal}
          className="flex items-center gap-2 rounded-2xl bg-[#0247FE] hover:bg-[#003CD8] px-4.5 py-2.5 text-xs font-bold text-white shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="h-4 w-4 text-white" />
        </button>

        {/* 3D Megaphone Graphic Positioned Cleanly on Right */}
        <div className="absolute right-[-24px] top-[62px] pointer-events-none">
          {/* Subtle reflection/shadow below megaphone */}
          <div className="absolute left-[30px] bottom-[10px] w-[70px] h-[14px] bg-slate-900/10 rounded-full blur-[8px] transform rotate-[-5deg]" />
          <Megaphone3D />
        </div>

        {/* Bottom Center Sparkle Star */}
        <div className="flex justify-center mt-3 select-none">
          <FourPointStar />
        </div>
      </div>

      {/* ── 3. Stay in the loop Card ── */}
      <div className="shrink-0 rounded-3xl border border-[#F1F5F9] bg-white p-5 relative shadow-2xs">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#334155]">Stay in the loop</h4>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              Get the best events &amp; offers in your inbox.
            </p>
          </div>
          {/* Circular Purple Arrow Button */}
          <button
            type="button"
            form="newsletter-form"
            onClick={handleNewsletterSubmit}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white shadow-md transition-transform active:scale-95 shrink-0 cursor-pointer"
            aria-label="Subscribe"
          >
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>

        <form id="newsletter-form" onSubmit={handleNewsletterSubmit} className="mt-4 relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-2xl border border-[#E2E8F0] bg-white py-3 pl-4 pr-14 text-xs text-[#334155] placeholder:text-[#CBD5E1] shadow-2xs focus:border-indigo-300 focus:outline-none"
          />
          {/* Paper Airplane with wave at bottom right */}
          <div className="absolute right-2 -bottom-2.5 pointer-events-none transform rotate-6">
            <PaperPlaneWithWave />
          </div>
        </form>
      </div>

      {/* ── 4. Get the App Dark Card ── */}
      <div className="shrink-0 rounded-2xl bg-[#0B1120] p-4 text-white border border-slate-800/60" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
        {/* Header */}
        <p className="text-[13px] font-semibold text-white leading-tight">Get the App</p>
        <p className="text-[11px] text-slate-400 font-normal mt-0.5 mb-4">Scan QR or download below</p>

        <div className="flex items-center gap-4">
          {/* Store Badges Column */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            {/* App Store */}
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-[10px] bg-white/5 border border-white/10 px-3 py-2 hover:bg-white/10 transition-colors w-full cursor-pointer"
            >
              <AppleIcon className="w-5 h-5 text-white shrink-0" />
              <div className="text-left leading-tight">
                <span className="text-[8px] text-slate-400 uppercase tracking-wide font-medium block">Download on the</span>
                <span className="text-[12px] font-semibold text-white block">App Store</span>
              </div>
            </button>

            {/* Google Play */}
            <button
              type="button"
              className="flex items-center gap-2.5 rounded-[10px] bg-white/5 border border-white/10 px-3 py-2 hover:bg-white/10 transition-colors w-full cursor-pointer"
            >
              <GooglePlayIcon className="w-5 h-5 text-white shrink-0" />
              <div className="text-left leading-tight">
                <span className="text-[8px] text-slate-400 uppercase tracking-wide font-medium block">Get it on</span>
                <span className="text-[12px] font-semibold text-white block">Google Play</span>
              </div>
            </button>
          </div>

          {/* Proper pixel-pattern QR Code */}
          <div className="shrink-0 w-[74px] h-[74px] bg-white rounded-xl p-1.5 flex items-center justify-center">
            <svg viewBox="0 0 21 21" className="w-full h-full" shapeRendering="crispEdges">
              {/* Top-left finder */}
              <rect x="0" y="0" width="7" height="7" rx="1" fill="#0B1120"/>
              <rect x="1" y="1" width="5" height="5" fill="white"/>
              <rect x="2" y="2" width="3" height="3" fill="#0B1120"/>
              {/* Top-right finder */}
              <rect x="14" y="0" width="7" height="7" rx="1" fill="#0B1120"/>
              <rect x="15" y="1" width="5" height="5" fill="white"/>
              <rect x="16" y="2" width="3" height="3" fill="#0B1120"/>
              {/* Bottom-left finder */}
              <rect x="0" y="14" width="7" height="7" rx="1" fill="#0B1120"/>
              <rect x="1" y="15" width="5" height="5" fill="white"/>
              <rect x="2" y="16" width="3" height="3" fill="#0B1120"/>
              {/* Data modules */}
              <rect x="8" y="0" width="1" height="1" fill="#0B1120"/>
              <rect x="10" y="0" width="1" height="1" fill="#0B1120"/>
              <rect x="12" y="0" width="1" height="1" fill="#0B1120"/>
              <rect x="8" y="2" width="1" height="1" fill="#0B1120"/>
              <rect x="10" y="2" width="2" height="1" fill="#0B1120"/>
              <rect x="8" y="4" width="2" height="1" fill="#0B1120"/>
              <rect x="11" y="4" width="1" height="1" fill="#0B1120"/>
              <rect x="8" y="6" width="1" height="1" fill="#0B1120"/>
              <rect x="12" y="6" width="1" height="1" fill="#0B1120"/>
              <rect x="0" y="8" width="1" height="1" fill="#0B1120"/>
              <rect x="2" y="8" width="2" height="1" fill="#0B1120"/>
              <rect x="5" y="8" width="1" height="1" fill="#0B1120"/>
              <rect x="8" y="8" width="1" height="1" fill="#0B1120"/>
              <rect x="10" y="8" width="1" height="1" fill="#0B1120"/>
              <rect x="12" y="8" width="2" height="1" fill="#0B1120"/>
              <rect x="15" y="8" width="2" height="1" fill="#0B1120"/>
              <rect x="19" y="8" width="1" height="1" fill="#0B1120"/>
              <rect x="0" y="10" width="2" height="1" fill="#0B1120"/>
              <rect x="4" y="10" width="1" height="1" fill="#0B1120"/>
              <rect x="6" y="10" width="1" height="1" fill="#0B1120"/>
              <rect x="9" y="10" width="2" height="1" fill="#0B1120"/>
              <rect x="13" y="10" width="1" height="1" fill="#0B1120"/>
              <rect x="16" y="10" width="2" height="1" fill="#0B1120"/>
              <rect x="20" y="10" width="1" height="1" fill="#0B1120"/>
              <rect x="0" y="12" width="1" height="1" fill="#0B1120"/>
              <rect x="3" y="12" width="2" height="1" fill="#0B1120"/>
              <rect x="7" y="12" width="1" height="1" fill="#0B1120"/>
              <rect x="10" y="12" width="1" height="1" fill="#0B1120"/>
              <rect x="12" y="12" width="3" height="1" fill="#0B1120"/>
              <rect x="17" y="12" width="1" height="1" fill="#0B1120"/>
              <rect x="19" y="12" width="2" height="1" fill="#0B1120"/>
              <rect x="8" y="14" width="2" height="1" fill="#0B1120"/>
              <rect x="12" y="14" width="1" height="1" fill="#0B1120"/>
              <rect x="14" y="14" width="2" height="1" fill="#0B1120"/>
              <rect x="17" y="14" width="1" height="1" fill="#0B1120"/>
              <rect x="19" y="14" width="1" height="1" fill="#0B1120"/>
              <rect x="8" y="16" width="1" height="1" fill="#0B1120"/>
              <rect x="10" y="16" width="2" height="1" fill="#0B1120"/>
              <rect x="15" y="16" width="2" height="1" fill="#0B1120"/>
              <rect x="20" y="16" width="1" height="1" fill="#0B1120"/>
              <rect x="8" y="18" width="2" height="1" fill="#0B1120"/>
              <rect x="12" y="18" width="1" height="1" fill="#0B1120"/>
              <rect x="14" y="18" width="3" height="1" fill="#0B1120"/>
              <rect x="19" y="18" width="2" height="1" fill="#0B1120"/>
              <rect x="8" y="20" width="1" height="1" fill="#0B1120"/>
              <rect x="11" y="20" width="2" height="1" fill="#0B1120"/>
              <rect x="15" y="20" width="1" height="1" fill="#0B1120"/>
              <rect x="18" y="20" width="1" height="1" fill="#0B1120"/>
              <rect x="20" y="20" width="1" height="1" fill="#0B1120"/>
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}
