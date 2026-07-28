"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Plus, Image as ImageIcon, Calendar, MapPin, Tag } from "lucide-react";
import { useModals, useEvents, useToast, useNotifications } from "@/providers/AppProvider";
import type { EventCategory } from "@/lib/types";

const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
];

export function CreateEventModal() {
  const { isCreateEventOpen, closeCreateEventModal } = useModals();
  const { addEvent } = useEvents();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EventCategory>("music");
  const [date, setDate] = useState("2024-12-10");
  const [time, setTime] = useState("7:00 PM");
  const [location, setLocation] = useState("Mumbai");
  const [venue, setVenue] = useState("Nesco Center");
  const [price, setPrice] = useState<number>(499);
  const [isFree, setIsFree] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0]);

  if (!isCreateEventOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !venue.trim()) {
      showToast("Please fill in event title and venue!", "error");
      return;
    }

    const eventDate = new Date(date || "2024-12-10");
    const month = eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    const day = String(eventDate.getDate());

    const created = addEvent({
      title,
      description: description || "An exciting event hosted on Occasio.",
      category,
      tags: [category, "community", "event"],
      date: date || "2024-12-10",
      dateLabel: `${day} ${month} · ${time}`,
      month,
      day,
      time,
      location,
      venue,
      price: isFree ? 0 : price,
      priceLabel: isFree ? "Free" : `₹${price.toLocaleString()}`,
      isFree,
      isFeatured,
      image: selectedImage,
      imageAlt: title,
      bookmarkColor: "#2563EB",
      organizer: "You (Organizer)",
    });

    showToast(`🎉 "${title}" created successfully!`, "success");
    addNotification({
      title: "Event Published! 🚀",
      message: `Your event "${created.title}" is live on Occasio.`,
      type: "system",
    });

    // Reset form
    setTitle("");
    setDescription("");
    closeCreateEventModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCreateEventModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-event-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-card border border-border shadow-2xl my-auto max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 id="create-event-modal-title" className="text-base font-extrabold text-foreground">
                  Host an Event on Occasio
                </h2>
                <p className="text-xs text-muted-foreground">
                  Publish your event and start selling tickets
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeCreateEventModal}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
            {/* Title */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mumbai Indie Music Night 2024"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Category & Price Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="music">Music</option>
                  <option value="tech">Tech</option>
                  <option value="food">Food</option>
                  <option value="art">Art</option>
                  <option value="sports">Sports</option>
                  <option value="workshops">Workshops</option>
                  <option value="electronic">Electronic</option>
                  <option value="festival">Festival</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Ticket Pricing (₹)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    disabled={isFree}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none disabled:opacity-40"
                  />
                  <label className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isFree}
                      onChange={(e) => setIsFree(e.target.checked)}
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    Free
                  </label>
                </div>
              </div>
            </div>

            {/* Date, Time & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Time
                </label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="7:00 PM"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  City Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">New Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Goa">Goa</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Venue Name *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Jio World Convention Centre, BKC"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                Event Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a catchy description of what attendees can expect..."
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* Cover Image Picker */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                Choose Cover Image
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {SAMPLE_IMAGES.map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative h-16 w-24 shrink-0 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage === imgUrl ? "border-primary ring-2 ring-primary/30" : "border-border opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="Sample" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Feature on Main Hero Banner Switch */}
            <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/30 p-3.5">
              <div>
                <p className="text-xs font-bold text-foreground">Set as Featured Spotlight Event</p>
                <p className="text-[11px] text-muted-foreground">Highlight this event at the top of the discovery page</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isFeatured}
                aria-label="Set as featured event"
                onClick={() => setIsFeatured(!isFeatured)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  isFeatured ? "bg-primary" : "bg-border"
                }`}
              >
                <motion.span
                  layout
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-xs ${
                    isFeatured ? "left-[22px]" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="border-t border-border pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeCreateEventModal}
                className="rounded-xl border border-border px-5 py-2.5 text-xs font-bold text-foreground hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                <span>Publish Event</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
