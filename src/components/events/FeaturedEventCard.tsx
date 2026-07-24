"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { Calendar, Clock, MapPin, Heart, Play, ArrowRight } from "lucide-react";
import { useSavedEvents, useModals } from "@/providers/AppProvider";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { Event } from "@/lib/types";

interface FeaturedEventCardProps {
  event: Event;
}

const AVATAR_IMGS = [10, 32, 47, 68, 12];

export function FeaturedEventCard({ event }: FeaturedEventCardProps) {
  const { isSaved, toggleSave } = useSavedEvents();
  const { openEventModal } = useModals();
  const saved = isSaved(event.id);

  // Framer Motion 3D Tilt controls
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 20 });
  const springY = useSpring(y, { stiffness: 220, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-6deg", "6deg"]);
  const glareX = useTransform(springX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(springY, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 35, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative perspective-1000 group w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      {/* Dynamic specular glare overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-30 overflow-hidden"
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      {/* Canva ticket template container */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow duration-300"
        style={{
          backgroundImage: "url('/tickets/featured-ticket-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col md:flex-row items-stretch min-h-[220px]">

          {/* ── LEFT: Event Photo ── */}
          <div className="relative w-full h-48 md:h-auto md:w-[42%] shrink-0 overflow-hidden group">
            <Image
              src={event.image}
              alt={event.imageAlt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none" />

            {/* Featured Badge */}
            <span className="absolute left-3 top-3 z-10 rounded-md bg-primary px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm">
              FEATURED EVENT
            </span>

            {/* Play Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="absolute left-4 bottom-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-900 shadow-lg backdrop-blur-md cursor-pointer"
              aria-label="Play event preview video"
              onClick={() => openEventModal(event)}
            >
              <Play className="h-4 w-4 fill-slate-900 ml-0.5" />
            </motion.button>
          </div>

          {/* ── CENTER: Event Details ── */}
          <div className="relative flex-1 px-5 py-4 md:px-6 md:py-5 flex flex-col justify-between md:w-[38%] shrink-0">
            {/* Heart bookmark */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.85 }}
              type="button"
              onClick={() => toggleSave(event.id)}
              className="absolute top-4 right-4 md:right-12 z-10 cursor-pointer"
              aria-label={saved ? "Remove from saved" : "Save event"}
            >
              <Heart className={saved ? "h-5 w-5 fill-red-500 text-red-500" : "h-5 w-5 text-muted-foreground"} />
            </motion.button>

            <div className="space-y-3">
              {/* Title */}
              <button
                type="button"
                onClick={() => openEventModal(event)}
                className="text-left cursor-pointer"
              >
                <h2 className="text-[17px] sm:text-[18px] font-bold text-foreground tracking-tight leading-snug pr-8 hover:text-primary transition-colors">
                  {event.title}
                </h2>
              </button>

              {/* Date & Location */}
              <div className="space-y-1 text-[12px] text-muted-foreground">
                <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {event.dateLabel}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {event.time}
                  </span>
                </div>
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                  {event.venue}, {event.location}
                </span>
              </div>

              {/* Attendee Avatars */}
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  {AVATAR_IMGS.map((imgId) => (
                    <div
                      key={imgId}
                      className="h-6 w-6 sm:h-7 sm:w-7 rounded-full ring-2 ring-card overflow-hidden shrink-0"
                    >
                      <Image
                        src={`https://i.pravatar.cc/28?img=${imgId}`}
                        alt="Attendee"
                        width={28}
                        height={28}
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
                <span className="text-[11px] sm:text-[12px] font-semibold text-muted-foreground">
                  {(event.attendees / 1000).toFixed(1)}K going
                </span>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {event.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Price + Magnetic CTA */}
            <div className="flex items-end justify-between sm:justify-start gap-4 mt-4 pt-3 border-t border-border/40 md:border-t-0">
              <div>
                <span className="block text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-0.5">
                  Starts from
                </span>
                <span className="text-[18px] sm:text-[20px] font-black text-primary leading-none">
                  {event.priceLabel}
                </span>
              </div>

              <MagneticButton
                onClick={() => openEventModal(event)}
                className="px-4 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-[12px] font-bold rounded-xl"
              >
                View Details
                <ArrowRight className="h-3.5 w-3.5" />
              </MagneticButton>
            </div>
          </div>

          {/* ── RIGHT: Barcode cutout area (desktop only) ── */}
          <div className="hidden md:block shrink-0 md:w-[20%]" />
        </div>
      </div>
    </motion.article>
  );
}
