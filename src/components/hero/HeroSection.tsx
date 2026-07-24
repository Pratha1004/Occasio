"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

/* ─── Hand-drawn White Curved Arrow ─── */
function HandDrawnWhiteArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M10 65 C 5 45, 10 20, 30 10" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M20 15 L 30 10 L 25 25" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Hand-drawn Yellow Arrow ─── */
function HandDrawnYellowArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M5 15 C 20 10, 40 20, 30 45" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M38 40 L 30 45 L 22 38" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Animated Counter ─── */
function AnimatedStat({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col">
      <span className="text-[16px] sm:text-[18px] md:text-[20px] font-bold text-white leading-none">{count}{suffix}</span>
      <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest mt-1">{label}</span>
    </div>
  );
}

export function HeroSection() {
  const scrollToEvents = () => {
    document.getElementById("events-grid")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative mb-6 text-white"
      style={{ isolation: "isolate" }}
    >
      {/* ── SVG Ticket-shaped background with perforated notches ── */}
      {/* Uses a 1000×320 viewBox; the notch circles are at the vertical midpoint on each side */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="ticket-clip">
            {/*
              Ticket shape:
              - Rounded corners (r=18)
              - Semicircle notch cut into left edge at vertical midpoint (cy=160, r=22, bulging inward)
              - Semicircle notch cut into right edge at vertical midpoint (cy=160, r=22, bulging inward)
              Using "evenodd" fill-rule: the inner circles subtract from the outer rect.
            */}
            <path
              fillRule="evenodd"
              d="
                M 18 0
                H 982
                Q 1000 0 1000 18
                V 138
                A 22 22 0 0 0 1000 182
                V 302
                Q 1000 320 982 320
                H 18
                Q 0 320 0 302
                V 182
                A 22 22 0 0 0 0 138
                V 18
                Q 0 0 18 0
                Z
              "
            />
          </clipPath>
          {/* Dotted pattern */}
          <pattern id="dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#475569" opacity="0.35" />
          </pattern>
        </defs>

        {/* Base dark navy fill clipped to ticket shape */}
        <rect width="1000" height="320" fill="#06132b" clipPath="url(#ticket-clip)" />

        {/* Dot grid overlay clipped to ticket shape */}
        <rect width="1000" height="320" fill="url(#dot-grid)" clipPath="url(#ticket-clip)" />

        {/* Left ambient glow blob */}
        <ellipse cx="80" cy="80" rx="180" ry="180" fill="#3B82F6" opacity="0.08" clipPath="url(#ticket-clip)" />

        {/* Right ambient glow blob */}
        <ellipse cx="920" cy="260" rx="220" ry="200" fill="#6366F1" opacity="0.08" clipPath="url(#ticket-clip)" />

        {/* Perforated dashed divider line — vertical at ~65% from left */}
        <line
          x1="648" y1="12" x2="648" y2="308"
          stroke="#334155"
          strokeWidth="1.5"
          strokeDasharray="6 5"
          opacity="0.6"
          clipPath="url(#ticket-clip)"
        />
      </svg>

      {/* ── Animated blobs layer (on top of SVG, clipped by same shape via overflow-hidden wrapper) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-none" style={{ clipPath: "none" }}>
        <motion.div
          animate={{ x: [0, 20, -10, 0], y: [0, -20, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-[240px] md:w-[300px] h-[240px] md:h-[300px] bg-primary/15 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -20, 10, 0], y: [0, 20, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-20 right-10 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-indigo-500/10 rounded-full blur-[90px]"
        />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 lg:gap-0 items-center w-full px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-8 lg:px-14 lg:py-8 overflow-visible">

        {/* ─── LEFT COL: Editorial Headline & CTA ─── */}
        <div className="md:col-span-6 lg:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-5 pr-0 md:pr-2 relative z-50 text-center md:text-left items-center md:items-start">

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-[12px] sm:text-[13px] text-slate-300">
              Your next experience is waiting!
            </span>
          </motion.div>

          {/* Big Headline */}
          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-black uppercase leading-[1.05] tracking-tight text-white text-[22px] sm:text-[28px] md:text-[24px] lg:text-[28px] xl:text-[34px]"
          >
            DISCOVER EVENTS
            <br />THAT STAY
            <br />
            <span className="text-[#60A5FA]">
              WITH YOU
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-[11px] sm:text-[12px] text-slate-400 leading-relaxed max-w-[260px] hidden sm:block"
          >
            Concerts, workshops, festivals, sports and more amazing events around you
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex items-center gap-4 md:gap-5 pt-1 pb-2"
          >
            <AnimatedStat value={150} label="Events" suffix="+" />
            <div className="h-6 w-px bg-slate-700" />
            <AnimatedStat value={12} label="Cities" />
            <div className="h-6 w-px bg-slate-700" />
            <AnimatedStat value={50} label="Users" suffix="K+" />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.36 }}
          >
            <MagneticButton
              onClick={scrollToEvents}
              aria-label="Explore Events"
              className="group inline-flex items-center gap-3 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:bg-blue-800 cursor-pointer px-5 py-2.5 sm:px-6 sm:py-3 bg-[#1849D6]"
            >
              <span className="transition-transform group-hover:scale-105">Explore Events</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </motion.div>
        </div>

        {/* ─── RIGHT COL: Overlapping Ticket Composition ─── */}
        <div className="md:col-span-6 lg:col-span-7 relative h-[200px] sm:h-[230px] md:h-[250px] lg:h-[260px] w-full overflow-hidden md:overflow-visible">

          {/* Decorative white arrow */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20px] -left-[8%] z-40 pointer-events-none hidden xl:block"
          >
            <HandDrawnWhiteArrow className="w-10 h-10 opacity-70" />
          </motion.div>

          {/* Decorative yellow arrow */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[150px] right-[5%] z-40 pointer-events-none hidden xl:block"
          >
            <HandDrawnYellowArrow className="w-8 h-8 opacity-80" />
          </motion.div>

          {/* ── TICKET 1: FESTIVAL SUMMER ── */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            whileHover={{ scale: 1.05, rotate: 2, y: -8 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 110 }}
            className="absolute top-[-30px] sm:top-[-45px] md:top-[-50px] right-[0%] z-30 cursor-pointer drop-shadow-2xl w-[220px] sm:w-[260px] md:w-[270px] lg:w-[315px]"
          >
            <Image
              src="/tickets/concert-ticket-original.png"
              alt="Festival Summer Canva Ticket"
              width={315}
              height={210}
              className="object-contain w-full h-auto"
              priority
            />
          </motion.div>

          {/* ── TICKET 2: MOON DAY SPACE MUSEUM ── */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            whileHover={{ scale: 1.05, rotate: -2, y: -8 }}
            transition={{ duration: 0.7, delay: 0.15, type: "spring", stiffness: 110 }}
            className="absolute top-[20px] sm:top-[28px] md:top-[30px] left-[-4%] md:left-[-6%] z-40 cursor-pointer drop-shadow-2xl w-[220px] sm:w-[260px] md:w-[270px] lg:w-[315px]"
          >
            <Image
              src="/tickets/space-museum-ticket-original.png"
              alt="Moon Day Space Museum Canva Ticket"
              width={315}
              height={210}
              className="object-contain w-full h-auto"
              priority
            />
          </motion.div>

          {/* ── TICKET 3: MUMBAI STREET FOOD FESTIVAL ── */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: 3 }}
            whileHover={{ scale: 1.05, rotate: 1, y: -8 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring", stiffness: 110 }}
            className="absolute top-[80px] sm:top-[100px] md:top-[110px] right-[3%] z-50 cursor-pointer drop-shadow-2xl w-[220px] sm:w-[260px] md:w-[270px] lg:w-[315px]"
          >
            <Image
              src="/tickets/mumbai-food-ticket.png"
              alt="Mumbai Street Food Festival Canva Ticket"
              width={315}
              height={210}
              className="object-contain w-full h-auto"
              priority
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
